"use client"

import { Environment, Float, Merged, useGLTF } from '@react-three/drei'
import { Canvas } from "@react-three/fiber"
import React, { createContext, Suspense, useContext, useMemo } from 'react'
import * as THREE from 'three'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    TypeScriptsvg001: THREE.Mesh
    TypeScriptsvg001_1: THREE.Mesh
  }
  materials: {
    blue: THREE.MeshStandardMaterial
    white: THREE.MeshStandardMaterial
  }
}

type InstancesContextType = Record<string, unknown>

const context = createContext<InstancesContextType | null>(null)

export function Instances({ children, ...props }: { children: React.ReactNode } & React.ComponentPropsWithoutRef<'group'>) {
  const { nodes } = useGLTF('/ts-logo.glb') as unknown as GLTFResult
  const instances = useMemo(
    () => ({
      TypeScriptsvg: nodes.TypeScriptsvg001,
      TypeScriptsvg1: nodes.TypeScriptsvg001_1,
    }),
    [nodes]
  )
  return (
    <Merged meshes={instances} {...props}>
      {(instances) => (
        <context.Provider value={instances}>
          {children}
        </context.Provider>
      )}
    </Merged>
  )
}

export function Model(props: React.ComponentPropsWithoutRef<'group'>) {
  const instances = useContext(context) as Record<string, React.ComponentType>

  if (!instances) {
    return null
  }

  const TypeScriptsvg = instances.TypeScriptsvg
  const TypeScriptsvg1 = instances.TypeScriptsvg1

  return (
    <group {...props} dispose={null}>
      <group name="Scene">
        <group name="TypeScript">
          <TypeScriptsvg />
          <TypeScriptsvg1 />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/ts-logo.glb')

interface TypeScriptModelProps {
  className?: string
  scale?: number
}

export const TypeScriptModel = ({
  className = '',
  scale = 9.5
}: TypeScriptModelProps = {}) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 2], fov: 35 }}
      gl={{ antialias: true }}
      className={`w-full h-full ${className}`}
    >
      <Suspense fallback={null}>

        {/* ✅ Lighting similar to GLTF viewer */}
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} intensity={1.5} />

        <Environment preset="studio" />

        {/* ✅ Center + correct scale */}
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={1.2}>
          <group scale={scale} rotation={[0.3, -0.1, 0]}>
            <Instances>
              <Model />
            </Instances>
          </group>
        </Float>


      </Suspense>
    </Canvas>
  )
}