import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import * as THREE from "three";

// List of available materials with corrected paths
const MATERIALS = [
  { id: "Nocturne-Oak", name: "Nocturne Oak" },
  { id: "Ferro-Grafite", name: "Ferro Grafite" },
  { id: "Jarrah", name: "Jarrah" },
  { id: "Lustrous-Elm-Natural", name: "Lustrous Elm" },
  { id: "Marmo-Grigio", name: "Marmo Grigio" },
  { id: "Midnight-Oak", name: "Midnight Oak" },
  { id: "Oxidised-Beamwood", name: "Oxidised Beamwood" },
  { id: "Sepia-Walnut", name: "Sepia Walnut" },
  { id: "Smoked-Birchply-Natural", name: "Smoked Birchply" },
  { id: "Tinted-Paper-Terrazo", name: "Tinted Paper Terrazo" },
];

const preloadTextures = () => {
  const textureLoader = new THREE.TextureLoader();

  MATERIALS.forEach((material) => {
    const img = new Image();
    img.src = `/assets/textures_new/${material.id}.jpg`;

    // Also preload in three.js texture cache
    textureLoader.load(`/assets/textures_new/${material.id}.jpg`);
  });
};

const AppContext = createContext();

export function AppProvider({ children }) {
  // Current selected material
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);

  // Door state
  const [doorOpen, setDoorOpen] = useState(false);

  // Material panel state
  const [materialPanelOpen, setMaterialPanelOpen] = useState(false);

  // Preload textures on mount
  useEffect(() => {
    preloadTextures();
  }, []);

  // Toggle door state with animation
  const toggleDoor = useCallback(() => {
    setDoorOpen((prev) => !prev);
  }, []);

  // Toggle material selection panel
  const toggleMaterialPanel = useCallback(() => {
    setMaterialPanelOpen((prev) => !prev);
  }, []);

  // Change material
  const changeMaterial = useCallback((materialId) => {
    const material = MATERIALS.find((m) => m.id === materialId);
    if (material) {
      setSelectedMaterial(material);
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({
      materials: MATERIALS,
      selectedMaterial,
      doorOpen,
      materialPanelOpen,
      toggleDoor,
      toggleMaterialPanel,
      changeMaterial,
    }),
    [
      selectedMaterial,
      doorOpen,
      materialPanelOpen,
      toggleDoor,
      toggleMaterialPanel,
      changeMaterial,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
