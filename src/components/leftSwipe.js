import React, { useState, useEffect } from "react";
import logo from "../assets/red_logo.png";
import sick from "../assets/sick.png";
import cheatDay from "../assets/cheat_day.png";
import lm from "../assets/less_motivation.png";
import busy from "../assets/busy.png";
import other from "../assets/other.png";
import { ChevronRight } from "lucide-react";
import "../css/leftSwipe.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const LeftSwipe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, refreshAuthToken } = useAuth();
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [otherReason, setOtherReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get phase and task from navigation state
  const { phaseNumber, taskId } = location.state || {};
  const phaseId = parseInt(phaseNumber);
  // Check its type and value

  useEffect(() => {
    // If there is no accessToken, try to refresh it by calling the backend refresh route
    if (!accessToken) {
      refreshAuthToken(); // Refresh token by making API call to the backend
    }
  }, [accessToken, refreshAuthToken]);

  const undoSwipe = (e) => {
    e.preventDefault();
    navigate("/gritPhases");
  };

  const handleButtonClick = (buttonName, image) => {
    setSelectedButton({ name: buttonName, image: image });
  };

  const handleGoalSelection = (goal) => {
    setSelectedGoal(goal);
  };

  const getReasonText = (buttonName) => {
    switch (buttonName) {
      case "sick":
        return "Feeling unwell";
      case "less_motivation":
        return "Lack of motivation";
      case "cheatDay":
        return "Cheat day";
      case "busy":
        return "Too busy";
      case "other":
        return otherReason.trim();
      default:
        return "";
    }
  };

  const doneBtnClick = async (e) => {
    e.preventDefault();
    console.log("Leftswipe done button clicked.");
    const { phaseNumber, dayNumber } = location.state || {};

    if (!phaseNumber || !dayNumber) {
      setError("Missing required information");
      return;
    }
    if (phaseId === 3 && !selectedGoal) {
      setError("Please select a goal you were unable to achieve.");
      return;
    }
    console.log("Phase and Day, ", phaseNumber);
    setIsLoading(true);
    setError(null);
    try {
      const reason = getReasonText(selectedButton.name);

      const requestData = {
        phaseId: parseInt(phaseNumber),
        taskId: parseInt(dayNumber),
        reasonForNonCompletion: reason,
        failedGoal: null,
      };

      if (phaseId === 3) {
        requestData.failedGoal = selectedGoal; // Include goal in phase 3
      }

      // console.log("🚀 Sending request to:", "http://localhost:5050/api/userprogressNC");
      // console.log("📦 Request Data:", requestData);
      
      const response = await axios.post(
        "/api/userprogressNC",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Success:", response.data);
      // let phaseNumb,
      //   dayNumb = 0;
      // if (
      //   (parseInt(phaseNumber) % 3 !== 0 && parseInt(dayNumber) === 5) ||
      //   (parseInt(phaseNumber) % 3 === 0 && parseInt(dayNumber) === 4)
      // ) {
      //   phaseNumb = parseInt(phaseNumber) + 1;
      //   dayNumb = 1;
      // } else {
      //   phaseNumb = parseInt(phaseNumber);
      //   dayNumb = parseInt(dayNumber) + 1;
      // }

      // const startProgressResponse = await axios.post(
      //   "http://localhost:5050/api/userprogressStart",
      //   {
      //     phaseId: phaseNumb,
      //     taskId: dayNumb,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   }
      // );
      // console.log("Start Progress: ", startProgressResponse.data);
      navigate("/gritPhases", {
        state: {
          phase: parseInt(phaseNumber),
          day: parseInt(dayNumber),
          rightSwipe: false,
          leftSwipe: true,
        },
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOtherReasonChange = (e) => {
    setOtherReason(e.target.value);
  };

  return (
    <div className="fullpage-left">
      <header className="header-left">
        <img src={logo} alt="logo" className="logo-left" />
        <div className="undo_swipe_btn" onClick={undoSwipe}>
          Undo Swipe <ChevronRight className="c" />
        </div>
      </header>
      <div className="body-leftSwipe">
        {!selectedGoal && phaseId === 3 ? (
          <div className="goal-selection">
            <div className="body_text">
              <h2>Which goal were you unable to achieve?</h2>
            </div>
            <div className="goal-buttons">
              <button
                className="goalBtn"
                onClick={() => handleGoalSelection("Protein Goal")}
              >
                Protein Goal
              </button>
              <br />
              <h3> OR </h3>
              <br />
              <button
                className="goalBtn"
                onClick={() => handleGoalSelection("Fat Goal")}
              >
                Fat Goal
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="body_text">
            It's okay! What was your biggest hurdle today?
            </div>

            {!selectedButton ? (
              <div className="body_images">
                <img
                  src={sick}
                  alt="sick"
                  onClick={() => handleButtonClick("sick", sick)}
                />
                <img
                  src={lm}
                  alt="less_motivation"
                  onClick={() => handleButtonClick("less_motivation", lm)}
                />
                <img
                  src={cheatDay}
                  alt="cheatDay"
                  onClick={() => handleButtonClick("cheatDay", cheatDay)}
                />
                <img
                  src={busy}
                  alt="busy"
                  onClick={() => handleButtonClick("busy", busy)}
                />
                <img
                  src={other}
                  alt="other"
                  onClick={() => handleButtonClick("other", other)}
                />
                <svg width="132" height="71" viewBox="0 0 132 71" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleButtonClick("sick", sick)}>
                  <ellipse cx="68" cy="44.5" rx="64" ry="26.5" fill="#D7DCE0"/>
                  <ellipse cx="68" cy="35.5" rx="64" ry="26.5" fill="#FFF1F1"/>
                  <path d="M57.3192 33V24.6H59.2632V31.416H63.4752V33H57.3192ZM67.5982 33.096C66.8622 33.096 66.2142 32.952 65.6542 32.664C65.1022 32.376 64.6742 31.984 64.3702 31.488C64.0662 30.984 63.9142 30.412 63.9142 29.772C63.9142 29.124 64.0622 28.552 64.3582 28.056C64.6622 27.552 65.0742 27.16 65.5942 26.88C66.1142 26.592 66.7022 26.448 67.3582 26.448C67.9902 26.448 68.5582 26.584 69.0622 26.856C69.5742 27.12 69.9782 27.504 70.2742 28.008C70.5702 28.504 70.7182 29.1 70.7182 29.796C70.7182 29.868 70.7142 29.952 70.7062 30.048C70.6982 30.136 70.6902 30.22 70.6822 30.3H65.4382V29.208H69.6982L68.9782 29.532C68.9782 29.196 68.9102 28.904 68.7742 28.656C68.6382 28.408 68.4502 28.216 68.2102 28.08C67.9702 27.936 67.6902 27.864 67.3702 27.864C67.0502 27.864 66.7662 27.936 66.5182 28.08C66.2782 28.216 66.0902 28.412 65.9542 28.668C65.8182 28.916 65.7502 29.212 65.7502 29.556V29.844C65.7502 30.196 65.8262 30.508 65.9782 30.78C66.1382 31.044 66.3582 31.248 66.6382 31.392C66.9262 31.528 67.2622 31.596 67.6462 31.596C67.9902 31.596 68.2902 31.544 68.5462 31.44C68.8102 31.336 69.0502 31.18 69.2662 30.972L70.2622 32.052C69.9662 32.388 69.5942 32.648 69.1462 32.832C68.6982 33.008 68.1822 33.096 67.5982 33.096ZM74.1365 33.096C73.5845 33.096 73.0525 33.032 72.5405 32.904C72.0365 32.768 71.6365 32.6 71.3405 32.4L71.9645 31.056C72.2605 31.24 72.6085 31.392 73.0085 31.512C73.4165 31.624 73.8165 31.68 74.2085 31.68C74.6405 31.68 74.9445 31.628 75.1205 31.524C75.3045 31.42 75.3965 31.276 75.3965 31.092C75.3965 30.94 75.3245 30.828 75.1805 30.756C75.0445 30.676 74.8605 30.616 74.6285 30.576C74.3965 30.536 74.1405 30.496 73.8605 30.456C73.5885 30.416 73.3125 30.364 73.0325 30.3C72.7525 30.228 72.4965 30.124 72.2645 29.988C72.0325 29.852 71.8445 29.668 71.7005 29.436C71.5645 29.204 71.4965 28.904 71.4965 28.536C71.4965 28.128 71.6125 27.768 71.8445 27.456C72.0845 27.144 72.4285 26.9 72.8765 26.724C73.3245 26.54 73.8605 26.448 74.4845 26.448C74.9245 26.448 75.3725 26.496 75.8285 26.592C76.2845 26.688 76.6645 26.828 76.9685 27.012L76.3445 28.344C76.0325 28.16 75.7165 28.036 75.3965 27.972C75.0845 27.9 74.7805 27.864 74.4845 27.864C74.0685 27.864 73.7645 27.92 73.5725 28.032C73.3805 28.144 73.2845 28.288 73.2845 28.464C73.2845 28.624 73.3525 28.744 73.4885 28.824C73.6325 28.904 73.8205 28.968 74.0525 29.016C74.2845 29.064 74.5365 29.108 74.8085 29.148C75.0885 29.18 75.3685 29.232 75.6485 29.304C75.9285 29.376 76.1805 29.48 76.4045 29.616C76.6365 29.744 76.8245 29.924 76.9685 30.156C77.1125 30.38 77.1845 30.676 77.1845 31.044C77.1845 31.444 77.0645 31.8 76.8245 32.112C76.5845 32.416 76.2365 32.656 75.7805 32.832C75.3325 33.008 74.7845 33.096 74.1365 33.096ZM80.5115 33.096C79.9595 33.096 79.4275 33.032 78.9155 32.904C78.4115 32.768 78.0115 32.6 77.7155 32.4L78.3395 31.056C78.6355 31.24 78.9835 31.392 79.3835 31.512C79.7915 31.624 80.1915 31.68 80.5835 31.68C81.0155 31.68 81.3195 31.628 81.4955 31.524C81.6795 31.42 81.7715 31.276 81.7715 31.092C81.7715 30.94 81.6995 30.828 81.5555 30.756C81.4195 30.676 81.2355 30.616 81.0035 30.576C80.7715 30.536 80.5155 30.496 80.2355 30.456C79.9635 30.416 79.6875 30.364 79.4075 30.3C79.1275 30.228 78.8715 30.124 78.6395 29.988C78.4075 29.852 78.2195 29.668 78.0755 29.436C77.9395 29.204 77.8715 28.904 77.8715 28.536C77.8715 28.128 77.9875 27.768 78.2195 27.456C78.4595 27.144 78.8035 26.9 79.2515 26.724C79.6995 26.54 80.2355 26.448 80.8595 26.448C81.2995 26.448 81.7475 26.496 82.2035 26.592C82.6595 26.688 83.0395 26.828 83.3435 27.012L82.7195 28.344C82.4075 28.16 82.0915 28.036 81.7715 27.972C81.4595 27.9 81.1555 27.864 80.8595 27.864C80.4435 27.864 80.1395 27.92 79.9475 28.032C79.7555 28.144 79.6595 28.288 79.6595 28.464C79.6595 28.624 79.7275 28.744 79.8635 28.824C80.0075 28.904 80.1955 28.968 80.4275 29.016C80.6595 29.064 80.9115 29.108 81.1835 29.148C81.4635 29.18 81.7435 29.232 82.0235 29.304C82.3035 29.376 82.5555 29.48 82.7795 29.616C83.0115 29.744 83.1995 29.924 83.3435 30.156C83.4875 30.38 83.5595 30.676 83.5595 31.044C83.5595 31.444 83.4395 31.8 83.1995 32.112C82.9595 32.416 82.6115 32.656 82.1555 32.832C81.7075 33.008 81.1595 33.096 80.5115 33.096ZM37.3328 48V39.6H38.9408L42.5168 45.528H41.6648L45.1808 39.6H46.7768L46.8008 48H44.9768L44.9648 42.396H45.3008L42.4928 47.112H41.6168L38.7488 42.396H39.1568V48H37.3328ZM51.7338 48.096C51.0458 48.096 50.4338 47.952 49.8978 47.664C49.3698 47.376 48.9498 46.984 48.6378 46.488C48.3338 45.984 48.1818 45.412 48.1818 44.772C48.1818 44.124 48.3338 43.552 48.6378 43.056C48.9498 42.552 49.3698 42.16 49.8978 41.88C50.4338 41.592 51.0458 41.448 51.7338 41.448C52.4138 41.448 53.0218 41.592 53.5578 41.88C54.0938 42.16 54.5138 42.548 54.8178 43.044C55.1218 43.54 55.2738 44.116 55.2738 44.772C55.2738 45.412 55.1218 45.984 54.8178 46.488C54.5138 46.984 54.0938 47.376 53.5578 47.664C53.0218 47.952 52.4138 48.096 51.7338 48.096ZM51.7338 46.56C52.0458 46.56 52.3258 46.488 52.5738 46.344C52.8218 46.2 53.0178 45.996 53.1618 45.732C53.3058 45.46 53.3778 45.14 53.3778 44.772C53.3778 44.396 53.3058 44.076 53.1618 43.812C53.0178 43.548 52.8218 43.344 52.5738 43.2C52.3258 43.056 52.0458 42.984 51.7338 42.984C51.4218 42.984 51.1418 43.056 50.8938 43.2C50.6458 43.344 50.4458 43.548 50.2938 43.812C50.1498 44.076 50.0778 44.396 50.0778 44.772C50.0778 45.14 50.1498 45.46 50.2938 45.732C50.4458 45.996 50.6458 46.2 50.8938 46.344C51.1418 46.488 51.4218 46.56 51.7338 46.56ZM59.1651 48.096C58.4051 48.096 57.8131 47.904 57.3891 47.52C56.9651 47.128 56.7531 46.548 56.7531 45.78V40.116H58.6251V45.756C58.6251 46.028 58.6971 46.24 58.8411 46.392C58.9851 46.536 59.1811 46.608 59.4291 46.608C59.7251 46.608 59.9771 46.528 60.1851 46.368L60.6891 47.688C60.4971 47.824 60.2651 47.928 59.9931 48C59.7291 48.064 59.4531 48.096 59.1651 48.096ZM55.7571 43.128V41.688H60.2331V43.128H55.7571ZM61.7399 48V41.544H63.6119V48H61.7399ZM62.6759 40.644C62.3319 40.644 62.0519 40.544 61.8359 40.344C61.6199 40.144 61.5119 39.896 61.5119 39.6C61.5119 39.304 61.6199 39.056 61.8359 38.856C62.0519 38.656 62.3319 38.556 62.6759 38.556C63.0199 38.556 63.2999 38.652 63.5159 38.844C63.7319 39.028 63.8399 39.268 63.8399 39.564C63.8399 39.876 63.7319 40.136 63.5159 40.344C63.3079 40.544 63.0279 40.644 62.6759 40.644ZM67.1013 48L64.3893 41.544H66.3213L68.5773 47.1H67.6173L69.9573 41.544H71.7573L69.0333 48H67.1013ZM76.2702 48V46.74L76.1502 46.464V44.208C76.1502 43.808 76.0262 43.496 75.7782 43.272C75.5382 43.048 75.1662 42.936 74.6622 42.936C74.3182 42.936 73.9782 42.992 73.6422 43.104C73.3142 43.208 73.0342 43.352 72.8022 43.536L72.1302 42.228C72.4822 41.98 72.9062 41.788 73.4022 41.652C73.8982 41.516 74.4022 41.448 74.9142 41.448C75.8982 41.448 76.6622 41.68 77.2062 42.144C77.7502 42.608 78.0222 43.332 78.0222 44.316V48H76.2702ZM74.3022 48.096C73.7982 48.096 73.3662 48.012 73.0062 47.844C72.6462 47.668 72.3702 47.432 72.1782 47.136C71.9862 46.84 71.8902 46.508 71.8902 46.14C71.8902 45.756 71.9822 45.42 72.1662 45.132C72.3582 44.844 72.6582 44.62 73.0662 44.46C73.4742 44.292 74.0062 44.208 74.6622 44.208H76.3782V45.3H74.8662C74.4262 45.3 74.1222 45.372 73.9542 45.516C73.7942 45.66 73.7142 45.84 73.7142 46.056C73.7142 46.296 73.8062 46.488 73.9902 46.632C74.1822 46.768 74.4422 46.836 74.7702 46.836C75.0822 46.836 75.3622 46.764 75.6102 46.62C75.8582 46.468 76.0382 46.248 76.1502 45.96L76.4382 46.824C76.3022 47.24 76.0542 47.556 75.6942 47.772C75.3342 47.988 74.8702 48.096 74.3022 48.096ZM82.3565 48.096C81.5965 48.096 81.0045 47.904 80.5805 47.52C80.1565 47.128 79.9445 46.548 79.9445 45.78V40.116H81.8165V45.756C81.8165 46.028 81.8885 46.24 82.0325 46.392C82.1765 46.536 82.3725 46.608 82.6205 46.608C82.9165 46.608 83.1685 46.528 83.3765 46.368L83.8805 47.688C83.6885 47.824 83.4565 47.928 83.1845 48C82.9205 48.064 82.6445 48.096 82.3565 48.096ZM78.9485 43.128V41.688H83.4245V43.128H78.9485ZM84.9313 48V41.544H86.8033V48H84.9313ZM85.8673 40.644C85.5233 40.644 85.2433 40.544 85.0273 40.344C84.8113 40.144 84.7033 39.896 84.7033 39.6C84.7033 39.304 84.8113 39.056 85.0273 38.856C85.2433 38.656 85.5233 38.556 85.8673 38.556C86.2113 38.556 86.4913 38.652 86.7073 38.844C86.9233 39.028 87.0313 39.268 87.0313 39.564C87.0313 39.876 86.9233 40.136 86.7073 40.344C86.4993 40.544 86.2193 40.644 85.8673 40.644ZM91.6127 48.096C90.9247 48.096 90.3127 47.952 89.7767 47.664C89.2487 47.376 88.8287 46.984 88.5167 46.488C88.2127 45.984 88.0607 45.412 88.0607 44.772C88.0607 44.124 88.2127 43.552 88.5167 43.056C88.8287 42.552 89.2487 42.16 89.7767 41.88C90.3127 41.592 90.9247 41.448 91.6127 41.448C92.2927 41.448 92.9007 41.592 93.4367 41.88C93.9727 42.16 94.3927 42.548 94.6967 43.044C95.0007 43.54 95.1527 44.116 95.1527 44.772C95.1527 45.412 95.0007 45.984 94.6967 46.488C94.3927 46.984 93.9727 47.376 93.4367 47.664C92.9007 47.952 92.2927 48.096 91.6127 48.096ZM91.6127 46.56C91.9247 46.56 92.2047 46.488 92.4527 46.344C92.7007 46.2 92.8967 45.996 93.0407 45.732C93.1847 45.46 93.2567 45.14 93.2567 44.772C93.2567 44.396 93.1847 44.076 93.0407 43.812C92.8967 43.548 92.7007 43.344 92.4527 43.2C92.2047 43.056 91.9247 42.984 91.6127 42.984C91.3007 42.984 91.0207 43.056 90.7727 43.2C90.5247 43.344 90.3247 43.548 90.1727 43.812C90.0287 44.076 89.9567 44.396 89.9567 44.772C89.9567 45.14 90.0287 45.46 90.1727 45.732C90.3247 45.996 90.5247 46.2 90.7727 46.344C91.0207 46.488 91.3007 46.56 91.6127 46.56ZM100.328 41.448C100.84 41.448 101.296 41.552 101.696 41.76C102.104 41.96 102.424 42.272 102.656 42.696C102.888 43.112 103.004 43.648 103.004 44.304V48H101.132V44.592C101.132 44.072 101.016 43.688 100.784 43.44C100.56 43.192 100.24 43.068 99.824 43.068C99.528 43.068 99.26 43.132 99.02 43.26C98.788 43.38 98.604 43.568 98.468 43.824C98.34 44.08 98.276 44.408 98.276 44.808V48H96.404V41.544H98.192V43.332L97.856 42.792C98.088 42.36 98.42 42.028 98.852 41.796C99.284 41.564 99.776 41.448 100.328 41.448Z" fill="#990838"/>
                  <path d="M12.6667 28.9134C13.7557 29.1934 14.8757 29.3345 16.0001 29.3334C23.3641 29.3334 29.3334 23.3641 29.3334 16.0001C29.3334 8.63608 23.3641 2.66675 16.0001 2.66675C8.63608 2.66675 2.66675 8.63608 2.66675 16.0001C2.66675 16.4507 2.68897 16.8952 2.73341 17.3334" stroke="#990838" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10.6789 11.2561H10.6669M21.3335 11.2561H21.3215M20.0002 21.3334C18.8471 20.4662 17.443 19.9982 16.0002 20.0001C14.7869 20.0001 13.6469 20.3254 12.6669 20.8934M6.69487 18.6668L3.81487 21.4441C3.4496 21.7986 3.15969 22.2232 2.96253 22.6925C2.76538 23.1618 2.66504 23.6661 2.66753 24.1751C2.67002 24.6841 2.77529 25.1874 2.97703 25.6547C3.17876 26.1221 3.47281 26.5438 3.84154 26.8948C5.41487 28.3854 7.9482 28.3601 9.49487 26.8681C9.86441 26.5169 10.1587 26.0941 10.3597 25.6256C10.5608 25.1571 10.6645 24.6526 10.6645 24.1428C10.6645 23.6329 10.5608 23.1284 10.3597 22.6599C10.1587 22.1914 9.86441 21.7687 9.49487 21.4174L6.69487 18.6668Z" stroke="#990838" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
    
              </div>
            ) : (
              <div className="selected-button-container">
                {selectedButton.name !== "other" && (
                  <img
                    src={selectedButton.image}
                    alt={selectedButton.name}
                    className="selected-button"
                  />
                )}
                <div className="its-ok-text">
                  {selectedButton.name === "other" ? (
                    <div className="other-reason-container">
                      <input
                        type="text"
                        value={otherReason}
                        onChange={handleOtherReasonChange}
                        placeholder="Please specify your reason..."
                        className="other-reason-input"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <>
                      That's OK!
                      <br />
                      Let us try again tomorrow!
                    </>
                  )}
                </div>
                <button
                  className="doneBtn pulse-button"
                  onClick={doneBtnClick}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Done"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LeftSwipe;
