// src/components/SupportFaq.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react"; 
import "../css/SupportFaq.css";
import logo from "../assets/GritFit_Full.png";
import faq  from "../assets/headphone.png";
import { ChevronUp, ChevronDown } from "lucide-react";
import TabBar from "./TabBar";

export default function SupportFaq() {
  const navigate = useNavigate();
  const handleBackProfile = () => {
    navigate("/UserProfile");
  };


  const faqs = [
    {
      question: "What is GritFit?",
      answer: "GritFit is a structured program for building healthy habits one step at a time."
    },
    {
      question: "How does GritFit work?",
      answer: "Each day you get a small, doable fitness or nutrition task. Complete them consistently to progress through phases."
    },
    {
      question: "Do I need to track calories?",
      answer: "Not necessarily—GritFit focuses on simple tasks. However, you can optionally track using the Calorie Calculator."
    },
    {
      question: "What happens if I miss a day?",
      answer: "No worries! Just pick up where you left off. GritFit is flexible and encourages steady progress."
    },
    {
      question: "Do I need to follow a specific diet?",
      answer: "Nope! GritFit is diet-agnostic. We just help you build consistent eating habits that fit your lifestyle."
    },
    {
      question: "Is GritFit free to use?",
      answer: "Yes. Our basic features are free. Some advanced features may require a subscription later."
    },
  ];


  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFaq = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // 3) Return to user profile or previous page
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
    <header className="gritphase-header">
            <ChevronLeft className="backIcon" onClick={handleBackProfile} />
                    <img src={logo} alt="Logo" className="logo-gritPhases-header" style={{marginLeft: "-12rem"}} onClick={handleBackProfile} />
                    <div className="phase-row">
                    </div>
            </header>
    <div className="supportFaq-container">
        <div className="report_header">
            <div className="report_header-text"><img src={faq} />FAQs</div>
        </div>
      <div className="faq-list">
        {faqs.map((item, index) => {
          const isOpen = expandedIndex === index;
          return (
            <div
              key={index}
              className={`faq-item ${isOpen ? "open" : ""}`}
              onClick={() => toggleFaq(index)}
            >
              {/* Question row */}
              <div className="faq-question">
                <span>{item.question}</span>
                <span className="faq-icon">{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
              </div>
              {/* Answer if open */}
              {isOpen && (
                <div className="faq-answer">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    <TabBar />
    </>
  );
}
