import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Info } from "lucide-react";
import NavBar from "./navBar";
import logo from "../assets/Logo.png";
import buttonImage from "../assets/Stepping_StoneBtn.png";
import "./GritPhases.css";
import arrowleft from "../assets/SlidingArrowLeft.png";
import arrowright from "../assets/SlidingArrowRight.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";

const GritPhase = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1);
  const scrollableRef = useRef(null);
  const navigate = useNavigate();
  const { authToken } = useAuth();

  const handleNavClose = () => {
    setIsNavOpen(false);
  };

  const handleNavOpen = () => {
    setIsNavOpen(true);
  };

  // Phase data structure
  const phases = [
    {
      number: 1,
      title: "Phase 1",
      description: "Have a 10 hour fasting window, for example: 10pm-8am",
    },
    {
      number: 2,
      title: "Phase 2",
      description: "Have a 12 hour fasting window, for example: 9pm-9am",
    },
    {
      number: 3,
      title: "Phase 3",
      description: "Have a 14 hour fasting window, for example: 8pm-10am",
    },
  ];

  const handleRightArrowClick = async (phaseNumber, dayNumber, e) => {
    e.preventDefault();
    console.log("Navigating to RightSwipe with:", { phaseNumber, dayNumber });

    navigate("/rightSwipe", {
      state: {
        phaseNumber,
        dayNumber,
      },
    });
  };

  const renderLeftPage = (e, phaseNumber, dayNumber) => {
    e.preventDefault();
    navigate("/leftSwipe", {
      state: {
        phaseId: phaseNumber,
        taskId: dayNumber,
      },
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollableRef.current) return;

      const sections = scrollableRef.current.getElementsByClassName("section");
      const scrollPosition = scrollableRef.current.scrollTop;
      const windowHeight = window.innerHeight;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionTop = section.offsetTop;

        if (scrollPosition >= sectionTop - windowHeight / 3) {
          setCurrentPhase(i + 1);
        }
      }
    };

    const scrollableElement = scrollableRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", handleScroll);
      return () =>
        scrollableElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const renderDayButtons = (phaseNumber) => (
    <div className="task-buttons">
      {[1, 2, 3].map((dayNumber) => (
        <div key={dayNumber} className="task-button-container">
          <img
            src={arrowleft}
            className="arrow arrow-left"
            onClick={(e) => renderLeftPage(e, phaseNumber, dayNumber)}
            alt="arrow left"
          />

          <button className="task-button">
            <img
              src={buttonImage}
              className="button-image"
              alt={`Task ${dayNumber}`}
            />
            <div className="day-label">Day {dayNumber}</div>
          </button>
          <img
            src={arrowright}
            className="arrow arrow-right"
            onClick={(e) => handleRightArrowClick(phaseNumber, dayNumber, e)}
            alt="arrow right"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="grit-phase-container">
      <NavBar isOpen={isNavOpen} onClose={handleNavClose} />

      <div className={`main-content ${isNavOpen ? "nav-open" : ""}`}>
        <header className="header">
          <div className="logo-container">
            <img
              src={logo}
              alt="Logo"
              onClick={!isNavOpen ? handleNavOpen : undefined}
              className="logo-gritPhases"
            />
            <ChevronDown
              className={`chevron ${isNavOpen ? "rotated" : ""}`}
              size={24}
            />
          </div>

          <button className="profile-button">
            <Info size={24} />
          </button>
        </header>

        <div className="fasting-header">Intermittent Fasting</div>

        {/* <div className="scrollable-content" ref={scrollableRef}>
          <div className="grit-phase-title">
            {phases[currentPhase - 1].title}
            <p className="grit-phase-desc">
              {phases[currentPhase - 1].description}
            </p>
          </div>
          {phases.map((phase) => (
            <section
              key={phase.number}
              className={`section section-${phase.number}`}
              style={{ minHeight: "calc(100vh - 70px)" }}
            >
              {renderDayButtons(phase.number)}
            </section>
          ))}
        </div> */}
        <div className="scrollable-content" ref={scrollableRef}>
          {phases.map((phase) => (
            <section
              key={phase.number}
              className={`section section-${phase.number}`}
              style={{ minHeight: "calc(100vh - 70px)" }}
            >
              <div className="grit-phase-title">
                {phase.title}
                <p className="grit-phase-desc">{phase.description}</p>
              </div>
              {renderDayButtons(phase.number)}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GritPhase;
