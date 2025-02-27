import React, { useEffect } from "react";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";
import pdfIcon from "../assets/pdf.png";


function GeneratePdf({
  userName = "Anonymous",
  maintenanceCalories,
  macros
}) {
  const { accessToken, refreshAuthToken } = useAuth();

  useEffect(() => {
    if (!accessToken) refreshAuthToken();
  }, [accessToken, refreshAuthToken]);

  const handleGeneratePdf = async () => {
    try {
      const response = await axios.post(
        "/api/generatePdf",
        {
          userName,
          maintenanceCalories,
          targetCaloriesBulk: maintenanceCalories + 500,
          targetCaloriesCut: maintenanceCalories - 500,
          proteinGrams: macros?.protein,
          carbGrams: macros?.carbs,
          fatGrams: macros?.fats
        },
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "MyNutrition.pdf";
      link.click();

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("PDF generation failed. See console.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
  <button
    onClick={handleGeneratePdf}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      border: "none",
      background: "none",
      cursor: "pointer",
      fontSize: "inherit",
      color: "inherit",
    }}
  >
    Nutrition 101 PDF
    <img src={pdfIcon} alt="PDF icon" width="20" height="20" />
  </button>
</div>
  );
}

export default GeneratePdf;
