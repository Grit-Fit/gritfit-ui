import React, { useState, useEffect, useRef } from "react";
import nutritionData from "./nutritionData"; 
import "../css/nutritionPage.css"; 
import "../css/gFitReport.css";
import "../css/CardView.css";
import logo from "../assets/GritFit_Full.png";
import NavBar from "./navBar";
import TabBar from "./TabBar";
import safeway from "../assets/safeway.png";
import harris from "../assets/harris.jpeg";
import walmart from "../assets/walmart.png";
import costco from "../assets/costco.png";
import target from "../assets/target.png";
import kroger from "../assets/kroger.png";
import trader from "../assets/trader.png";
import toppick from "../assets/toppick.png";


const NutritionPage = () => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);


  const tableRef = useRef(null);


  useEffect(() => {
    if (selectedStore && tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedStore]);


  const handleStoreClick = (store) => {
    setSelectedStore((prev) => (prev === store ? null : store));
  };


  const storeLogos = {
    "Safeway": safeway,
    "Harris Teeter": harris,
    "Walmart": walmart,
    "Costco": costco,
    "Target": target,
    "Kroger": kroger,
    "Trader Joe's": trader,
  };

  return (
    <>
      <header className="gritphase-header">
        <img src={logo} alt="Logo" className="logo-gritPhases-header" />
      </header>

      <div className="report_header_nut">
        <div className="report_header-text">
          <img src={toppick} alt="Top Picks Icon" />
          Top Picks
        </div>
      </div>

      <div className="nutrition-page-container">
        <NavBar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
  
        {/* Grid of store cards */}
        <div className="store-grid">
          {Object.keys(nutritionData).map((store) => (
            <div
              key={store}
              className={`store-card ${selectedStore === store ? "active" : ""}`}
              onClick={() => handleStoreClick(store)}
            >
              <img 
                src={storeLogos[store]} 
                alt={store} 
                className="store-icon"
              />
            </div>
          ))}
        </div>


        {selectedStore && (
          <div className="store-food-table" ref={tableRef}>
            <h4 style={{ textAlign: 'center', fontWeight: '700', fontSize: '0.9rem' }}>
              Best Macro friendly items at {selectedStore}
            </h4>

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

      <TabBar />
    </>
  );
};

export default NutritionPage;
