import React from "react";
import { useAppContext } from "../context/AppContext";

export default function MaterialPanel({ isOpen }) {
  const { materials, selectedMaterial, changeMaterial } = useAppContext();

  return (
    <div
      className={`absolute bottom-6 left-20 bg-white rounded-lg shadow-lg transition-all duration-200 pointer-events-auto z-10 overflow-hidden ${
        isOpen ? "max-w-full opacity-100" : "max-w-0 opacity-0"
      }`}
    >
      <div className="p-4 flex items-center gap-3" style={{ width: "auto" }}>
        {materials.map((material) => (
          <div
            key={material.id}
            className={`flex flex-col items-center cursor-pointer transition-all w-[100px] h-[130px] ${
              selectedMaterial.id === material.id
                ? "ring-2 ring-blue-500 scale-105 border border-gray-300 rounded-md pt-1"
                : "border border-transparent"
            }`}
            onClick={() => changeMaterial(material.id)}
            title={material.name}
          >
            <div
              className="w-[88px] h-[88px] bg-center bg-cover rounded-md"
              style={{
                backgroundImage: `url(/assets/textures_new/${material.id}.jpg)`,
              }}
            />
            <div className="flex items-center justify-center text-center text-sm mt-2 w-full h-[34px] px-1 leading-snug">
              {material.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
