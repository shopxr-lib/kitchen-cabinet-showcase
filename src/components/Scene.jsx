import React, { useRef, useEffect, useMemo, useState } from "react";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAppContext } from "../context/AppContext";

// Define the minimum and maximum zoom values
const MIN_ZOOM = 1.2; // Prevent camera from entering cabinet
const MAX_ZOOM = 5; // Prevent extreme zooming out

export default function Scene() {
  const { doorOpen, selectedMaterial } = useAppContext();
  const { scene: threeScene } = useThree();

  // State to track if textures are initially loaded
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  const [cabinetMaterial, setCabinetMaterial] = useState(null);

  // Load the kitchen cabinet model with corrected path
  const { scene } = useGLTF("/assets/models/masterbenchtop-cabinet1.glb");

  // References to model parts
  const cabinetRef = useRef();
  const leftDoorRef = useRef();
  const rightDoorRef = useRef();
  const glassPartsRefs = useRef([]);
  const isMounted = useRef(true);

  // Create and configure texture loader
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);

  // Create material with the texture - moved to useMemo to prevent flickering
  useEffect(() => {
    // Full path to texture with corrected base path
    const fullPath = `/assets/textures_new/${selectedMaterial.id}.jpg`;

    // Load texture for the cabinet
    const texture = textureLoader.load(fullPath, () => {
      // Mark textures as loaded after first texture loads
      setTexturesLoaded(true);
    });

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.anisotropy = 16;

    // Create optimized material with the texture
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.6,
      metalness: 0.05,
    });

    setCabinetMaterial(material);

    // Cleanup function to dispose of the texture
    return () => {
      texture.dispose();
    };
  }, [selectedMaterial, textureLoader]);

  // Create glass material that won't get texture applied
  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      roughness: 0,
      transmission: 0.9,
      thickness: 0.05,
      envMapIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.5,
    });
  }, []);

  // Set up background color for the scene
  useEffect(() => {
    if (threeScene) {
      threeScene.background = new THREE.Color("#b2b2b2"); // Light gray background
    }
  }, [threeScene]);

  // Find door components and glass components on initial load
  useEffect(() => {
    if (!scene) return;

    const leftDoor = [];
    const rightDoor = [];
    const glassParts = [];

    // Identify doors and glass components by name or material
    scene.traverse((child) => {
      if (child.isMesh) {
        // Identify glass parts by material properties or naming conventions
        if (
          child.name.toLowerCase().includes("glass") ||
          child.name.toLowerCase().includes("window") ||
          (child.material &&
            (child.material.transparent === true ||
              child.material.transmission > 0 ||
              child.material.opacity < 1))
        ) {
          glassParts.push(child);
          glassPartsRefs.current.push(child);
          child.material = glassMaterial;
        }
        // Identify left and right doors based on position or naming
        else if (
          child.name.toLowerCase().includes("door") ||
          child.name.toLowerCase().includes("drawer") ||
          child.name.toLowerCase().includes("front")
        ) {
          if (child.position.x <= 0) {
            leftDoor.push(child);
          } else {
            rightDoor.push(child);
          }
        }
      }
    });

    // If specific identification failed, try to identify by position
    if (leftDoor.length === 0 && rightDoor.length === 0) {
      scene.traverse((child) => {
        if (child.isMesh && !glassParts.includes(child)) {
          // Identify doors by their size and position
          const box = new THREE.Box3().setFromObject(child);
          const size = new THREE.Vector3();
          box.getSize(size);

          if (size.y > size.x && size.y > size.z) {
            if (child.position.x <= 0) {
              leftDoor.push(child);
            } else {
              rightDoor.push(child);
            }
          }
        }
      });
    }

    leftDoorRef.current = leftDoor;
    rightDoorRef.current = rightDoor;

    // Store original positions/rotations for animation
    [...leftDoor, ...rightDoor].forEach((part) => {
      part.userData.originalRotation = part.rotation.y;
    });
  }, [scene, glassMaterial]);

  // Apply materials to the cabinet parts when material changes
  useEffect(() => {
    if (!cabinetRef.current || !texturesLoaded) return;

    cabinetRef.current.traverse((child) => {
      if (
        child.isMesh &&
        !child.name.includes("handle") &&
        !child.name.includes("hinge") &&
        !child.name.includes("hardware") &&
        !glassPartsRefs.current.includes(child)
      ) {
        // Apply new material to all cabinet parts except hardware and glass
        child.material = cabinetMaterial;
      }
    });
  }, [cabinetMaterial, texturesLoaded]);

  // Animation for door opening/closing with smooth transition
  useFrame((state, delta) => {
    // Calculate target rotations for both doors
    const leftTargetRotation = doorOpen ? -Math.PI / 2 : 0; // Left door target rotation
    const rightTargetRotation = doorOpen ? Math.PI / 2 : 0; // Right door target rotation

    // Animate left door and associated glass parts
    if (leftDoorRef.current && leftDoorRef.current.length > 0) {
      leftDoorRef.current.forEach((part) => {
        part.rotation.y = THREE.MathUtils.lerp(
          part.rotation.y,
          leftTargetRotation,
          delta * 5 // Increased animation speed for smoother transition
        );
      });

      // Apply the same rotation to glass parts associated with the left door
      glassPartsRefs.current.forEach((glassPart) => {
        if (glassPart.position.x <= 0) {
          // Assuming glass parts on the left side
          glassPart.rotation.y = THREE.MathUtils.lerp(
            glassPart.rotation.y,
            leftTargetRotation,
            delta * 5
          );
        }
      });
    }

    // Animate right door and associated glass parts
    if (rightDoorRef.current && rightDoorRef.current.length > 0) {
      rightDoorRef.current.forEach((part) => {
        part.rotation.y = THREE.MathUtils.lerp(
          part.rotation.y,
          rightTargetRotation,
          delta * 5
        );
      });

      // Apply the same rotation to glass parts associated with the right door
      glassPartsRefs.current.forEach((glassPart) => {
        if (glassPart.position.x > 0) {
          // Assuming glass parts on the right side
          glassPart.rotation.y = THREE.MathUtils.lerp(
            glassPart.rotation.y,
            rightTargetRotation,
            delta * 5
          );
        }
      });
    }
  });

  return (
    <>
      {/* Improved lighting for better material visibility */}
      <Environment preset="apartment" intensity={0.5} />
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[2, 4, 0]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <hemisphereLight intensity={0} color="#ffffff" groundColor="#bbbbff" />

      {/* Cabinet model */}
      <group ref={cabinetRef} position={[0, 0, 0]} receiveShadow castShadow>
        <primitive object={scene} />
      </group>

      {/* Camera controls with zoom constraints */}
      <OrbitControls
        minDistance={MIN_ZOOM}
        maxDistance={MAX_ZOOM}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />
    </>
  );
}

// Preload model with corrected path
useGLTF.preload("/assets/models/masterbenchtop-cabinet1.glb");
