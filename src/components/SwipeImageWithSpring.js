import React from 'react';
import { useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import '../css/SwipeImageWithSpring.css';  // Import the component-specific styles

const SwipeImageWithSpring = ({ children, onSwipe, phaseNumber, dayNumber }) => {
    const [gone, setGone] = React.useState(0); // Tracks whether the task was swiped
    const [props, set] = useSpring(() => ({
      x: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
    }));
  
    // Gesture handling with use-gesture
    const bind = useDrag((state) => {
      const { offset, movement: [mx], velocity, event } = state;
      console.log('Drag state:', state); // Log drag state
      // Apply swipe movement
      set({
        x: mx,
        scale: 1 - Math.abs(mx) / 1000,
        rotate: mx / 20,
        opacity: 1 - Math.abs(mx) / 200,
      });
  
      // Trigger swipe action if swipe exceeds threshold
      if (Math.abs(offset[0]) > 50 && velocity[0] > 0.2) {
        const direction = mx > 0 ? 'right' : 'left';
        console.log('Swipe direction:', direction);
        setGone(direction === 'right' ? 1 : -1); // Set swipe direction
      }
    });
  
    // Trigger navigation after the swipe animation completes (onRest)
    useEffect(() => {
      if (gone !== 0) {
        // Trigger navigation after swipe animation completes
        set({
          x: gone > 0 ? 1000 : -1000, // Move task off-screen (left or right)
          opacity: 0, // Fade out the task
        });
      }
    }, [gone, set]);
  
    // Handle navigation after animation finishes
    useEffect(() => {
      if (gone !== 0) {
        // Trigger navigation when swipe animation is finished (after onRest)
        setTimeout(() => {
          onSwipe(gone > 0 ? 'right' : 'left', phaseNumber, dayNumber); // Trigger onSwipe
        }, 300); // Adjust the timeout duration to match the animation time
      }
    }, [gone, onSwipe, phaseNumber, dayNumber]);
  
    return (
      <animated.div
        className="swipe-task"
        style={{
          ...props,
          touchAction: 'none', // Prevent default touch actions
          transform: props.x.to((x) => `translateX(${x}px)`), // Drag movement
        }}
        {...bind()} // Bind drag gestures
      >
        {children} {/* Render the task button as a child */}
      </animated.div>
    );
  };

export default SwipeImageWithSpring;
