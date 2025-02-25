import React from "react";
import axios from "../axios"; 

function GeneratePdfButton(props) {
  // We'll pass in the user data as props
  const {
    userName,
    maintenanceCalories,
    targetCaloriesBulk,
    targetCaloriesCut,
    targetCaloriesMaintain,
    proteinGrams,
    carbGrams,
    fatGrams,
  } = props;

  const handleGeneratePdf = async () => {
    try {
      // 1) Make a POST request to your server
      const response = await axios.post(
        "/api/generatePdf",
        {
          userName,
          maintenanceCalories,
          targetCaloriesBulk,
          targetCaloriesCut,
          targetCaloriesMaintain,
          proteinGrams,
          carbGrams,
          fatGrams,
        },
        { responseType: "blob" } // important for binary data
      );

      // 2) Convert response blob to a downloadable file
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      // 3) Create link <a> element and trigger download
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "Nutrition101.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <button onClick={handleGeneratePdf}>
      Download Personalized PDF
    </button>
  );
}

export default GeneratePdfButton;
