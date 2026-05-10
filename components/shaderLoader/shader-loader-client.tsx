'use client';

import React, {
  useEffect,
  useRef,
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
// Utility: detect WebGL support before instantiating a renderer
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
// Utility: simple debounce — avoids hammering setSize on every resize pixel
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
      onReveal,
      onProgress,
      onCancel,
      children,
    },
    ref
  ) => {
    const loaderRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const promptRef = useRef<HTMLParagraphElement>(null);

    // ── Three.js refs (never trigger re-renders) ───────────────────────────
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);   // FIX: camera in ref, not in tick()
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const uniformsRef = useRef<ShaderUniforms | null>(null);
    const meshRef = useRef<THREE.Mesh | null>(null);
    const clockRef = useRef<THREE.Clock | null>(null);

    // ── State refs ─────────────────────────────────────────────────────────
    const isRevealedRef = useRef(false);
    const animationIdRef = useRef<number | null>(null);
    const webGLAvailableRef = useRef(true);

    // ── Helpers ────────────────────────────────────────────────────────────
    const parseColor = (colorString: string): THREE.Color => {
      const color = new THREE.Color();
      try {
        color.setStyle(colorString);
      } catch {
        console.warn(`ShaderLoader: invalid color "${colorString}", falling back to blue.`);
        color.setStyle('blue');
      }
      return color;
    };

    // ── Init ───────────────────────────────────────────────────────────────
    const initializeThreeScene = useCallback(() => {
      if (!canvasRef.current) return false;

      // FIX: guard against missing WebGL before touching THREE
      if (!isWebGLSupported()) {
        webGLAvailableRef.current = false;
        console.warn('ShaderLoader: WebGL not supported. Falling back to instant reveal.');
        return false;
      }

      const canvas = canvasRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      const scene = new THREE.Scene();

      // FIX: camera stored in ref
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
    }, [borderColor]); // eslint-disable-line react-hooks/exhaustive-deps
    // parseColor is stable; borderColor change is handled separately below

    // ── Sync borderColor prop changes at runtime ───────────────────────────
    // FIX: previously ignored after mount
    useEffect(() => {
      if (uniformsRef.current) {
        uniformsRef.current.uBorderColor.value = parseColor(borderColor);
      }
    }, [borderColor]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Resize (debounced) ─────────────────────────────────────────────────
    const handleResize = useCallback(
      debounce(() => {
        if (!rendererRef.current || !uniformsRef.current) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        rendererRef.current.setSize(width, height);
        rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        uniformsRef.current.uResolution.value.set(width, height);
      }, 150), // 150 ms debounce — imperceptible lag, massive CPU saving
      []
    );

    // ── Reveal logic ───────────────────────────────────────────────────────
    const triggerRevealAnimation = useCallback(() => {
      if (isRevealedRef.current || !loaderRef.current) return;
      isRevealedRef.current = true;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (promptRef.current) {
        gsap.to(promptRef.current, {
          opacity: 0,
          y: prefersReducedMotion ? 0 : -25,
          duration: prefersReducedMotion ? 0.1 : 0.5,
          ease: 'power2.inOut',
        });
      }

      // FIX: handle WebGL-unavailable path gracefully
      if (!uniformsRef.current || !webGLAvailableRef.current) {
        if (loaderRef.current) loaderRef.current.style.opacity = '0';
        setTimeout(() => {
          if (loaderRef.current) loaderRef.current.style.pointerEvents = 'none';
          onReveal?.();
        }, 300);
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
          if (loaderRef.current) {
            loaderRef.current.style.pointerEvents = 'none';
          }
        },
      });
    }, [duration, onProgress, onReveal]);

    // ── Touch: ignore scrolls, only fire on taps ───────────────────────────
    // FIX: previously fired on any touchstart including scroll swipes
    const touchStartY = useRef(0);

    const handleTouchStart = useCallback((e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? 0;
    }, []);

    const handleTouchEnd = useCallback(
      (e: TouchEvent) => {
        const deltaY = Math.abs(
          (e.changedTouches[0]?.clientY ?? 0) - touchStartY.current
        );
        if (deltaY < 10) {
          // It's a tap, not a scroll
          triggerRevealAnimation();
        }
      },
      [triggerRevealAnimation]
    );

    // ── Ref API ────────────────────────────────────────────────────────────
    const reveal = useCallback(() => triggerRevealAnimation(), [triggerRevealAnimation]);

    const cancel = useCallback(() => {
      if (isRevealedRef.current) return;
      isRevealedRef.current = true;

      if (uniformsRef.current) {
        gsap.killTweensOf(uniformsRef.current.uTransition);
      }
      if (promptRef.current) {
        gsap.killTweensOf(promptRef.current);
      }

      // FIX: actually hide the overlay so the user isn't stuck
      if (loaderRef.current) {
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
          onComplete: () => {
            if (loaderRef.current) {
              loaderRef.current.style.pointerEvents = 'none';
            }
          },
        });
      }

      onCancel?.();
    }, [onCancel]);

    const isRevealed = useCallback(() => isRevealedRef.current, []);

    useImperativeHandle(ref, () => ({ reveal, cancel, isRevealed }), [
      reveal,
      cancel,
      isRevealed,
    ]);

    // ── Mount: init + events ───────────────────────────────────────────────
    useEffect(() => {
      const initialized = initializeThreeScene();

      const loader = loaderRef.current;
      if (!loader) return;

      loader.addEventListener('click', triggerRevealAnimation);
      loader.addEventListener('touchstart', handleTouchStart, { passive: true });
      loader.addEventListener('touchend', handleTouchEnd, { passive: true });
      window.addEventListener('resize', handleResize);

      // FIX: start the animation loop here, after init, not in a separate effect
      // This guarantees refs are populated before tick() is called.
      if (initialized) {
        const clock = clockRef.current!;
        const renderer = rendererRef.current!;
        const uniforms = uniformsRef.current!;
        const scene = sceneRef.current!;
        const camera = cameraRef.current!;

        const tick = () => {
          // FIX: pause RAF when tab is hidden — saves GPU/battery
          if (!document.hidden) {
            uniforms.uTime.value = clock.getElapsedTime();
            renderer.render(scene, camera);
          }
          animationIdRef.current = requestAnimationFrame(tick);
        };

        animationIdRef.current = requestAnimationFrame(tick);
      } else if (!webGLAvailableRef.current) {
        // No WebGL — show a plain black overlay that still reveals on click
        if (canvasRef.current) canvasRef.current.style.display = 'none';
        if (loader) (loader as HTMLElement).style.background = '#000';
      }

      return () => {
        loader.removeEventListener('click', triggerRevealAnimation);
        loader.removeEventListener('touchstart', handleTouchStart);
        loader.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('resize', handleResize);

        if (animationIdRef.current !== null) {
          cancelAnimationFrame(animationIdRef.current);
        }

        // Dispose Three.js resources
        if (meshRef.current) {
          meshRef.current.geometry.dispose();
          (meshRef.current.material as THREE.ShaderMaterial).dispose();
        }
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
      };
    }, [
      initializeThreeScene,
      triggerRevealAnimation,
      handleTouchStart,
      handleTouchEnd,
      handleResize,
    ]);

    return (
      <div ref={loaderRef} className={styles.loader}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          role="img"
          aria-label="Loading animation"
        />
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
        {/* Children are rendered in the DOM immediately; the overlay sits on top */}
        {children}
      </div>
    );
  }
);

ShaderLoaderClient.displayName = 'ShaderLoaderClient';
export default ShaderLoaderClient;