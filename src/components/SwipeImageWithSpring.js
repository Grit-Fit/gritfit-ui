import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import '../css/SwipeImageWithSpring.css';

const SwipeImageWithSpring = ({ children, onSwipe, phaseNumber, dayNumber }) => {
  const [gone, setGone] = useState(null); 


  const [styles, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    opacity: 1,
    config: { tension: 250, friction: 35 }, 
  }));

  const bind = useDrag(({ down, movement: [mx, my], velocity: [vx, vy] }) => {
    if (gone) return; 

    
    if (down) {
      api.start({
        x: mx,
        y: my,
        scale: 1 - Math.abs(mx) / 1000,
        rotate: mx / 20,
        opacity: 1 - Math.abs(mx) / 200,
      });
    } else {
      // User released; check if it should fling off screen
      const threshold = 50;
      const velocityThreshold = 0.05;

      // Decide if it is a swipe or a reset
      const swipeHorizontally = Math.abs(mx) > threshold || vx > velocityThreshold;
      const swipeUp = my < -threshold || vy > velocityThreshold;

      if (swipeHorizontally) {
        setGone(mx > 0 ? 'right' : 'left');
      } else if (swipeUp) {
        setGone('up');
      } else {
      
        api.start({
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          opacity: 1,
        });
      }
    }
  });

 
  useEffect(() => {
    if (!gone) return;

    if (gone === 'right') {
      api.start({ x: 1000, y: 0, opacity: 0 , config: { duration: 400 }});
    } else if (gone === 'left') {
      api.start({ x: -1000, y: 0, opacity: 0, config: { duration: 400 } });
    } else if (gone === 'up') {
      api.start({ x: 0, y: -1000, opacity: 0 , config: { duration: 500 } });
    }
  }, [gone, api]);

  
  useEffect(() => {
    if (!gone) return;

    const timeout = setTimeout(() => {
      onSwipe(gone, phaseNumber, dayNumber);
    }, 300);

    return () => clearTimeout(timeout);
  }, [gone, onSwipe, phaseNumber, dayNumber]);

  return (
    <animated.div
      className="swipe-task"
      style={{

        x: styles.x,
        y: styles.y,
        scale: styles.scale,
        rotate: styles.rotate.to((r) => `${r}deg`),
        opacity: styles.opacity,


        transform: styles.x
          .to((xVal) => `translate3d(${xVal}px, 0, 0)`)
          .to((translate) => translate),

        willChange: 'transform',
        touchAction: 'none', // important for mobile to prevent default scroll
      }}
      {...bind()}
    >
      {children}
    </animated.div>
  );
};

export default SwipeImageWithSpring;
