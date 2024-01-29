import React, { useRef, useEffect, useState, useForceUpdate } from "react";
import * as THREE from "three";
import {
  Canvas,
  useThree,
  extend,
  useFrame,
  useLoader,
} from "react-three-fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Login from "./Login.js";
import Register from "./Register.js";
import "./styles.css";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import "./3DStyles.css";
import LibroAnimator from "./LIbroAnimator.js";

const Prova3D = (props) => {
  const { user, isLoggedIn } = props;
  // extend({ OrbitControls });

  const CameraControls = () => {
    const { camera, gl } = useThree();
    const controlsRef = useRef();

    // useFrame(() => controlsRef.current.update());

    // return <orbitControls ref={controlsRef} args={[camera, gl.domElement]} />;
  };

  const Libro = ({ onAnimationComplete, animationStarted }) => {
    const group = useRef();
    const gltf = useLoader(
      GLTFLoader,
      `${process.env.REACT_APP_BACKEND_ENDPOINT}/carica-modello`
    );
    const mixer = new THREE.AnimationMixer(gltf.scene);

    const objectGltf = gltf.scene;

    if (objectGltf) {
      objectGltf.scale.set(20, 20, 20);
      objectGltf.position.set(0, -11, 20);
    }

    const { scene } = useThree();
    scene.add(objectGltf);

    const animations = gltf.animations;

    useEffect(() => {
      if (!animationStarted) {
        animations.forEach((animation) => {
          const action = mixer.clipAction(animation);

          action.setLoop(THREE.LoopOnce);
          action.clampWhenFinished = true;

          action.play();
        });
      }
    }, [animationStarted, animations, mixer]);

    useFrame(() => {
      if (!animationStarted) {
        mixer.update(0.01);
        if (mixer.time >= mixer._actions[0]?._clip.duration) {
          onAnimationComplete();
        }
      }
    });

    useFrame((state, delta) => {
      if (animationStarted) {
        mixer.update(delta);
      }
    });

    useFrame((state, delta) => mixer.update(delta));

    useEffect(() => {
      if (gltf.scene) {
        gltf.scene.traverse((child) => {
          if (child.isMesh && child.material && child.material.name) {
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

            child.material.needsUpdate = true;
          }
        });
      }
    }, [gltf.scene, textures]);
  };

  const Libreria = ({ textures }) => {
    const group = useRef();
    const gltf2 = useLoader(
      GLTFLoader,
      `${process.env.REACT_APP_BACKEND_ENDPOINT}/carica-modello2`
    );
    const mixer = new THREE.AnimationMixer(gltf2.scene); // Non è necessario passare la scena

    const objectGltf2 = gltf2.scene;

    if (objectGltf2) {
      objectGltf2.scale.set(20, 20, 20);
      objectGltf2.position.set(-30, -20, 20);
    }

    // Aggiungi l'oggetto alla scena principale usando useRef
    const { scene, camera } = useThree();
    useEffect(() => {
      group.current = objectGltf2;
      scene.add(group.current);
      return () => scene.remove(group.current);
    }, [objectGltf2, scene]);

    useEffect(() => {
      if (gltf2.scene) {
        gltf2.scene.traverse((child) => {
          if (child.isMesh && child.material && child.material.name) {
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

            child.material.needsUpdate = true;
          }
        });
      }
    }, [gltf2.scene, textures]);
  };

  const Libri = ({ textures }) => {
    const group = useRef();
    const gltf3 = useLoader(
      GLTFLoader,
      `${process.env.REACT_APP_BACKEND_ENDPOINT}/carica-modello3`
    );
    const mixer = new THREE.AnimationMixer(gltf3.scene); // Non è necessario passare la scena

    const objectGltf3 = gltf3.scene;

    if (objectGltf3) {
      objectGltf3.scale.set(20, 20, 20);
      objectGltf3.position.set(-102, -20, 20);
    }

    // Aggiungi l'oggetto alla scena principale usando useRef
    const { scene, camera } = useThree();
    useEffect(() => {
      group.current = objectGltf3;
      scene.add(group.current);
      return () => scene.remove(group.current);
    }, [objectGltf3, scene]);

    const commonTexture = useLoader(
      THREE.TextureLoader,
      `${process.env.PUBLIC_URL}/models/texture-legno.jpg`
    );

    useEffect(() => {
      if (gltf3.scene) {
        gltf3.scene.traverse((child) => {
          if (child.isMesh && child.material && child.material.name) {
            console.log("Materials 3 are: ", child.material.name);
            const materialName = child.material.name;
            const texture = textures[commonTexture];
            const geometry = child.geometry;

            if (geometry.isBufferGeometry) {
              geometry.computeVertexNormals();
            }

            child.material.emissive.setHex(0x000000); // Imposta emissive su nero
            child.material.metalness = 0; // Disattiva metalness
            child.material.roughness = 1; // Disattiva roughness
            child.material.map = commonTexture || null; // Imposta la texture o null se non è presente
            child.material.normalMap = normalMap;
            child.material.needsUpdate = true;
          }
        });
      }
    }, [gltf3.scene, commonTexture]);
  };

  const normalMap = useLoader(
    THREE.TextureLoader,
    `${process.env.PUBLIC_URL}/models/normal.jpg`
  );

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
    inner: useLoader(
      THREE.TextureLoader,
      `${process.env.PUBLIC_URL}/models/pagina-libro.jpg`
    ),
  };

  const [modelReady, setModelReady] = useState(false);
  const [libroRossoMixer, setLibroRossoMixer] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [animationTriggered, setAnimationTriggered] = useState(false);

  const handleAnimationComplete = () => {
    setShowButtons(true);
    setAnimationStarted(true);
  };

  const handleLoginSubmit = () => {
    console.log("Login button clicked");
    setAnimationTriggered(true);
  };

  // Nasconde i pulsanti quando l'animazione di LibroAnimator inizia
  useEffect(() => {
    if (animationTriggered) {
      setShowButtons(false);
    }
  }, [animationTriggered]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {!user && !isLoggedIn && showButtons ? (
        <div
          id="pulsanti"
          style={{
            position: "absolute",
            top: "50%", // Imposta la posizione verticale al centro
            left: "50%", // Imposta la posizione orizzontale al centro
            transform: "translate(-50%, -50%)", // Centra il contenuto
          }}
        >
          <Container>
            <Login onLoginSubmit={handleLoginSubmit} />
            <Register onLoginSubmit={handleLoginSubmit} />
          </Container>
        </div>
      ) : (
        <Link to={`/gdl`} className="gdls-link"></Link>
      )}
      <div className="canvas-container">
        <Canvas
          style={{ width: "100%", height: "100%" }}
          camera={{ position: [0, 0, 54], fov: 50 }}
        >
          <CameraControls />

          <ambientLight intensity={0.5} />
          <pointLight position={[5, 20, 30]} castShadow />
          <directionalLight intensity={2} castShadow />

          <Libro
            textures={textures}
            onAnimationComplete={handleAnimationComplete}
            animationStarted={animationStarted}
          />
          <LibroAnimator
            onAnimationComplete={() => setAnimationTriggered(false)}
            animationStarted={animationTriggered}
          />
          <Libreria textures={textures} />
          <Libri textures={textures} />
        </Canvas>
      </div>
    </div>
  );
};

export default Prova3D;
