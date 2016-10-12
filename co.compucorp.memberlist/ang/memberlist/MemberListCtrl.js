(function(angular, $, _) {

  angular.module('memberlist').config(function($routeProvider) {
      $routeProvider.when('/compucorp/members', {
        controller: 'MemberlistMemberListCtrl',
        templateUrl: '~/memberlist/MemberListCtrl.html',

        // If you need to look up data when opening the page, list it out
        // under "resolve".
        resolve: {
        }
      });
    }
  );

  angular.module('memberlist').directive('ccPaginate',function() {
    return {
      restrict : 'A',
      scope : {
        ccPaginate:'=',
        pageData:'=',
        pageSize:'='
      },
      controller :['$scope', function($scope) {
        $scope.pageSize=$scope.pageSize || 10;
        $scope.ccPaginate=$scope.ccPaginate || [];
        $scope.pageNumber=0;
        $scope.turnable=function(direction){
          if('next'==direction) {
            return $scope.ccPaginate.length>($scope.pageNumber+1)*$scope.pageSize;
          } else if('prev'==direction) {
            return $scope.pageNumber>0;
          }
          return false;
        };
        $scope.turnPage= function(direction) {
          if($scope.turnable(direction)) {
            if('next'==direction) {
              $scope.pageNumber++;
            } else if('prev'==direction) {
              $scope.pageNumber--;
            }
          }
          $scope.pageData=null;
          $scope.pageData=[];
          for(var i=($scope.pageNumber*$scope.pageSize);i<(($scope.pageNumber+1)*$scope.pageSize)&&i<$scope.ccPaginate.length;i++) {
            $scope.pageData.push($scope.ccPaginate[i]);
          } 
        };
        $scope.$watch('ccPaginate',function(){$scope.turnPage()});
      }],
      template : '<span data-ng-show="turnable(\'prev\')" data-ng-click="turnPage(\'prev\')">&lt;</span>'
               + '<span data-ng-bind="\'Page \'+(pageNumber+1)"></span>'
               + '<span data-ng-show="turnable(\'next\')" data-ng-click="turnPage(\'next\')">&gt;</span>'
    }
  });


  // The controller uses *injection*. This default injects a few things:
  //   $scope -- This is the set of variables shared between JS and HTML.
  //   crmApi, crmStatus, crmUiHelp -- These are services provided by civicrm-core.
  //   myContact -- The current contact, defined above in config().
  angular.module('memberlist').controller('MemberlistMemberListCtrl', function($scope, crmApi, crmStatus, crmUiHelp) {
    // The ts() and hs() functions help load strings for this module.
    var ts = $scope.ts = CRM.ts('memberlist');
    var hs = $scope.hs = crmUiHelp({file: 'CRM/memberlist/MemberListCtrl'}); // See: templates/CRM/memberlist/MemberListCtrl.hlp

    $scope.memberships=null;
    $scope.filterParameters={
        onlyActive:false,
        source:null,
        startDate:null,
        endDate:null
    };
    $scope.isNullOrEmpty=function(value) {
      return (null==value || ''==value.trim());
    };

    $scope.getParameters=function() {
        var params={};
        if(null==$scope.filterParameters) {
          return params;
        }
        if(!$scope.isNullOrEmpty($scope.filterParameters.source)) {
          params.source={'LIKE':'%'+$scope.filterParameters.source+'%'};
        }
        if($scope.filterParameters.onlyActive) {
          params.active_only=1;
        }
        if(!$scope.isNullOrEmpty($scope.filterParameters.startDate) && !$scope.isNullOrEmpty($scope.filterParameters.endDate)) {
          params.start_date={'BETWEEN':[$scope.filterParameters.startDate,$scope.filterParameters.endDate]};
        }
        return params;
    };
    $scope.fetchMemberList=function() {
    crmApi('Membership','get',$scope.getParameters()).then(function(members) {
     if(members.is_error==0) {
        $scope.memberships=members.values;
     }
    }); 
    };
    $scope.fetchMemberList();
  });

})(angular, CRM.$, CRM._);
