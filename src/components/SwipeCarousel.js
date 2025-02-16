import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Navigation icons
import '../css/SwipeCarousel.css'; // Updated styles

const SwipeCarousel = ({ slides }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [props, set] = useSpring(() => ({
      x: 0,
      config: { tension: 200, friction: 20 }, // Smooth animation
    }));
  
    const goToSlide = (index) => {
      const direction = index > currentIndex ? 1 : -1; // Determine swipe direction
      set({
        x: -100 * direction, // Move current slide out
        onRest: () => {
          setCurrentIndex(index); // Update active index
          set({ x: 100 * direction }); // Move new slide into view
          set({ x: 0 }); // Center new slide
        },
      });
    };
  
    const goNext = () => {
      if (currentIndex < slides.length - 1) {
        goToSlide(currentIndex + 1);
      }
    };
  
    const goPrev = () => {
      if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
    };
  
    const bind = useDrag(({ movement: [mx], velocity, direction: [dx], last }) => {
      if (last) {
        if (mx > 50 && dx > 0) {
          goPrev(); // Swipe right
        } else if (mx < -50 && dx < 0) {
          goNext(); // Swipe left
        } else {
          set({ x: 0 }); // Reset if no significant swipe
        }
      } else {
        set({ x: mx }); // Follow drag movement
      }
    });
  
    return (
      <div className="carousel-container">
        {/* Chevron for previous */}
        <ChevronLeft
          className="carousel-chevron left"
          onClick={goPrev}
          style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible' }}
        />
  
        {/* Slide wrapper */}
        <div className="carousel-slide-wrapper">
          <animated.div
            className="carousel-slide"
            style={props}
            {...bind()} // Bind swipe gestures
          >
            {slides[currentIndex]}
          </animated.div>
        </div>
  
        {/* Chevron for next */}
        <ChevronRight
          className="carousel-chevron right"
          onClick={goNext}
          style={{ visibility: currentIndex === slides.length - 1 ? 'hidden' : 'visible' }}
        />
  
        {/* Dots for navigation */}
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    );
  };
  
export default SwipeCarousel;
