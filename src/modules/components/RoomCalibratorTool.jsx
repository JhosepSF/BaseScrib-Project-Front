import PropTypes from "prop-types";

/**
 * RoomCalibratorTool Component
 * Standalone modular visual inspector for room zones/hitboxes.
 * Renders glowing neon debug outlines and real-time coordinate badges (x, y, w, h) directly in SVG coordinate space.
 */
export function RoomCalibratorTool({ active, zones = [] }) {
  if (!active) return null;

  return (
    <g style={{ pointerEvents: "none" }}>
      {zones.map((zone) => (
        <foreignObject
          key={zone.id}
          x={zone.x}
          y={zone.y}
          width={zone.width}
          height={zone.height}
          style={{ overflow: "visible", pointerEvents: "none" }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              outline: `3.5px dashed ${zone.color}`,
              backgroundColor: `${zone.color}45`,
              boxShadow: `0 0 25px ${zone.color}, inset 0 0 15px ${zone.color}`,
              transform: zone.transform || "none",
              transformOrigin: zone.transformOrigin || "top left",
              borderRadius: "8px",
              position: "relative",
              pointerEvents: "none",
              boxSizing: "border-box"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: zone.y < 60 ? "10px" : "-36px",
                left: "8px",
                background: zone.color,
                color: "#000000",
                fontSize: "18px",
                fontWeight: "900",
                padding: "4px 12px",
                borderRadius: "6px",
                boxShadow: `0 0 16px ${zone.color}, 0 4px 10px rgba(0,0,0,0.8)`,
                whiteSpace: "nowrap",
                letterSpacing: "0.5px",
                border: "1.5px solid #000000",
                zIndex: 9999,
                pointerEvents: "none"
              }}
            >
              {zone.label} [x:{zone.x} y:{zone.y} w:{zone.width} h:{zone.height}]
            </div>
          </div>
        </foreignObject>
      ))}
    </g>
  );
}

RoomCalibratorTool.propTypes = {
  active: PropTypes.bool.isRequired,
  zones: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      transform: PropTypes.string,
      transformOrigin: PropTypes.string
    })
  )
};
