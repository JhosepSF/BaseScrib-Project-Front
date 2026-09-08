import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "../../styles/Panel.css";
import { soundFx } from "../utils/soundEffects";

// Vocabulary Dictionary by Day (25 curated items per day across 14 curriculum days)
const VOCAB_BY_DAY = {
  1: [
    { en: "recruit", es: "recluta" },
    { en: "spaceship", es: "nave espacial" },
    { en: "planet", es: "planeta" },
    { en: "crew", es: "tripulación" },
    { en: "name", es: "nombre" },
    { en: "country", es: "país" },
    { en: "skills", es: "habilidades" },
    { en: "favorite", es: "favorito" },
    { en: "fly", es: "volar" },
    { en: "astronaut", es: "astronauta" },
    { en: "captain", es: "capitán" },
    { en: "galaxy", es: "galaxia" },
    { en: "star", es: "estrella" },
    { en: "orbit", es: "órbita" },
    { en: "repair", es: "reparar" },
    { en: "explore", es: "explorar" },
    { en: "discover", es: "descubrir" },
    { en: "alien", es: "alienígena" },
    { en: "earth", es: "tierra" },
    { en: "language", es: "idioma" },
    { en: "cadet", es: "cadete" },
    { en: "badge", es: "insignia" },
    { en: "scanner", es: "escáner" },
    { en: "signal", es: "señal" },
    { en: "suit", es: "traje" }
  ],
  2: [
    { en: "cabin", es: "cabina" },
    { en: "robot", es: "robot" },
    { en: "spacesuit", es: "traje espacial" },
    { en: "helmet", es: "casco" },
    { en: "computer", es: "computadora" },
    { en: "table", es: "mesa" },
    { en: "chair", es: "silla" },
    { en: "star", es: "estrella" },
    { en: "screen", es: "pantalla" },
    { en: "monitor", es: "monitor" },
    { en: "door", es: "puerta" },
    { en: "airlock", es: "esclusa de aire" },
    { en: "oxygen tank", es: "tanque de oxígeno" },
    { en: "battery", es: "batería" },
    { en: "map", es: "mapa" },
    { en: "radar", es: "radar" },
    { en: "locker", es: "casillero" },
    { en: "bed", es: "cama" },
    { en: "hatch", es: "escotilla" },
    { en: "sensor", es: "sensor" },
    { en: "flashlight", es: "linterna" },
    { en: "toolkit", es: "caja de herramientas" },
    { en: "cable", es: "cable" },
    { en: "button", es: "botón" },
    { en: "window", es: "ventana" }
  ],
  3: [
    { en: "wake up", es: "despertarse" },
    { en: "train", es: "entrenar" },
    { en: "study", es: "estudiar" },
    { en: "clean", es: "limpiar" },
    { en: "eat", es: "comer" },
    { en: "write", es: "escribir" },
    { en: "sleep", es: "dormir" },
    { en: "inspect", es: "inspeccionar" },
    { en: "schedule", es: "horario" },
    { en: "monitor", es: "monitorear" },
    { en: "exercise", es: "hacer ejercicio" },
    { en: "cook", es: "cocinar" },
    { en: "shower", es: "ducharse" },
    { en: "breakfast", es: "desayuno" },
    { en: "dinner", es: "cena" },
    { en: "briefing", es: "reunión informativa" },
    { en: "duty", es: "deber / guardia" },
    { en: "shift", es: "turno" },
    { en: "report", es: "informe" },
    { en: "morning", es: "mañana" },
    { en: "evening", es: "tarde / noche" },
    { en: "clock", es: "reloj" },
    { en: "alarm", es: "alarma" },
    { en: "relax", es: "relajarse" },
    { en: "routine", es: "rutina" }
  ],
  4: [
    { en: "studying", es: "estudiando" },
    { en: "cleaning", es: "limpiando" },
    { en: "reading", es: "leyendo" },
    { en: "writing", es: "escribiendo" },
    { en: "eating", es: "comiendo" },
    { en: "talking", es: "conversando" },
    { en: "working", es: "trabajando" },
    { en: "repairing", es: "reparando" },
    { en: "scanning", es: "escaneando" },
    { en: "flying", es: "volando" },
    { en: "calibrating", es: "calibrando" },
    { en: "broadcasting", es: "transmitiendo" },
    { en: "navigating", es: "navegando" },
    { en: "troubleshooting", es: "solucionando fallos" },
    { en: "checking", es: "comprobando" },
    { en: "assembling", es: "ensamblando" },
    { en: "coding", es: "programando" },
    { en: "observing", es: "observando" },
    { en: "listening", es: "escuchando" },
    { en: "testing", es: "probando" },
    { en: "fixing", es: "arreglando" },
    { en: "charging", es: "cargando" },
    { en: "launching", es: "lanzando" },
    { en: "operating", es: "operando" },
    { en: "docking", es: "acoplando" }
  ],
  5: [
    { en: "always", es: "siempre" },
    { en: "sometimes", es: "a veces" },
    { en: "never", es: "nunca" },
    { en: "usually", es: "usualmente" },
    { en: "rarely", es: "raramente" },
    { en: "often", es: "a menudo" },
    { en: "daily", es: "a diario" },
    { en: "weekly", es: "semanalmente" },
    { en: "monthly", es: "mensualmente" },
    { en: "seldom", es: "casi nunca" },
    { en: "frequently", es: "frecuentemente" },
    { en: "schedule", es: "horario" },
    { en: "time", es: "tiempo / hora" },
    { en: "checklist", es: "lista de control" },
    { en: "drill", es: "simulacro" },
    { en: "protocol", es: "protocolo" },
    { en: "inspection", es: "inspección" },
    { en: "timeline", es: "cronograma" },
    { en: "punctual", es: "puntual" },
    { en: "practice", es: "practicar" },
    { en: "workout", es: "entrenamiento físico" },
    { en: "help", es: "ayudar" },
    { en: "meet", es: "reunirse" },
    { en: "explore", es: "explorar" },
    { en: "reminder", es: "recordatorio" }
  ],
  6: [
    { en: "have", es: "tener" },
    { en: "has", es: "tener (él/ella)" },
    { en: "don't have", es: "no tener" },
    { en: "toolkit", es: "caja de herramientas" },
    { en: "oxygen tank", es: "tanque de oxígeno" },
    { en: "scanner", es: "escáner" },
    { en: "energy cell", es: "célula de energía" },
    { en: "key code", es: "código de acceso" },
    { en: "laser torch", es: "antorcha láser" },
    { en: "multi-tool", es: "multiherramienta" },
    { en: "power core", es: "núcleo de poder" },
    { en: "battery pack", es: "paquete de baterías" },
    { en: "probe", es: "sonda espacial" },
    { en: "transceiver", es: "transceptor" },
    { en: "fuse", es: "fusible" },
    { en: "circuit", es: "circuito" },
    { en: "wrench", es: "llave inglesa" },
    { en: "generator", es: "generador" },
    { en: "harness", es: "arnés" },
    { en: "connector", es: "conector" },
    { en: "display", es: "pantalla" },
    { en: "spare", es: "repuesto" },
    { en: "gear", es: "equipo / engranaje" },
    { en: "gadget", es: "dispositivo" },
    { en: "supplies", es: "suministros" }
  ],
  7: [
    { en: "what", es: "qué / cuál" },
    { en: "where", es: "dónde" },
    { en: "when", es: "cuándo" },
    { en: "who", es: "quién" },
    { en: "why", es: "por qué" },
    { en: "how", es: "cómo" },
    { en: "which", es: "cuál (opción)" },
    { en: "whose", es: "de quién" },
    { en: "signal", es: "señal" },
    { en: "frequency", es: "frecuencia" },
    { en: "anomaly", es: "anomalía" },
    { en: "origin", es: "origen" },
    { en: "destination", es: "destino" },
    { en: "location", es: "ubicación" },
    { en: "query", es: "consulta" },
    { en: "answer", es: "respuesta" },
    { en: "reason", es: "razón / motivo" },
    { en: "trajectory", es: "trayectoria" },
    { en: "distance", es: "distancia" },
    { en: "speed", es: "velocidad" },
    { en: "target", es: "objetivo" },
    { en: "beacon", es: "baliza" },
    { en: "transmission", es: "transmisión" },
    { en: "transmitter", es: "transmisor" },
    { en: "status", es: "estado" }
  ],
  8: [
    { en: "my", es: "mi" },
    { en: "your", es: "tu" },
    { en: "his", es: "su (de él)" },
    { en: "her", es: "su (de ella)" },
    { en: "our", es: "nuestro" },
    { en: "their", es: "su (de ellos)" },
    { en: "mine", es: "mío" },
    { en: "yours", es: "tuyo" },
    { en: "hers", es: "suyo (de ella)" },
    { en: "ours", es: "nuestro (pronombre)" },
    { en: "theirs", es: "de ellos (pronombre)" },
    { en: "visor", es: "visor" },
    { en: "badge", es: "insignia" },
    { en: "datapad", es: "tableta de datos" },
    { en: "backpack", es: "mochila" },
    { en: "insignia", es: "distintivo" },
    { en: "tag", es: "etiqueta" },
    { en: "credentials", es: "credenciales" },
    { en: "token", es: "ficha / pase" },
    { en: "emblem", es: "emblema" },
    { en: "belongings", es: "pertenencias" },
    { en: "locker", es: "casillero" },
    { en: "identity", es: "identidad" },
    { en: "keycard", es: "tarjeta llave" },
    { en: "uniform", es: "uniforme" }
  ],
  9: [
    { en: "me", es: "mí / me" },
    { en: "him", es: "él / lo" },
    { en: "her", es: "ella / la" },
    { en: "us", es: "nosotros / nos" },
    { en: "them", es: "ellos / los" },
    { en: "transmission", es: "transmisión" },
    { en: "channel", es: "canal" },
    { en: "coordinates", es: "coordenadas" },
    { en: "message", es: "mensaje" },
    { en: "dispatcher", es: "despachador" },
    { en: "receiver", es: "receptor" },
    { en: "sender", es: "remitente" },
    { en: "audio", es: "audio" },
    { en: "frequency", es: "frecuencia" },
    { en: "uplink", es: "enlace de subida" },
    { en: "downlink", es: "enlace de bajada" },
    { en: "satellite", es: "satélite" },
    { en: "relay", es: "repetidor" },
    { en: "antenna", es: "antena" },
    { en: "broadcast", es: "difusión" },
    { en: "intercom", es: "intercomunicador" },
    { en: "ping", es: "pulso de señal" },
    { en: "wavelength", es: "longitud de onda" },
    { en: "listen", es: "escuchar" },
    { en: "send", es: "enviar" }
  ],
  10: [
    { en: "this", es: "este / esta" },
    { en: "that", es: "ese / esa / aquel" },
    { en: "these", es: "estos / estas" },
    { en: "those", es: "esos / esas" },
    { en: "shield", es: "escudo" },
    { en: "console", es: "consola" },
    { en: "controls", es: "controles" },
    { en: "deck", es: "cubierta" },
    { en: "terminal", es: "terminal" },
    { en: "switch", es: "interruptor" },
    { en: "lever", es: "palanca" },
    { en: "dashboard", es: "panel de control" },
    { en: "indicator", es: "indicador" },
    { en: "gauge", es: "manómetro / medidor" },
    { en: "dial", es: "cuadrante" },
    { en: "screen", es: "pantalla" },
    { en: "panel", es: "panel" },
    { en: "keyboard", es: "teclado" },
    { en: "interface", es: "interfaz" },
    { en: "mechanism", es: "mecanismo" },
    { en: "unit", es: "unidad" },
    { en: "mainframe", es: "servidor central" },
    { en: "apparatus", es: "aparato" },
    { en: "cyberdeck", es: "ciberconsola" },
    { en: "system", es: "sistema" }
  ],
  11: [
    { en: "faster", es: "más rápido" },
    { en: "bigger", es: "más grande" },
    { en: "smaller", es: "más pequeño" },
    { en: "brighter", es: "más brillante" },
    { en: "stronger", es: "más fuerte" },
    { en: "colder", es: "más frío" },
    { en: "warmer", es: "más cálido" },
    { en: "closer", es: "más cercano" },
    { en: "heavier", es: "más pesado" },
    { en: "lighter", es: "más liviano" },
    { en: "farther", es: "más lejos" },
    { en: "nearer", es: "más cerca" },
    { en: "higher", es: "más alto" },
    { en: "deeper", es: "más profundo" },
    { en: "safer", es: "más seguro" },
    { en: "better", es: "mejor" },
    { en: "worse", es: "peor" },
    { en: "explorer", es: "explorador" },
    { en: "speed", es: "velocidad" },
    { en: "propulsion", es: "propulsión" },
    { en: "thrust", es: "empuje" },
    { en: "engine", es: "motor" },
    { en: "booster", es: "propulsor" },
    { en: "starship", es: "astronave" },
    { en: "altitude", es: "altitud" }
  ],
  12: [
    { en: "fastest", es: "el más rápido" },
    { en: "brightest", es: "el más brillante" },
    { en: "biggest", es: "el más grande" },
    { en: "smallest", es: "el más pequeño" },
    { en: "furthest", es: "el más lejano" },
    { en: "deepest", es: "el más profundo" },
    { en: "safest", es: "el más seguro" },
    { en: "oldest", es: "el más antiguo" },
    { en: "newest", es: "el más nuevo" },
    { en: "greatest", es: "el más grandioso" },
    { en: "highest", es: "el más alto" },
    { en: "coldest", es: "el más frío" },
    { en: "record", es: "récord" },
    { en: "champion", es: "campeón" },
    { en: "peak", es: "cima / cúspide" },
    { en: "nebula", es: "nebulosa" },
    { en: "supernova", es: "supernova" },
    { en: "black hole", es: "agujero negro" },
    { en: "cosmos", es: "cosmos" },
    { en: "quasar", es: "cuásar" },
    { en: "asteroid", es: "asteroide" },
    { en: "comet", es: "cometa" },
    { en: "zenith", es: "cénit" },
    { en: "cluster", es: "cúmulo estelar" },
    { en: "infinity", es: "infinito" }
  ],
  13: [
    { en: "visited", es: "visitó / visitado" },
    { en: "landed", es: "aterrizó" },
    { en: "launched", es: "lanzó / despegó" },
    { en: "discovered", es: "descubrió" },
    { en: "traveled", es: "viajó" },
    { en: "repaired", es: "reparó" },
    { en: "transmitted", es: "transmitió" },
    { en: "detected", es: "detectó" },
    { en: "arrived", es: "llegó" },
    { en: "departed", es: "partió" },
    { en: "unlocked", es: "desbloqueó" },
    { en: "solved", es: "resolvió" },
    { en: "calibrated", es: "calibró" },
    { en: "recorded", es: "grabó / registró" },
    { en: "explored", es: "exploró" },
    { en: "yesterday", es: "ayer" },
    { en: "last night", es: "anoche" },
    { en: "mission", es: "misión" },
    { en: "expedition", es: "expedición" },
    { en: "logbook", es: "cuaderno de bitácora" },
    { en: "voyage", es: "travesía" },
    { en: "milestone", es: "hito" },
    { en: "history", es: "historia" },
    { en: "chronicle", es: "crónica" },
    { en: "memory", es: "recuerdo" }
  ],
  14: [
    { en: "graduation", es: "graduación" },
    { en: "commander", es: "comandante" },
    { en: "cadet", es: "cadete" },
    { en: "honors", es: "honores" },
    { en: "certificate", es: "certificado" },
    { en: "mission", es: "misión" },
    { en: "victory", es: "victoria" },
    { en: "celebration", es: "celebración" },
    { en: "achievement", es: "logro" },
    { en: "starbase", es: "base estelar" },
    { en: "alliance", es: "alianza" },
    { en: "future", es: "futuro" },
    { en: "universe", es: "universo" },
    { en: "journey", es: "viaje" },
    { en: "stellar", es: "estelar" },
    { en: "honor", es: "honor" },
    { en: "badge", es: "insignia" },
    { en: "diploma", es: "diploma" },
    { en: "legacy", es: "legado" },
    { en: "tribute", es: "homenaje" },
    { en: "outpost", es: "puesto de avanzada" },
    { en: "galaxy", es: "galaxia" },
    { en: "pioneer", es: "pionero" },
    { en: "leader", es: "líder" },
    { en: "legend", es: "leyenda" }
  ]
};

