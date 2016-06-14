var quickyApp = angular.module('quicky',["ui.router"]);

var model = {
	name : "not modified"

};

quickyApp.config(function($stateProvider, $urlRouterProvider){

      // For any unmatched url, send to /route1
	$urlRouterProvider.otherwise("/")

	$stateProvider
	.state('login', {
		url: "/",
		controller: "loginCtrl"
	})
	.state('admin', {
		url: "/adminPage",
		templateUrl: "./templates/adminPage.html",
		controller: 'quickyCtrl'
	})
		.state('admin.recipeDisplay', {
			url: "/displayRecipe/:recipeName",
			templateUrl: './templates/recipeDisplay.html',
			controller: 'displayRecipe'
		})
	  .state('route2.list', {
		  url: "/list",
		  templateUrl: "route2.list.html",
		  controller: function($scope){
			$scope.things = ["A", "Set", "Of", "Things"];
		  }
	  })
	})

quickyApp.controller('loginCtrl', function($scope, $http, $location) {
	$scope.checkEmail = function(email) {
		$http.get("http://localhost:3000/checkClient/" + email).success(function(data) {
			model.type = data.type;
			model.email = email;
			$scope.removeOnClick();
		});
	}

	$scope.removeOnClick = function() {
		var elem = angular.element( document.querySelector( '#gConnect' ) );
		elem.remove();
		if (model.type == "Admin") {
			$http.get("http://localhost:3000/admin/getUnmodified").success(function(data) {
        		model.recipes = data;

				$location.path('/adminPage');
    		});
		} else {
			$location.path('/cooker').replace();
			console.log($location.path());
		}
	}
});

quickyApp.controller('displayRecipe', function($scope, $stateParams) {
	var recipes = model.recipes;
	var size = model.recipes.length;
	for (var i = 0; i < size; i++) {
		if (recipes[i].name === $stateParams.recipeName) {
			$scope.correctRecipe = recipes[i];
			break;
		}
	}
});

quickyApp.controller('quickyCtrl', function($scope, $http){
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

	$scope.setSteps = function(recipeName) {
		$scope.steps.push($scope.preparation);
		$scope.steps.push($scope.cooking);
		console.log($scope.steps);

		var prep = {

		}
		prep.preparation = $scope.preparation;
		prep.cooking = $scope.cooking;
		console.log(prep);
		$http.post("http://localhost:3000/admin/updateSteps/" + recipeName, {steps: prep});

		$scope.preparation = [];
		$scope.cooking = [];
		$scope.steps = [];
	}


});
