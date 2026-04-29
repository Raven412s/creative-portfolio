"use client"

import { Environment, Float, Merged, useGLTF } from '@react-three/drei'
import { Canvas } from "@react-three/fiber"
import React, { createContext, Suspense, useContext, useMemo } from 'react'
import * as THREE from 'three'
import { GLTF } from 'three-stdlib'

// Define the type of instances based on the GLTF nodes
type GLTFResult = GLTF & {
  nodes: {
    ['React-Logo_Material002_0']: THREE.Mesh
  }
  materials: {
    ['Material.002']: THREE.MeshStandardMaterial
  }
}

/**
 * HERE'S THE TRICK: 
 * We extract the type of instance components that Merged generates.
 * 'InstanceProps' is the type that defines what properties each logo can receive (position, rotation, scale, etc.)
 */
import { InstanceProps } from '@react-three/drei'

// Define that our context is an object where each value is a React component
// that accepts the properties of a Drei instance.
type ContextType = Record<string, React.FC<InstanceProps>>

const context = createContext<ContextType | null>(null)

export function Instances({ children, ...props }: { children: React.ReactNode } & React.ComponentPropsWithoutRef<'group'>) {
  const { nodes } = useGLTF('/react_logo.glb') as unknown as GLTFResult
  
  const instances = useMemo(
    () => ({
      ReactLogoMaterial: nodes['React-Logo_Material002_0'],
    }),
    [nodes]
  )

  return (
    <Merged meshes={instances} {...props}>
      {(instanceComponents: ContextType) => (
        <context.Provider value={instanceComponents}>
          {children}
        </context.Provider>
      )}
    </Merged>
  )
}

export function Model(props: React.ComponentPropsWithoutRef<'group'>) {
  const instances = useContext(context)
  
  if (!instances) {
    throw new Error("Model must be used within an <Instances> component")
  }

  // Ahora 'ReactLogoMaterial' tiene el tipo exacto React.FC<InstanceProps>
  const ReactLogoMaterial = instances.ReactLogoMaterial

  return (
    <group {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={0.01}>
          <group name="RootNode">
            <group
              name="React-Logo"
              position={[0, 7.935, 18.102]}
              rotation={[0, 0, -Math.PI / 2]}
              scale={[39.166, 39.166, 52.734]}
            >
              {/* No marcará error porque InstanceProps permite las props estándar de Three */}
              <ReactLogoMaterial />
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/react_logo.glb')


interface ReactModelProps {
  className?: string
  scale?: number
}

export const ReactModel = ({ className = '', scale = 1 }: ReactModelProps = {}) => {
    return (
        <Canvas
                  camera={{ position: [0, 40, 20], fov: 10 }}
                  gl={{ antialias: true }}
                  className={`w-full h-full ${className}`}
                >
                  <Suspense fallback={null}>
                    <Environment preset="night" />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[80, 30, 20]} angle={9.9} penumbra={1} />
                    
                    <Float speed={2} rotationIntensity={1.3} floatIntensity={2}>
                      <Instances>
                        <Model scale={scale} />
                      </Instances>
                    </Float>
                  </Suspense>
                </Canvas>
    )
}