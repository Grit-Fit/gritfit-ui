import React, { useState } from "react";
import nutritionData from "./nutritionData"; 
import "../css/nutritionPage.css"; 
import "../css/gFitReport.css";
import logo from "../assets/GritFit_Full.png";
import NavBar from "./navBar";
import { ChevronDown, Info, Menu } from "lucide-react";

const NutritionPage = () => {
    const [selectedStore, setSelectedStore] = useState(null);
    const [isNavOpen, setIsNavOpen] = useState(false);

    const handleStoreClick = (store) => {
        setSelectedStore(selectedStore === store ? null : store);
    };

    return (
        <div className="nutrition-page-container">
        <NavBar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
        <header className="gfit-report-header">
          <div className="logo-container1">
            <Menu
                        className="hamburger-icon"
                        size={24} // Adjust size as needed
                        onClick={() => setIsNavOpen(!isNavOpen)} 
                        style={{ cursor: "pointer", marginLeft: "10px", marginTop: "24px" }} // Adjust spacing
            />
            <img src={logo} alt="Logo" onClick={() => setIsNavOpen(!isNavOpen)} />
          </div>
        </header>                    
            <h2 className="report_header-text" style={{ textAlign: 'center', marginTop: '36px', color: '#284964' }}>Your Personalized Nutrition Hub</h2>
            <p class = "text">
            We’ve curated a handy list of stores where you can easily find all the food items you’ll need for your fitness journey. 
            Whether you’re meal prepping like a pro or just grabbing essentials, we’ve got you covered. 
            Tap a store to explore your options — healthy gains are just a click away! 🥦🥚
            </p>

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
                    <h4 style={{ textAlign: 'center', fontWeight: '700' }}>Available Foods at {selectedStore}</h4>
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
