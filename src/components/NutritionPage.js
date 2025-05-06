// src/components/NutritionPage.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import nutritionData from "./nutritionData";
import "../css/nutritionPage.css";
import "../css/gFitReport.css";
import "../css/CardView.css";
import logo from "../assets/logo1.png";
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

import FeedbackPrompt from "./FeedbackPrompt";          // ★ new

/* --------------------------------------------------------- */
/*       N U T R I T I O N   P A G E  – “Top Picks”          */
/* --------------------------------------------------------- */
export default function NutritionPage() {
  const navigate = useNavigate();

  /* ---------------- state ---------------- */
  const [selectedStore, setSelectedStore] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // show feedback modal?
  const [showFeedback, setShowFeedback] = useState(false);

  // has this device already filled the Top‑Picks survey?
  const [askedOnce, setAskedOnce] = useState(
    localStorage.getItem("fp_top_picks") === "done"
  );

  const tableRef = useRef(null);

  /* ---------------- smooth‑scroll to table ---------------- */
  useEffect(() => {
    if (selectedStore && tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedStore]);

  /* ---------------- click‑away listener ---------------- */
  useEffect(() => {
    if (!selectedStore || askedOnce) return;

    // fires when user clicks anywhere in the document
    const handleGlobalClick = (e) => {
      if (showFeedback) return;                      // modal already open

      const insideStoreCard = e.target.closest(".store-card");
      if (!insideStoreCard) {
        // user is leaving the Top‑Picks section → open prompt once
        setShowFeedback(true);
        document.removeEventListener("click", handleGlobalClick, true);
      }
    };

    document.addEventListener("click", handleGlobalClick, true);

    // cleanup on unmount / when store deselected
    return () => document.removeEventListener("click", handleGlobalClick, true);
  }, [selectedStore, showFeedback, askedOnce]);

  /* ---------------- helpers ---------------- */
  const handleStoreClick = (store) =>
    setSelectedStore((prev) => (prev === store ? null : store));

  const storeLogos = {
    Safeway: safeway,
    "Harris Teeter": harris,
    Walmart: walmart,
    Costco: costco,
    Target: target,
    Kroger: kroger,
    "Trader Joe's": trader,
  };

  const goToCard = () => navigate("/cardView");

  /* ---------------- UI ---------------- */
  return (
    <>
      {/* ─── sticky logo nav ─── */}
      <header className="gritphase-header">
        <img
          src={logo}
          alt="Logo"
          className="logo-gritPhases-task"
          onClick={goToCard}
        />
      </header>

      {/* ─── section heading ─── */}
      <div className="report_header_nut">
        <div className="report_header-text">
          <img src={toppick} alt="Top Picks Icon" />
          Top Picks
        </div>
      </div>

      {/* ─── main container ─── */}
      <div className="nutrition-page-container">
        <NavBar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

        {/* grid of stores */}
        <div className="store-grid">
          {Object.keys(nutritionData).map((store) => (
            <div
              key={store}
              className={`store-card ${
                selectedStore === store ? "active" : ""
              }`}
              onClick={() => handleStoreClick(store)}
            >
              <img src={storeLogos[store]} alt={store} className="store-icon" />
            </div>
          ))}
          
        </div>

            <button
                  className="px-4 py-2 rounded bg-black text-white text-sm"
                  onClick={() => setShowFeedback(true)}
                >
                  Give feedback
                </button>

        {/* macro table for selected store */}
        {selectedStore && (
          <div className="store-food-table" ref={tableRef}>
            <h4
              style={{
                textAlign: "center",
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              Best macro‑friendly items at {selectedStore}
            </h4>

            {["Proteins", "Carbohydrates", "Fats"].map((cat) => (
              <div key={cat}>
                <h5>{cat}</h5>
                <table>
                  <thead>
                    <tr>
                      <th>Food Item</th>
                      <th>Calories/100g</th>
                      <th>
                        {cat === "Proteins"
                          ? "Protein/100g"
                          : cat === "Carbohydrates"
                          ? "Carbs/100g"
                          : "Fat/100g"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutritionData[selectedStore]?.[cat]?.map((food, idx) => (
                      <tr key={idx}>
                        <td>{food.foodItem}</td>
                        <td>{food.calories}</td>
                        <td>
                          {cat === "Proteins"
                            ? `${food.protein} g`
                            : cat === "Carbohydrates"
                            ? `${food.carbs} g`
                            : `${food.fat} g`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            {/* fallback button (kept for manual trigger) */}
            {!askedOnce && (
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <button
                  className="px-4 py-2 rounded bg-black text-white text-sm"
                  onClick={() => setShowFeedback(true)}
                >
                  Give feedback
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* bottom navbar */}
      <TabBar />

      {/* feedback modal */}
      {showFeedback && (
        <FeedbackPrompt
          feature="TOP_PICKS"
          question="How much do you like this feature?"
          placeholder="What would make it more useful?"
          onClose={() => setShowFeedback(false)}
          onSubmitted={() => {
            localStorage.setItem("fp_top_picks", "done");
            setAskedOnce(true);
            setShowFeedback(false);
          }}
        />
      )}
    </>
  );
}
