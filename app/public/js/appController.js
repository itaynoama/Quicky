var stepsApp = angular.module('quicky',[]);

var model = {};

stepsApp.run(function($http) {
    $http.get("http://localhost:3000/admin/getUnmodified").success(function(data) {
        model.recipes = data;
        //console.log(model.recipes);
    });
});

stepsApp.controller('quickyCtrl', function($scope){
    $scope.steps = [];
	$scope.preparation = [];
	$scope.cooking = [];
	//var preparation = [];
	//var cooking = [];
	//$scope.steps.push(preparation);
	//$scope.steps.push(cooking);
	$scope.name = "Or & itay";
    $scope.notModified = model;


    $scope.addPreparationSteps = function (prepare, prepTime) {
        $scope.preparation.push({action: prepare, time: prepTime});
    };

	$scope.addCookingSteps = function (toCook, cookTime) {
        $scope.cooking.push({action: toCook, time: cookTime});
	};

	$scope.setSteps = function() {
		$scope.steps.push($scope.preparation);
		$scope.steps.push($scope.cooking);
//        $http.set("http://localhost:3000/admin/updateSteps/" +  + "/" + $scope.steps);
        console.log($scope.notModified.recipes);
		//console.log(model);

	}

});
