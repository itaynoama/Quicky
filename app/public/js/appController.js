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
		  templateUrl: "./templates/home.html",
		  controller: 'ClientHome'
	 }).
	 state('recipesByTime', {
		  url: "/displayByTime/:time",
		  templateUrl: './templates/recipesClient.html',
		  controller: 'displayByTime'
	 }).
//        state('recipesByTime.favorite', {
//            params: ['time', 'recipeName'],
//            views: {
//                'content@': {
//                    templateUrl: function(stateParams) {
//                        console.log("template");
//                    },
//                    constroller: function() {
//                        cosnole.log("function");
//                    }
//                }
//            }
//        }).
	 state('specificRecipe', {
			 url: "/displayByTime/specific/:recipeName",
			 templateUrl: "./templates/ingredientsClient.html",
			 controller: 'recipeIngredients'
			 })

})

quickyApp.controller('loginCtrl', function($scope, $http, $location) {
	$scope.checkEmail = function(email, user) {
		  globalData.googleData = user;
		$http.get("https://quickyfinal.herokuapp.com/checkClient/" + email).success(function(data) {
				console.log(data);
				globalData.userData= data.data;
			$scope.removeOnClick();
		});
	}

	$scope.removeOnClick = function() {
		var elem = angular.element( document.querySelector( '#gConnect' ) );
		elem.remove();
		  var script = angular.element(document.querySelector('#googleScript'));
		  script.remove();
		if (globalData.userData.type == "Admin") {
			$http.get("https://quickyfinal.herokuapp.com/admin/getUnmodified").success(function(data) {
					 if (data.type == "error") {
						  globalData.recipes = {};
						  console.log("getUnmodified service returned an error:\n"+data.data);
					 } else {
						  globalData.recipes = data;
					 $location.path('/adminPage');
					 }

	 		});
		} else {
			$location.path('/home');
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
	$scope.name = globalData.googleData.displayName;
	 $scope.notModified = globalData.recipes;
	 var preparationTime = 0;
	 var cookingTime = 0;

	 $scope.addPreparationSteps = function (prepare, prepTime) {
		  $scope.preparation.push({action: prepare, time: prepTime});
		  preparationTime += prepTime;
	 };

	$scope.addCookingSteps = function (toCook, cookTime) {
		  $scope.cooking.push({action: toCook, time: cookTime});
		  cookingTime += cookTime;
	};

	$scope.setSteps = function(recipeName) {
		$scope.steps.push($scope.preparation);
		$scope.steps.push($scope.cooking);
		var prep = {

		}
		prep.preparation = $scope.preparation;
		prep.cooking = $scope.cooking;
		  console.log(prep);
		  console.log(preparationTime);
		  console.log(cookingTime);

		$http.post("https://quickyfinal.herokuapp.com/admin/updateSteps/" + recipeName, {steps: prep, prepare: preparationTime, cook: cookingTime }).success(function(data) {
				if (data.status == 301) {
					 console.log("updateSteps service has failed");
				}
		  });
		$scope.preparation = [];
		$scope.cooking = [];
		$scope.steps = [];
	}
});

quickyApp.controller('ClientHome', function($scope, $http, $location) {
	 //markinng each favorite recipes according to client data
	 $scope.markUserFavorites = function() {
		  var size = globalData.recipes.length;
		  var favSize ; globalData.userData.favorite.length;
		  for (var i = 0; i < size; i++) {
				console.log("first loop");
				globalData.recipes[i].favorite = "notFavorite";
				for(var j = 0; j < favSize; j++) {
					 console.log("escond loop");
					 if (globalData.recipes[i].name == globalData.userData.favorite[j]) {
						  globalData.recipes[i].favorite = 'favorite';
					 }
				}
		  }

	 }

	 $scope.getAllModified = function() {
		  var elem = angular.element( document.querySelector('#timeInput'));
		  var time = elem[0].value;
		  $http.get('https://quickyfinal.herokuapp.com/admin/getModified/' + time).success(function(data) {
				if (data.status == 301) {
					 console.log("getModified service has failed");
				} else {
					 globalData.recipes = data;
					 $scope.markUserFavorites();
					 $location.path('/displayByTime/' + time);
				}
		  });
	 }
})

quickyApp.controller('displayByTime', function($scope, $http, $stateParams) {
	 $scope.checkIfInFavorites = function(recipeName) {
		  var size = globalData.userData.favorite.length;
		  var answer = false;
		  for (var i = 0; i < size; i++) {
				if (globalData.userData.favorite[i] == recipeName) {
					 answer = true;
				}
		  }
		  return answer;
	 }
	 var time = parseInt($stateParams.time, 10);
	 $scope.modifiedRecipes = globalData.recipes;
	 $scope.emptyFavoriteIcon = '../images/favorite.png';
	 $scope.fullFavoriteIcon = '../images/favoritePicked.png';
	 $scope.addToFavorites = function($index, recipeName) {
		  if ($scope.checkIfInFavorites($scope.modifiedRecipes[$index].name)) {
				//we want to ckear it from favorites(because it 's already favorited)
				 $http.post('https://quickyfinal.herokuapp.com/admin/addToFavorites/' + recipeName, {email: globalData.userData.email})
					  .success(function(data) {
						  if (data.status == 301) {
								console.log('addFavorite service had failed');
						  }
						  globalData.recipes[$index].favorite = 'notFavorite';
						  $scope.modifiedRecipes[$index].favorite = 'notFavorite';
						  var indexOfRecipe = globalData.userData.favorite.indexOf(recipeName);
						  if (indexOfRecipe > -1) {
								globalData.userData.favorite.splice(indexOfRecipe, 1);
						  }
					 });

		  }else {
				 $http.post('https://quickyfinal.herokuapp.com/admin/addToFavorites/' + recipeName, {email: globalData.userData.email})
					  .success(function(data) {
						  if (data.status == 301) {
								console.log('addFavorite service had failed');
						  }
						  globalData.recipes[$index].favorite = 'favorite';
						  $scope.modifiedRecipes[$index].favorite = 'favorite';
						  globalData.userData.favorite.push(recipeName);
					 });
		  }
	 }
})

quickyApp.controller('recipeIngredients', function($scope, $stateParams) {
	 var elem = document.getElementsByTagName('body')[0];
	 if (elem.hasAttribute('class')) {
		  elem.removeAttribute('class');
	 }else {
		  elem.setAttribute('class', 'cover');
	 }
	 var recipes = globalData.recipes;
	var size = globalData.recipes.length;
	for (var i = 0; i < size; i++) {
		if (recipes[i].name === $stateParams.recipeName) {
			$scope.correctRecipe = recipes[i];
			break;
		}
	}



})
