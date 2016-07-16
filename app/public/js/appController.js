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
		  url: "/displayByTime/:favorite",
            params :{
        favorite: null
    },
		  templateUrl: './templates/recipesClient.html',
		  controller: 'displayByTime'
	 }).
	 state('specificRecipe', {
			 url: "/displayByTime/specific/:recipeName",
			 templateUrl: "./templates/ingredientsClient.html",
			 controller: 'recipeIngredients'
			 }).
     state("timeBar", {
            url: "/displayByTime/specific/timeBar/:recipeName",
            templateUrl: "./templates/timeBar.html",
            controller: "timeBarControl"
    })

})

quickyApp.controller('loginCtrl', function($scope, $http, $location) {
	$scope.checkEmail = function(email, user) {
        console.log(user);
		  globalData.googleData = user;
		$http.get("https://quickyfinal.herokuapp.com/checkClient/" + email).success(function(data) {
				console.log(data);
				globalData.userData= data.data;
			$scope.removeOnClick();
		});
	}

	$scope.removeOnClick = function() {
		var login = angular.element( document.querySelector( '#gConnect' ) );
        var logo = angular.element( document.querySelector( '#logo' ) );
		login.remove();
        logo.remove();
        if(globalData.userData.type == "Admin") {
            document.getElementsByTagName('body')[0].className = "cover";
        }

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
    var mainTotalTime = 0;
    var sideTotalTime = 0;


    $scope.addPreparationSteps = function (prepare, prepTime, prepKind) {
        $scope.preparation.push({action: prepare, time: prepTime, kind: prepKind, imageURL: "../images/VeganGreenChiliMacAndCheese/1.png"});
        preparationTime += prepTime;
        console.log("preparationTime = " + preparationTime);
        if (prepKind == "main") mainTotalTime += prepTime;
        else sideTotalTime += prepTime;
        console.log("mainTotalTime = " + mainTotalTime);
        console.log("sideTotalTime = " + sideTotalTime);
    };

	$scope.addCookingSteps = function (toCook, cookTime, cookKind) {
		  $scope.cooking.push({action: toCook, time: cookTime, kind: cookKind, imageURL: "../images/SpicyBuffaloChickpeaWraps/3.png"});
		  cookingTime += cookTime;
        console.log("cookingTime = " + cookingTime);
        if (cookKind == "main") mainTotalTime += cookTime;
        else sideTotalTime += cookTime;
        console.log("mainTotalTime = " + mainTotalTime);
        console.log("sideTotalTime = " + sideTotalTime);
	};

	$scope.setSteps = function(recipeName) {
		$scope.steps.push($scope.preparation);
		$scope.steps.push($scope.cooking);
		var prep = {

		}
		prep.preparation = $scope.preparation;
		prep.cooking = $scope.cooking;
		  console.log("steps = " + JSON.stringify(prep));
		  console.log("prep time = " + preparationTime);
		  console.log("cooking time= " + cookingTime);
        var totalTime = 0;
        console.log("side total time = " + sideTotalTime);
        console.log("main total time = " + mainTotalTime);
        if (sideTotalTime > mainTotalTime) totalTime = sideTotalTime;
        else totalTime = mainTotalTime;
        console.log("total time = " + totalTime);

		$http.post("http://localhost:3000/admin/updateSteps/" + recipeName, {steps: prep, prepare: preparationTime, cook: cookingTime, total: totalTime }).success(function(data) {
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
				globalData.recipes[i].favorite = "notFavorite";
				for(var j = 0; j < favSize; j++) {
				    if (globalData.recipes[i].name == globalData.userData.favorite[j]) {
				        globalData.recipes[i].favorite = 'favorite';
                        break;
				    }
				}
		  }
         console.log('user\'s favoritr: ' + globalData.userData.favorite);
         console.log('all recipes: ' + globalData.recipes);
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
					 $location.path('/displayByTime/' + 0);
				}
		  });
	 }
})

