import React, { useState, useEffect, useRef } from "react";
import { soundFx } from "../../utils/soundEffects";

/**
 * TypewriterText Component
 * Renders text character-by-character with skip capability and audio blips.
 * Prevents re-triggering bugs when parent components re-render.
 */
export default function TypewriterText({
  text = "",
  speed = 22,
  onComplete,
  isSkipped = false,
  className = "",
  soundFrequency = 3,
}) {
  const [displayedText, setDisplayedText] = useState("");
  const onCompleteRef = useRef(onComplete);

  // Keep ref updated without re-triggering the typewriter effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!text) {
      setDisplayedText("");
      return;
    }

    if (isSkipped) {
      setDisplayedText(text);
      if (onCompleteRef.current) onCompleteRef.current();
      return;
    }

    let currentIndex = 0;
    setDisplayedText("");

    const timer = setInterval(() => {
      currentIndex += 1;
      setDisplayedText(text.slice(0, currentIndex));

      if (currentIndex % soundFrequency === 0 && currentIndex < text.length) {
        soundFx.playClick();
      }

      if (currentIndex >= text.length) {
        clearInterval(timer);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, speed);

    return () => {
      clearInterval(timer);
    };
  }, [text, isSkipped, speed, soundFrequency]);

  return <span className={className}>{displayedText}</span>;
}
