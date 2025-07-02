import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { ChevronLeft, Lightbulb } from "lucide-react";
import logo from "../assets/GritFit_Full.png";
import "../css/IntroVideo.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/FeedbackWizard.css";
import FeedbackPrompt from "./FeedbackPrompt"; 

export default function FeedbackWizardPage() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [showPrompt, setShowPrompt] = useState(false);

  // Go back handler
  const handleBack = () => navigate(-1);

  // BUTTON STYLE
  const tealBtn = {
    background: "#00d0e6",
    border: "none",
    color: "#fff",
    fontWeight: 600,
    padding: "10px 20px",
    borderRadius: 6,
    cursor: "pointer",
  };

  const test = {
    background: "#00d0e6",
    border: "none",
    color: "#fff",
    fontWeight: 600,
    padding: "10px 20px",
    borderRadius: 6,
    cursor: "pointer",
    margin: "32px 0 0 0",
  };

  // STRATEGY SLIDE
  const StrategySlide = () => {
    const [showInfo, setShowInfo] = useState(false);
    return (
      <div className="fw-slide-content">
        <p>
          We really appreciate your participation and want to invite you to our
          <strong> Strategy Squad</strong>. Interested?
        </p>
        <div className="fw-btn-row">
          <button
            style={tealBtn}
            onClick={() => {
              window.open(
                "https://chat.whatsapp.com/JpNQpoYaKTkEdRajrY6Cxj",
                "_blank"
              );
              sliderRef.current.slickNext();
            }}
          >
            Join GritFit Community!
          </button>
          <Lightbulb
            size={24}
            style={{ marginLeft: 10, cursor: "pointer" }}
            onClick={() => setShowInfo((p) => !p)}
            color="#4facfe"
          />
        </div>
        {showInfo && (
          <div className="strategy-info-bubble">
            Strategy Squad is a small, invite-only WhatsApp group where you help
            shape GritFit’s future. No commitment — just honest feedback!
          </div>
        )}
      </div>
    );
  };

  // SLIDES DATA
  const slides = [
    {
      id: 1,
      content: (
        <div className="fw-slide-content">
          <p>
            If you got value using <strong>GritFit</strong>, please leave us a
            tiny testimonial. It encourages us to keep building & improving the
            app.
          </p>
          <div className="fw-btn-row">
            <button
              style={tealBtn}
              onClick={() => {
                // open our in-app prompt instead of external link
                setShowPrompt(true);
              }}
              disabled={showPrompt}
            >
              Write Here!
            </button>
          </div>
        </div>
      ),
    },
    { id: 2, content: <StrategySlide /> },
    {
      id: 3,
      content: (
        <div className="fw-slide-content">
          <p>
            We’d love to connect with you to learn about your experience – pick
            any slot that works:
          </p>
          <button
            style={test}
            onClick={() =>
              window.open("https://calendly.com/gritfit/brief-call", "_blank")
            }
          >
            20-min call with the Founder
          </button>
        </div>
      ),
    },
  ];

  // SLIDER SETTINGS
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
  };

  // CURRENT SLIDE
  const current = sliderRef.current?.innerSlider?.state.currentSlide ?? 0;

  return (
    <>
    <div className="fw-page">
      {/* HEADER */}
      <div className="fw-header">
      <ChevronLeft className="intro-back-button" onClick={handleBack} size={40}/>
      <img src={logo} alt="GritFit Logo" className="intro-logo" />
      </div>

      {/* CARD */}
      <div className="fw-card">
        <Slider ref={sliderRef} {...sliderSettings}>
          {slides.map((s) => (
            <div key={s.id} className="fw-slide">
              {s.content}
            </div>
          ))}
        </Slider>

      </div>
    </div>

      {showPrompt && (
        <FeedbackPrompt
          feature="APP_ONBOARDING"               // or whatever feature code you want
          question="What did you like most about GritFit?"
          placeholder="Let us know…"
          onSubmitted={() => {
            // after they submit, move to next slide
            sliderRef.current.slickNext();
          }}
          onClose={() => {
            setShowPrompt(false);
          }}
        />
      )}
      </>

  );
}
