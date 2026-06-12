import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  ShoppingBag,
  Zap,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Plus,
  X,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { products } from "@/data/products";

// Import generated assets
import berriesImg from "@/assets/seabuckthorn_berries.png";
import oilImg from "@/assets/oil_extraction.png";
import capsulesImg from "@/assets/seabuckthorn_capsules_luxury.png";

interface Scene {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  accentColor: string;
  duration: number; // in seconds
}

const SCENES: Scene[] = [
  {
    id: 0,
    title: "High-Altitude Purity",
    subtitle: "1. Raw Himalayan Origins",
    description:
      "Sourced from wild sea buckthorn berries growing above 12,000 feet, where intense sunlight and extreme cold concentrate active nutrients.",
    image: berriesImg,
    accentColor: "from-orange-500/30 to-amber-500/20",
    duration: 5,
  },
  {
    id: 1,
    title: "Supercritical Extraction",
    subtitle: "2. Preserving Nature's Wisdom",
    description:
      "Our proprietary cold-press process extracts pure oil drop-by-drop without heat or solvents, retaining 190+ highly bioactive compounds.",
    image: oilImg,
    accentColor: "from-amber-600/30 to-yellow-500/20",
    duration: 5,
  },
  {
    id: 2,
    title: "Ultimate Bio-Vitality",
    subtitle: "3. Pure Omega-7 Softgels",
    description:
      "Packed with rare Omega-7, essential fatty acids (3, 6, 9), and powerful antioxidants in a plant-based vegan capsule for cellular renewal.",
    image: capsulesImg,
    accentColor: "from-orange-600/30 to-yellow-600/20",
    duration: 5,
  },
];

interface Hotspot {
  id: number;
  x: string; // percentage from left
  y: string; // percentage from top
  title: string;
  description: string;
  benefit: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 1,
    x: "48%",
    y: "35%",
    title: "Rare Omega-7",
    description:
      "Provides ultra-rich palmitoleic acid, a rare nutrient vital for deeply hydrating mucosal membranes and promoting radiant skin elasticity.",
    benefit: "Collagen & Hydration Booster",
  },
  {
    id: 2,
    x: "35%",
    y: "65%",
    title: "100% Organic Oil Extract",
    description:
      "Supercritical CO2 extracted seed and berry oil blend. Completely unrefined, gluten-free, and contains no synthetic fillers.",
    benefit: "Maximum Cellular Purity",
  },
  {
    id: 3,
    x: "62%",
    y: "55%",
    title: "Vegan Shell",
    description:
      "Hypromellose-based, fast-dissolving capsule shell. Optimizes nutrient absorption in the stomach and protects delicate oils from oxidation.",
    benefit: "Vegan & Rapid Absorption",
  },
  {
    id: 4,
    x: "50%",
    y: "80%",
    title: "190+ Bioactive Nutrients",
    description:
      "A natural powerhouse combining vitamins A, B1, B2, B6, C, and E, with high levels of beta-carotene and essential fatty acids 3, 6, and 9.",
    benefit: "Total Body Defense System",
  },
];

