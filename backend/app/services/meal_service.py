import json
import os
import base64
from datetime import datetime, timedelta
from typing import List, Dict, Any

from google import genai
from google.genai import types
from app.core.config import settings


class MealService:
    def __init__(self):
        # Initialize Gemini API
        self.model = "gemini-2.0-flash"

    async def generate_meal_plan(
        self, user_data: Dict[str, Any], days: int
    ) -> Dict[str, Any]:
        """
        Generate a meal plan using Gemini API
        """
        try:
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            profile = {
                "profile": {
                    "days": days,
                    "restrictions": user_data.get("dietary_restrictions", []),
                    "allergies": user_data.get("allergies", []),
                },
                "preferences": {
                    "dislikes": user_data.get("disliked_ingredients", []),
                    "preferred_cuisines": user_data.get("preferred_cuisines", []),
                },
                "goals": {
                    "target_daily_calories": user_data.get(
                        "target_daily_calories", 2000
                    ),
                    "target_macros_pct": user_data.get(
                        "target_macros_pct", {"protein": 20, "carbs": 50, "fat": 30}
                    ),
                },
            }

            user_prompt = json.dumps(profile, indent=2)
            contents = [
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(
                            text="""Act as an expert meal planner and creative recipe developer.Your primary task is to generate a personalized, structured meal plan based strictly on the user's profile, dietary needs, preferences, and specific requests provided below.Goal: Create a meal plan based on given days.

User Profile & Constraints:{
  \"profile\": {
    \"days\" : 5
    \"allergies\": [\"{allergy1}\", \"{allergy2}\", ...]
  },
  \"preferences\": {
    \"dislikes\": [\"{dislike1}\", \"{dislike2}\", ...],
    \"preferred_cuisines\": [\"{cuisine1}\", \"{cuisine2}\", ...],
  },
  \"goals\": {
    \"target_daily_calories\": {calories_value},
    \"target_macros_pct\": {
        \"protein\": {protein_pct},
        \"carbs\": {carbs_pct},
        \"fat\": {fat_pct}
    }
  },
}
Output Requirements:Format: Respond ONLY with a single, valid JSON object. Do NOT include any introduction, conversation, apologies, or explanation outside the JSON structure itself.JSON Structure: The root object must have keys \"Day1\", \"Day2\", ..., \"Day{duration_days}\".Each \"DayX\" object must contain keys for each requested meal (e.g., \"Breakfast\", \"Lunch\", \"Dinner\").Each meal object (e.g., \"Breakfast\") must contain:\"name\": (String) A creative and appropriate name for the dish.\"recipe\": (Object) Containing the following keys:\"description\": (String) A brief, appealing description of the dish (1-2 sentences).\"prepTimeMins\": (Number) Estimated preparation time in minutes.\"cookTimeMins\": (Number) Estimated cooking time in minutes.\"ingredients\": (Array of Objects) Each object must have:\"item\": (String) Ingredient name.\"quantity\": (String) Amount needed (Use string type for flexibility).\"unit\": (String) Unit of measurement.\"instructions\": (Array of Strings) Each string representing a clear, step-by-step instruction.Quality & Adherence:Safety First: Absolute adherence to restrictions and allergies is non-negotiable.Constraint Compliance: Follow all provided constraints and preferences to the best of your ability.Recipe Quality: Generate realistic, appealing recipes with clear instructions suitable for the user's skill_level.Variety & Balance: Ensure a good mix of flavors, ingredients (within constraints), and meal types throughout the plan.Completeness: Populate all required fields in the specified JSON structure accurately.Generate the meal plan JSON now. Make sure the recipe instructions given are detailed, assume the user needs full guidance.

Do not return user profile."""
                        ),
                    ],
                ),
                types.Content(
                    role="model",
                    parts=[
                        types.Part.from_text(
                            text="""{
  \"Day1\": {
    \"Breakfast\": {
      \"name\": \"Berry Burst Oatmeal Bowl\",
      \"recipe\": {
        \"description\": \"A hearty and colorful oatmeal bowl packed with antioxidants and fiber to start your day right.\",
        \"prepTimeMins\": 5,
        \"cookTimeMins\": 10,
        \"ingredients\": [
          {
            \"item\": \"Rolled Oats\",
            \"quantity\": \"1/2\",
            \"unit\": \"cup\"
          },
          {
            \"item\": \"Almond Milk\",
            \"quantity\": \"1\",
            \"unit\": \"cup\"
          },
          {
            \"item\": \"Mixed Berries\",
            \"quantity\": \"1/2\",
            \"unit\": \"cup\"
          },
          {
            \"item\": \"Chia Seeds\",
            \"quantity\": \"1\",
            \"unit\": \"tablespoon\"
          },
          {
            \"item\": \"Honey\",
            \"quantity\": \"1\",
            \"unit\": \"teaspoon\"
          }
        ],
        \"instructions\": [
          \"In a saucepan, combine rolled oats and almond milk.\",
          \"Bring to a boil, then reduce heat and simmer for 5-7 minutes, or until oats are cooked and creamy, stirring occasionally.\",
          \"Pour the cooked oatmeal into a bowl.\",
          \"Top with mixed berries, chia seeds, and a drizzle of honey.\",
          \"Serve immediately.\"
        ]
      }
    },
    \"Lunch\": {
      \"name\": \"Mediterranean Quinoa Salad\",
      \"recipe\": {
        \"description\": \"A refreshing and flavorful salad with quinoa, vegetables, and a zesty lemon dressing.\",
        \"prepTimeMins\": 15,
        \"cookTimeMins\": 20,
        \"ingredients\": [
          {
            \"item\": \"Quinoa\",
            \"quantity\": \"1/2\",
            \"unit\": \"cup\"
          },
          {
            \"item\": \"Water\",
            \"quantity\": \"1\",
            \"unit\": \"cup\"
          },
          {
            \"item\": \"Cucumber\",
            \"quantity\": \"1/2\",
            \"unit\": \"\",
            \"notes\": \"diced\"
          },
          {
            \"item\": \"Cherry Tomatoes\",
            \"quantity\": \"1/2\",
            \"unit\": \"cup\",
             \"notes\": \"halved\"
          },
          {
            \"item\": \"Red Onion\",
            \"quantity\": \"1/4\",
            \"unit\": \"\",
            \"notes\": \"finely chopped\"
          },
          {
            \"item\": \"Kalamata Olives\",
            \"quantity\": \"1/4\",
            \"unit\": \"cup\",
            \"notes\": \"halved\"
          },
          {
            \"item\": \"Feta Cheese\",
            \"quantity\": \"2\",
            \"unit\": \"tablespoons\",
            \"notes\": \"crumbled\"
          },
          {
            \"item\": \"Lemon Juice\",
            \"quantity\": \"2\",
            \"unit\": \"tablespoons\"
          },
          {
            \"item\": \"Olive Oil\",
            \"quantity\": \"1\",
            \"unit\": \"tablespoon\"
          },
          {
            \"item\": \"Dried Oregano\",
            \"quantity\": \"1/2\",
            \"unit\": \"teaspoon\"
          },
          {
            \"item\": \"Salt\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          },
          {
            \"item\": \"Black Pepper\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          }
        ],
        \"instructions\": [
          \"Rinse quinoa under cold water.\",
          \"In a saucepan, combine quinoa and water. Bring to a boil, then reduce heat and simmer for 15 minutes, or until water is absorbed.\",
          \"Fluff quinoa with a fork and let it cool slightly.\",
          \"In a large bowl, combine cooked quinoa, cucumber, cherry tomatoes, red onion, olives, and feta cheese.\",
          \"In a small bowl, whisk together lemon juice, olive oil, oregano, salt, and pepper.\",
          \"Pour dressing over the salad and toss gently to combine.\",
          \"Serve chilled.\"
        ]
      }
    },
    \"Dinner\": {
      \"name\": \"Lemon Herb Baked Chicken Breast\",
      \"recipe\": {
        \"description\": \"Tender and juicy baked chicken breast with a bright lemon herb flavor.\",
        \"prepTimeMins\": 10,
        \"cookTimeMins\": 25,
        \"ingredients\": [
          {
            \"item\": \"Chicken Breast\",
            \"quantity\": \"2\",
            \"unit\": \"\",
            \"notes\": \"boneless, skinless\"
          },
          {
            \"item\": \"Lemon Juice\",
            \"quantity\": \"2\",
            \"unit\": \"tablespoons\"
          },
          {
            \"item\": \"Olive Oil\",
            \"quantity\": \"1\",
            \"unit\": \"tablespoon\"
          },
          {
            \"item\": \"Dried Herbs\",
            \"quantity\": \"1\",
            \"unit\": \"teaspoon\",
            \"notes\": \"(e.g., thyme, rosemary, oregano)\"
          },
          {
            \"item\": \"Garlic Powder\",
            \"quantity\": \"1/2\",
            \"unit\": \"teaspoon\"
          },
          {
            \"item\": \"Salt\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          },
          {
            \"item\": \"Black Pepper\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          }
        ],
        \"instructions\": [
          \"Preheat oven to 375°F (190°C).\",
          \"In a small bowl, whisk together lemon juice, olive oil, dried herbs, garlic powder, salt, and pepper.\",
          \"Place chicken breasts in a baking dish and drizzle with lemon herb mixture.\",
          \"Bake for 20-25 minutes, or until chicken is cooked through and internal temperature reaches 165°F (74°C).\",
          \"Let the chicken rest for 5 minutes before serving.\"
        ]
      }
    }
  },
  \"Day2\": {
    \"Breakfast\": {
      \"name\": \"Scrambled Tofu with Spinach and Tomatoes\",
      \"recipe\": {
        \"description\": \"A savory and protein-packed tofu scramble with fresh spinach and juicy tomatoes.\",
        \"prepTimeMins\": 5,
        \"cookTimeMins\": 10,
        \"ingredients\": [
          {
            \"item\": \"Firm Tofu\",
            \"quantity\": \"1\",
            \"unit\": \"block\",
            \"notes\": \"drained and crumbled\"
          },
          {
            \"item\": \"Spinach\",
            \"quantity\": \"2\",
            \"unit\": \"cups\",
            \"notes\": \"fresh\"
          },
          {
            \"item\": \"Cherry Tomatoes\",
            \"quantity\": \"1/2\",
            \"unit\": \"cup\",
            \"notes\": \"halved\"
          },
          {
            \"item\": \"Onion\",
            \"quantity\": \"1/4\",
            \"unit\": \"\",
            \"notes\": \"diced\"
          },
          {
            \"item\": \"Nutritional Yeast\",
            \"quantity\": \"1\",
            \"unit\": \"tablespoon\"
          },
          {
            \"item\": \"Turmeric Powder\",
            \"quantity\": \"1/4\",
            \"unit\": \"teaspoon\"
          },
          {
            \"item\": \"Salt\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          },
          {
            \"item\": \"Black Pepper\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          }
        ],
        \"instructions\": [
          \"Heat a non-stick skillet over medium heat.\",
          \"Add onion and cook until softened, about 3-5 minutes.\",
          \"Add spinach and cherry tomatoes and cook until spinach is wilted, about 2 minutes.\",
          \"Add crumbled tofu, nutritional yeast, turmeric powder, salt, and pepper.\",
          \"Cook, stirring occasionally, until tofu is heated through and slightly browned, about 5 minutes.\",
          \"Serve immediately.\"
        ]
      }
    },
    \"Lunch\": {
      \"name\": \"Lentil Soup\",
      \"recipe\": {
        \"description\": \"A hearty and nutritious lentil soup, perfect for a comforting lunch.\",
        \"prepTimeMins\": 10,
        \"cookTimeMins\": 30,
        \"ingredients\": [
          {
            \"item\": \"Brown Lentils\",
            \"quantity\": \"1\",
            \"unit\": \"cup\",
            \"notes\": \"rinsed\"
          },
          {
            \"item\": \"Vegetable Broth\",
            \"quantity\": \"4\",
            \"unit\": \"cups\"
          },
          {
            \"item\": \"Carrot\",
            \"quantity\": \"1/2\",
            \"unit\": \"\",
            \"notes\": \"diced\"
          },
          {
            \"item\": \"Celery\",
            \"quantity\": \"1/2\",
            \"unit\": \"stalk\",
            \"notes\": \"diced\"
          },
          {
            \"item\": \"Onion\",
            \"quantity\": \"1/2\",
            \"unit\": \"\",
            \"notes\": \"diced\"
          },
          {
            \"item\": \"Garlic\",
            \"quantity\": \"2\",
            \"unit\": \"cloves\",
            \"notes\": \"minced\"
          },
          {
            \"item\": \"Diced Tomatoes\",
            \"quantity\": \"1\",
            \"unit\": \"cup\",
            \"notes\": \"canned\"
          },
          {
            \"item\": \"Olive Oil\",
            \"quantity\": \"1\",
            \"unit\": \"tablespoon\"
          },
          {
            \"item\": \"Dried Thyme\",
            \"quantity\": \"1/2\",
            \"unit\": \"teaspoon\"
          },
          {
            \"item\": \"Salt\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          },
          {
            \"item\": \"Black Pepper\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          }
        ],
        \"instructions\": [
          \"Heat olive oil in a large pot over medium heat.\",
          \"Add onion, carrot, and celery and cook until softened, about 5-7 minutes.\",
          \"Add garlic and cook for 1 minute more.\",
          \"Add lentils, vegetable broth, diced tomatoes, thyme, salt, and pepper.\",
          \"Bring to a boil, then reduce heat and simmer for 20-25 minutes, or until lentils are tender.\",
          \"Serve hot.\"
        ]
      }
    },
    \"Dinner\": {
      \"name\": \"Baked Salmon with Roasted Asparagus\",
      \"recipe\": {
        \"description\": \"A simple and healthy baked salmon served with tender roasted asparagus.\",
        \"prepTimeMins\": 10,
        \"cookTimeMins\": 15,
        \"ingredients\": [
          {
            \"item\": \"Salmon Fillet\",
            \"quantity\": \"2\",
            \"unit\": \"\",
            \"notes\": \"6 oz each\"
          },
          {
            \"item\": \"Asparagus\",
            \"quantity\": \"1\",
            \"unit\": \"bunch\",
            \"notes\": \"trimmed\"
          },
          {
            \"item\": \"Olive Oil\",
            \"quantity\": \"2\",
            \"unit\": \"tablespoons\"
          },
          {
            \"item\": \"Lemon Slices\",
            \"quantity\": \"4\",
            \"unit\": \"\"
          },
          {
            \"item\": \"Garlic Powder\",
            \"quantity\": \"1/2\",
            \"unit\": \"teaspoon\"
          },
          {
            \"item\": \"Salt\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          },
          {
            \"item\": \"Black Pepper\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          }
        ],
        \"instructions\": [
          \"Preheat oven to 400°F (200°C).\",
          \"Line a baking sheet with parchment paper.\",
          \"Place asparagus on the baking sheet and drizzle with 1 tablespoon of olive oil. Season with salt and pepper.\",
          \"Place salmon fillets on the same baking sheet and drizzle with remaining 1 tablespoon of olive oil. Season with garlic powder, salt, and pepper.\",
          \"Top each salmon fillet with lemon slices.\",
          \"Bake for 12-15 minutes, or until salmon is cooked through and asparagus is tender.\",
          \"Serve immediately.\"
        ]
      }
    }
  },
  \"Day3\": {
    \"Breakfast\": {
      \"name\": \"Overnight Oats with Almonds and Banana\",
      \"recipe\": {
        \"description\": \"Easy and delicious overnight oats prepared with almond milk, sliced banana, and crunchy almonds.\",
        \"prepTimeMins\": 5,
        \"cookTimeMins\": 0,
        \"ingredients\": [
          {
            \"item\": \"Rolled Oats\",
            \"quantity\": \"1/2\",
            \"unit\": \"cup\"
          },
          {
            \"item\": \"Almond Milk\",
            \"quantity\": \"1\",
            \"unit\": \"cup\"
          },
          {
            \"item\": \"Chia Seeds\",
            \"quantity\": \"1\",
            \"unit\": \"tablespoon\"
          },
          {
            \"item\": \"Banana\",
            \"quantity\": \"1/2\",
            \"unit\": \"\",
            \"notes\": \"sliced\"
          },
          {
            \"item\": \"Almonds\",
            \"quantity\": \"1/4\",
            \"unit\": \"cup\",
            \"notes\": \"slivered\"
          },
          {
            \"item\": \"Maple Syrup\",
            \"quantity\": \"1\",
            \"unit\": \"teaspoon\",
            \"notes\": \"optional\"
          }
        ],
        \"instructions\": [
          \"In a jar or container, combine rolled oats, almond milk, and chia seeds.\",
          \"Stir well to combine.\",
          \"Top with sliced banana and slivered almonds.\",
          \"Cover and refrigerate overnight.\",
          \"In the morning, stir well and add maple syrup if desired.\",
          \"Serve cold.\"
        ]
      }
    },
    \"Lunch\": {
      \"name\": \"Chickpea Salad Sandwich\",
      \"recipe\": {
        \"description\": \"A vegan chickpea salad sandwich, a great alternative to tuna salad, made with mashed chickpeas, vegan mayo and seasonings.\",
        \"prepTimeMins\": 10,
        \"cookTimeMins\": 0,
        \"ingredients\": [
          {
            \"item\": \"Chickpeas\",
            \"quantity\": \"1\",
            \"unit\": \"can\",
            \"notes\": \"drained and rinsed\"
          },
          {
            \"item\": \"Vegan Mayonnaise\",
            \"quantity\": \"2\",
            \"unit\": \"tablespoons\"
          },
          {
            \"item\": \"Celery\",
            \"quantity\": \"1/4\",
            \"unit\": \"stalk\",
            \"notes\": \"diced\"
          },
          {
            \"item\": \"Red Onion\",
            \"quantity\": \"1/4\",
            \"unit\": \"\",
            \"notes\": \"finely chopped\"
          },
          {
            \"item\": \"Lemon Juice\",
            \"quantity\": \"1\",
            \"unit\": \"teaspoon\"
          },
          {
            \"item\": \"Dijon Mustard\",
            \"quantity\": \"1/2\",
            \"unit\": \"teaspoon\"
          },
          {
            \"item\": \"Salt\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          },
          {
            \"item\": \"Black Pepper\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          },
          {
            \"item\": \"Bread\",
            \"quantity\": \"2\",
            \"unit\": \"slices\",
            \"notes\": \"whole wheat\"
          },
          {
            \"item\": \"Lettuce\",
            \"quantity\": \"1\",
            \"unit\": \"leaf\"
          }
        ],
        \"instructions\": [
          \"In a bowl, mash chickpeas with a fork or potato masher.\",
          \"Add vegan mayonnaise, celery, red onion, lemon juice, Dijon mustard, salt, and pepper.\",
          \"Mix well to combine.\",
          \"Spread chickpea salad onto one slice of bread.\",
          \"Top with lettuce and another slice of bread.\",
          \"Serve immediately.\"
        ]
      }
    },
    \"Dinner\": {
      \"name\": \"Turkey and Vegetable Stir-Fry\",
      \"recipe\": {
        \"description\": \"Quick and easy turkey stir-fry with lots of colorful vegetables.\",
        \"prepTimeMins\": 15,
        \"cookTimeMins\": 20,
        \"ingredients\": [
          {
            \"item\": \"Ground Turkey\",
            \"quantity\": \"1\",
            \"unit\": \"pound\"
          },
          {
            \"item\": \"Broccoli Florets\",
            \"quantity\": \"1\",
            \"unit\": \"cup\"
          },
          {
            \"item\": \"Carrot\",
            \"quantity\": \"1\",
            \"unit\": \"\",
            \"notes\": \"sliced\"
          },
          {
            \"item\": \"Bell Pepper\",
            \"quantity\": \"1/2\",
            \"unit\": \"\",
            \"notes\": \"sliced\"
          },
          {
            \"item\": \"Soy Sauce\",
            \"quantity\": \"2\",
            \"unit\": \"tablespoons\",
            \"notes\": \"low sodium\"
          },
          {
            \"item\": \"Sesame Oil\",
            \"quantity\": \"1\",
            \"unit\": \"tablespoon\"
          },
          {
            \"item\": \"Ginger\",
            \"quantity\": \"1\",
            \"unit\": \"teaspoon\",
            \"notes\": \"grated\"
          },
          {
            \"item\": \"Garlic\",
            \"quantity\": \"2\",
            \"unit\": \"cloves\",
            \"notes\": \"minced\"
          }
        ],
        \"instructions\": [
          \"Heat sesame oil in a large skillet or wok over medium-high heat.\",
          \"Add ground turkey and cook, breaking it apart with a spoon, until browned.\",
          \"Add broccoli florets, carrot, and bell pepper and stir-fry for 5-7 minutes, or until vegetables are tender-crisp.\",
          \"Add soy sauce, ginger, and garlic and stir-fry for 1-2 minutes more, or until fragrant.\",
          \"Serve hot.\"
        ]
      }
    }
  },
  \"Day4\": {
    \"Breakfast\": {
      \"name\": \"Smoothie Bowl with Granola and Fruit\",
      \"recipe\": {
        \"description\": \"A thick and creamy smoothie bowl topped with crunchy granola and fresh fruit.\",
        \"prepTimeMins\": 5,
        \"cookTimeMins\": 0,
        \"ingredients\": [
          {
            \"item\": \"Frozen Berries\",
            \"quantity\": \"1\",
            \"unit\": \"cup\",
            \"notes\": \"mixed\"
          },
          {
            \"item\": \"Banana\",
            \"quantity\": \"1/2\",
            \"unit\": \"\",
            \"notes\": \"frozen\"
          },
          {
            \"item\": \"Almond Milk\",
            \"quantity\": \"1/4\",
            \"unit\": \"cup\"
          },
          {
            \"item\": \"Granola\",
            \"quantity\": \"1/4\",
            \"unit\": \"cup\"
          },
          {
            \"item\": \"Fresh Fruit\",
            \"quantity\": \"1/2\",
            \"unit\": \"cup\",
            \"notes\": \"sliced\"
          }
        ],
        \"instructions\": [
          \"In a blender, combine frozen berries, frozen banana, and almond milk.\",
          \"Blend until smooth and creamy, adding more almond milk if needed to reach desired consistency.\",
          \"Pour smoothie into a bowl.\",
          \"Top with granola and fresh fruit.\",
          \"Serve immediately.\"
        ]
      }
    },
    \"Lunch\": {
      \"name\": \"Quinoa Bowl with Black Beans and Avocado\",
      \"recipe\": {
        \"description\": \"A delicious and filling quinoa bowl with black beans, avocado, and a lime dressing.\",
        \"prepTimeMins\": 15,
        \"cookTimeMins\": 20,
        \"ingredients\": [
          {
            \"item\": \"Quinoa\",
            \"quantity\": \"1/2\",
            \"unit\": \"cup\"
          },
          {
            \"item\": \"Water\",
            \"quantity\": \"1\",
            \"unit\": \"cup\"
          },
          {
            \"item\": \"Black Beans\",
            \"quantity\": \"1/2\",
            \"unit\": \"cup\",
            \"notes\": \"canned, rinsed\"
          },
          {
            \"item\": \"Avocado\",
            \"quantity\": \"1/2\",
            \"unit\": \"\",
            \"notes\": \"diced\"
          },
          {
            \"item\": \"Corn\",
            \"quantity\": \"1/2\",
            \"unit\": \"cup\",
            \"notes\": \"frozen or canned\"
          },
          {
            \"item\": \"Red Onion\",
            \"quantity\": \"1/4\",
            \"unit\": \"\",
            \"notes\": \"finely chopped\"
          },
          {
            \"item\": \"Lime Juice\",
            \"quantity\": \"2\",
            \"unit\": \"tablespoons\"
          },
          {
            \"item\": \"Olive Oil\",
            \"quantity\": \"1\",
            \"unit\": \"tablespoon\"
          },
          {
            \"item\": \"Cilantro\",
            \"quantity\": \"2\",
            \"unit\": \"tablespoons\",
            \"notes\": \"chopped\"
          },
          {
            \"item\": \"Salt\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          },
          {
            \"item\": \"Black Pepper\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          }
        ],
        \"instructions\": [
          \"Rinse quinoa under cold water.\",
          \"In a saucepan, combine quinoa and water. Bring to a boil, then reduce heat and simmer for 15 minutes, or until water is absorbed.\",
          \"Fluff quinoa with a fork and let it cool slightly.\",
          \"In a bowl, combine cooked quinoa, black beans, avocado, corn, and red onion.\",
          \"In a small bowl, whisk together lime juice, olive oil, cilantro, salt, and pepper.\",
          \"Pour dressing over the bowl and toss gently to combine.\",
          \"Serve immediately.\"
        ]
      }
    },
    \"Dinner\": {
      \"name\": \"Chicken and Vegetable Skewers\",
      \"recipe\": {
        \"description\": \"Grilled chicken and vegetable skewers marinated in a lemon herb dressing.\",
        \"prepTimeMins\": 20,
        \"cookTimeMins\": 15,
        \"ingredients\": [
          {
            \"item\": \"Chicken Breast\",
            \"quantity\": \"1\",
            \"unit\": \"pound\",
            \"notes\": \"cut into 1-inch cubes\"
          },
          {
            \"item\": \"Bell Peppers\",
            \"quantity\": \"2\",
            \"unit\": \"\",
            \"notes\": \"cut into 1-inch pieces\"
          },
          {
            \"item\": \"Red Onion\",
            \"quantity\": \"1\",
            \"unit\": \"\",
            \"notes\": \"cut into wedges\"
          },
          {
            \"item\": \"Zucchini\",
            \"quantity\": \"1\",
            \"unit\": \"\",
            \"notes\": \"cut into 1-inch pieces\"
          },
          {
            \"item\": \"Cherry Tomatoes\",
            \"quantity\": \"1\",
            \"unit\": \"cup\"
          },
          {
            \"item\": \"Olive Oil\",
            \"quantity\": \"2\",
            \"unit\": \"tablespoons\"
          },
          {
            \"item\": \"Lemon Juice\",
            \"quantity\": \"2\",
            \"unit\": \"tablespoons\"
          },
          {
            \"item\": \"Dried Herbs\",
            \"quantity\": \"1\",
            \"unit\": \"teaspoon\",
            \"notes\": \"(e.g., thyme, oregano, rosemary)\"
          },
          {
            \"item\": \"Salt\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          },
          {
            \"item\": \"Black Pepper\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          }
        ],
        \"instructions\": [
          \"In a bowl, whisk together olive oil, lemon juice, dried herbs, salt, and pepper.\",
          \"Add chicken cubes and vegetables to the bowl and toss to coat.\",
          \"Cover and marinate in the refrigerator for at least 30 minutes.\",
          \"Preheat grill to medium-high heat.\",
          \"Thread chicken and vegetables onto skewers.\",
          \"Grill for 10-15 minutes, or until chicken is cooked through and vegetables are tender, turning occasionally.\",
          \"Serve immediately.\"
        ]
      }
    }
  },
  \"Day5\": {
    \"Breakfast\": {
      \"name\": \"Whole Wheat Toast with Peanut Butter and Apple Slices\",
      \"recipe\": {
        \"description\": \"A simple and satisfying breakfast of whole wheat toast topped with peanut butter and crisp apple slices.\",
        \"prepTimeMins\": 5,
        \"cookTimeMins\": 0,
        \"ingredients\": [
          {
            \"item\": \"Whole Wheat Bread\",
            \"quantity\": \"2\",
            \"unit\": \"slices\"
          },
          {
            \"item\": \"Peanut Butter\",
            \"quantity\": \"2\",
            \"unit\": \"tablespoons\"
          },
          {
            \"item\": \"Apple\",
            \"quantity\": \"1/2\",
            \"unit\": \"\",
            \"notes\": \"sliced\"
          }
        ],
        \"instructions\": [
          \"Toast bread slices until golden brown.\",
          \"Spread peanut butter evenly on each slice of toast.\",
          \"Top with apple slices.\",
          \"Serve immediately.\"
        ]
      }
    },
    \"Lunch\": {
      \"name\": \"Spinach Salad with Berries and Balsamic Vinaigrette\",
      \"recipe\": {
        \"description\": \"A light and refreshing spinach salad with mixed berries and a tangy balsamic vinaigrette.\",
        \"prepTimeMins\": 10,
        \"cookTimeMins\": 0,
        \"ingredients\": [
          {
            \"item\": \"Spinach\",
            \"quantity\": \"4\",
            \"unit\": \"cups\",
            \"notes\": \"fresh\"
          },
          {
            \"item\": \"Mixed Berries\",
            \"quantity\": \"1/2\",
            \"unit\": \"cup\"
          },
          {
            \"item\": \"Walnuts\",
            \"quantity\": \"1/4\",
            \"unit\": \"cup\",
            \"notes\": \"chopped\"
          },
          {
            \"item\": \"Balsamic Vinaigrette\",
            \"quantity\": \"2\",
            \"unit\": \"tablespoons\",
            \"notes\": \"store-bought or homemade\"
          }
        ],
        \"instructions\": [
          \"In a large bowl, combine spinach, mixed berries, and walnuts.\",
          \"Drizzle with balsamic vinaigrette.\",
          \"Toss gently to combine.\",
          \"Serve immediately.\"
        ]
      }
    },
    \"Dinner\": {
      \"name\": \"Shrimp Scampi with Zucchini Noodles\",
      \"recipe\": {
        \"description\": \"A light and flavorful shrimp scampi served over zucchini noodles.\",
        \"prepTimeMins\": 10,
        \"cookTimeMins\": 15,
        \"ingredients\": [
          {
            \"item\": \"Shrimp\",
            \"quantity\": \"1\",
            \"unit\": \"pound\",
            \"notes\": \"peeled and deveined\"
          },
          {
            \"item\": \"Zucchini\",
            \"quantity\": \"2\",
            \"unit\": \"\",
            \"notes\": \"spiralized into noodles\"
          },
          {
            \"item\": \"Garlic\",
            \"quantity\": \"4\",
            \"unit\": \"cloves\",
            \"notes\": \"minced\"
          },
          {
            \"item\": \"Olive Oil\",
            \"quantity\": \"2\",
            \"unit\": \"tablespoons\"
          },
          {
            \"item\": \"Lemon Juice\",
            \"quantity\": \"2\",
            \"unit\": \"tablespoons\"
          },
          {
            \"item\": \"Red Pepper Flakes\",
            \"quantity\": \"1/4\",
            \"unit\": \"teaspoon\"
          },
          {
            \"item\": \"Parsley\",
            \"quantity\": \"2\",
            \"unit\": \"tablespoons\",
            \"notes\": \"chopped\"
          },
          {
            \"item\": \"Salt\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          },
          {
            \"item\": \"Black Pepper\",
            \"quantity\": \"to taste\",
            \"unit\": \"\"
          }
        ],
        \"instructions\": [
          \"Heat olive oil in a large skillet over medium heat.\",
          \"Add garlic and red pepper flakes and cook until fragrant, about 1 minute.\",
          \"Add shrimp and cook until pink and opaque, about 3-5 minutes.\",
          \"Add lemon juice and zucchini noodles and cook until zucchini noodles are tender-crisp, about 2-3 minutes.\",
          \"Stir in parsley, salt, and pepper.\",
          \"Serve immediately.\"
        ]
      }
    }
  }
}"""
                        ),
                    ],
                ),
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=user_prompt),
                    ],
                ),
            ]
            generate_content_config = types.GenerateContentConfig(
                response_mime_type="application/json",
            )
            response = client.models.generate_content(
                model=self.model,
                contents=contents,
                config=generate_content_config,
            )

            # Parse the response
            return json.loads(response.text)

        except Exception as e:
            print(f"Error generating meal plan: {e}")
            raise e


meal_service = MealService()
