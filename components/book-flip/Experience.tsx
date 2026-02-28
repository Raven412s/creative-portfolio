"use client"
import { Environment, OrbitControls } from "@react-three/drei";
import Book from "./Book";
import { JSX } from "react";

export const Experience = (): JSX.Element => {
  return (
    <>
      <Book />
      <OrbitControls enableZoom={false} />
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