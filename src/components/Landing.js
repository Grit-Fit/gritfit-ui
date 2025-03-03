import React, { useEffect, useState } from 'react';
import logo from "../assets/GritFit_Full.png";

const API_URL =  "https://api.gritfit.site/api";

function Landing() {
  // This effect replicates the original IntersectionObserver behavior.
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

    // Select all sections except the hero plus all cards and observe them
    const elements = document.querySelectorAll(
      'section:not(.hero), .card, .feature-card, .testimonial-card'
    );
    elements.forEach((el) => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    // Optional cleanup if needed
    return () => observer.disconnect();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Function to update formData as user types
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/betaSignup`, {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);  // Success message from server
        setFormData({ name: '', email: '', message: '' });  // Clear the form after submission
      } else {
        alert("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      {/* Inline style block for demonstration; you can place this in a .css file */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary: #00B5FF;
              --secondary: #00E1A0;
              --accent: #FF5C87;
              --dark: #121820;
              --light: #ffffff;
              --text-dark: #222;
              --gradient: linear-gradient(135deg, #00B5FF, #00E1A0);
              --background-light: linear-gradient(to bottom right, #e0f1ff, #c1f0e6);
              --card-hover: rgba(0, 181, 255, 0.1);
            }

            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Outfit', sans-serif;
              background: var(--background-light);
              color: var(--text-dark);
              scroll-behavior: smooth;
              overflow-x: hidden;
            }

            header {
              background: var(--gradient);
              color: var(--light);
              padding-top: 10px;
              padding-bottom: 10px;
              padding-left: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              position: sticky;
              top: 0;
              z-index: 1000;
              box-shadow: 0 4px 12px rgba(0, 181, 255, 0.2);
            }

            header img {
              height: 48px;
              padding-right: 8px;
            }

            nav {
              display: flex;
              gap: 0px;
              padding-left: 20px;
              align-items: center;
            }

            nav a {
              color: var(--light);
              text-decoration: none;
              font-weight: 600;
              padding: 6px 12px;
              transition: background 0.3s ease, transform 0.2s ease;
              border-radius: 20px;
            }

            nav a:hover {
              background: rgba(255, 255, 255, 0.15);
              transform: translateY(-2px);
            }

            section {
              padding: 100px 20px;
              text-align: center;
              position: relative;
            }

            h1, h2 {
              font-weight: 800;
              margin-bottom: 20px;
              line-height: 1.2;
            }

            p {
              max-width: 700px;
              margin: 0 auto 30px;
              font-size: 1.1em;
              line-height: 1.6;
            }

            button {
              background: var(--gradient);
              color: var(--light);
              padding: 16px 32px;
              border: none;
              border-radius: 30px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(0, 181, 255, 0.3);
              position: relative;
              overflow: hidden;
              z-index: 1;
            }

            button::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #00E1A0, #00B5FF);
              z-index: -1;
              opacity: 0;
              transition: opacity 0.3s ease;
            }

            button:hover {
              transform: translateY(-5px);
              box-shadow: 0 8px 25px rgba(0, 181, 255, 0.4);
            }

            button:hover::after {
              opacity: 1;
            }

            .user{
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .btn {
              background: var(--gradient);
              color: var(--light);
              padding: 16px 32px;
              border: none;
              border-radius: 30px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(0, 181, 255, 0.3);
              width: 100%;
              height: 100%;

              /* Make <a> behave like a block-level button */
              display: inline-block;
              text-decoration: none; /* Remove underline for links */

              position: relative;
              overflow: hidden;
              z-index: 1;
            }

            /* Hover effect */
            .btn:hover {
              transform: translateY(-5px);
              box-shadow: 0 8px 25px rgba(0, 181, 255, 0.4);
            }

            /* The gradient overlay effect */
            .btn::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #00E1A0, #00B5FF);
              z-index: -1;
              opacity: 0;
              transition: opacity 0.3s ease;
            }

            .btn:hover::after {
              opacity: 1;
            }


            .hero {
              background: var(--background-light);
              color: var(--dark);
              position: relative;
              overflow: hidden;
              padding: 160px 20px 140px;
            }

            .hero::before {
              content: '';
              position: absolute;
              top: -10%;
              right: -10%;
              width: 60%;
              height: 70%;
              background: radial-gradient(circle, rgba(0, 225, 160, 0.15) 0%, rgba(0, 181, 255, 0.05) 70%);
              border-radius: 50%;
            }

            .hero::after {
              content: '';
              position: absolute;
              bottom: -10%;
              left: -10%;
              width: 60%;
              height: 70%;
              background: radial-gradient(circle, rgba(0, 181, 255, 0.15) 0%, rgba(0, 225, 160, 0.05) 70%);
              border-radius: 50%;
            }

            .hero h1 {
              font-size: 4em;
              background: var(--gradient);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              margin-bottom: 30px;
              filter: drop-shadow(0 2px 2px rgba(0, 181, 255, 0.3));
            }

            .emoji {
              font-size: 1.5em;
              vertical-align: middle;
              margin-right: 10px;
            }

            .card-container {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 20px;
              margin-top: 40px;
            }

            .card {
              background: var(--light);
              padding: 30px 25px;
              border-radius: 16px;
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
              margin: 15px;
              transition: all 0.3s ease;
              text-align: left;
              width: 100%;
              max-width: 300px;
              position: relative;
              overflow: hidden;
              border: 1px solid rgba(0, 181, 255, 0.1);
            }

            .card:hover {
              transform: translateY(-8px) scale(1.02);
              box-shadow: 0 12px 40px rgba(0, 181, 255, 0.12);
              background: linear-gradient(to bottom right, white, rgba(224, 241, 255, 0.5));
            }

            .card-icon {
              font-size: 2em;
              margin-bottom: 20px;
              display: inline-block;
              background: var(--gradient);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }

            .card h3 {
              font-weight: 700;
              margin-bottom: 15px;
              font-size: 1.3em;
            }

            .card p {
              font-size: 1em;
              opacity: 0.9;
              margin-bottom: 0;
            }

            .dark-section {
              background: var(--dark);
              color: var(--light);
              padding: 100px 20px;
              position: relative;
              overflow: hidden;
            }

            .dark-section::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: radial-gradient(circle at 70% 30%, rgba(0, 181, 255, 0.2) 0%, transparent 60%);
            }

            .dark-section h2 {
              background: var(--gradient);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              display: inline-block;
              margin-bottom: 40px;
              font-size: 2.5em;
            }

            .feature-card {
              background: rgba(255, 255, 255, 0.05);
              padding: 25px;
              border-radius: 16px;
              border: 1px solid rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(5px);
              transition: all 0.3s ease;
              text-align: left;
              width: 100%;
              max-width: 320px;
            }

            .feature-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 30px rgba(0, 181, 255, 0.1);
              background: rgba(255, 255, 255, 0.08);
            }

            .testimonial-section {
              background: linear-gradient(to bottom, rgba(224, 241, 255, 0.8), rgba(193, 240, 230, 0.8));
              padding: 100px 20px;
            }

            .testimonial-section h2 {
              font-size: 2.5em;
              margin-bottom: 40px;
              color: var(--dark);
            }

            .testimonial-card {
              background: var(--light);
              padding: 30px;
              border-radius: 16px;
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
              width: 100%;
              max-width: 350px;
              position: relative;
              text-align: left;
            }

            .testimonial-card::before {
              content: '"';
              position: absolute;
              top: 20px;
              left: 20px;
              font-size: 5em;
              opacity: 0.1;
              font-family: Georgia, serif;
              line-height: 0;
            }

            .testimonial-text {
              font-size: 1.1em;
              line-height: 1.6;
              margin-bottom: 20px;
              position: relative;
              z-index: 1;
            }

            .testimonial-author {
              display: flex;
              align-items: center;
              border-top: 1px solid rgba(0, 0, 0, 0.1);
              padding-top: 15px;
            }

            .author-avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: var(--gradient);
              margin-right: 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
            }

            .author-info h4 {
              margin: 0;
              font-weight: 600;
            }

            .author-info p {
              margin: 0;
              font-size: 0.9em;
              opacity: 0.7;
            }

            .beta-section {
              background: linear-gradient(to right, #e0f1ff, #c1f0e6);
              padding: 80px 20px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }

            .beta-section::before {
              content: '';
              position: absolute;
              top: -100px;
              right: -100px;
              width: 300px;
              height: 300px;
              background: radial-gradient(circle, rgba(0, 225, 160, 0.2) 0%, transparent 70%);
              border-radius: 50%;
            }

            .beta-section h2 {
              font-size: 2.2em;
              margin-bottom: 20px;
              color: var(--dark);
            }

            .beta-form {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 15px;
              width: 100%;
              max-width: 500px;
              margin: 30px auto 0;
              position: relative;
              z-index: 2;
            }

            .beta-form input,
            .beta-form textarea {
              width: 100%;
              padding: 18px 20px;
              border: none;
              border-radius: 12px;
              font-size: 1em;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
              font-family: 'Outfit', sans-serif;
              transition: all 0.3s ease;
            }

            .beta-form input:focus,
            .beta-form textarea:focus {
              outline: none;
              box-shadow: 0 6px 25px rgba(0, 181, 255, 0.15);
              transform: translateY(-2px);
            }

            .beta-form textarea {
              min-height: 120px;
              resize: none;
            }

            .apply-button {
              background: var(--gradient);
              width: 100%;
              padding: 18px;
              border-radius: 12px;
              font-weight: 700;
              font-size: 1.1em;
              margin-top: 10px;
            }

            .apply-button:hover {
              transform: translateY(-5px);
            }

            .emoji-button {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            }

            footer {
              background: var(--dark);
              color: var(--light);
              padding: 40px 20px;
              text-align: center;
              position: relative;
            }

            footer::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 5px;
              background: var(--gradient);
            }

            @media (max-width: 768px) {
              .hero h1 {
                font-size: 2.8em;
              }
              nav a {
                padding: 6px 9px;
                font-size: 0.9em;
              }
              .card-container {
                align-items: center;
              }
              .card, .feature-card, .testimonial-card {
                max-width: 100%;
              }
            }

            @media (max-width: 480px) {
              .hero h1 {
                font-size: 2.8em;
              }
              nav a {
                padding: 6px 9px;
                font-size: 0.9em;
              }
              .card-container {
                align-items: center;
              }
              .card, .feature-card, .testimonial-card {
                max-width: 100%;
              }
            }

            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .animate-fadeInUp {
              animation: fadeInUp 0.8s ease forwards;
            }
            .delay-1 {
              animation-delay: 0.1s;
            }
            .delay-2 {
              animation-delay: 0.3s;
            }
            .delay-3 {
              animation-delay: 0.5s;
            }
          `,
        }}
      />

      {/* Main content structure */}
      <header>
        <img src={logo} alt="GritFit Logo" />
        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Join Beta</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <h1 className="animate-fadeInUp">Grit Today,<br />Fit Tomorrow</h1>
        <p className="animate-fadeInUp delay-1">
          Small daily tasks designed to make gym beginners consistent and help
          them build muscle — without the overwhelm.
        </p>
        {/* <button className="animate-fadeInUp delay-2">Start Your Fitness Journey</button> */}
        <div class = "user">
        <a href="/login"  className="btn animate-fadeInUp delay-2">Sign In</a>
        <a href="/signup" className="btn animate-fadeInUp delay-2">Create Account</a>
        </div>
      </section>

      <section id="about">
        <h2>About GritFit</h2>
        <p>
          GritFit helps beginners develop gym habits through micro-tasks focused
          on consistency, protein tracking, hydration, and reflection — all
          essential for muscle growth.
        </p>

        <div className="card-container">
          <div className="card">
            <span className="card-icon">🔔</span>
            <h3>Daily Micro-Tasks</h3>
            <p>Small, achievable steps that add up to major gains. No more feeling lost at the gym.</p>
          </div>

          <div className="card">
            <span className="card-icon">📊</span>
            <h3>Track Consistency</h3>
            <p>Watch your streaks grow as you build the foundation for serious muscle gains.</p>
          </div>

          <div className="card">
            <span className="card-icon">💬</span>
            <h3>Reflect & Improve</h3>
            <p>Learn from what worked (or didn't) each day to level up your fitness journey.</p>
          </div>
        </div>
      </section>

      <section className="dark-section">
        <h2>Why GritFit Works</h2>
        <div className="card-container">
          <div className="feature-card">
            <span className="emoji">✅</span>
            <h3>Focus on Consistency</h3>
            <p>
              The #1 key to hypertrophy success that most beginners miss. We make
              it easy to never skip a day.
            </p>
          </div>

          <div className="feature-card">
            <span className="emoji">📚</span>
            <h3>Science-backed Habits</h3>
            <p>
              Combining nutrition, hydration & training habits that are proven to
              maximize muscle growth.
            </p>
          </div>

          <div className="feature-card">
            <span className="emoji">🎉</span>
            <h3>Celebrate Small Wins</h3>
            <p>
              Every completed task builds momentum and gets you closer to your
              dream physique.
            </p>
          </div>
        </div>
      </section>

      <section className="testimonial-section">
        <h2>What Our Users Say</h2>
        <div className="card-container">
          <div className="testimonial-card">
            <p className="testimonial-text">
              "GritFit made me consistent for the first time ever. I finally see
              my gains stacking! No cap, this app changed my fitness game."
            </p>
            <div className="testimonial-author">
              
            </div>
          </div>

          <div className="testimonial-card">
            <p className="testimonial-text">
              "I used to skip the gym after bad days. Now I reflect, reset, and
              show up again. The streak system is lowkey addictive!"
            </p>
            <div className="testimonial-author">
              
            </div>
          </div>

          <div className="testimonial-card">
            <p className="testimonial-text">
              "Tracking my hydration and protein daily helped me understand my
              body better. The micro-tasks made everything more manageable."
            </p>
            <div className="testimonial-author">
             
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="beta-section">
        <h2>💪 Want to be a GritFit Beta Tester? 🚀</h2>
        <p>
          We're looking for beginners ready to build muscle and smash their gym
          goals — one daily habit at a time! Apply below and join our exclusive
          beta team.
        </p>

        <form className="beta-form" onSubmit={handleFormSubmit}>
          <input type="text" placeholder="Your Name 💼" required />
          <input type="email" placeholder="Your Email 📧" required />
          <textarea placeholder="Tell us why you want to join 💬" required />
          <button type="submit" className="apply-button emoji-button">
            🔥 Apply as Beta Tester
          </button>
        </form>
      </section>

      <footer>
        &copy; 2025 GritFit. Build Consistency. Build Muscle.
      </footer>
    </>
  );
}

export default Landing;
