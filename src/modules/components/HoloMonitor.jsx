import PropTypes from "prop-types";

/**
 * HoloMonitor — Reusable holographic monitor panel.
 * Simulates a sci-fi monitor with scanline effect, glow border, and flicker animation.
 */
export default function HoloMonitor({ icon, title, children, className = "", style = {} }) {
  return (
    <div className={`holo-monitor ${className}`} style={style}>
      <div className="holo-monitor__header">
        <span className="holo-monitor__icon">{icon}</span>
        <span className="holo-monitor__title">{title}</span>
      </div>
      <div className="holo-monitor__body">
        {children}
      </div>
    </div>
  );
}

HoloMonitor.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};
