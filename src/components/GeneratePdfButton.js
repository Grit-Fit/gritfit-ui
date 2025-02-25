// src/components/pdf.js
import React from "react";
import axios from "../axios"; // or wherever your axios is located

function GeneratePdf({
  userName = "Anonymous",     // you can provide defaults
  age,
  gender,
  weight,
  weightUnit,
  height,
  heightUnit,
  activity,
  maintenanceCalories,
  macros,                     // macros is an object { protein, carbs, fats }
}) {
  // We define a button click handler to call the backend route
  const handleGeneratePdf = async () => {
    // For safety, ensure we have the minimal data
    if (!maintenanceCalories || !macros) {
      alert("Please calculate your maintenance first!");
      return;
    }

    try {
      const response = await axios.post(
        "/api/generatePdf",
        {
          userName,      // if you want the user’s name from your DB
          age,
          gender,
          weight,
          weightUnit,
          height,
          heightUnit,
          activity,
          // This might differ from your server’s placeholders.
          // Adjust the key names to match what your server expects!
          maintenanceCalories,
          proteinGrams: macros.protein,
          carbGrams: macros.carbs,
          fatGrams: macros.fats,
        },
        { responseType: "blob" } // important for binary data
      );

      // Turn the response into a Blob and trigger a download
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "Nutrition101.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. See console for details.");
    }
  };

  // The component renders just a button
  return (
    <button onClick={handleGeneratePdf}>
      Generate Personalized PDF
    </button>
  );
}

export default GeneratePdf;
