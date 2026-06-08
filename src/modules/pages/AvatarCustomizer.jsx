import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { API_BASE } from "../../config";
import "../../styles/Panel.css";

export default function AvatarCustomizer() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);

  // Customization state variables
  const [suitColor, setSuitColor] = useState("#ffffff"); // White
  const [visorColor, setVisorColor] = useState("#00f5ff"); // Neon Cyan
  const [accessory, setAccessory] = useState("none"); // "none", "antenna", "ring", "goggles"
  const [decal, setDecal] = useState("none"); // "none", "star", "heart", "planet"
  const [manualRotation, setManualRotation] = useState(0); // slider (0 to 2*PI)
  const [autoRotate, setAutoRotate] = useState(true);

  // References to update Three.js objects in real-time
  const materialsRef = useRef({ suit: null, visor: null });
  const meshesRef = useRef({ antenna: null, ring: null, goggles: null, star: null, heart: null, planet: null });
  const avatarGroupRef = useRef(null);

  const token = localStorage.getItem("basescrib_token") || "";

  // Color options maps
  const suitColorsList = [
    { name: "Astronaut White", hex: "#ffffff" },
    { name: "Dark Navy Blue", hex: "#0b2545" },
    { name: "Mars Orange", hex: "#ff6b35" },
    { name: "Toxic Green", hex: "#00ff87" }
  ];

  const visorColorsList = [
    { name: "Neon Cyan", hex: "#00f5ff" },
    { name: "Cyber Gold", hex: "#ffd700" },
    { name: "Ruby Red", hex: "#ff0055" }
  ];

  // Fetch initial profile
  useEffect(() => {
    if (!token) {
      setError("No has iniciado sesión.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch current user details
        const meRes = await fetch(`${API_BASE}/users/me/`, { headers });
        if (!meRes.ok) throw new Error("Token inválido");
        const userData = await meRes.json();
        setUser(userData);

        if (userData.role !== "student") {
          throw new Error("Solo los estudiantes pueden personalizar su avatar.");
        }

        // Fetch Student Profile
        const profRes = await fetch(`${API_BASE}/student-profiles/me/`, { headers });
        if (profRes.ok) {
          const profileData = await profRes.json();
          if (profileData.avatar) {
            try {
              // Parse saved avatar configurations
              const config = JSON.parse(profileData.avatar);
              if (config.suitColor) setSuitColor(config.suitColor);
              if (config.visorColor) setVisorColor(config.visorColor);
              if (config.accessory) setAccessory(config.accessory);
              if (config.decal) setDecal(config.decal);
            } catch (e) {
              console.warn("Could not parse saved avatar configurations, using defaults.");
            }
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Setup Three.js scene
  useEffect(() => {
    if (loading || error) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 4);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x00f5ff, 1.2, 10);
    blueLight.position.set(-2, 1, 2);
    scene.add(blueLight);

    // 5. Build Procedural Astronaut Model Group
    const avatarGroup = new THREE.Group();
    avatarGroupRef.current = avatarGroup;

    // Materials definition
    const suitMaterial = new THREE.MeshStandardMaterial({
      color: suitColor,
      roughness: 0.2,
      metalness: 0.1
    });
    const visorMaterial = new THREE.MeshStandardMaterial({
      color: visorColor,
      roughness: 0.05,
      metalness: 0.9,
      emissive: visorColor,
      emissiveIntensity: 0.4
    });
    const secondaryMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.5
    });

    materialsRef.current = { suit: suitMaterial, visor: visorMaterial };

    // Body (Suit Chest)
    const bodyGeom = new THREE.CylinderGeometry(0.35, 0.25, 0.8, 16);
    const bodyMesh = new THREE.Mesh(bodyGeom, suitMaterial);
    bodyMesh.position.y = 0.4;
    avatarGroup.add(bodyMesh);

    // Helmet (Head)
    const headGeom = new THREE.SphereGeometry(0.32, 24, 24);
    const headMesh = new THREE.Mesh(headGeom, suitMaterial);
    headMesh.position.y = 0.92;
    avatarGroup.add(headMesh);

    // Visor (Face Shield)
    const visorGeom = new THREE.SphereGeometry(0.22, 16, 16);
    // Scale it down on Z axis to make it flatter
    visorGeom.scale(1, 0.8, 0.5);
    const visorMesh = new THREE.Mesh(visorGeom, visorMaterial);
    visorMesh.position.set(0, 0.95, 0.22);
    avatarGroup.add(visorMesh);

    // Backpack (Dual Jetpack cylinders)
    const packGroup = new THREE.Group();
    const packCylGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12);
    
    const leftPack = new THREE.Mesh(packCylGeom, secondaryMaterial);
    leftPack.position.set(-0.16, 0.45, -0.25);
    packGroup.add(leftPack);

    const rightPack = new THREE.Mesh(packCylGeom, secondaryMaterial);
    rightPack.position.set(0.16, 0.45, -0.25);
    packGroup.add(rightPack);

    avatarGroup.add(packGroup);

    // Limbs (Arms & Legs)
    const limbGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.45, 12);
    
    // Left Arm
    const leftArm = new THREE.Mesh(limbGeom, suitMaterial);
    leftArm.position.set(-0.45, 0.5, 0);
    leftArm.rotation.z = Math.PI / 6;
    avatarGroup.add(leftArm);

    // Right Arm
    const rightArm = new THREE.Mesh(limbGeom, suitMaterial);
    rightArm.position.set(0.45, 0.5, 0);
    rightArm.rotation.z = -Math.PI / 6;
    avatarGroup.add(rightArm);

    // Left Leg
    const leftLeg = new THREE.Mesh(limbGeom, suitMaterial);
    leftLeg.position.set(-0.16, -0.05, 0);
    avatarGroup.add(leftLeg);

    // Right Leg
    const rightLeg = new THREE.Mesh(limbGeom, suitMaterial);
    rightLeg.position.set(0.16, -0.05, 0);
    avatarGroup.add(rightLeg);

    // 6. Accessories Group
    // Torus / Ring Around Neck
    const ringGeom = new THREE.TorusGeometry(0.24, 0.04, 8, 24);
    ringGeom.rotateX(Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeom, secondaryMaterial);
    ringMesh.position.y = 0.76;
    ringMesh.visible = false;
    avatarGroup.add(ringMesh);

    // Helmet Antenna
    const antennaGroup = new THREE.Group();
    const rodGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8);
    const rod = new THREE.Mesh(rodGeom, secondaryMaterial);
    rod.position.y = 0.125;
    antennaGroup.add(rod);

    const tipGeom = new THREE.SphereGeometry(0.04, 8, 8);
    const tipMaterial = new THREE.MeshBasicMaterial({ color: 0xff0055 });
    const tip = new THREE.Mesh(tipGeom, tipMaterial);
    tip.position.y = 0.25;
    antennaGroup.add(tip);

    antennaGroup.position.set(0, 1.2, 0);
    antennaGroup.visible = false;
    avatarGroup.add(antennaGroup);

    // Goggles
    const gogglesGroup = new THREE.Group();
    const bandGeom = new THREE.TorusGeometry(0.325, 0.015, 6, 24);
    bandGeom.rotateX(Math.PI / 2);
    const band = new THREE.Mesh(bandGeom, secondaryMaterial);
    gogglesGroup.add(band);

    const glassGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.06, 8);
    glassGeom.rotateX(Math.PI / 2);
    const glassL = new THREE.Mesh(glassGeom, visorMaterial);
    glassL.position.set(-0.1, 0, 0.3);
    const glassR = new THREE.Mesh(glassGeom, visorMaterial);
    glassR.position.set(0.1, 0, 0.3);
    gogglesGroup.add(glassL);
    gogglesGroup.add(glassR);

    gogglesGroup.position.set(0, 0.95, 0);
    gogglesGroup.visible = false;
    avatarGroup.add(gogglesGroup);

    // 7. Decals
    // Star Decal
    const starGeom = new THREE.ConeGeometry(0.07, 0.15, 4);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const star = new THREE.Mesh(starGeom, starMaterial);
    star.position.set(0, 0.45, 0.36);
    star.rotation.x = Math.PI / 2.5;
    star.visible = false;
    avatarGroup.add(star);

    // Heart Decal
    const heartGeom = new THREE.BoxGeometry(0.08, 0.08, 0.04);
    const heartMaterial = new THREE.MeshBasicMaterial({ color: 0xff0055 });
    const heart = new THREE.Mesh(heartGeom, heartMaterial);
    heart.position.set(0, 0.45, 0.36);
    heart.rotation.y = 0;
    heart.visible = false;
    avatarGroup.add(heart);

    // Planet Decal
    const planetGroup = new THREE.Group();
    const sphereGeom = new THREE.SphereGeometry(0.05, 8, 8);
    const pSphere = new THREE.Mesh(sphereGeom, new THREE.MeshBasicMaterial({ color: 0x00f5ff }));
    planetGroup.add(pSphere);

    const pRingGeom = new THREE.TorusGeometry(0.08, 0.008, 4, 16);
    pRingGeom.rotateX(Math.PI / 3);
    const pRing = new THREE.Mesh(pRingGeom, new THREE.MeshBasicMaterial({ color: 0xffd700 }));
    planetGroup.add(pRing);

    planetGroup.position.set(0, 0.45, 0.36);
    planetGroup.visible = false;
    avatarGroup.add(planetGroup);

    // Store references to dynamically toggle meshes
    meshesRef.current = {
      antenna: antennaGroup,
      ring: ringMesh,
      goggles: gogglesGroup,
      star: star,
      heart: heart,
      planet: planetGroup
    };

    scene.add(avatarGroup);

    // Adjust visibility according to state variables
    antennaGroup.visible = accessory === "antenna";
    ringMesh.visible = accessory === "ring";
    gogglesGroup.visible = accessory === "goggles";
    star.visible = decal === "star";
    heart.visible = decal === "heart";
    planetGroup.visible = decal === "planet";

    // 8. Animation Loop
    let animationFrameId;
    const animate = () => {
      // Rotation logic
      if (autoRotate) {
        avatarGroup.rotation.y += 0.005;
        // Keep manual slider in sync (mod 2*PI)
        setManualRotation(avatarGroup.rotation.y % (Math.PI * 2));
      } else {
        avatarGroup.rotation.y = manualRotation;
      }

      // Slow hover/breath bobbing
      avatarGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.05;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 9. Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      bodyGeom.dispose();
      headGeom.dispose();
      visorGeom.dispose();
      packCylGeom.dispose();
      limbGeom.dispose();
      ringGeom.dispose();
      rodGeom.dispose();
      tipGeom.dispose();
      bandGeom.dispose();
      glassGeom.dispose();
      starGeom.dispose();
      heartGeom.dispose();
      sphereGeom.dispose();
      pRingGeom.dispose();
    };
  }, [loading, error]);

  // Sync color changes to Three.js materials
  useEffect(() => {
    if (materialsRef.current.suit) {
      materialsRef.current.suit.color.set(suitColor);
    }
  }, [suitColor]);

  useEffect(() => {
    if (materialsRef.current.visor) {
      materialsRef.current.visor.color.set(visorColor);
      materialsRef.current.visor.emissive.set(visorColor);
    }
  }, [visorColor]);

  // Sync accessory changes
  useEffect(() => {
    const meshes = meshesRef.current;
    if (meshes.antenna) {
      meshes.antenna.visible = accessory === "antenna";
      meshes.ring.visible = accessory === "ring";
      meshes.goggles.visible = accessory === "goggles";
    }
  }, [accessory]);

  // Sync decal changes
  useEffect(() => {
    const meshes = meshesRef.current;
    if (meshes.star) {
      meshes.star.visible = decal === "star";
      meshes.heart.visible = decal === "heart";
      meshes.planet.visible = decal === "planet";
    }
  }, [decal]);

  // Sync slider rotation
  useEffect(() => {
    if (!autoRotate && avatarGroupRef.current) {
      avatarGroupRef.current.rotation.y = manualRotation;
    }
  }, [manualRotation, autoRotate]);

  // Save selection to backend profile
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const config = JSON.stringify({
        suitColor,
        visorColor,
        accessory,
        decal
      });

      const res = await fetch(`${API_BASE}/student-profiles/me/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: config })
      });

      if (!res.ok) {
        throw new Error("No se pudo guardar la apariencia del avatar.");
      }

      setSuccess("¡Avatar guardado con éxito en tu panel de control!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container space-bg" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div className="auth-card">
          <h2>Cargando simulador 3D...</h2>
          <p className="tagline">Encendiendo motores gráficos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-bg" style={{ maxWidth: 1000 }}>
      <header className="panel-header">
        <h1>Diseñador de Avatar 3D</h1>
        <p className="tagline">Personaliza tu traje de exploración espacial</p>
      </header>

      {error && <div className="error-message" style={{ width: "100%", maxWidth: 900 }}>{error}</div>}
      {success && <div className="success-message" style={{ width: "100%", maxWidth: 900, background: "rgba(46,196,182,0.15)", border: "1px solid #2ec4b6", color: "#b8fff9", padding: 15, borderRadius: 8, textAlign: "center", marginBottom: 20 }}>{success}</div>}

      <div className="avatar-workspace" style={{ display: "flex", gap: 30, width: "100%", flexWrap: "wrap" }}>
        {/* Left Side: 3D Canvas */}
        <div 
          ref={containerRef} 
          className="auth-card" 
          style={{ 
            flex: "1 1 400px", 
            minHeight: 400, 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center",
            padding: 20,
            background: "radial-gradient(circle, rgba(15, 58, 71, 0.6) 0%, rgba(5, 24, 32, 0.4) 100%)"
          }}
        >
          <canvas ref={canvasRef} style={{ width: "100%", height: 350, display: "block" }} />

          {/* Interactive controls */}
          <div style={{ width: "100%", marginTop: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ fontSize: "0.85rem", color: "#9be6df" }}>Girar personaje: {Math.round((manualRotation * 180) / Math.PI)}°</label>
              <button 
                onClick={() => setAutoRotate(!autoRotate)}
                style={{ 
                  margin: 0, 
                  padding: "4px 10px", 
                  fontSize: "0.75rem", 
                  borderRadius: 4, 
                  background: autoRotate ? "rgba(46, 196, 182, 0.2)" : "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(184, 255, 249, 0.3)"
                }}
              >
                {autoRotate ? "⏸️ Pausar Giro" : "▶️ Auto-giro"}
              </button>
            </div>
            <input 
              type="range" 
              min={0} 
              max={Math.PI * 2} 
              step={0.05} 
              value={manualRotation}
              onChange={(e) => {
                setManualRotation(Number(e.target.value));
                setAutoRotate(false);
              }}
              style={{ width: "100%", cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Right Side: Options Panel */}
        <div className="auth-card" style={{ flex: "1 1 400px", padding: 30, textAlign: "left" }}>
          <h2 style={{ borderBottom: "1px solid rgba(184, 255, 249, 0.2)", paddingBottom: 10, marginTop: 0 }}>
            Panel de Vestuario
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 15 }}>
            {/* Color of Suit */}
            <div>
              <h4 style={{ margin: "0 0 10px 0", color: "#9be6df", fontSize: "0.95rem" }}>👕 Color del Traje Espacial</h4>
              <div style={{ display: "flex", gap: 10 }}>
                {suitColorsList.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setSuitColor(c.hex)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      backgroundColor: c.hex,
                      border: suitColor === c.hex ? "3px solid #00f5ff" : "1px solid rgba(255,255,255,0.3)",
                      padding: 0,
                      cursor: "pointer",
                      margin: 0,
                      boxShadow: suitColor === c.hex ? "0 0 10px #00f5ff" : "none"
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Visor Color */}
            <div>
              <h4 style={{ margin: "0 0 10px 0", color: "#9be6df", fontSize: "0.95rem" }}>🕶️ Cristal del Visor</h4>
              <div style={{ display: "flex", gap: 10 }}>
                {visorColorsList.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setVisorColor(c.hex)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      backgroundColor: c.hex,
                      border: visorColor === c.hex ? "3px solid #b8fff9" : "1px solid rgba(255,255,255,0.3)",
                      padding: 0,
                      cursor: "pointer",
                      margin: 0,
                      boxShadow: visorColor === c.hex ? `0 0 12px ${c.hex}` : "none"
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Accessories Option */}
            <div>
              <h4 style={{ margin: "0 0 10px 0", color: "#9be6df", fontSize: "0.95rem" }}>👒 Accesorios del Casco</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  { id: "none", name: "Ninguno", emoji: "❌" },
                  { id: "antenna", name: "Antena", emoji: "📡" },
                  { id: "ring", name: "Aro de Cuello", emoji: "⭕" },
                  { id: "goggles", name: "Visores Gafas", emoji: "🥽" }
                ].map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAccessory(a.id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: accessory === a.id ? "2px solid #00f5ff" : "1px solid rgba(255,255,255,0.15)",
                      background: accessory === a.id ? "rgba(0, 245, 255, 0.15)" : "rgba(255,255,255,0.04)",
                      color: accessory === a.id ? "#b8fff9" : "#e6f7ff",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      margin: 0
                    }}
                  >
                    {a.emoji} {a.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Emblem Option */}
            <div>
              <h4 style={{ margin: "0 0 10px 0", color: "#9be6df", fontSize: "0.95rem" }}>🛡️ Emblema de Pecho</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  { id: "none", name: "Vacío", emoji: "🚫" },
                  { id: "star", name: "Estrella Dorada", emoji: "⭐" },
                  { id: "heart", name: "Corazón Ruby", emoji: "❤️" },
                  { id: "planet", name: "Planeta Celeste", emoji: "🪐" }
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDecal(d.id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: decal === d.id ? "2px solid #00f5ff" : "1px solid rgba(255,255,255,0.15)",
                      background: decal === d.id ? "rgba(0, 245, 255, 0.15)" : "rgba(255,255,255,0.04)",
                      color: decal === d.id ? "#b8fff9" : "#e6f7ff",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      margin: 0
                    }}
                  >
                    {d.emoji} {d.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 15, marginTop: 35 }}>
            <button 
              className="btn-cancel" 
              style={{ flex: 1 }} 
              onClick={() => navigate("/panelprincipal")}
            >
              Volver
            </button>
            <button 
              className="btn-create" 
              style={{ flex: 2, background: "linear-gradient(135deg, #2ec4b6, #26a399)", color: "#002427" }} 
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? "Guardando..." : "💾 Guardar Apariencia"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
