const nutritionData = {
  "Safeway": {
    "Proteins": [
      { foodItem: "Seitan", calories: 370, protein: 75 },
      { foodItem: "Firm Tofu", calories: 76, protein: 8 },
      { foodItem: "Greek Yogurt", calories: 59, protein: 10 },
      { foodItem: "Cottage Cheese", calories: 98, protein: 11 },
      { foodItem: "Edamame", calories: 122, protein: 11 },
      { foodItem: "Beyond Meat Burgers", calories: 250, protein: 20 },
      { foodItem: "Lentils (dry)", calories: 352, protein: 25 }
    ],
    "Carbohydrates": [
      { foodItem: "Brown Rice", calories: 123, carbs: 26 },
      { foodItem: "Whole Wheat Pasta", calories: 124, carbs: 25 },
      { foodItem: "Red Potatoes", calories: 77, carbs: 17 },
      { foodItem: "Dave's Killer Bread", calories: 247, carbs: 41 },
      { foodItem: "Steel Cut Oats", calories: 380, carbs: 68 },
      { foodItem: "Medjool Dates", calories: 282, carbs: 75 },
      { foodItem: "Gala Apples", calories: 52, carbs: 14 }
    ],
    "Fats": [
      { foodItem: "Hass Avocados", calories: 160, fat: 15 },
      { foodItem: "Blue Diamond Almonds", calories: 579, fat: 49 },
      { foodItem: "Signature Select Olive Oil", calories: 884, fat: 100 },
      { foodItem: "O Organics Peanut Butter", calories: 588, fat: 50 },
      { foodItem: "Walnuts", calories: 654, fat: 65 },
      { foodItem: "Ground Flax Seeds", calories: 534, fat: 42 },
      { foodItem: "Full Fat Cottage Cheese", calories: 103, fat: 4.3 }
    ]
  },
  "Harris Teeter": {
    "Proteins": [
      { foodItem: "Fresh Tofu", calories: 76, protein: 8 },
      { foodItem: "Greek Yogurt", calories: 59, protein: 10 },
      { foodItem: "Cottage Cheese", calories: 98, protein: 11 },
      { foodItem: "Veggie Burgers", calories: 240, protein: 21 },
      { foodItem: "Tempeh", calories: 193, protein: 19 },
      { foodItem: "Plant-Based Meatballs", calories: 220, protein: 17 },
      { foodItem: "Hummus", calories: 166, protein: 7 }
    ],
    "Carbohydrates": [
      { foodItem: "Carolina Gold Rice", calories: 130, carbs: 28 },
      { foodItem: "Nature's Own Bread", calories: 247, carbs: 41 },
      { foodItem: "Sweet Potatoes", calories: 86, carbs: 20 },
      { foodItem: "Barilla Pasta", calories: 371, carbs: 75 },
      { foodItem: "Bob's Red Mill Oats", calories: 389, carbs: 66 },
      { foodItem: "Fresh Bananas", calories: 89, carbs: 23 },
      { foodItem: "Red Potatoes", calories: 77, carbs: 17 }
    ],
    "Fats": [
      { foodItem: "Fresh Avocados", calories: 160, fat: 15 },
      { foodItem: "Simple Truth Mixed Nuts", calories: 607, fat: 54 },
      { foodItem: "California Olive Oil", calories: 884, fat: 100 },
      { foodItem: "Justin's Almond Butter", calories: 614, fat: 55 },
      { foodItem: "Bob's Red Mill Chia Seeds", calories: 486, fat: 31 },
      { foodItem: "Nutiva Coconut Oil", calories: 862, fat: 100 },
      { foodItem: "Full Fat Greek Yogurt", calories: 130, fat: 10 }
    ]
  },
  "Kroger": {
    "Proteins": [
      { foodItem: "Simple Truth Organic Tofu", calories: 76, protein: 8 },
      { foodItem: "Tempeh", calories: 193, protein: 19 },
      { foodItem: "Plant-Based Ground", calories: 230, protein: 19 },
      { foodItem: "Greek Yogurt", calories: 59, protein: 10 },
      { foodItem: "Cottage Cheese", calories: 98, protein: 11 },
      { foodItem: "Seitan", calories: 370, protein: 75 },
      { foodItem: "Lentils (dry)", calories: 352, protein: 25 }
    ],
    "Carbohydrates": [
      { foodItem: "Simple Truth Brown Rice", calories: 123, carbs: 26 },
      { foodItem: "Kroger Pasta", calories: 371, carbs: 75 },
      { foodItem: "Sweet Potatoes", calories: 86, carbs: 20 },
      { foodItem: "Private Selection Bread", calories: 247, carbs: 41 },
      { foodItem: "Simple Truth Oats", calories: 389, carbs: 66 },
      { foodItem: "Fresh Bananas", calories: 89, carbs: 23 },
      { foodItem: "Quinoa", calories: 120, carbs: 21 }
    ],
    "Fats": [
      { foodItem: "Fresh Avocados", calories: 160, fat: 15 },
      { foodItem: "Simple Truth Mixed Nuts", calories: 607, fat: 54 },
      { foodItem: "Private Selection Olive Oil", calories: 884, fat: 100 },
      { foodItem: "Simple Truth Almond Butter", calories: 614, fat: 55 },
      { foodItem: "Chia Seeds", calories: 486, fat: 31 },
      { foodItem: "Coconut Oil", calories: 862, fat: 100 },
      { foodItem: "Full Fat Greek Yogurt", calories: 130, fat: 10 }
    ]
  },
  "Target": {
    "Proteins": [
      { foodItem: "Good & Gather Tofu", calories: 76, protein: 8 },
      { foodItem: "Beyond Meat Products", calories: 250, protein: 20 },
      { foodItem: "Plant-Based Protein Powder", calories: 380, protein: 75 },
      { foodItem: "Greek Yogurt", calories: 59, protein: 10 },
      { foodItem: "Impossible Meat", calories: 240, protein: 19 },
      { foodItem: "Veggie Burgers", calories: 220, protein: 17 },
      { foodItem: "Plant-Based Chicken Strips", calories: 190, protein: 18 }
    ],
    "Carbohydrates": [
      { foodItem: "Good & Gather Rice", calories: 130, carbs: 28 },
      { foodItem: "Sweet Potatoes", calories: 86, carbs: 20 },
      { foodItem: "Market Pantry Pasta", calories: 371, carbs: 75 },
      { foodItem: "Dave's Killer Bread", calories: 247, carbs: 41 },
      { foodItem: "Quaker Oats", calories: 389, carbs: 66 },
      { foodItem: "Fresh Bananas", calories: 89, carbs: 23 },
      { foodItem: "Good & Gather Quinoa", calories: 120, carbs: 21 }
    ],
    "Fats": [
      { foodItem: "Fresh Avocados", calories: 160, fat: 15 },
      { foodItem: "Good & Gather Mixed Nuts", calories: 607, fat: 54 },
      { foodItem: "Good & Gather Olive Oil", calories: 884, fat: 100 },
      { foodItem: "Good & Gather Almond Butter", calories: 614, fat: 55 },
      { foodItem: "Chia Seeds", calories: 486, fat: 31 },
      { foodItem: "Coconut Oil", calories: 862, fat: 100 },
      { foodItem: "Good & Gather Greek Yogurt", calories: 130, fat: 10 }
    ]
  },
  "Trader Joe's": {
    "Proteins": [
      { foodItem: "Organic Tempeh", calories: 193, protein: 19 },
      { foodItem: "Extra Firm Tofu", calories: 70, protein: 8 },
      { foodItem: "Greek Yogurt (2%)", calories: 73, protein: 9 },
      { foodItem: "Cottage Cheese", calories: 98, protein: 11 },
      { foodItem: "Black Bean & Quinoa Bowl", calories: 120, protein: 6 },
      { foodItem: "Chickpea Patties", calories: 230, protein: 8 },
      { foodItem: "Lentil Wraps", calories: 240, protein: 9 }
    ],
    "Carbohydrates": [
      { foodItem: "Jasmine Rice", calories: 130, carbs: 28 },
      { foodItem: "Sweet Potato", calories: 86, carbs: 20 },
      { foodItem: "Organic Bananas", calories: 89, carbs: 23 },
      { foodItem: "Seeds & Grains Bread", calories: 240, carbs: 44 },
      { foodItem: "Steel Cut Oatmeal", calories: 389, carbs: 66 },
      { foodItem: "Organic Quinoa", calories: 120, carbs: 21 },
      { foodItem: "Dried Mango", calories: 320, carbs: 80 }
    ],
    "Fats": [
      { foodItem: "Organic Avocados", calories: 160, fat: 15 },
      { foodItem: "Raw Mixed Nuts", calories: 607, fat: 54 },
      { foodItem: "California Olive Oil", calories: 884, fat: 100 },
      { foodItem: "Raw Almond Butter", calories: 614, fat: 55 },
      { foodItem: "Organic Chia Seeds", calories: 486, fat: 31 },
      { foodItem: "Coconut Oil", calories: 862, fat: 100 },
      { foodItem: "Full Fat Greek Yogurt", calories: 130, fat: 10 }
    ]
  },
  "Costco": {
    "Proteins": [
      { foodItem: "Kirkland Greek Yogurt", calories: 97, protein: 10 },
      { foodItem: "Beyond Burger (bulk)", calories: 250, protein: 20 },
      { foodItem: "Quinoa", calories: 120, protein: 4.4 },
      { foodItem: "Black Beans (bulk)", calories: 341, protein: 21 },
      { foodItem: "Garden Burgers", calories: 160, protein: 11 },
      { foodItem: "Impossible Burger", calories: 240, protein: 19 },
      { foodItem: "Plant-Based Protein Shakes", calories: 160, protein: 20 }
    ],
    "Carbohydrates": [
      { foodItem: "Kirkland Rice", calories: 130, carbs: 28 },
      { foodItem: "Sweet Potatoes (bulk)", calories: 86, carbs: 20 },
      { foodItem: "Dave's Killer Bread", calories: 240, carbs: 43 },
      { foodItem: "Kirkland Quinoa", calories: 120, carbs: 21 },
      { foodItem: "Quaker Oatmeal", calories: 389, carbs: 66 },
      { foodItem: "Organic Bananas", calories: 89, carbs: 23 },
      { foodItem: "Dried Fruit Mix", calories: 340, carbs: 82 }
    ],
    "Fats": [
      { foodItem: "Kirkland Mixed Nuts", calories: 607, fat: 54 },
      { foodItem: "Kirkland Avocado Oil", calories: 884, fat: 100 },
      { foodItem: "Kirkland Almond Butter", calories: 614, fat: 55 },
      { foodItem: "Kirkland Macadamia Nuts", calories: 718, fat: 75 },
      { foodItem: "Nutiva Coconut Oil", calories: 862, fat: 100 },
      { foodItem: "Kirkland Olive Oil", calories: 884, fat: 100 },
      { foodItem: "Kirkland Greek Yogurt", calories: 130, fat: 10 }
    ]
  },
  "Walmart": {
    "Proteins": [
      { foodItem: "Great Value Tofu", calories: 76, protein: 8 },
      { foodItem: "Black Beans (canned)", calories: 341, protein: 21 },
      { foodItem: "Morning Star Farms Products", calories: 240, protein: 21 },
      { foodItem: "Plant-Based Crumbles", calories: 220, protein: 18 },
      { foodItem: "Greek Yogurt", calories: 59, protein: 10 },
      { foodItem: "Protein Bars", calories: 360, protein: 20 },
      { foodItem: "Chickpeas (canned)", calories: 364, protein: 15 }
    ],
    "Carbohydrates": [
      { foodItem: "Great Value Rice", calories: 130, carbs: 28 },
      { foodItem: "Sweet Potatoes", calories: 86, carbs: 20 },
      { foodItem: "Great Value Bread", calories: 247, carbs: 41 },
      { foodItem: "Great Value Pasta", calories: 371, carbs: 75 },
      { foodItem: "Quaker Oats", calories: 389, carbs: 66 },
      { foodItem: "Fresh Bananas", calories: 89, carbs: 23 },
      { foodItem: "Russet Potatoes", calories: 77, carbs: 17 }
    ],
    "Fats": [
      { foodItem: "Fresh Avocados", calories: 160, fat: 15 },
      { foodItem: "Great Value Mixed Nuts", calories: 607, fat: 54 },
      { foodItem: "Great Value Olive Oil", calories: 884, fat: 100 },
      { foodItem: "Great Value Almond Butter", calories: 614, fat: 55 },
      { foodItem: "Great Value Chia Seeds", calories: 486, fat: 31 },
      { foodItem: "LouAna Coconut Oil", calories: 862, fat: 100 },
      { foodItem: "Great Value Greek Yogurt", calories: 130, fat: 10 }
    ]
  }
};

export default nutritionData;