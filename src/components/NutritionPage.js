import React, { useState } from "react";
import nutritionData from "./nutritionData"; // Import data file
import "../css/nutritionPage.css"; // For consistent styling

const NutritionPage = () => {
    const [selectedStore, setSelectedStore] = useState(null);

    const handleStoreClick = (store) => {
        setSelectedStore(selectedStore === store ? null : store);
    };

    return (
        <div className="nutrition-page-container">
            <h2 className="page-title">Nutrition Information</h2>

            <ul className="nutrition-store-list">
                {Object.keys(nutritionData).map((store) => (
                    <li
                        key={store}
                        className={`store-button ${selectedStore === store ? "active" : ""}`}
                        onClick={() => handleStoreClick(store)}
                    >
                        {store}
                    </li>
                ))}
            </ul>

            {selectedStore && (
                <div className="store-food-table">
                    <h4>Available Foods at {selectedStore}</h4>

                    {['Proteins', 'Carbohydrates', 'Fats'].map((category) => (
                        <div key={category}>
                            <h5>{category}</h5>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Food Item</th>
                                        <th>Calories/100g</th>
                                        <th>
                                            {category === 'Proteins' ? 'Protein/100g' :
                                                category === 'Carbohydrates' ? 'Carbs/100g' : 'Fat/100g'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nutritionData[selectedStore]?.[category]?.map((food, index) => (
                                        <tr key={index}>
                                            <td>{food.foodItem}</td>
                                            <td>{food.calories}</td>
                                            <td>
                                                {category === 'Proteins' ? `${food.protein}g` :
                                                    category === 'Carbohydrates' ? `${food.carbs}g` :
                                                    `${food.fat}g`}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NutritionPage;