export function SeaBuckthornVideo() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCinematic, setIsCinematic] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const { addToCart } = useCart();
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const totalDuration = SCENES.reduce((acc, scene) => acc + scene.duration, 0); // 30s
  const currentSeconds = (progress / 100) * totalDuration;

  // Handle automatic progress playback
  useEffect(() => {
    if (isPlaying) {
      const updateInterval = 100; // update progress every 100ms
      const increment = (updateInterval / (totalDuration * 1000)) * 100;

      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          const next = prev + increment;
          if (next >= 100) {
            return 0; // Loop back
          }
          return next;
        });
      }, updateInterval);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, totalDuration]);

  // Sync active scene index with progress
  useEffect(() => {
    const sceneIdx = Math.min(Math.floor((progress / 100) * SCENES.length), SCENES.length - 1);
    if (sceneIdx !== activeSceneIdx) {
      setActiveSceneIdx(sceneIdx);
      // Close hotspot popup when scene changes to keep UI clean
      setActiveHotspot(null);
    }
  }, [progress, activeSceneIdx]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newProgress = Math.max(0, Math.min(100, (clickX / width) * 100));
    setProgress(newProgress);
  };

  const handlePrevScene = () => {
    const prevIdx = (activeSceneIdx - 1 + SCENES.length) % SCENES.length;
    setProgress((prevIdx / SCENES.length) * 100 + 1); // offset slightly to land inside scene
  };

  const handleNextScene = () => {
    const nextIdx = (activeSceneIdx + 1) % SCENES.length;
    setProgress((nextIdx / SCENES.length) * 100 + 1);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleAddToCart = () => {
    const product = products.find((p) => p.id === "sea-buckthorn-capsules");
    if (product) {
      addToCart(product);
    }
  };

  return (
    <div
      className={`relative transition-all duration-700 ${isCinematic ? "bg-slate-950 py-16 text-white" : "bg-gradient-to-b from-orange-50/50 via-white to-white py-16 md:py-24"}`}
    >
      {/* Background cinematic overlay */}
      {isCinematic && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-10 transition-opacity duration-500" />
      )}

      <div
        className={`container mx-auto px-6 relative transition-all duration-500 ${isCinematic ? "z-20 max-w-6xl" : "max-w-7xl"}`}
      >
        {/* Header Title Section */}
        <div className="text-center mb-12 relative">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-4 border border-orange-200 shadow-sm animate-pulse">
            <Sparkles className="h-3.5 w-3.5 text-orange-600 fill-orange-400" />
            Featured Presentation
          </span>
          <h2
            className={`font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight ${isCinematic ? "text-white" : "text-slate-900"}`}
          >
            Sourcing <span className="text-orange-600 italic font-light">Natural Radiance</span>
          </h2>
          <p
            className={`mt-4 text-lg max-w-2xl mx-auto font-light ${isCinematic ? "text-slate-300" : "text-slate-600"}`}
          >
            Journey into the pristine high altitudes to witness how our premium Sea Buckthorn
            Capsules are harvested, extracted, and crafted to encapsulate life's vitality.
          </p>
        </div>

        {/* Video Player & Smart TV Ambient Glow Wrapper */}
        <div className="relative group/player rounded-[32px] md:rounded-[40px] overflow-hidden bg-slate-950 border border-slate-800/80 shadow-elegant transition-all duration-700">
          {/* Smart Ambient TV Glow (Pulsating lighting color matching current scene) */}
          <div className="absolute -inset-10 bg-gradient-to-r from-orange-600/10 to-amber-500/10 opacity-70 blur-[80px] rounded-full pointer-events-none group-hover/player:opacity-100 transition-opacity duration-700 animate-pulse" />

          <div className="relative aspect-video w-full overflow-hidden z-10 bg-black flex items-center justify-center">
            {/* The Ken Burns Panning Image Slideshow */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSceneIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full select-none"
              >
                <img
                  src={SCENES[activeSceneIdx].image}
                  alt={SCENES[activeSceneIdx].title}
                  className={`w-full h-full object-cover opacity-95 transition-transform duration-[6000ms] ease-out ${isPlaying ? "scale-105" : "scale-100"}`}
                />

                {/* Visual Overlay Shading */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/35" />
                <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black/55 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Audio Wave Visualizer Simulation when Playing & not Muted */}
            {isPlaying && !isMuted && (
              <div className="absolute top-8 right-8 flex items-end gap-1 h-6 z-20 opacity-80 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
                {[0.8, 0.4, 0.9, 0.3, 0.7, 0.5, 0.8].map((height, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ["4px", `${height * 18}px`, "4px"] }}
                    transition={{ repeat: Infinity, duration: 0.8 + i * 0.15, ease: "easeInOut" }}
                    className="w-[2px] bg-orange-400 rounded-full"
                  />
                ))}
              </div>
            )}

            {/* Glowing Hotspots (Scene 3 - Capsules focus or explicit exploration toggle) */}
            <AnimatePresence>
              {showHotspots && activeSceneIdx === 2 && (
                <div className="absolute inset-0 z-30">
                  {HOTSPOTS.map((hotspot) => {
                    const isActive = activeHotspot?.id === hotspot.id;
                    return (
                      <div
                        key={hotspot.id}
                        className="absolute"
                        style={{ left: hotspot.x, top: hotspot.y }}
                      >
                        {/* Interactive Ripple Ring */}
                        <button
                          onClick={() => setActiveHotspot(isActive ? null : hotspot)}
                          className="relative flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold cursor-pointer group shadow-lg border border-white/50 focus:outline-none transition-transform hover:scale-125 z-40"
                        >
                          <Plus
                            className={`h-4 w-4 transition-transform duration-300 ${isActive ? "rotate-45" : ""}`}
                          />

                          {/* Pulsing ring animation */}
                          <span className="absolute -inset-2.5 rounded-full border border-orange-400 animate-ping opacity-60" />
                          <span className="absolute -inset-4 rounded-full border border-orange-400/40 animate-pulse" />
                        </button>

                        {/* Interactive Popup Box */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 10 }}
                              className="absolute left-10 top-1/2 -translate-y-1/2 w-64 bg-slate-950/90 backdrop-blur-lg border border-orange-500/40 rounded-2xl p-4 text-white shadow-2xl z-50 animate-in fade-in"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded-full">
                                  {hotspot.benefit}
                                </span>
                                <button
                                  onClick={() => setActiveHotspot(null)}
                                  className="text-white/40 hover:text-white transition"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <h4 className="font-bold text-sm mb-1">{hotspot.title}</h4>
                              <p className="text-xs text-white/70 leading-relaxed font-light">
                                {hotspot.description}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>

            {/* Ambient Title & Subtitle Slides (Left Side Overlay) */}
            <div className="absolute left-8 md:left-12 bottom-20 max-w-xl z-20 text-left pointer-events-none select-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSceneIdx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="space-y-3"
                >
                  <span className="inline-block px-3 py-1 rounded bg-orange-500/80 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-widest">
                    {SCENES[activeSceneIdx].subtitle}
                  </span>
                  <h3 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight leading-none drop-shadow-md">
                    {SCENES[activeSceneIdx].title}
                  </h3>
                  <p className="text-sm md:text-base text-white/80 leading-relaxed font-light drop-shadow-sm line-clamp-3">
                    {SCENES[activeSceneIdx].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dark screen Play overlay when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/45 z-20 flex items-center justify-center backdrop-blur-[2px] transition-all">
                <button
                  onClick={handlePlayPause}
                  className="w-20 h-20 rounded-full bg-orange-500/90 text-white flex items-center justify-center hover:bg-orange-600 transition shadow-2xl hover:scale-110 active:scale-95"
                >
                  <Play className="h-9 w-9 fill-white ml-1 text-white" />
                </button>
              </div>
            )}

            {/* Custom Interactive UI Video Controls Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 z-30 transition-all duration-300">
              {/* Custom Scrubable Timeline Scrubber */}
              <div
                className="group/timeline relative h-1.5 w-full bg-white/20 rounded-full cursor-pointer mb-5 transition-all hover:h-2"
                onClick={handleScrub}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-orange-600 to-amber-400 rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  {/* Glowing scrub indicator */}
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full border border-orange-500 shadow-md scale-0 group-hover/timeline:scale-100 transition-transform duration-200" />
                </div>

                {/* Timeline Scene Markers */}
                <div className="absolute inset-0 flex justify-between pointer-events-none">
                  <div className="w-0.5 h-full bg-white/30" style={{ marginLeft: "33.3%" }} />
                  <div className="w-0.5 h-full bg-white/30" style={{ marginLeft: "66.6%" }} />
                </div>
              </div>

              {/* Action Buttons Panel */}
              <div className="flex items-center justify-between text-white select-none">
                <div className="flex items-center gap-4">
                  {/* Play / Pause button */}
                  <button
                    onClick={handlePlayPause}
                    className="p-2 rounded-full hover:bg-white/10 transition"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 fill-white" />
                    )}
                  </button>

                  {/* Previous Scene */}
                  <button
                    onClick={handlePrevScene}
                    className="p-2 rounded-full hover:bg-white/10 transition"
                    aria-label="Previous Scene"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Next Scene */}
                  <button
                    onClick={handleNextScene}
                    className="p-2 rounded-full hover:bg-white/10 transition"
                    aria-label="Next Scene"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Sound Volume Mute Button */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full hover:bg-white/10 transition"
                    aria-label="Toggle Sound"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>

                  {/* Duration Time Display */}
                  <span className="text-xs font-mono text-white/80 select-none">
                    {formatTime(currentSeconds)} / {formatTime(totalDuration)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Interactive hotspots explorer toggle button */}
                  {activeSceneIdx === 2 && (
                    <button
                      onClick={() => setShowHotspots(!showHotspots)}
                      className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition border ${
                        showHotspots
                          ? "bg-orange-500/20 border-orange-500/40 text-orange-300"
                          : "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {showHotspots ? "Hide Hotspots" : "Show Hotspots"}
                    </button>
                  )}

                  {/* Cinematic ambient TV lighting dimmer toggle */}
                  <button
                    onClick={() => setIsCinematic(!isCinematic)}
                    className={`p-2 rounded-full transition ${isCinematic ? "bg-orange-500/20 text-orange-400" : "hover:bg-white/10"}`}
                    aria-label="Toggle Cinematic Mode"
                    title="Toggle Cinematic Mode"
                  >
                    <Sparkles className="h-5 w-5" />
                  </button>

                  {/* Mock Fullscreen toggle */}
                  <button
                    onClick={() => setIsCinematic(!isCinematic)}
                    className="p-2 rounded-full hover:bg-white/10 transition"
                    aria-label="Toggle Fullscreen"
                  >
                    {isCinematic ? (
                      <Minimize2 className="h-5 w-5" />
                    ) : (
                      <Maximize2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic Under-Player Highlights Cards & Instant Actions */}
      </div>
    </div>
  );
}
