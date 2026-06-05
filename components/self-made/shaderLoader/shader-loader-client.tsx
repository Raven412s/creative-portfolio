'use client';

import React, {
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
    useCallback,
} from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { vertexShader, fragmentShader } from './shaders';
import { ShaderLoaderProps, ShaderLoaderRef, ShaderUniforms } from './types';
import styles from './shaderLoader.module.css';

// ---------------------------------------------------------------------------
// Utility: detect WebGL support
// ---------------------------------------------------------------------------
function isWebGLSupported(): boolean {
    try {
        const canvas = document.createElement('canvas');
        return !!(
            canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        );
    } catch {
        return false;
    }
}

// ---------------------------------------------------------------------------
// Utility: debounce
// ---------------------------------------------------------------------------
function debounce<T extends (...args: Parameters<T>) => void>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout>;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const ShaderLoaderClient = forwardRef<ShaderLoaderRef, ShaderLoaderProps>(
    (
        {
            duration = 3000,
            borderColor = 'blue',
            clickPrompt = 'CLICK TO REVEAL',
            interaction = false,
            autoRevealDelay = 500,
            onReveal,
            onProgress,
            onCancel,
        },
        ref
    ) => {
        // Controls whether this component is in the DOM at all.
        // Once reveal completes, we set this to false → full unmount.
        const [mounted, setMounted] = useState(true);

        const loaderRef = useRef<HTMLDivElement>(null);
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const promptRef = useRef<HTMLParagraphElement>(null);

        // Three.js refs
        const sceneRef = useRef<THREE.Scene | null>(null);
        const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
        const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
        const uniformsRef = useRef<ShaderUniforms | null>(null);
        const meshRef = useRef<THREE.Mesh | null>(null);
        const clockRef = useRef<THREE.Clock | null>(null);

        // State refs
        const isRevealedRef = useRef(false);
        const animationIdRef = useRef<number | null>(null);
        const webGLAvailableRef = useRef(true);

        // ── Helpers ──────────────────────────────────────────────────────────────
        const parseColor = (colorString: string): THREE.Color => {
            const color = new THREE.Color();
            try {
                color.setStyle(colorString);
            } catch {
                color.setStyle('blue');
            }
            return color;
        };

        // ── Dispose Three.js resources ────────────────────────────────────────────
        const disposeThree = useCallback(() => {
            if (animationIdRef.current !== null) {
                cancelAnimationFrame(animationIdRef.current);
                animationIdRef.current = null;
            }
            if (meshRef.current) {
                meshRef.current.geometry.dispose();
                (meshRef.current.material as THREE.ShaderMaterial).dispose();
            }
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
        }, []);

        // ── Unmount the overlay completely from the DOM ───────────────────────────
        const unmountOverlay = useCallback(() => {
            disposeThree();
            setMounted(false);
        }, [disposeThree]);

        // ── Init Three.js scene ───────────────────────────────────────────────────
        const initializeThreeScene = useCallback(() => {
            if (!canvasRef.current) return false;
            if (!isWebGLSupported()) {
                webGLAvailableRef.current = false;
                return false;
            }

            const canvas = canvasRef.current;
            const width = window.innerWidth;
            const height = window.innerHeight;

            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            const renderer = new THREE.WebGLRenderer({
                canvas,
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setClearColor(0x000000, 0);

            const uniforms: ShaderUniforms = {
                uTransition: { value: 0.0 },
                uResolution: { value: new THREE.Vector2(width, height) },
                uTime: { value: 0.0 },
                uBorderColor: { value: parseColor(borderColor) },
            };

            const geometry = new THREE.PlaneGeometry(2, 2);
            const material = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms,
                transparent: true,
                depthWrite: false,
                depthTest: false,
            });

            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            const clock = new THREE.Clock();

            sceneRef.current = scene;
            cameraRef.current = camera;
            rendererRef.current = renderer;
            uniformsRef.current = uniforms;
            meshRef.current = mesh;
            clockRef.current = clock;

            return true;
        }, [borderColor]);

        // ── Sync borderColor at runtime ───────────────────────────────────────────
        useEffect(() => {
            if (uniformsRef.current) {
                uniformsRef.current.uBorderColor.value = parseColor(borderColor);
            }
        }, [borderColor]);

        // ── Resize ────────────────────────────────────────────────────────────────
        // Resize handler is created inside the main useEffect to avoid dependency chains

        // ── Core reveal logic ─────────────────────────────────────────────────────
        const triggerRevealAnimation = useCallback(() => {
            if (isRevealedRef.current) return;
            isRevealedRef.current = true;

            const prefersReducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches;

            // Hide the click prompt
            if (promptRef.current) {
                gsap.to(promptRef.current, {
                    opacity: 0,
                    y: prefersReducedMotion ? 0 : -25,
                    duration: prefersReducedMotion ? 0.1 : 0.5,
                    ease: 'power2.inOut',
                });
            }

            // No WebGL — just fade out and unmount
            if (!uniformsRef.current || !webGLAvailableRef.current) {
                gsap.to(loaderRef.current, {
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        onReveal?.();
                        unmountOverlay();
                    },
                });
                return;
            }

            const uniforms = uniformsRef.current;

            gsap.to(uniforms.uTransition, {
                value: 1.0,
                duration: prefersReducedMotion ? 0.3 : duration / 1000,
                ease: prefersReducedMotion ? 'none' : 'power2.inOut',
                onUpdate: () => onProgress?.(uniforms.uTransition.value),
                onComplete: () => {
                    onReveal?.();
                    // Fully unmount — no display:none on a parent, just gone from DOM
                    unmountOverlay();
                },
            });
        }, [duration, onProgress, onReveal, unmountOverlay]);

        // ── Touch: tap vs scroll detection ───────────────────────────────────────
        const touchStartY = useRef(0);

        const handleTouchStart = useCallback((e: TouchEvent) => {
            touchStartY.current = e.touches[0]?.clientY ?? 0;
        }, []);

        const handleTouchEnd = useCallback(
            (e: TouchEvent) => {
                const deltaY = Math.abs(
                    (e.changedTouches[0]?.clientY ?? 0) - touchStartY.current
                );
                if (deltaY < 10) triggerRevealAnimation();
            },
            [triggerRevealAnimation]
        );

        // ── Ref API ───────────────────────────────────────────────────────────────
        const reveal = useCallback(() => triggerRevealAnimation(), [triggerRevealAnimation]);

        const cancel = useCallback(() => {
            if (isRevealedRef.current) return;
            isRevealedRef.current = true;

            if (uniformsRef.current) gsap.killTweensOf(uniformsRef.current.uTransition);
            if (promptRef.current) gsap.killTweensOf(promptRef.current);

            gsap.to(loaderRef.current, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.inOut',
                onComplete: () => {
                    onCancel?.();
                    unmountOverlay();
                },
            });
        }, [onCancel, unmountOverlay]);

        const isRevealed = useCallback(() => isRevealedRef.current, []);

        useImperativeHandle(ref, () => ({ reveal, cancel, isRevealed }), [
            reveal, cancel, isRevealed,
        ]);

        // ── Mount: init scene + events + optional auto-reveal ────────────────────
        useEffect(() => {
            if (!mounted) return;

            const initialized = initializeThreeScene();
            const loader = loaderRef.current;
            if (!loader) return;

            // Create resize handler and debounced version inside the effect
            const handleResize = () => {
                if (!rendererRef.current || !uniformsRef.current) return;

                const width = window.innerWidth;
                const height = window.innerHeight;

                rendererRef.current.setSize(width, height);
                rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

                uniformsRef.current.uResolution.value.set(width, height);
            };

            const debouncedHandleResize = debounce(handleResize, 150);

            // Only attach click/touch listeners when interaction mode is on
            if (interaction) {
                loader.addEventListener('click', triggerRevealAnimation);
                loader.addEventListener('touchstart', handleTouchStart, { passive: true });
                loader.addEventListener('touchend', handleTouchEnd, { passive: true });
            }

            window.addEventListener('resize', debouncedHandleResize);

            if (initialized) {
                const clock = clockRef.current!;
                const renderer = rendererRef.current!;
                const uniforms = uniformsRef.current!;
                const scene = sceneRef.current!;
                const camera = cameraRef.current!;

                const tick = () => {
                    if (!document.hidden) {
                        uniforms.uTime.value = clock.getElapsedTime();
                        renderer.render(scene, camera);
                    }
                    animationIdRef.current = requestAnimationFrame(tick);
                };
                animationIdRef.current = requestAnimationFrame(tick);
            } else if (!webGLAvailableRef.current) {
                if (canvasRef.current) canvasRef.current.style.display = 'none';
                if (loader) (loader as HTMLElement).style.background = '#000';
            }

            // Auto-reveal when interaction=false
            let autoRevealTimer: ReturnType<typeof setTimeout> | null = null;
            if (!interaction) {
                autoRevealTimer = setTimeout(() => {
                    triggerRevealAnimation();
                }, autoRevealDelay);
            }

            return () => {
                if (interaction) {
                    loader.removeEventListener('click', triggerRevealAnimation);
                    loader.removeEventListener('touchstart', handleTouchStart);
                    loader.removeEventListener('touchend', handleTouchEnd);
                }
                window.removeEventListener('resize', debouncedHandleResize);
                if (autoRevealTimer) clearTimeout(autoRevealTimer);
                disposeThree();
            };
        }, [
            mounted,
            interaction,
            autoRevealDelay,
            initializeThreeScene,
            triggerRevealAnimation,
            handleTouchStart,
            handleTouchEnd,
            disposeThree,
        ]);

        // Once unmounted, render nothing — fully out of DOM
        if (!mounted) return null;

        return (
            <div ref={loaderRef} className={styles.loader}>
                <canvas
                    ref={canvasRef}
                    className={styles.canvas}
                    role="img"
                    aria-label="Loading animation"
                />
                {interaction && (
                    <p
                        ref={promptRef}
                        className={styles.clickPrompt}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                triggerRevealAnimation();
                            }
                        }}
                    >
                        {clickPrompt}
                    </p>
                )}
            </div>
        );
    }
);

ShaderLoaderClient.displayName = 'ShaderLoaderClient';
export default ShaderLoaderClient;