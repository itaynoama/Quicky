var stepsApp = angular.module('quicky',['ngRoute']);

var model = {
	name : "not modified"

};
stepsApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/displayRecipe/:recipeName', {
        templateUrl: 'recipeDisplay.html',
        controller: 'displayRecipe'
    }).
      otherwise({
        redirectTo: '/'
      });
}]);

stepsApp.run(function($http) {
    $http.get("http://localhost:3000/admin/getUnmodified").success(function(data) {
        model.recipes = data;
    });
});



//stepsApp.config(['$routeProvider', function($routeProvider) {
//	$routeProvider.when('#:recipeName', {
//		templateUrl:'/recipeDisplay.html',
//		controller: 'displayRecipe'
//	});
//}]);

stepsApp.controller('displayRecipe', function($scope, $routeParams) {
	var recipes = model.recipes;
	var size = model.recipes.length;


	for (var i = 0; i < size; i++) {
//		console.log(recipes[i].name)
		if (recipes[i].name === $routeParams.recipeName) {
			$scope.correctRecipe = recipes[i];
			$scope.mainIngredients = recipes[i].ingredients[1].main;
			$scope.sideIngredients = recipes[i].ingredients[0].side;
//			console.log($scope.mainIngredients);
//			console.log($routeParams.recipeName)
//			console.log($scope.correctRecipe);
			break;
		}
	}
//	console.log($scope.correctRecipe);

});

stepsApp.controller('quickyCtrl', function($scope, $routeParams, $http){
    $scope.steps = [];
	$scope.preparation = [];
	$scope.cooking = [];
	$scope.name = "Or & Itay";
    $scope.notModified = model;

	for (var recipe in model.recipes) {
		if (recipe.name === $routeParams.recipeName) {
			$scope.correctRecipe = recipe;
			break;
		}
	}

    $scope.addPreparationSteps = function (prepare, prepTime) {
        $scope.preparation.push({action: prepare, time: prepTime});
    };

	$scope.addCookingSteps = function (toCook, cookTime) {
        $scope.cooking.push({action: toCook, time: cookTime});
	};

	$scope.setSteps = function(recipeName) {
		$scope.steps.push($scope.preparation);
		$scope.steps.push($scope.cooking);
		console.log($scope.steps);
//        $http.post("http://localhost:3000/admin/updateSteps/" + recipeName + "/" + $scope.steps).success(function(data) {
//			console.log("updated");
//		});
		$http.post("http://localhost:3000/admin/updateSteps/" + recipeName, $scope.steps);
//        console.log($scope.notModified.recipes);
		//console.log(model);
		$scope.preparation = [];
		$scope.cooking = [];
		$scope.steps = [];
	}
});
