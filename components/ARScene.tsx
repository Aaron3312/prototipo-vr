"use client";
import { useEffect, useState } from "react";

type Layer = "electrico" | "fontaneria" | "acabados";

const LAYERS: { id: Layer; label: string; color: string; emoji: string }[] = [
  { id: "electrico", label: "Eléctrico", color: "#FBBF24", emoji: "⚡" },
  { id: "fontaneria", label: "Fontanería", color: "#60A5FA", emoji: "💧" },
  { id: "acabados", label: "Acabados", color: "#34D399", emoji: "🏠" },
];

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export default function ARScene() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [activeLayers, setActiveLayers] = useState<Record<Layer, boolean>>({
    electrico: true,
    fontaneria: true,
    acabados: true,
  });
  const [targetFound, setTargetFound] = useState(false);

  useEffect(() => {
    (async () => {
      await loadScript("https://aframe.io/releases/1.5.0/aframe.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js");
      setScriptsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!scriptsLoaded) return;
    const scene = document.querySelector("a-scene");
    const onFound = () => setTargetFound(true);
    const onLost = () => setTargetFound(false);
    scene?.addEventListener("markerFound", onFound);
    scene?.addEventListener("markerLost", onLost);
    return () => {
      scene?.removeEventListener("markerFound", onFound);
      scene?.removeEventListener("markerLost", onLost);
    };
  }, [scriptsLoaded]);

  const toggleLayer = (layer: Layer) => {
    setActiveLayers((prev) => {
      const next = { ...prev, [layer]: !prev[layer] };
      const el = document.getElementById(`layer-${layer}`);
      if (el) el.setAttribute("visible", String(next[layer]));
      return next;
    });
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Escena AR — solo se renderiza cuando los scripts están listos */}
      {scriptsLoaded && (
        // @ts-expect-error a-scene is a custom element
        <a-scene
          mindar-image="imageTargetSrc: /targets/plano.mind; autoStart: true;"
          color-space="sRGB"
          renderer="colorManagement: true"
          vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false"
          embedded
          style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
        >
          {/* @ts-expect-error a-assets */}
          <a-assets>
            <img id="img-plano"      src="/layers/plano-base.svg" />
            <img id="img-electrico"  src="/layers/electrico.svg" />
            <img id="img-fontaneria" src="/layers/fontaneria.svg" />
            <img id="img-acabados"   src="/layers/acabados.svg" />
          {/* @ts-expect-error a-assets */}
          </a-assets>

          {/* @ts-expect-error a-camera */}
          <a-camera position="0 0 0" look-controls="enabled: false" />

          {/* @ts-expect-error a-entity target */}
          <a-entity mindar-image-target="targetIndex: 0">
            {/* @ts-expect-error a-image */}
            <a-image src="#img-plano"      position="0 0 0"     width="1" height="1" />
            {/* @ts-expect-error a-image */}
            <a-image id="layer-electrico"  src="#img-electrico"  position="0 0 0.001" width="1" height="1" visible="true" />
            {/* @ts-expect-error a-image */}
            <a-image id="layer-fontaneria" src="#img-fontaneria" position="0 0 0.002" width="1" height="1" visible="true" />
            {/* @ts-expect-error a-image */}
            <a-image id="layer-acabados"   src="#img-acabados"   position="0 0 0.003" width="1" height="1" visible="true" />
          {/* @ts-expect-error a-entity */}
          </a-entity>
        {/* @ts-expect-error a-scene */}
        </a-scene>
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none z-10">
        <div className="flex items-center justify-between">
          <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur">
            AR Planos
          </div>
          {scriptsLoaded && (
            targetFound ? (
              <div className="bg-green-500/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur">
                Plano detectado ✓
              </div>
            ) : (
              <div className="bg-yellow-500/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur animate-pulse">
                Apunta al plano impreso
              </div>
            )
          )}
        </div>
      </div>

      {/* Botones de capas */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 px-4 z-10">
        {LAYERS.map(({ id, label, color, emoji }) => (
          <button
            key={id}
            onClick={() => toggleLayer(id)}
            className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl text-sm font-semibold backdrop-blur transition-all duration-200 shadow-lg ${
              activeLayers[id] ? "scale-105" : "bg-black/40 text-white/50 scale-95"
            }`}
            style={activeLayers[id] ? { backgroundColor: color + "CC", color: "white", border: `2px solid ${color}` } : {}}
          >
            <span className="text-xl">{emoji}</span>
            <span>{label}</span>
            <span className="text-xs opacity-75">{activeLayers[id] ? "ON" : "OFF"}</span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {!scriptsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
          <div className="text-white text-center space-y-4">
            <div className="text-5xl animate-spin">⚙️</div>
            <p className="text-lg font-medium">Cargando AR...</p>
            <p className="text-sm text-white/50">Puede tomar unos segundos</p>
          </div>
        </div>
      )}
    </div>
  );
}
