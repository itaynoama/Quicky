#Quicky vegan API
The purpose of this Web Service is to manage all the recipes that appears in the DB.<br/>
In manage to work with those functions, you need to add a "Callback" functions to handle the data response

## This service contains the services above:

### Get all the Unmodified Recipes (recipes without steps) :
-> `https://quickyfinal.herokuapp.com/admin/getUnmodified`
#### method: GET
```
Arguments: None.
```
#### Example
```
https://quickyfinal.herokuapp.com/admin/getUnmodified

[
  {
    "name": "Roasted_Potato_&_Kale",
    "displayName": "Roasted Potato & Kale",
    "description": "Lunch hash with roasted sweet potatoes, red onion, kale, and tandoori masala-spiced tofu! A protein- and fiber-packed plant-based meal.",
    "category": "Lunch",
    "features": "Easy quicky",
    "imageURL": "http://cdn3.minimalistbaker.com/wp-content/uploads/2015/10/SWEET-POTATO-KALE-SCRAMBLE-SQUARE.jpg",
    "likes": 0,
    "modified": false,
    "timers": {
      "preparation": 0,
      "cooking": 0,
      "total": 0
    },
    "steps": {
      "preparation": [],
      "cooking": []
    },
    "ingredients": {
      "main": {
        "kind": "SERVING",
        "ingredients": [
          {
            "name": "Hummus",
            "quantity": "3 Tsp"
          },
          {
            "name": "Hot sauce, like tapatio",
            "quantity": "1 cup"
          }
        ]
      },
      "side": {
        "kind": "SCRAMBLE",
        "ingredients": [
          {
            "name": "extra firm tofu",
            "quantity": "8 ounces"
          },
          {
            "name": "sweet potato, chopped into large bites",
            "quantity": "1 large"
          },
          {
            "name": "melted coconut oil, divided",
            "quantity": "2 Tbsp"
          },
          {
            "name": "tandoori masala spice, divided",
            "quantity": "3 1/4 tsp"
          },
          {
            "name": "coconut sugar",
            "quantity": "1 tsp"
          },
          {
            "name": "each sea salt + black pepper, divided",
            "quantity": "1/2 tsp"
          },
          {
            "name": "red onion, skin and tops removed, then sliced into wedges lengthwise ",
            "quantity": "1"
          },
          {
            "name": "fresh parsley, plus more for serving",
            "quantity": "2 Tbsp "
          },
          {
            "name": "ground turmeric",
            "quantity": "1/8 tsp"
          },
          {
            "name": "large bundle kale, chopped, large stems removed",
            "quantity": "1"
          }
        ]
      }
    }
  },
  {
    "name": "Mango_Energy_Bites",
    "displayName": "Mango Energy Bites",
    "description": "Mango energy bites with dates, coconut, hemp seeds, and lime zest! Perfectly sweet, tender, and so full of natural energy!",
    "category": "Dessert",
    "features": "Easy quicky",
    "imageURL": "http://cdn3.minimalistbaker.com/wp-content/uploads/2016/05/Mango-Coconut-Energy-Bites-SQUARE.jpg",
    "likes": 0,
    "modified": false,
    "timers": {
      "preparation": 0,
      "cooking": 0,
      "total": 0
    },
    "steps": {
      "preparation": [],
      "cooking": []
    },
    "ingredients": {
      "main": {
        "kind": "Mango",
        "ingredients": [
          {
            "name": "sea salt",
            "quantity": "Pinch"
          },
          {
            "name": "medjool dates",
            "quantity": "10 pitted"
          },
          {
            "name": "firmly packed,dried unsweetened mango",
            "quantity": "1 cup"
          }
        ]
      },
      "side": {
        "kind": "Sauce",
        "ingredients": [
          {
            "name": "raw walnuts or cashews ",
            "quantity": "1 1/4 cup"
          },
          {
            "name": "unsweetened finely shredded coconut",
            "quantity": "1/3 cup"
          },
          {
            "name": "hemp seeds",
            "quantity": "2 Tbsp"
          }
        ]
      }
    }
  }
]
```


