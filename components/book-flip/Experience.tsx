"use client"
import { Environment, OrbitControls } from "@react-three/drei";
import { TOUCH } from "three";
import Book from "./Book";
import { JSX } from "react";

export const Experience = (): JSX.Element => {
  return (
    <>
      <Book />
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        screenSpacePanning={true}    // pan screen ke plane mein hoga, natural lagega
        panSpeed={0.6}               // pan thoda slow rakho taaki accidental na ho
        zoomSpeed={0.6}
        minDistance={2}              // zyada paas na aaye
        maxDistance={3.5}              // zyada door na jaye
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        // vertical pan band karo — sirf horizontal allow karo
        touches={{
          ONE: TOUCH.ROTATE,    // ROTATE (single finger)
          TWO: TOUCH.DOLLY_PAN,  // DOLLY_PAN (pinch = zoom, two finger drag = pan)
        }}
      />
      <Environment preset="studio" />
      <directionalLight
        position={[2, 5, 2]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.3} />
      </mesh>
    </>
  );
};