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
      answer: "GritFit is a habit-building fitness app designed to help you stay consistent with your nutrition and training through small daily tasks."
    },
    {
      question: "How does GritFit work?",
      answer: "Every day, you get a simple task related to nutrition or fitness. Complete it and swipe right; if you miss it, swipe left. Over time, this builds discipline and long-term habits."
    },
    {
      question: "Do I need to track calories?",
      answer: "We recommend tracking calories, but not from day one. GritFit eases you into it without overwhelming you."
    },
    {
      question: "What happens if I miss a day?",
      answer: "No worries! GritFit is designed to help you bounce back. You’ll still get daily tasks, and missing one won’t ruin your progress."
    },
    {
      question: "Do I need to follow a specific diet?",
      answer: "Nope! GritFit works with flexible dieting (IIFYM), meaning you can eat foods that fit your macros while still making progress."
    },
    {
      question: "Is GritFit free to use?",
      answer: "Our beta version is free! Future premium features may be introduced, but core habit-building features will remain accessible."
    },
    {
      question: "How do I contact support?",
      answer: "Reach us through mail: support@gritfit.site."
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
