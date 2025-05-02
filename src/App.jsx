import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { AppProvider } from "./context/AppContext";
import * as THREE from "three";
import Scene from "./components/Scene";
import UI from "./components/UI";

// List of materials paths to preload with corrected paths
const texturePaths = [
  "Nocturne-Oak",
  "Ferro-Grafite",
  "Jarrah",
  "Lustrous-Elm-Natural",
  "Marmo-Grigio",
  "Midnight-Oak",
  "Oxidised-Beamwood",
  "Sepia-Walnut",
  "Smoked-Birchply-Natural",
  "Tinted-Paper-Terrazo",
].map((id) => `/assets/textures_new/${id}.jpg`);

function App() {
  useEffect(() => {
    texturePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
    });
  }, []);

  return (
    <AppProvider>
      <div className="relative w-full h-[100dvh] bg-gray-200 overflow-hidden">
        {/* 3D Canvas */}
        <Canvas
          shadows
          camera={{ position: [0, 0.5, 2], fov: 50 }}
          className="w-full h-full"
          dpr={[1, 2]} // Optimize performance
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.5,
          }}
        >
          <color attach="background" args={["#e0e0e0"]} />
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>

        {/* UI Elements */}
        <UI />

        {/* Branding */}
        <div className="absolute bottom-4 w-full font-medium text-center flex items-center justify-center text-gray-800">
          Powered by
          <img
            src="/assets/ShopXRLogo.png"
            alt="ShopXR"
            className="h-4 ml-1"
            style={{
              maxWidth: "80px",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
