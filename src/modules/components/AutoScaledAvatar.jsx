import { useEffect, useRef, useState } from "react";

/**
 * AutoScaledAvatar Component
 * Automatically detects non-transparent pixel bounding box of any AI/raw character PNG,
 * and scales it dynamically so all characters render at the EXACT same visual height!
 */
export default function AutoScaledAvatar({ 
  src, 
  alt = "Avatar", 
  activeFilter = "none",
  targetHeightRatio = 0.88,
  style = {}
}) {
  const containerRef = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [offsetY, setOffsetY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;
    setIsLoaded(false);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        let minY = h, maxY = 0;
        let minX = w, maxX = 0;
        let hasOpaque = false;

        // Scan pixels for non-transparent body bounds (alpha > 35)
        for (let y = 0; y < h; y += 2) {
          for (let x = 0; x < w; x += 2) {
            const alpha = data[(y * w + x) * 4 + 3];
            if (alpha > 35) {
              hasOpaque = true;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
            }
          }
        }

        if (hasOpaque && maxY > minY) {
          const bodyHeight = maxY - minY;
          const bodyHeightRatio = bodyHeight / h;

          // Target scale so actual character body fills targetHeightRatio (88%) of container
          let computedScale = targetHeightRatio / bodyHeightRatio;
          
          // Clamp scale to reasonable bounds (0.75x to 1.65x)
          computedScale = Math.max(0.75, Math.min(1.65, computedScale));

          // Center Y offset adjustment
          const bodyCenterY = (minY + maxY) / 2;
          const imgCenterY = h / 2;
          const shiftY = ((imgCenterY - bodyCenterY) / h) * 100;

          setScaleFactor(computedScale);
          setOffsetY(shiftY);
        } else {
          setScaleFactor(1);
          setOffsetY(0);
        }
      } catch (err) {
        console.warn("AutoScaledAvatar measurement fallback:", err);
        setScaleFactor(1);
        setOffsetY(0);
      } finally {
        setIsLoaded(true);
      }
    };
  }, [src, targetHeightRatio]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.25s ease-in-out",
        ...style
      }}
    >
      {/* BASE CHARACTER PNG (PRE-RENDERED CLEAN ARTWORK) */}
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: `scale(${scaleFactor}) translateY(${offsetY}%)`,
          transformOrigin: "center center",
          filter: `${activeFilter} drop-shadow(0 0 12px rgba(184, 255, 249, 0.45))`,
          transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        }}
      />
    </div>
  );
}