quickyApp.controller('displayByTime', function($scope, $http, $stateParams) {
    console.log("displaying by time");
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
	 var time = parseInt($stateParams.favorite, 10);
	 if (time > 0) {
         console.log("favoritessss");
         $http.post('http://localhost:3000/admin/getFavorites', {favor: globalData.userData.favorite}).success(function(data) {
             console.log("user's favorites: " + data);
             globalData.recipes = data;

             var size = globalData.recipes.length;
		  var favSize ; globalData.userData.favorite.length;
		  for (var i = 0; i < size; i++) {
				globalData.recipes[i].favorite = "favorite";
		  }

             $scope.modifiedRecipes = data;
         })
     } else {
         console.log("normal display");
         $scope.modifiedRecipes = globalData.recipes;
     }
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

     //------Filter By Category--------

     $scope.showOnlyEntree = function() {
         $scope.modifiedRecipes = globalData.recipes;
         var size = globalData.recipes.length;
         for(var i=0; i < size; i++){
             if($scope.modifiedRecipes[i].category != "Entree") {
                 $scope.modifiedRecipes.splice(i,1);
                 i--;
                 size--;
             }
         }
     }
     $scope.showOnlyLunch = function() {
         $scope.modifiedRecipes = globalData.recipes;
         var size = globalData.recipes.length;
         for(var i=0; i < size; i++){
             if($scope.modifiedRecipes[i].category != "Lunch") {
                 $scope.modifiedRecipes.splice(i,1);
                 i--;
                 size--;
             }
         }
     }
     $scope.showOnlyPasta = function() {
         $scope.modifiedRecipes = globalData.recipes;
         var size = globalData.recipes.length;
         for(var i=0; i < size; i++){
             if($scope.modifiedRecipes[i].category != "Pasta") {
                 $scope.modifiedRecipes.splice(i,1);
                 i--;
                 size--;
             }
         }
     }
     $scope.showOnlyAppetizer = function() {
         $scope.modifiedRecipes = globalData.recipes;
         var size = globalData.recipes.length;
         for(var i=0; i < size; i++){
             if($scope.modifiedRecipes[i].category != "Appetizer") {
                 $scope.modifiedRecipes.splice(i,1);
                 i--;
                 size--;
             }
         }
     }
      $scope.showOnlyDessert = function() {
         $scope.modifiedRecipes = globalData.recipes;
         var size = globalData.recipes.length;
         for(var i=0; i < size; i++){
             if($scope.modifiedRecipes[i].category != "Dessert") {
                 $scope.modifiedRecipes.splice(i,1);
                 i--;
                 size--;
             }
         }
     }
     $scope.showOnlyEasyQuicky = function() {
         $scope.modifiedRecipes = globalData.recipes;
         var size = globalData.recipes.length;
         for(var i=0; i < size; i++){
             if($scope.modifiedRecipes[i].features != "Easy quicky") {
                 $scope.modifiedRecipes.splice(i,1);
                 i--;
                 size--;
             }
         }
     }
})

quickyApp.controller('recipeIngredients', function($scope, $stateParams, $location) {
//	 var elem = document.getElementsByTagName('body')[0];
//	 if (elem.hasAttribute('class')) {
//		  elem.removeAttribute('class');
//	 }else {
//		  elem.setAttribute('class', 'cov);
//	 }
	 var recipes = globalData.recipes;
	var size = globalData.recipes.length;
	for (var i = 0; i < size; i++) {
		if (recipes[i].name === $stateParams.recipeName) {
			$scope.correctRecipe = recipes[i];
			break;
		}
	}

    $scope.startCooking = function() {
        $location.path('/displayByTime/specific/timeBar/' + $scope.correctRecipe.name)
    }
})

