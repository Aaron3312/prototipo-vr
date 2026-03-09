"use client";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";

type Layer = "electrico" | "fontaneria" | "acabados";

const LAYERS: { id: Layer; label: string; color: string; emoji: string }[] = [
  { id: "electrico", label: "Eléctrico", color: "#FBBF24", emoji: "⚡" },
  { id: "fontaneria", label: "Fontanería", color: "#60A5FA", emoji: "💧" },
  { id: "acabados", label: "Acabados", color: "#34D399", emoji: "🏠" },
];

export default function ARScene() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [activeLayers, setActiveLayers] = useState<Record<Layer, boolean>>({
    electrico: true,
    fontaneria: true,
    acabados: true,
  });
  const [targetFound, setTargetFound] = useState(false);
  const sceneRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!scriptsLoaded) return;

    const scene = document.querySelector("a-scene");
    sceneRef.current = scene as HTMLElement;

    const onTargetFound = () => setTargetFound(true);
    const onTargetLost = () => setTargetFound(false);

    scene?.addEventListener("markerFound", onTargetFound);
    scene?.addEventListener("markerLost", onTargetLost);

    return () => {
      scene?.removeEventListener("markerFound", onTargetFound);
      scene?.removeEventListener("markerLost", onTargetLost);
    };
  }, [scriptsLoaded]);

  const toggleLayer = (layer: Layer) => {
    const newState = !activeLayers[layer];
    setActiveLayers((prev) => ({ ...prev, [layer]: newState }));

    const el = document.getElementById(`layer-${layer}`);
    if (el) el.setAttribute("visible", String(newState));
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Scripts MindAR + A-Frame via CDN */}
      <Script
        src="https://aframe.io/releases/1.5.0/aframe.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          const mindScript = document.createElement("script");
          mindScript.src =
            "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js";
          mindScript.onload = () => setScriptsLoaded(true);
          document.head.appendChild(mindScript);
        }}
      />

      {/* Escena AR */}
      {/* @ts-expect-error a-scene is a custom element */}
      <a-scene
        mindar-image="imageTargetSrc: /targets/plano.mind; autoStart: true;"
        color-space="sRGB"
        renderer="colorManagement: true; physicallyCorrectLights: true"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        embedded
        style={{ width: "100%", height: "100%" }}
      >
        {/* @ts-expect-error a-assets is a custom element */}
        <a-assets>
          <img id="img-plano" src="/layers/plano-base.png" />
          <img id="img-electrico" src="/layers/electrico.png" />
          <img id="img-fontaneria" src="/layers/fontaneria.png" />
          <img id="img-acabados" src="/layers/acabados.png" />
          {/* @ts-expect-error a-assets closing */}
        </a-assets>

        {/* @ts-expect-error a-camera is a custom element */}
        <a-camera position="0 0 0" look-controls="enabled: false" />

        {/* Target 0: el plano impreso */}
        {/* @ts-expect-error a-entity is a custom element */}
        <a-entity mindar-image-target="targetIndex: 0">
          {/* Plano base */}
          {/* @ts-expect-error a-entity is a custom element */}
          <a-image
            src="#img-plano"
            position="0 0 0"
            width="1"
            height="1"
          />

          {/* Capa eléctrico */}
          {/* @ts-expect-error a-entity is a custom element */}
          <a-image
            id="layer-electrico"
            src="#img-electrico"
            position="0 0 0.001"
            width="1"
            height="1"
            visible="true"
          />

          {/* Capa fontanería */}
          {/* @ts-expect-error a-entity is a custom element */}
          <a-image
            id="layer-fontaneria"
            src="#img-fontaneria"
            position="0 0 0.002"
            width="1"
            height="1"
            visible="true"
          />

          {/* Capa acabados */}
          {/* @ts-expect-error a-entity is a custom element */}
          <a-image
            id="layer-acabados"
            src="#img-acabados"
            position="0 0 0.003"
            width="1"
            height="1"
            visible="true"
          />
          {/* @ts-expect-error a-entity is a custom element */}
        </a-entity>
        {/* @ts-expect-error a-scene is a custom element */}
      </a-scene>

      {/* UI superpuesta */}
      <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none">
        <div className="flex items-center justify-between">
          <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur">
            AR Planos Constructor
          </div>
          {targetFound && (
            <div className="bg-green-500/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur">
              Plano detectado
            </div>
          )}
          {!targetFound && (
            <div className="bg-yellow-500/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur animate-pulse">
              Apunta al plano
            </div>
          )}
        </div>
      </div>

      {/* Botones de capas */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 px-4">
        {LAYERS.map(({ id, label, color, emoji }) => (
          <button
            key={id}
            onClick={() => toggleLayer(id)}
            className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl text-sm font-semibold backdrop-blur transition-all duration-200 shadow-lg ${
              activeLayers[id]
                ? "text-white shadow-lg scale-105"
                : "bg-black/40 text-white/50 scale-95"
            }`}
            style={
              activeLayers[id]
                ? { backgroundColor: color + "CC", borderColor: color, borderWidth: 2 }
                : {}
            }
          >
            <span className="text-xl">{emoji}</span>
            <span>{label}</span>
            <span className="text-xs opacity-75">{activeLayers[id] ? "ON" : "OFF"}</span>
          </button>
        ))}
      </div>

      {/* Instrucciones iniciales si no hay scripts */}
      {!scriptsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white text-center">
            <div className="text-4xl mb-4 animate-spin">⚙️</div>
            <p className="text-lg">Cargando experiencia AR...</p>
          </div>
        </div>
      )}
    </div>
  );
}
