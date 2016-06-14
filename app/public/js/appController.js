var quickyApp = angular.module('quicky',["ui.router"]);

var globalData = {


};

quickyApp.config(function($stateProvider, $urlRouterProvider){

      // For any unmatched url, send to /route1
	$urlRouterProvider.otherwise("/")

	$stateProvider.
    state('login', {
		url: "/",
		controller: "loginCtrl"
    }).
    state('admin', {
        url: "/adminPage",
        templateUrl: "./templates/adminPage.html",
        controller: 'quickyCtrl'
	}).
        state('admin.recipeDisplay', {
			url: "/displayRecipe/:recipeName",
			templateUrl: './templates/recipeDisplay.html',
			controller: 'displayRecipe'
		}).
    state('cooker', {
        url: "/home",
        templateUrl: "home.html",
        controller: 'ClientHome'
    }).
    state('recipesByTime', {
        url: "/displayByTime/:time",
        templateUrl: './templates/recipesByTime.html',
        controller: 'displayByTime'
    })

})

quickyApp.controller('loginCtrl', function($scope, $http, $location) {
	$scope.checkEmail = function(email, user) {
        globalData.user = user;
		$http.get("http://localhost:3000/checkClient/" + email).success(function(data) {

            globalData.userType = data.type;
			globalData.email = email;
			$scope.removeOnClick();
		});
	}

	$scope.removeOnClick = function() {
		var elem = angular.element( document.querySelector( '#gConnect' ) );
		elem.remove();
        var script = angular.element(document.querySelector('#googleScript'));
        script.remove();
		if (globalData.userType == "Admin") {
			$http.get("http://localhost:3000/admin/getUnmodified").success(function(data) {
                if (data.type == "error") {
                    globalData.recipes = {};
                    console.log("getUnmodified service returned an error:\n"+data.data);
                } else {
                    globalData.recipes = data;
				    $location.path('/adminPage');
                }

    		});
		} else {
			$location.path('/cooker').replace();
		}
	}
});

quickyApp.controller('displayRecipe', function($scope, $stateParams) {
	var recipes = globalData.recipes;
	var size = globalData.recipes.length;
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
	$scope.name = globalData.user.displayName;
    $scope.notModified = globalData.recipes;

    $scope.addPreparationSteps = function (prepare, prepTime) {
        $scope.preparation.push({action: prepare, time: prepTime});
    };

	$scope.addCookingSteps = function (toCook, cookTime) {
        $scope.cooking.push({action: toCook, time: cookTime});
	};

	$scope.setSteps = function(recipeName) {
		$scope.steps.push($scope.preparation);
		$scope.steps.push($scope.cooking);
		var prep = {

		}
		prep.preparation = $scope.preparation;
		prep.cooking = $scope.cooking;
		$http.post("http://localhost:3000/admin/updateSteps/" + recipeName, {steps: prep}).success(function(data) {
            if (data.status == 301) {
                console.log("updateSteps service has failed");
            }
        });
		$scope.preparation = [];
		$scope.cooking = [];
		$scope.steps = [];
	}
});

quickyApp.controller('ClientHome', function($scope, $http) {

})

quickyApp.controller('displayByTime', function($scope, $http, $stateParams) {
    var time = parseInt($stateParams.time, 10);
    $scope.getAllModified = function(time) {
        $http.get('http://localhost:3000/admin/getModified/' + $stateParams.time, function(data) {
            if (data.status == 301) {
                console.log("getModified service has failed");
            } else {
                globalData.recipes = data;
                $scope.modifiedRecipes = globalData.recipes;
            }
        });
    }

    $scope.addToFavorites = function(recipeName) {
        $http.post('http://localhost:3000/admin/addToFavorites/' + recipeName, {email: globalData.email}).success(function(data) {
            if (data.status == 301) {
                console.log('addFavorite service had failed');
            }
        });
    }

})
