import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { soundFx } from "../utils/soundEffects";

/**
 * RecruteHUD — Floating HUD bar with avatar identity, stats, and navigation.
 * Positioned at the top of the Space Station view.
 */
export default function RecluteHUD({ user, onOpenStore, onOpenRank, onOpenEval, onOpenInventory, onLogout }) {
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="recrute-hud">
      {/* Identity */}
      <div className="recrute-hud__identity">
        <div className="recrute-hud__avatar-mini">🧑‍🚀</div>
        <span className="recrute-hud__name">{user.username}</span>
      </div>

      {/* Stats */}
      <div className="recrute-hud__stats">
        <span className="recrute-hud__stat recrute-hud__stat--xp">⭐ {user.xp || 0} XP</span>
        <span className="recrute-hud__stat recrute-hud__stat--coins" data-tour="coins-card">🪙 {user.coins || 0}</span>
        <span className="recrute-hud__stat recrute-hud__stat--streak" data-tour="streak-card">🔥 {user.streak_count || 0}d</span>
      </div>

      {/* Action Buttons */}
      <div className="recrute-hud__actions">
        <button
          className="recrute-hud__btn recrute-hud__btn--store"
          data-tour="store-button"
          onClick={() => { soundFx.playClick(); onOpenStore(); }}
        >
          🛒 Tienda
        </button>
        <button
          className="recrute-hud__btn recrute-hud__btn--rank"
          onClick={() => { soundFx.playClick(); onOpenRank(); }}
        >
          🏆 Ranking
        </button>
        <button
          className="recrute-hud__btn recrute-hud__btn--eval"
          onClick={() => { soundFx.playClick(); onOpenEval(); }}
        >
          📝 Evaluaciones
        </button>
        <button
          className="recrute-hud__btn recrute-hud__btn--avatar"
          onClick={() => { soundFx.playClick(); if (onOpenInventory) onOpenInventory(); else navigate("/avatar"); }}
        >
          🎨 Avatar
        </button>
        <button
          className="recrute-hud__btn recrute-hud__btn--logout"
          onClick={() => { soundFx.playClick(); onLogout(); }}
        >
          Salir
        </button>
      </div>
    </div>
  );
}

RecluteHUD.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    xp: PropTypes.number,
    coins: PropTypes.number,
    streak_count: PropTypes.number,
  }),
  onOpenStore: PropTypes.func.isRequired,
  onOpenRank: PropTypes.func.isRequired,
  onOpenEval: PropTypes.func.isRequired,
  onOpenInventory: PropTypes.func,
  onLogout: PropTypes.func.isRequired,
};
