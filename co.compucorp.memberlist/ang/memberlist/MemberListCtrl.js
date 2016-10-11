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

//  angular.module('memberlist').directive('paginate',function() {
//  });


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
