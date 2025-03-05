import React, { useEffect, useState } from 'react';
import logo from "../assets/GritFit_Full.png";
import axios from "../axios";
import "../css/Landing.css";
import samay from "../assets/samay.jpg";
import jay from "../assets/jay.jpg";
import shayan from "../assets/shayan.jpg";
import bhargav from "../assets/bhargav.jpg";
import Slider from 'react-slick';               
import 'slick-carousel/slick/slick.css';        
import 'slick-carousel/slick/slick-theme.css';
import link from '../assets/linkedin.png'; 

const API_URL =  "https://api.gritfit.site/api";

function Landing() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(
      'section:not(.hero), .card, .feature-card, .testimonial-card , .founder-card'
    );
    elements.forEach((el) => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

   
    return () => observer.disconnect();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(`${API_URL}/betaSignup`, formData);  
        alert(response.data.message);
        setFormData({ name: '', email: '', message: '' });
        window.open("https://forms.gle/tdjn5EedwoZRNWGg9", "_blank");
    } catch (error) {
        console.error("Error submitting beta signup form:", error);
        alert(error.response?.data?.message || "Failed to submit form.");
    }
};

  // Slick slider settings
  const sliderSettings = {
    dots: true,            
    infinite: false,       
    speed: 500,            
    slidesToShow: 1,      
    slidesToScroll: 1, 
    centerMode: true,      
    centerPadding: "0",    
  };


  return (
    <>
      <header classname="landing">
       <a href="#home">
        <img src={logo} alt="GritFit Logo" />
       </a> 
        <nav>
          <a href="#about">About</a>
          <a href="#founders">Team</a>
          <a href="#contact">Join Beta</a>
        </nav>
      </header>

      <section className="dark-section" id="home">
        <h1 className="landingh1 animate-fadeInUp">Grit Today,<br />Fit Tomorrow</h1>
        <p className="animate-fadeInUp delay-1">
        GritFit helps you seamlessly build nutrition habits that support your training. Start simple, build consistency, and gradually level up to tracking calories—without feeling overwhelmed.
        </p>
        <div className = "user">
        <a href="/login"  className="btn animate-fadeInUp delay-2">Sign In</a>
        <a href="/signup" className="btn animate-fadeInUp delay-2">Create Account</a>
        </div>
      </section>

      <section id = "about" className="dark-section">
        <h2 className='landingh2'>About GritFit</h2>
        <Slider {...sliderSettings}>
          <div>
          <div className="feature-card">
            <h4>What is GritFit?</h4>
            <ul style={{ listStyleType: 'disc', paddingLeft: '0.5rem' }}>
              <li>A nutrition habit-building app designed for people training for hypertrophy.</li>
              <li>Helps you stay accountable and build solid nutrition habits without feeling overwhelmed.</li>
              <li>Uses an intuitive swipe-based interaction for daily habit tracking.</li>
            </ul>
          </div>
          </div>

          <div>
          <div className="feature-card">
            <h4>Why GritFit?</h4>
            <ul style={{ listStyleType: 'disc', paddingLeft: '0.5rem' }}>
              <li>Nutrition consistency is the hardest part of muscle growth.</li>
              <li>Most apps focus on calorie tracking & meal plans—GritFit focuses on <strong>building habits first</strong>.</li>
              <li>No information overload, just one simple habit a day to focus on.</li>
            </ul>
          </div>
          </div>

          <div>
          <div className="feature-card">
            <h4>How It Works?</h4>
            <ul style={{ listStyleType: 'disc', paddingLeft: '0.5rem' }}>
              <li>Each day, you get a <strong>GritPhase Task</strong> to complete.</li>
              <li>Swipe right ✅ if completed, swipe left ❌ if not.</li>
              <li>Track progress through a <strong>consistency calendar & insights</strong>.</li>
            </ul>
          </div>
          </div>

          <div>
          <div className="feature-card">
            <h4>Who is it for?</h4>
            <ul style={{ listStyleType: 'disc', paddingLeft: '0.5rem' }}>
              <li>Beginners starting their hypertrophy journey.</li>
              <li>Lifters who struggle with <strong>sticking to nutrition habits</strong>.</li>
              <li>Anyone who wants <strong>structure & accountability</strong> without micromanaging every calorie.</li>
            </ul>
          </div>
          </div>

          <div>
          <div className="feature-card">
            <h4>Why It’s Different?</h4>
            <ul style={{ listStyleType: 'disc', paddingLeft: '0.5rem' }}>
              <li>Habit-first approach, not just numbers.</li>
              <li>GritFit guides you through setbacks, not just successes.</li>
              <li>No rigid meal plans—<strong>you build your own routine</strong>.</li>
              <li>Access top macronutrients from leading U.S. grocery outlets.</li>
              <li>Fun, engaging, and frictionless design.</li>
            </ul>
          </div>
          </div>
        
        </Slider>
        
      </section>

      <section className="dark-section">
        <h2 className='landingh2'>Value Statements</h2>
        <Slider {...sliderSettings}>
        <div>
          <div className="feature-card">
            <h4>MISSION 🎯</h4>
            <p>
            To enable people to understand their nutritional needs and empower them with the necessary tools to maintain discipline while they enjoy their journey to a healthier lifestyle. Guided by our core belief that a positive impact should be the pinnacle of our efforts, we aim to become the product of choice when intrinsic motivation is not.
            </p>
          </div>
        </div>  

        <div>
          <div className="feature-card">
          <h4>VISION 🔭</h4>
            <p>
            We envision a future where maintaining a disciplined routine no longer feels burdensome but becomes a natural and enjoyable process. We desire to make GritFit a daily companion for individuals who lack the motivation to follow a disciplined lifestyle. Our future success will be defined impact, resourcefulness, being inspiring, and maintaining a fun environment.
            </p>
          </div>
        </div>  

        <div>
          <div className="feature-card">
          <h4>PURPOSE 💡</h4>
            <p>
            To instill and promote a disciplined lifestyle through our product. We aspire to bring about a tangible difference in the lives of individuals by aiding them in their path to a sustainable and disciplined life. We believe that having an honest, disciplined, and passion-driven approach can gather amazing energy to get tasks accomplished, making us your reliable fitness partner.
            </p> 
          </div>
        </div>  
        
        </Slider>
      </section>

      <section id="founders" className="dark-section">
        <h2 className="landingh2 animate-fadeInUp">Meet The Team</h2>
        <p className="animate-fadeInUp delay-1">
          Our founders are dedicated individuals striving to make health and fitness exciting for everyone.
        </p>
        <Slider {...sliderSettings}>
          <div>
          <div className="feature-card animate-fadeInUp delay-2">
            <img
              src={jay}
              alt="Jay Shah"
              className="founder-image"
            />
            <p style={{ display: "flex", justifyContent: "center", alignItems: "baseline" }}>
            <h3>Jay Shah</h3>
            <a
                href="https://www.linkedin.com/in/jayshah2000/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: "8px" }}
              >
                <img
                  src={link}
                  alt="LinkedIn"
                  style={{ width: "24px", height: "24px", verticalAlign: "middle" }}
                />
              </a>
            </p>
            <h5>Founder</h5>
            <p>
              Jay is dedicated to making nutrition plan knowledge simple and accessible.
              Inspired by his own journey to maintain a balanced diet, Jay created GritFit
              to help others achieve their fitness goals.
            </p>
           
          </div>
          </div>

          <div className="feature-card animate-fadeInUp delay-3">
            <img
              src={samay}
              alt="Samay Jain"
              className="founder-image"
            />
            <p style={{ display: "flex", justifyContent: "center", alignItems: "baseline" }}>
            <h3>Samay Jain</h3>
            <a
                href="https://www.linkedin.com/in/samay-jain-b19583233/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: "8px" }}
              >
                <img
                  src={link}
                  alt="LinkedIn"
                  style={{ width: "24px", height: "24px", verticalAlign: "middle" }}
                />
              </a>
            </p>
            <h5>Technical Dumbbell</h5>
            <p>Samay, a key contributor and technical wizard at GritFit, ensures the platform is robust, user-friendly, and always evolving. Driven by a passion for tech innovation and fitness, he helps deliver a seamless experience that supports everyone’s goals.
            </p>
          </div>

          {/* Founder 2 */}
          <div className="feature-card animate-fadeInUp delay-3">
            <img
              src={shayan}
              alt="Shayan Shah"
              className="founder-image"
            />
            <p style={{ display: "flex", justifyContent: "center", alignItems: "baseline" }}>
            <h3>Shayan Shah</h3>
            <a
                href="https://www.linkedin.com/in/shayanshah/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: "8px" }}
              >
                <img
                  src={link}
                  alt="LinkedIn"
                  style={{ width: "24px", height: "24px", verticalAlign: "middle" }}
                />
              </a>
            </p>
            <h5>Research & Insights Consultant</h5>
            <p>
            Fitness is not just a goal, it's a lifestyle. Shayan wants to help people realize that eating healthy doesn't have to be tedious. With GritFit, we aim to revolutionize the way people approach their diet, making it both exciting and effortless
            </p>
          </div>
          
          <div className="feature-card animate-fadeInUp delay-3">
            <img
              src={bhargav}
              alt="Bhargav Patel"
              className="founder-image"
            />
            <p style={{ display: "flex", justifyContent: "center", alignItems: "baseline" }}>
            <h3>Bhargav Patel</h3>
            <a
                href="https://www.linkedin.com/company/gritfitv1/about/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: "8px" }}
              >
                <img
                  src={link}
                  alt="LinkedIn"
                  style={{ width: "24px", height: "24px", verticalAlign: "middle" }}
                />
              </a>
            </p>
            
            <h5>Technical Consultant</h5>
            <p>
            Bhargav is passionate about using technology to enhance fitness and health. Drawing from his own experiences, he has played a key role in developing an app that makes habit-building and wellness accessible, helping users stay consistent and achieve their fitness goals.
            </p>
          </div>
          </Slider>
      </section>


      <section id="contact" className="dark-section">
        <h3>Want to be a GritFit Beta Tester?</h3>
        <p>
        Ever had an expert nutrition plan and consistency guaranteed for FREE? Just put in your contact details and we'll provide you the product to test soon!
        </p>

        <form className="beta-form" onSubmit={handleFormSubmit}>
          <input
                type="text"
                name="name"
                placeholder="Your Name 💼"
                value={formData.name}
                onChange={handleChange}
                style={{ color: '#000' }} 
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Your Email 📧"
                value={formData.email}
                onChange={handleChange}
                style={{ color: '#000' }} 
                required
            />
            <textarea
                name="message"
                placeholder="Tell us what makes you a great beta tester! 🚀 (optional)"
                value={formData.message}
                onChange={handleChange}
                style={{ color: '#000' }} 
            />
          <button type="submit" className="apply-button emoji-button">
            🔥 Apply as Beta Tester
          </button>
        </form>
      </section>

      <footer>
  <p>2025 GritFit<br></br> Swipe. Commit. Transform</p>

  
  <p>
    Need help? Email us at{" "}
    <a href="mailto:support@gritfit.com" style={{ color: "#fff", textDecoration: "underline" }}>
      support@gritfit.com
    </a>
  </p>

  
  <p style={{ display: "flex", justifyContent: "center" }}>
    Connect with us:
    
    <a
      href="https://www.linkedin.com/company/gritfitv1/about/"
      target="_blank"
      rel="noopener noreferrer"
      style={{ marginLeft: "8px" }}
    >
      <img
        src={link}
        alt="LinkedIn"
        style={{ width: "24px", height: "24px", verticalAlign: "middle" }}
      />
    </a>
  </p>
</footer>
    
    </>
  );
}

export default Landing;
