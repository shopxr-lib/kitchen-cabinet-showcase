import React from "react";
import { FiLayers } from "react-icons/fi";
import { useAppContext } from "../context/AppContext";
import MaterialPanel from "../components/MaterialPlane";

export default function UI() {
  const { toggleDoor, materialPanelOpen, toggleMaterialPanel } =
    useAppContext();

  // Handle door toggle
  const handleDoorToggle = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    toggleDoor();
  };

  // Handle material panel toggle
  const handleMaterialToggle = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    toggleMaterialPanel();
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Door Control Button */}
      <div className="absolute top-6 left-6 pointer-events-auto z-20">
        <button
          onClick={handleDoorToggle}
          className="bg-white p-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle Cabinet Door"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={24}
            height={24}
            color={"#000000"}
            fill={"none"}
          >
            <path
              d="M6 18L5 21M18 18L19 21"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 18H8C5.17157 18 3.75736 18 2.87868 17.0586C2 16.1171 2 14.6019 2 11.5714V9.42857C2 6.39811 2 4.88289 2.87868 3.94144C3.75736 3 5.17157 3 8 3H16C18.8284 3 20.2426 3 21.1213 3.94144C22 4.88289 22 6.39811 22 9.42857V11.5714C22 14.6019 22 16.1171 21.1213 17.0586C20.2426 18 18.8284 18 16 18Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.5 14H21.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 3L12 14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 9L9 8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 9L15 8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Material Selection Button */}
      <div className="absolute bottom-6 left-6 pointer-events-auto z-20">
        <button
          onClick={handleMaterialToggle}
          className="bg-white p-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Material Selection"
        >
          <FiLayers size={24} />
        </button>
      </div>

      {/* Material Selection Panel */}
      <MaterialPanel isOpen={materialPanelOpen} />
    </div>
  );
}
