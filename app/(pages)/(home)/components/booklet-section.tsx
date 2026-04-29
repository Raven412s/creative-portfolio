"use client"
import React from 'react'
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "@/components/book-flip/Experience";
import { UI } from "@/components/book-flip/UI";
import { ResponsiveCamera } from '@/components/book-flip/responsive-camera';

const BookletSection = () => {
    return (
        <section id="bookflip-3D" className="h-screen w-full relative pointer-events-none bg-background">
            <UI />
            <Loader />
            <Canvas
                shadows
                className="pointer-events-auto h-1/2"  // yeh add karo
                style={{ touchAction: 'none' }}   // yeh bhi
            >
                <ResponsiveCamera />
                <group position-y={0} >
                    <Suspense fallback={null}>
                        <Experience />
                    </Suspense>
                </group>
            </Canvas>
        </section>
    )
}

export default BookletSection