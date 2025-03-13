// src/components/SwipeableCard.js
import React from "react";
import { useSpring, animated, to } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";

/**
 * Usage:
 *  <SwipeableCard
 *    onSwipeLeft={() => ...}
 *    onSwipeRight={() => ...}
 *    disabled={false}
 *  >
 *    <DailyCard ... />
 *  </SwipeableCard>
 */
function SwipeableCard({ children, onSwipeLeft, onSwipeRight }) {
    // x, y, rot represent the position & rotation of the card
    const [{ x, y, rot }, api] = useSpring(() => ({ x: 0, y: 0, rot: 0 }));
  
    const bind = useGesture({
      onDrag: ({ down, movement: [mx], velocity, direction: [dx] }) => {
        // If user drags quickly (velocity > threshold), treat it as a swipe
        const trigger = velocity > 0.3;
  
        if (!down && trigger) {
          if (dx < 0) {
            // dx negative => swiping left
            onSwipeLeft && onSwipeLeft();
          } else {
            // dx positive => swiping right
            onSwipeRight && onSwipeRight();
          }
          // Reset to the original position
          api.start({ x: 0, y: 0, rot: 0 });
        } else {
          // While dragging, update position
          api.start({
            x: down ? mx : 0,
            rot: down ? mx / 20 : 0
          });
        }
      }
    });
  
    // A transform function for our animated card
    const transform = to([x, rot], (xVal, rVal) => {
      return `translateX(${xVal}px) rotate(${rVal}deg)`;
    });
  
    return (
      <animated.div
        {...bind()}
        style={{
          touchAction: "none",
          transform
        }}
      >
        {children}
      </animated.div>
    );
  }
  
  export default SwipeableCard;
