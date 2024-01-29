import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";

const LibroAnimator = ({ onAnimationComplete, animationStarted }) => {
  const group = useRef();
  const gltf = useLoader(
    GLTFLoader,
    `${process.env.REACT_APP_BACKEND_ENDPOINT}/carica-modello`
  );

  const objectGltf = gltf.scene;

  if (objectGltf) {
    objectGltf.scale.set(20, 20, 20);
    objectGltf.position.set(0, -11, 20);
  }

  useEffect(() => {
    if (objectGltf) {
      group.current = objectGltf;
    }
  }, [objectGltf]);

  useEffect(() => {
    if (group.current) {
      const targetPosition = new THREE.Vector3(0, -13, 40); // Posizione finale desiderata (verso la camera)
      const startPosition = group.current.position.clone(); // Posizione iniziale del libro
      const distance = targetPosition.distanceTo(startPosition); // Distanza tra la posizione iniziale e finale

      let progress = 0;

      const updatePosition = () => {
        const easingFactor = 0.002; // Ridotto per uno spostamento più lento
        progress += easingFactor;

        if (progress <= 1) {
          const newPosition = new THREE.Vector3().lerpVectors(
            startPosition,
            targetPosition,
            progress
          );
          group.current.position.copy(newPosition);
        } else {
          // Animazione completata
          onAnimationComplete();
        }
      };

      if (animationStarted) {
        // Avvia l'animazione di spostamento
        const frameId = requestAnimationFrame(function animate() {
          updatePosition();
          frameId && requestAnimationFrame(animate);
        });

        return () => cancelAnimationFrame(frameId);
      }
    }
  }, [animationStarted, onAnimationComplete]);

  return null; // Non renderizzare nulla direttamente, il componente si occupa solo dell'animazione
};

export default LibroAnimator;
