import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import '../css/SwipeImageWithSpring.css';

const SwipeImageWithSpring = ({ children, onSwipe, phaseNumber, dayNumber }) => {
  const [gone, setGone] = useState(null); // Tracks swipe direction: 'left', 'right', or 'up'

  const [props, set] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    opacity: 1,
  }));

  // Gesture handling
  const bind = useDrag((state) => {
    const {
      offset: [ox, oy],
      movement: [mx, my],
      velocity: [vx, vy],
    } = state;

    // Horizontal movement visual effect
    set({
      x: mx,
      y: my,
      scale: 1 - Math.abs(mx) / 1000,
      rotate: mx / 20,
      opacity: 1 - Math.abs(mx) / 200,
    });

    // Detect swipe left or right
    if (Math.abs(ox) > 50 && vx > 0.2) {
      const direction = mx > 0 ? 'right' : 'left';
      setGone(direction);
    }

    // Detect swipe up (oy is negative when swiping up)
    if (oy < -50 && vy > 0.2) {
      setGone('up');
    }
  });

  // Animate card off screen based on swipe direction
  useEffect(() => {
    if (!gone) return;

    if (gone === 'right') {
      set({ x: 1000, y: 0, opacity: 0 });
    } else if (gone === 'left') {
      set({ x: -1000, y: 0, opacity: 0 });
    } else if (gone === 'up') {
      set({ x: 0, y: -1000, opacity: 0 });
    }
  }, [gone, set]);

  // Callback after animation
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
        ...props,
        touchAction: 'none',
      }}
      {...bind()}
    >
      {children}
    </animated.div>
  );
};

export default SwipeImageWithSpring;