quickyApp.controller('timeBarControl', function($scope, $stateParams, $http) {
    var recipes = globalData.recipes;
	var size = recipes.length;
	for (var i = 0; i < size; i++) {
		if (recipes[i].name === $stateParams.recipeName) {
			$scope.correctRecipe = recipes[i];
			break;
		}
	}
    function createList(prep, cook) {
        var array = [];
        for (var i of prep) {
            array.push({value: i.time, img: i.imageURL});
        }
        for (var i of cook) {
            array.push({value: i.time, img: i.imageURL});
        }
        return array;
    }
    console.log($scope.correctRecipe);
    var ingredients = $scope.correctRecipe.ingredients;
    var mainKind = ingredients.main.kind;
    var sideKind = ingredients.side.kind;
    var mainPreparation = [];
    var sidePreparation = [];
    var mainCooking = [];
    var sideCooking = [];
    $scope.kinds = {};
    //console.log($scope.correctRecipe.steps.preparation);
    for (var prep of $scope.correctRecipe.steps.preparation) {
        if (prep.kind == mainKind) mainPreparation.push(prep);
        else sidePreparation.push(prep);
    }
    for (var cook of $scope.correctRecipe.steps.cooking) {
        if (cook.kind == mainKind) mainCooking.push(cook);
        else sideCooking.push(cook);
    }
    $scope.kinds.main = {preparation: mainPreparation, cooking: mainCooking};
    $scope.kinds.side = {preparation: sidePreparation, cooking: sideCooking};
    //console.log($scope.kinds);
    var mainList = createList($scope.kinds.main.preparation, $scope.kinds.main.cooking);
    var sideList = createList($scope.kinds.side.preparation, $scope.kinds.side.cooking);
    console.log("main list:\n" + mainList);
    console.log("side list:\n" + sideList);
    timeKnots.draw("#timeline1", mainList, {horizontalLayout: false, color: "#FFFF00", color2: "#a0b91b", height: 400, width:50, class: "mainList",  background: "#a32323"});

    timeKnots.draw("#timeline2", sideList, {horizontalLayout: false, color: "#FF0000", color2: "#a0b91b", height: 400, width:50, class: "sideList",  background: "#a32323"});

    timeKnots.makeTimeController("#timeline3", [{}], {color: "#2f972f", height: 400, width: 50, id: "timer", radius: 10, value: $scope.correctRecipe.timers.total });

//    $scope.getRecipeIndex = function(recipeName) {
//        var size = globalData.recipes.length;
//        for (var i = 0; i < size; i++) {
//            if (globalData.recipes.recipes[i].name == recipeName) {
//                 return i;
//            }
//        }
//    }
//    $scope.checkIfInFavorites = function(recipeName) {
//		  var size = globalData.userData.favorite.length;
//		  var answer = false;
//		  for (var i = 0; i < size; i++) {
//				if (globalData.userData.favorite[i] == recipeName) {
//					 answer = true;
//				}
//		  }
//		  return answer;
//	 }
//     $scope.addToFavorites = function(recipeName) {
//		  if ($scope.checkIfInFavorites(recipeName)) {
//				//we want to ckear it from favorites(because it 's already favorited)
//				 $http.post('https://quickyfinal.herokuapp.com/admin/addToFavorites/' + recipeName, {email: globalData.userData.email})
//					  .success(function(data) {
//						  if (data.status == 301) {
//								console.log('addFavorite service had failed');
//						  }
//						  globalData.recipes[getRecipeIndex(recipeName)].favorite = 'notFavorite';
//						  $scope.correctRecipe.favorite = 'notFavorite';
//						  var indexOfRecipe = globalData.userData.favorite.indexOf(recipeName);
//						  if (indexOfRecipe > -1) {
//								globalData.userData.favorite.splice(indexOfRecipe, 1);
//						  }
//					 });
//		  }else {
//				 $http.post('https://quickyfinal.herokuapp.com/admin/addToFavorites/' + recipeName, {email: globalData.userData.email})
//					  .success(function(data) {
//						  if (data.status == 301) {
//								console.log('addFavorite service had failed');
//						  }
//						  globalData.recipes[getRecipeIndex(recipeName)].favorite = 'favorite';
//						  $scope.correctRecipe.favorite = 'favorite';
//						  globalData.userData.favorite.push(recipeName);
//					 });
//		  }
//	 }
})

