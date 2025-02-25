// pdf.js
import React from "react";
import axios from "../axios";

function GeneratePdf({
  userName = "Anonymous",
  maintenanceCalories,
  macros
}) {
  // The button triggers the handleGeneratePdf function
  const handleGeneratePdf = async () => {
    try {
      const response = await axios.post(
        "/api/generatePdf",
        {
          userName,
          maintenanceCalories,
          // for example: 
          targetCaloriesBulk: maintenanceCalories + 500,
          targetCaloriesCut: maintenanceCalories - 500,
          proteinGrams: macros?.protein,
          carbGrams: macros?.carbs,
          fatGrams: macros?.fats
        },
        { responseType: "blob" },
        {
            headers: { Authorization: `Bearer ${accessToken}` },
         }
      );

      // Construct a blob and download
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "MyNutrition.pdf";
      link.click();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <button onClick={handleGeneratePdf}>
      Download My Edited PDF
    </button>
  );
}

export default GeneratePdf;
