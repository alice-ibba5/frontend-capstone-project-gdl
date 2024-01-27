import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import {
  Canvas,
  useThree,
  extend,
  useFrame,
  useLoader,
} from "react-three-fiber";
import { useGLTF } from "@react-three/drei";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Prova3D = () => {
  extend({ OrbitControls });

  const CameraControls = () => {
    const { camera, gl } = useThree();
    const controlsRef = useRef();

    useFrame(() => controlsRef.current.update());

    return <orbitControls ref={controlsRef} args={[camera, gl.domElement]} />;
  };

  const Model = ({
    id,
    url,
    position,
    scale,
    textures,
    startAnimation,
    animationName,
  }) => {
    const { scene, animations } = useGLTF(url);
    const group = useRef();
    const mixer = useRef();

    useEffect(() => {
      if (animations && animations.length > 0 && startAnimation) {
        mixer.current = new THREE.AnimationMixer(scene);

        // Verifica se è specificato un nome di animazione
        if (animationName) {
          // Trova l'animazione desiderata per nome
          const targetAnimation = animations.find(
            (anim) => anim.name === animationName
          );

          if (targetAnimation) {
            const action = mixer.current.clipAction(targetAnimation);
            action.reset();
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.play();
          } else {
            console.error(
              `Animation "${animationName}" not found for model ${id}`
            );
          }
        } else {
          // Avvia tutte le animazioni
          animations.forEach((clip) => {
            const action = mixer.current.clipAction(clip);
            action.reset();
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.play();
          });
        }

        return () => {
          mixer.current.stopAllAction();
        };
      }
    }, [animations, scene, startAnimation, id, animationName]);

    // Log information about the animations
    console.log(`Animations for model ${id}:`, animations);

    useEffect(() => {
      if (scene) {
        scene.traverse((child) => {
          if (child.isMesh) {
            const materialName = child.material.name.toLowerCase();
            const texture = textures[materialName];
            const geometry = child.geometry;

            if (geometry.isBufferGeometry) {
              geometry.computeVertexNormals();
            }

            child.material.emissive.setHex(0x000000); // Imposta emissive su nero
            child.material.metalness = 0; // Disattiva metalness
            child.material.roughness = 1; // Disattiva roughness
            child.material.map = texture || null; // Imposta la texture o null se non è presente

            if (texture) {
              child.material.map.wrapS = THREE.RepeatWrapping;
              child.material.map.wrapT = THREE.RepeatWrapping;
              child.material.map.repeat.set(-200, -200); // Esempio di regolazione della ripetizione della texture
            }

            child.material.needsUpdate = true;
          }
        });
      }
    }, [scene, textures]);

    return (
      <group ref={group} position={position} scale={scale}>
        <primitive object={scene} />
      </group>
    );
  };

  const textures = {
    cover: useLoader(
      THREE.TextureLoader,
      `${process.env.PUBLIC_URL}/models/libro.jpg`
    ),
    page: useLoader(
      THREE.TextureLoader,
      `${process.env.PUBLIC_URL}/models/pagina-libro.jpg`
    ),
    side: useLoader(
      THREE.TextureLoader,
      `${process.env.PUBLIC_URL}/models/book-side.jpg`
    ),
    _1: useLoader(
      THREE.TextureLoader,
      `${process.env.PUBLIC_URL}/models/legno.jpg`
    ),
    pelle: new THREE.TextureLoader().load("../../assets/pelle.jpg"),
    inner: useLoader(
      THREE.TextureLoader,
      `${process.env.PUBLIC_URL}/models/book-side.jpg`
    ),
  };

  const [modelReady, setModelReady] = useState(false);
  const [libroRossoAction, setLibroRossoAction] = useState(null);

  const handleModelReady = ({ id, action }) => {
    if (id === "libroRosso") {
      setModelReady(true);
      setLibroRossoAction(action);
    }
  };

  useEffect(() => {
    if (modelReady && libroRossoAction) {
      libroRossoAction.reset().play();
    }
  }, [modelReady, libroRossoAction]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 50], fov: 50 }}
      >
        <CameraControls />

        <ambientLight intensity={1} />
        <pointLight position={[5, 20, 30]} castShadow />
        <directionalLight intensity={0.5} castShadow />

        <Model
          id="libroRosso"
          url={`${process.env.REACT_APP_BACKEND_ENDPOINT}/carica-modello`}
          position={[0, -11, 20]}
          scale={[20, 20, 20]}
          textures={textures}
          startAnimation={true}
          onModelReady={handleModelReady}
          animationName="book_animatedAction"
        />
        <Model
          url={`${process.env.REACT_APP_BACKEND_ENDPOINT}/carica-modello2`}
          position={[-30, -20, 20]}
          scale={[20, 20, 20]}
          textures={textures}
          startAnimation={false}
        />
        <Model
          url={`${process.env.REACT_APP_BACKEND_ENDPOINT}/carica-modello3`}
          position={[-102, -20, 20]}
          scale={[20, 20, 20]}
          textures={textures}
          startAnimation={false}
        />
      </Canvas>
    </div>
  );
};

export default Prova3D;
