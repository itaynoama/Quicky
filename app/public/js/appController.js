var stepsApp = angular.module('quicky',[]);

var model = {
	name : "not modified"

};

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

	$scope.displayRecipe = function(recipeName) {
		$scope.notModified.recipes.forEach(function(data) {
			if (data.name === recipeName) {
				$scope.recipeToDisplay = data;

			}
		})
		console.log($scope.recipeToDisplay);
	}

});