### Get all modified recipes (recipes with steps) :
-> `https://quickyfinal.herokuapp.com/admin/getModified/:time`
#### method: GET
```
Arguments: 
time = int (0-30)
```
#### Example
```
https://quickyfinal.herokuapp.com/admin/getModified/25

[
  {
    "name": "Spicy_buffalo_chickpea_wraps",
    "displayName": "Spicy buffalo chickpea wraps",
    "description": "Buffalo Chickpea Wraps, Spicy chickpeas, crunchy vegetables, and a creamy hummus dressing.",
    "category": "Entree",
    "features": "Easy quicky",
    "imageURL": "http://cdn.minimalistbaker.com/wp-content/uploads/2015/12/Spicy-Chickpea-Wraps-SQUARE.jpg",
    "likes": 1,
    "modified": true,
    "timers": {
      "preparation": 20,
      "cooking": 10,
      "total": 25
    },
    "steps": {
      "preparation": [
        {
          "action": "Make dressing by adding hummus, maple syrup, and lemon juice to a mixing bowl and whisking to combine. Add hot water until thick but pourable.",
          "time": 3,
          "imageURL": "./images/SpicyBuffaloChickpeaWraps/1.png",
          "kind": "Dressing + Salad"
        },
        {
          "action": "Taste and adjust flavor as needed, then add romaine lettuce or kale, and toss. Set aside. ",
          "time": 2,
          "imageURL": "./images/SpicyBuffaloChickpeaWraps/2.png",
          "kind": "Dressing + Salad"
        },
        {
          "action": "To make chickpeas, add drained, dried chickpeas to a separate mixing bowl. Add coconut oil, 3 Tbsp hot sauce, garlic powder, and a pinch of salt - toss to combine/coat.",
          "time": 5,
          "imageURL": "./images/SpicyBuffaloChickpeaWraps/1.png",
          "kind": "Buffalo Chickpea"
        }
      ],
      "cooking": [
        {
          "action": "Heat a metal or cast-iron skillet over medium heat. Once hot, add chickpeas and sauté for 3-5 minutes, mashing a few chickpeas gently with a spoon to create texture",
          "time": 7,
          "imageURL": "./images/SpicyBuffaloChickpeaWraps/2.png",
          "kind": "Buffalo Chickpea"
        },
        {
          "action": "Once chickpeas are hot and slightly dried out, remove from heat and add remaining 1 Tbsp hot sauce. Stir to combine. Set aside.",
          "time": 7,
          "imageURL": "./images/SpicyBuffaloChickpeaWraps/1.png",
          "kind": "Buffalo Chickpea"
        },
        {
          "action": "To assemble, top each wrap with a generous portion of the dressed romaine salad, and top with 1/4 cup buffalo chickpeas and a sprinkle of diced tomatoes, avocado, and/or onion (optional).",
          "time": 6,
          "imageURL": "./images/SpicyBuffaloChickpeaWraps/3.png",
          "kind": "Buffalo Chickpea"
        }
      ]
    },
    "ingredients": {
      "main": {
        "kind": "Buffalo Chickpea",
        "ingredients": [
          {
            "name": "chickpeas, rinsed, drained and dried",
            "quantity": "425 g"
          },
          {
            "name": "coconut oil",
            "quantity": "1 Tbsp"
          },
          {
            "name": "hot sauce*, divided",
            "quantity": "4 Tbsp"
          },
          {
            "name": "garlic powder",
            "quantity": "1/4 tsp"
          },
          {
            "name": "sea salt",
            "quantity": "pinch"
          }
        ]
      },
      "side": {
        "kind": "Dressing + Salad",
        "ingredients": [
          {
            "name": "hummus",
            "quantity": "1/4 cup + 2 Tbsp"
          },
          {
            "name": "maple syrup, plus more to taste",
            "quantity": "1 1/2 - 2 Tbsp"
          },
          {
            "name": "small lemon, juiced",
            "quantity": "1"
          },
          {
            "name": "Hot water to thin ",
            "quantity": "1-2 Tbsp"
          },
          {
            "name": "romaine lettuce",
            "quantity": "1 head"
          }
        ]
      }
    }
  }
]
```


### Update recipe steps (Admin) :
->`https://quickyfinal.herokuapp.com/admin/updateSteps/:recipeName`
#### method: POST
```
Arguments: 
recipeName = String
steps = [prepration:[String],cooking:[String]]
prepare = int
cook = int
total = int
```


### Get client data :
-> `https://quickyfinal.herokuapp.com/checkClient/:email`
#### method: GET
```
Arguments: 
email = String
```
#### Example
```
https://quickyfinal.herokuapp.com/checkClient/orbenda1904@gmail.com

{
  "type": true,
  "data": {
    "__v": 0,
    "email": "orbenda1904@gmail.com",
    "type": "Cooker",
    "_id": "578b774e34248e1100079612",
    "favorite": []
  }
}
```


### Add recipe to specific client's favorites :
-> `https://quickyfinal.herokuapp.com/admin/addToFavorites/:recipeName`
#### method: POST
```
Arguments: 
recipeName = String
email = String (POST value)
```
#### Example
```
https://quickyfinal.herokuapp.com/admin/addToFavorites/Vietnamese_spring_rolls?email=orbenda1905@gmail.com

[]
```


### Get specific recipes:
-> `https://quickyfinal.herokuapp.com/admin/getFavorites`
#### method: POST
```
Arguments: 
favor = [String] (POST value - contains names of recipes) 
```
#### Example
```
https://quickyfinal.herokuapp.com/admin/getFavorites?favor=Vietnamese_spring_rolls

[]
```
## Authors
Itay Noama & Or Ben David
