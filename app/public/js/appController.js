var stepsApp = angular.module('quicky',[]);

stepsApp.run(function($http) {
    $http.get("http://localhost:3000/admin/getUnmodified").success(function(data) {
        model.recipes = data;
    });
});

stepsApp.controller('quickyCtrl', function($scope){
    $scope.steps = [];

    $scope.addNewItem = function (actionText, actionTime) {
        $scope.steps.push({action: actionText, time: actionTime});
    };
});
