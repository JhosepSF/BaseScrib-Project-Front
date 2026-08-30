import { useState } from "react";
import { soundFx } from "../utils/soundEffects";
import PropTypes from "prop-types";

/**
 * PortalGateway — Animated mini-portal for accessing the Valle de Portales.
 * Features a spinning conic-gradient vortex, dashed energy ring, and holographic label.
 */
export default function PortalGateway({ onOpen, scale = 1.0, showLabel = true, is3D = false, isHovered: externalHover = false }) {
  const [internalHover, setInternalHover] = useState(false);
  const isHovered = externalHover || internalHover;

  return (
    <div
      className="portal-gateway-scaler"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}
    >
      <div
        className={`portal-gateway ${is3D ? "portal-gateway--3d" : ""} ${isHovered ? "hovered" : ""}`}
        onClick={() => { soundFx.playWarp(); onOpen(); }}
        onMouseEnter={() => { setInternalHover(true); soundFx.playWarp(); }}
        onMouseLeave={() => setInternalHover(false)}
        style={{
          height: showLabel ? undefined : "110px"
        }}
      >
        {/* Outer energy ring */}
        <div
          className="portal-gateway__outer-ring"
          style={isHovered ? { animationDuration: "2s" } : undefined}
        />

        {/* Inner vortex */}
        <div
          className="portal-gateway__vortex"
          style={isHovered ? { animationDuration: "1.5s" } : undefined}
        >
          <span
            className="portal-gateway__vortex-emoji"
            style={isHovered ? { transform: "scale(1.25)" } : undefined}
          >
            🌀
          </span>
        </div>

        {/* Label */}
        {showLabel && (
          <div className="portal-gateway__label">
            ✨ VALLE DE PORTALES
            <span className="portal-gateway__sublabel">(Desafíos Extra)</span>
          </div>
        )}
      </div>
    </div>
  );
}

PortalGateway.propTypes = {
  onOpen: PropTypes.func.isRequired,
  scale: PropTypes.number,
  showLabel: PropTypes.bool,
  is3D: PropTypes.bool,
  isHovered: PropTypes.bool,
};