// Helper to shuffle an array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate vocabulary cable nodes ensuring NO straight-line matching horizontal pairs!
function createGameNodes(pairs) {
  const left = pairs.map((p, idx) => ({ id: idx, text: p.en, matchIndex: idx }));
  const right = pairs.map((p, idx) => ({ id: idx, text: p.es, matchIndex: idx }));

  let shuffledLeft = shuffle(left);
  let shuffledRight = shuffle(right);

  // Guarantee NO horizontal straight-line matches (derangement)!
  if (shuffledLeft.length > 1) {
    let attempts = 0;
    while (
      attempts < 40 &&
      shuffledRight.some((rItem, idx) => rItem.matchIndex === shuffledLeft[idx].matchIndex)
    ) {
      shuffledRight = shuffle(right);
      attempts++;
    }
  }

  return { leftNodes: shuffledLeft, rightNodes: shuffledRight };
}

export function SentenceLaunchGame({ activity, onComplete, onClose, hideHeader = false }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [leftNodes, setLeftNodes] = useState([]);
  const [rightNodes, setRightNodes] = useState([]);
  const [connections, setConnections] = useState({}); // { leftIndex: rightIndex }
  const [selectedLeft, setSelectedLeft] = useState(null); // left index
  
  const [portCoords, setPortCoords] = useState({}); // { portId: {x, y} }
  const [mistakes, setMistakes] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Dynamic API vocabulary state
  const [fetchedVocab, setFetchedVocab] = useState([]);
  const [usedWordsHistory, setUsedWordsHistory] = useState(new Set());

  // Solution feedback evaluation state
  const [showSolution, setShowSolution] = useState(false);
  const [evalResults, setEvalResults] = useState({}); // { leftIdx: { userRightIdx, isCorrect, correctRightIdx } }

  const containerRef = useRef(null);
  const lastBuiltQIndexRef = useRef(-1);

  // Determine rounds/questions
  const questions = (activity?.questions && activity.questions.length > 0) ? activity.questions : [1, 2];

  // Wire Colors
  const colors = ["#ff6b6b", "#2ec4b6", "#ffd166", "#ab47bc", "#ff6b35", "#00ff87"];

  // Calculate coordinates of all ports
  const updateCoords = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newCoords = {};

    leftNodes.forEach((node, idx) => {
      const port = document.getElementById(`left-port-${idx}`);
      if (port) {
        const rect = port.getBoundingClientRect();
        newCoords[`left-${idx}`] = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2
        };
      }
    });

    rightNodes.forEach((node, idx) => {
      const port = document.getElementById(`right-port-${idx}`);
      if (port) {
        const rect = port.getBoundingClientRect();
        newCoords[`right-${idx}`] = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2
        };
      }
    });

    setPortCoords(newCoords);
  };

  // Fetch expanded vocabulary from backend database API for the day
  useEffect(() => {
    let isMounted = true;
    const dayNum = activity?.dayNumber || activity?.day || activity?.day_num || 1;
    fetch(`/api/daily-vocabulary/?day=${dayNum}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          const mapped = data.map(item => ({ en: item.word_en, es: item.word_es }));
          setFetchedVocab(mapped);
        }
      })
      .catch(err => {
        console.warn("Could not fetch remote daily vocabulary, using comprehensive offline pool:", err);
      });
    return () => {
      isMounted = false;
    };
  }, [activity?.dayNumber, activity?.day, activity?.day_num]);

  // Build English <-> Spanish vocabulary wire pairs for current round (100% randomized per student/attempt)
  useEffect(() => {
    // CRITICAL: Prevent re-running and wiping connections when parent re-renders!
    if (lastBuiltQIndexRef.current === currentQIndex && leftNodes.length > 0) {
      return;
    }
    lastBuiltQIndexRef.current = currentQIndex;

    const dayNum = activity?.dayNumber || activity?.day || activity?.day_num || 1;
    const fullPool = fetchedVocab.length > 0 ? fetchedVocab : (VOCAB_BY_DAY[dayNum] || VOCAB_BY_DAY[1]);

    // Exclude words already used in prior rounds of this session to ensure variety
    let candidatePool = fullPool.filter(w => !usedWordsHistory.has(w.en.toLowerCase()));
    if (candidatePool.length < 4) {
      // If pool is exhausted across multiple rounds, reset history
      candidatePool = fullPool;
      setUsedWordsHistory(new Set());
    }

    // Pick 4 random pairs from available pool
    const shuffledPool = shuffle(candidatePool);
    const roundPairs = shuffledPool.slice(0, 4);

    // Record used words
    setUsedWordsHistory(prev => {
      const next = new Set(prev);
      roundPairs.forEach(p => next.add(p.en.toLowerCase()));
      return next;
    });

    const { leftNodes: lNodes, rightNodes: rNodes } = createGameNodes(roundPairs);

    setLeftNodes(lNodes);
    setRightNodes(rNodes);
    setConnections({});
    setSelectedLeft(null);
    setIsError(false);
    setIsSuccess(false);
    setShowSolution(false);
    setEvalResults({});
  }, [currentQIndex, activity?.dayNumber, activity?.day, activity?.day_num]);

  // Update port coordinates on render / window resize
  useEffect(() => {
    if (leftNodes.length > 0 && rightNodes.length > 0) {
      const timer = setTimeout(updateCoords, 150);
      window.addEventListener("resize", updateCoords);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateCoords);
      };
    }
  }, [leftNodes, rightNodes]);

  const handleLeftClick = (idx) => {
    if (isSuccess || showSolution) return;
    if (selectedLeft === idx) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(idx);
    }
  };

  const handleRightClick = (rightIdx) => {
    if (isSuccess || showSolution || selectedLeft === null) return;

    setConnections(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(leftKey => {
        if (next[leftKey] === rightIdx) {
          delete next[leftKey];
        }
      });
      next[selectedLeft] = rightIdx;
      return next;
    });

    setSelectedLeft(null);
  };

  const handleVerify = () => {
    if (showSolution || isSuccess) return;

    if (Object.keys(connections).length !== leftNodes.length) {
      soundFx.playError();
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
      return;
    }

    // Detailed evaluation of each connection
    const results = {};
    let allCorrect = true;

    leftNodes.forEach((lNode, lIdx) => {
      const userRightIdx = connections[lIdx];
      const correctRightIdx = rightNodes.findIndex(rNode => rNode.matchIndex === lNode.matchIndex);
      const isCorrect = (userRightIdx !== undefined) && (rightNodes[userRightIdx]?.matchIndex === lNode.matchIndex);

      if (!isCorrect) allCorrect = false;

      results[lIdx] = {
        userRightIdx,
        correctRightIdx,
        isCorrect
      };
    });

    if (allCorrect) {
      soundFx.playLaser();
      soundFx.playSuccess();
      setIsSuccess(true);
      setTimeout(() => {
        handleNextRound();
      }, 1500);
    } else {
      // 1-Attempt Incorrect: Record mistake, show red (wrong) vs green (correct) wire feedback
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      soundFx.playError();
      setIsError(true);
      setShowSolution(true);
      setEvalResults(results);
    }
  };

  const handleNextRound = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      soundFx.playCoin();
      soundFx.playStreakBonus();
      onComplete(15, 15, mistakes);
    }
  };

  return (
    <div className="glass-console auth-card panel-large animate-fadeIn" style={{ maxWidth: 740, width: "100%", padding: "16px 20px", position: "relative", margin: "auto" }}>
      {/* Scanline Overlay */}
      <div className="scan-line" />

      {!hideHeader && (
        <div className="panel-title-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, borderBottom: "1.5px solid rgba(184, 255, 249, 0.2)", paddingBottom: 10 }}>
          <div style={{ textAlign: "left" }}>
            <span className="dashboard-kicker" style={{ color: "#2ec4b6", textTransform: "uppercase", fontSize: "0.78rem", fontWeight: "bold" }}>
              Etapa 1: Cableado de Vocabulario Espacial
            </span>
            <h2 style={{ margin: "3px 0 0 0", color: "#b8fff9", fontSize: "1.4rem" }}>{activity?.title || "Reconexión de Energía Espacial"}</h2>
          </div>
          <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "6px 14px" }}>
            Cerrar X
          </button>
        </div>
      )}

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#9be6df", fontSize: "0.82rem", marginBottom: 10 }}>
          <span>Fusibles de Red: {currentQIndex + 1} de {questions.length}</span>
          <span>Energía Restablecida: {Math.round(((currentQIndex) / questions.length) * 100)}%</span>
        </div>

        <h3 style={{ color: "#ffd166", marginBottom: 10, fontSize: "0.95rem", textAlign: "left", lineHeight: "1.4" }}>
          ⚡ Instructions / Instrucciones: Une los cables de cada palabra en Inglés (izquierda) con su significado correcto en Español (derecha) para restablecer la corriente del cohete.
        </h3>

        {/* Wire Deck Area */}
        <div 
          id="wire-canvas-container" 
          ref={containerRef} 
          className="wire-minigame-deck"
          style={{ maxWidth: "480px", margin: "10px auto", padding: "12px 14px", minHeight: "210px" }}
        >
          {/* SVG Canvas to render cables */}
          <svg className="wire-svg-canvas">
            {!showSolution ? (
              /* Normal Gameplay Connections */
              Object.keys(connections).map((leftIdxStr) => {
                const leftIdx = Number(leftIdxStr);
                const rightIdx = connections[leftIdx];
                const start = portCoords[`left-${leftIdx}`];
                const end = portCoords[`right-${rightIdx}`];

                if (!start || !end) return null;

                const wireColor = colors[leftNodes[leftIdx].matchIndex % colors.length];

                return (
                  <g key={`wire-${leftIdx}`}>
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke="#000"
                      strokeWidth="12"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke={wireColor}
                      strokeWidth="10"
                      strokeLinecap="round"
                      opacity="0.45"
                      style={{ filter: `blur(4px)` }}
                    />
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke={wireColor}
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.35)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="8,12"
                    />
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="6,15"
                      className="electric-flow-line"
                      style={{ filter: "drop-shadow(0 0 3px #fff)" }}
                    />
                    <circle cx={start.x} cy={start.y} r="8" fill="#ffd166">
                      <animate attributeName="r" values="4;9;4" dur="0.9s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;0.2;0.9" dur="0.9s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={end.x} cy={end.y} r="8" fill="#2ec4b6">
                      <animate attributeName="r" values="4;9;4" dur="0.9s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;0.2;0.9" dur="0.9s" repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })
            ) : (
              /* Solution Evaluation Mode: Render User Wires (Red for Wrong, Green for Right) + Solution Wires */
              leftNodes.map((lNode, lIdx) => {
                const res = evalResults[lIdx];
                if (!res) return null;

                const start = portCoords[`left-${lIdx}`];
                const userEnd = portCoords[`right-${res.userRightIdx}`];
                const correctEnd = portCoords[`right-${res.correctRightIdx}`];

                if (!start) return null;

                return (
                  <g key={`eval-group-${lIdx}`}>
                    {/* Render User Attempt Wire */}
                    {userEnd && (
                      <>
                        <path
                          d={`M ${start.x} ${start.y} C ${(start.x + userEnd.x)/2} ${start.y}, ${(start.x + userEnd.x)/2} ${userEnd.y}, ${userEnd.x} ${userEnd.y}`}
                          fill="none"
                          stroke={res.isCorrect ? "#2ec4b6" : "#ef4444"}
                          strokeWidth="8"
                          strokeLinecap="round"
                          opacity="0.85"
                          style={{ filter: `drop-shadow(0 0 8px ${res.isCorrect ? "#2ec4b6" : "#ef4444"})` }}
                        />
                        <path
                          d={`M ${start.x} ${start.y} C ${(start.x + userEnd.x)/2} ${start.y}, ${(start.x + userEnd.x)/2} ${userEnd.y}, ${userEnd.x} ${userEnd.y}`}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="4,8"
                        />
                      </>
                    )}

                    {/* If Incorrect, Render Green Dashed Solution Wire */}
                    {!res.isCorrect && correctEnd && (
                      <path
                        d={`M ${start.x} ${start.y} C ${(start.x + correctEnd.x)/2} ${start.y}, ${(start.x + correctEnd.x)/2} ${correctEnd.y}, ${correctEnd.x} ${correctEnd.y}`}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray="6,8"
                        style={{ filter: "drop-shadow(0 0 10px #10b981)" }}
                      />
                    )}
                  </g>
                );
              })
            )}

            {/* Active drawing wire line */}
            {selectedLeft !== null && portCoords[`left-${selectedLeft}`] && (
              <line
                x1={portCoords[`left-${selectedLeft}`].x}
                y1={portCoords[`left-${selectedLeft}`].y}
                x2={portCoords[`left-${selectedLeft}`].x + 40}
                y2={portCoords[`left-${selectedLeft}`].y}
                stroke="#fff"
                strokeWidth="3.5"
                strokeDasharray="6,6"
                className="electric-flow-line"
                style={{ filter: "drop-shadow(0 0 5px #ffd166)" }}
                opacity="0.85"
              />
            )}
          </svg>

          {/* Left Column Wires (English) */}
          <div className="wire-column">
            {leftNodes.map((node, idx) => {
              const isSelected = selectedLeft === idx;
              const isConnected = connections[idx] !== undefined;
              const evalItem = evalResults[idx];
              
              let wireColor = colors[node.matchIndex % colors.length];
              if (showSolution && evalItem) {
                wireColor = evalItem.isCorrect ? "#2ec4b6" : "#ef4444";
              }

              return (
                <div className="wire-node" key={`left-node-${idx}`}>
                  <div 
                    id={`left-port-${idx}`}
                    className={`wire-port ${isConnected ? "connected" : ""} ${isSelected ? "selected-port-spark" : ""}`}
                    onClick={() => handleLeftClick(idx)}
                    style={{
                      backgroundColor: isSelected ? "#fff" : wireColor,
                      boxShadow: isSelected ? `0 0 15px #fff` : `0 0 8px ${wireColor}`,
                      border: isSelected ? "3px solid #000" : "4px solid #000"
                    }}
                  />
                  <div className="wire-label" style={{ fontWeight: "bold", color: showSolution && evalItem && !evalItem.isCorrect ? "#fca5a5" : "#ffd166", fontSize: "1rem" }}>
                    🇬🇧 {node.text}
                    {showSolution && evalItem && (
                      <span style={{ marginLeft: "6px", fontSize: "0.85rem" }}>
                        {evalItem.isCorrect ? "✔️" : "❌"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column Terminals (Spanish) */}
          <div className="wire-column" style={{ alignItems: "flex-end" }}>
            {rightNodes.map((node, idx) => {
              const connectedLeftKey = Object.keys(connections).find(key => connections[key] === idx);
              const isConnected = connectedLeftKey !== undefined;
              const wireColor = isConnected ? colors[leftNodes[Number(connectedLeftKey)].matchIndex % colors.length] : "#141f32";

              return (
                <div className="wire-node" key={`right-node-${idx}`} style={{ flexDirection: "row-reverse" }}>
                  <div 
                    id={`right-port-${idx}`}
                    className={`wire-port ${isConnected ? "connected" : ""}`}
                    onClick={() => handleRightClick(idx)}
                    style={{
                      backgroundColor: wireColor,
                      boxShadow: isConnected ? `0 0 12px ${wireColor}` : "none",
                      border: "4px solid #000"
                    }}
                  />
                  <div className="wire-label" style={{ textAlign: "right", fontWeight: "bold", color: "#9be6df", fontSize: "1rem" }}>
                    🇪🇸 {node.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Normal Action buttons */}
        {!showSolution && (
          <div style={{ display: "flex", gap: 15, marginTop: 14 }}>
            <button 
              className="btn-cancel" 
              style={{ flex: 1, margin: 0, padding: "10px 16px" }} 
              onClick={() => setConnections({})}
              disabled={Object.keys(connections).length === 0 || isSuccess}
            >
              🔄 Limpiar Cables
            </button>
            <button 
              className="btn-create" 
              style={{ flex: 2, background: "linear-gradient(135deg, #2ec4b6, #26a399)", color: "#002427", margin: 0, padding: "10px 16px" }} 
              onClick={handleVerify}
              disabled={Object.keys(connections).length !== leftNodes.length || isSuccess}
            >
              ⚡ Conectar Energía
            </button>
          </div>
        )}

        {/* Feedback Mode Panel with Manual Student Control Button */}
        {showSolution && (
          <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1.5px solid #ef4444", borderRadius: "16px", padding: "20px", marginTop: "20px", textAlign: "center" }} className="animate-fadeIn">
            <div style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.15rem", marginBottom: "6px" }}>
              💥 ¡CONEXIÓN INCORRECTA REGISTRADA! (-0.75 pts)
            </div>
            <p style={{ color: "#e6f7ff", fontSize: "0.95rem", margin: "0 0 16px 0", lineHeight: "1.5" }}>
              Las conexiones en <strong style={{ color: "#ef4444" }}>rojo (❌)</strong> representan tu intento incorrecto. Las líneas punteadas en <strong style={{ color: "#10b981" }}>verde (✔️)</strong> indican la traducción correcta. Tómate el tiempo necesario para revisarlas.
            </p>
            <button
              onClick={handleNextRound}
              style={{
                padding: "16px 36px",
                background: "linear-gradient(135deg, #ffd166 0%, #ff9f1c 100%)",
                border: "none",
                borderRadius: "14px",
                color: "#0d1b2a",
                fontWeight: "900",
                fontSize: "1.1rem",
                cursor: "pointer",
                boxShadow: "0 0 25px rgba(255, 209, 102, 0.6)",
                transition: "all 0.2s ease"
              }}
            >
              💡 ENTENDIDO - CONTINUAR A LA SIGUIENTE RONDA ➔
            </button>
          </div>
        )}

        {isSuccess && (
          <div style={{ marginTop: 15, color: "#2ec4b6", fontWeight: "bold", textAlign: "center" }}>
            ✨ ¡SISTEMA RESTABLECIDO! Todas las palabras están correctamente conectadas.
          </div>
        )}
      </div>
    </div>
  );
}

SentenceLaunchGame.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string,
    questions: PropTypes.array,
    dayNumber: PropTypes.number,
    day: PropTypes.number
  }),
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  hideHeader: PropTypes.bool
};
