import PropTypes from "prop-types";
import "../../styles/AvatarFrame.css";

export default function AvatarFrame({ frameId = "frame_default", size = "medium", children, title = "", onClick }) {
  const frameClassMap = {
    frame_default: "avatar-frame-default",
    frame_fire: "avatar-frame-fire",
    frame_electric: "avatar-frame-electric",
    frame_spidey: "avatar-frame-spidey",
    frame_neon: "avatar-frame-neon",
    frame_gold_crown: "avatar-frame-gold-crown"
  };

  const sizePxMap = {
    small: 42,
    medium: 56,
    large: 84,
    xlarge: 120
  };

  const dimension = typeof size === "number" ? size : (sizePxMap[size] || 56);
  const activeClass = frameClassMap[frameId] || "avatar-frame-default";

  return (
    <div
      className={`avatar-frame-container ${activeClass}`}
      style={{
        width: dimension,
        height: dimension,
        cursor: onClick ? "pointer" : "default"
      }}
      title={title}
      onClick={onClick}
    >
      <div className="avatar-frame-inner">
        {children || <span style={{ fontSize: `${dimension * 0.45}px` }}>🧑‍🚀</span>}
      </div>
    </div>
  );
}

AvatarFrame.propTypes = {
  frameId: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
  title: PropTypes.string,
  onClick: PropTypes.func
};
