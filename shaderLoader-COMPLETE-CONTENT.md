# ShaderLoader Component - Complete Documentation

## Overview
ShaderLoader is a standalone full-page WebGL reveal overlay component built with React, Three.js, and GSAP. It creates an interactive or automatic pixelated shader animation that reveals the page content with a configurable border glow effect.

### Key Features
- **Standalone overlay**: Renders as a sibling component, never wraps children
- **Full-page animation**: Fixed viewport overlay with WebGL-powered shader effects
- **Interactive or automatic**: Click-to-reveal or auto-reveal after a delay
- **Customizable appearance**: Configurable duration, border color, and custom prompt text
- **Performance optimized**: Debounced resizing, requestAnimationFrame rendering, proper cleanup
- **Accessibility ready**: Touch support, keyboard navigation, prefers-reduced-motion support
- **Ref-based API**: Programmatic control via `reveal()`, `cancel()`, and `isRevealed()`
- **Dynamic uniforms**: Real-time color updates without re-rendering
- **Graceful fallback**: Works without WebGL (no animation, just fade out)

---

## File 1: index.ts
**Purpose**: Main export file that re-exports all public APIs from the component

```typescript
export { default as ShaderLoader } from './shader-loader';
export { default as ShaderLoaderClient } from './shader-loader-client';
export type { ShaderLoaderProps, ShaderLoaderRef, ShaderUniforms } from './types';
export { vertexShader, fragmentShader } from './shaders';
```

---

## File 2: types.ts
**Purpose**: TypeScript interfaces and types for the component

```typescript
import * as THREE from 'three';

export interface ShaderLoaderProps {
  /**
   * Duration of the reveal animation in milliseconds
   * @default 3000
   */
  duration?: number;

  /**
   * Border color for the shader glow effect.
   * Accepts any CSS color string (hex, rgb, hsl, named colors).
   * @default 'blue'
   */
  borderColor?: string;

  /**
   * Custom text for the click-to-reveal prompt.
   * Only shown when interaction is true.
   * @default 'CLICK TO REVEAL'
   */
  clickPrompt?: string;

  /**
   * If true (default), user must click/tap to trigger the reveal.
   * If false, the reveal animation starts automatically on mount.
   * @default true
   */
  interaction?: boolean;

  /**
   * Delay in ms before auto-reveal starts (only used when interaction=false).
   * @default 500
   */
  autoRevealDelay?: number;

  /**
   * Callback fired when the reveal animation completes.
   */
  onReveal?: () => void;

  /**
   * Callback fired during animation with a normalized progress value [0, 1].
   */
  onProgress?: (progress: number) => void;

  /**
   * Callback fired if the reveal is programmatically cancelled.
   */
  onCancel?: () => void;

  // NOTE: No children prop — ShaderLoader is a standalone overlay only.
  // It never wraps children. Mount it anywhere in the tree as a sibling.
}

export interface ShaderLoaderRef {
  /** Programmatically trigger the reveal animation. No-op if already revealed. */
  reveal: () => void;

  /**
   * Cancel the reveal animation and unmount the loader immediately.
   * Fires onCancel callback.
   */
  cancel: () => void;

  /** Returns true if the reveal animation has completed. */
  isRevealed: () => boolean;
}

/** Three.js uniform block for the ShaderLoader material. */
export interface ShaderUniforms {
  [key: string]: THREE.IUniform;

  uTransition: THREE.IUniform<number>;
  uResolution: THREE.IUniform<THREE.Vector2>;
  uTime: THREE.IUniform<number>;
  uBorderColor: THREE.IUniform<THREE.Color>;
}
```

---

## File 3: shaders.ts
**Purpose**: GLSL vertex and fragment shaders for the WebGL animation

### Key Algorithm Components:
- **Perlin noise (cnoise)**: Creates organic, flowing distortions using Perlin's improvement over value noise
- **Pixelation effect**: Reduces UV precision to create blocky appearance
- **Radial gradient**: Drives the "reveal" from center outward
- **Dynamic glow**: Color oscillates based on time for living effect
- **Edge detection**: Smooth step functions create sharp but smooth borders

```glsl
// VERTEX SHADER
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}

// FRAGMENT SHADER
uniform float uTransition;
uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;
uniform vec3 uBorderColor;

vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy  = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g100,g100),dot(g010,g010),dot(g110,g110)));
  g000 *= norm0.x; g100 *= norm0.y; g010 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g101,g101),dot(g011,g011),dot(g111,g111)));
  g001 *= norm1.x; g101 *= norm1.y; g011 *= norm1.z; g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  float n_z  = mix(mix(n000, n100, fade_xyz.x), mix(n010, n110, fade_xyz.x), fade_xyz.y);
  float n_dz = mix(mix(n001, n101, fade_xyz.x), mix(n011, n111, fade_xyz.x), fade_xyz.y);
  return 2.2 * mix(n_z, n_dz, fade_xyz.z);
}

void main() {
  float pixelSize = 10.0;
  vec2 grid = uResolution / pixelSize;
  vec2 pixelatedUv = floor(vUv * grid) / grid;

  float aspect = uResolution.x / uResolution.y;
  vec2 correctedUv = (pixelatedUv - 0.5) * vec2(aspect, 1.0) + 0.5;

  float maxDistance = length(vec2(aspect, 1.0)) * 0.5;

  vec2 displacedUv = correctedUv + cnoise(vec3(correctedUv * 5.0, uTime * 0.1));
  float strength   = cnoise(vec3(displacedUv * 5.0, uTime * 0.2));

  float d = length(correctedUv - 0.5);
  float normalizedDistance = d / maxDistance;

  float radialGradient = normalizedDistance * 12.5 + (1.0 - uTransition) * 2.0 - 15.0 * uTransition;
  float rawStrength = strength + radialGradient;

  strength = clamp(rawStrength, 0.0, 1.0);

  float edge = smoothstep(0.0, 0.7, rawStrength) * smoothstep(2.5, 0.7, rawStrength);
  edge *= min(uTransition * 5.0, 1.0);

  vec3 deepMidnightColor = uBorderColor * 0.015;
  vec3 richGlowingColor  = uBorderColor * 1.5;
  vec3 edgeColor = mix(deepMidnightColor, richGlowingColor, sin(uTime * 1.5) * 0.5 + 0.5);

  vec3 baseBlack  = vec3(0.0);
  vec3 planeColor = mix(baseBlack, edgeColor * 6.5, edge);

  float finalAlpha = max(strength, edge);

  gl_FragColor = vec4(planeColor, finalAlpha);
}
```

---

## File 4: shaderLoader.module.css
**Purpose**: Styling for the overlay and interactive elements

```css
/* Full-viewport fixed overlay */
.loader {
  height: 100dvh;
  width: 100%;
  position: fixed;
  inset: 0;
  z-index: 50000;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: all;
  /* transition drives the cancel() fade-out via gsap */
}

.canvas {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  display: block;
}

.clickPrompt {
  position: relative;
  z-index: 2;
  color: white;
  cursor: pointer;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  user-select: none;
  touch-action: none;
  /* opacity / transform are driven by gsap; CSS transition is a fallback only */
  transition: opacity 0.3s ease-in-out;
}

.clickPrompt:hover {
  opacity: 0.7;
}

.clickPrompt:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.6);
  outline-offset: 6px;
  border-radius: 2px;
}

/* Reduced-motion: remove all animated transitions */
@media (prefers-reduced-motion: reduce) {
  .loader,
  .clickPrompt {
    transition: none;
  }
}

.loader[style*="display: none"] canvas {
  display: none;
}
```

---

## File 5: shader-loader.tsx
**Purpose**: Server component wrapper for Suspense and code splitting

```typescript
import React, { Suspense } from 'react';
import ShaderLoaderClient from './shader-loader-client';
import type { ShaderLoaderProps, ShaderLoaderRef } from './types';

/**
 * ShaderLoader — standalone full-page WebGL reveal overlay.
 *
 * This component renders ONLY the overlay. It does NOT wrap children.
 * Place it as a sibling anywhere in your layout tree.
 * It fully unmounts from the DOM once the reveal animation completes.
 *
 * @example — layout.tsx
 * ```tsx
 * <CursorProvider>
 *   <ShaderLoader interaction={true} borderColor="#1cf3a1" />
 *   <Navbar />
 *   <main>{children}</main>
 *   <Footer />
 * </CursorProvider>
 * ```
 *
 * @example — auto-reveal (no click needed)
 * ```tsx
 * <ShaderLoader interaction={false} autoRevealDelay={800} duration={2000} />
 * ```
 */
const ShaderLoader = React.forwardRef<ShaderLoaderRef, ShaderLoaderProps>(
  (props, ref) => (
    <Suspense fallback={null}>
      <ShaderLoaderClient {...props} ref={ref} />
    </Suspense>
  )
);

ShaderLoader.displayName = 'ShaderLoader';
export default ShaderLoader;
```

---

## File 6: shader-loader-client.tsx
**Purpose**: Main client component with all animation and event logic

```typescript
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
```

---

## Architecture & Design Patterns

### Component Structure
- **Server wrapper** (`shader-loader.tsx`): Handles Suspense, passes props to client
- **Client component** (`shader-loader-client.tsx`): 'use client' directive, all interactivity and rendering
- **Separation of concerns**: Shaders in separate file, types isolated, styles modularized

### State Management
- **React state**: `mounted` - tracks if component is in DOM
- **Refs for Three.js objects**: Avoids unnecessary re-renders
- **Ref callbacks**: `reveal()`, `cancel()`, `isRevealed()` for programmatic control

### Performance Optimizations
- **Debounced resize**: 150ms delay prevents resize thrashing
- **RequestAnimationFrame**: Syncs animation with display refresh rate
- **Page visibility API**: Pauses rendering when tab is hidden
- **Proper cleanup**: Cancels animation frames, disposes Three.js resources in useEffect cleanup
- **High-performance WebGL settings**: `powerPreference: 'high-performance'`

### Accessibility Features
- **Keyboard support**: Enter/Space to trigger reveal, focusable prompt
- **Touch support**: Distinguishes between tap (reveal) and scroll (no action)
- **prefers-reduced-motion**: Detects and respects reduced-motion preferences
- **ARIA labels**: `role="img"` on canvas, `role="button"` on prompt
- **Focus visible styles**: Outline on keyboard focus

### Graceful Degradation
- **WebGL detection**: Tests browser support on mount
- **Fallback rendering**: No WebGL? Just fade to black and unmount
- **Color parsing**: Invalid colors default to blue, never crash

---

## Usage Examples

### Basic Interactive Reveal
```typescript
import { ShaderLoader } from '@/components/self-made/shaderLoader';

export default function Layout({ children }) {
  return (
    <>
      <ShaderLoader interaction={true} duration={3000} borderColor="blue" />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

### Auto-Reveal After Delay
```typescript
<ShaderLoader 
  interaction={false} 
  autoRevealDelay={800} 
  duration={2000}
  borderColor="#1cf3a1"
/>
```

### With Programmatic Control
```typescript
const ref = useRef<ShaderLoaderRef>(null);

const handleSkip = () => ref.current?.cancel();
const handleForceReveal = () => ref.current?.reveal();

return (
  <>
    <ShaderLoader 
      ref={ref} 
      interaction={true}
      onReveal={() => console.log('Reveal complete!')}
      onProgress={(p) => console.log(`Progress: ${p * 100}%`)}
      onCancel={() => console.log('Cancelled')}
    />
    <button onClick={handleSkip}>Skip</button>
  </>
);
```

---

## Dependencies
- `react` - UI framework
- `three` - 3D graphics library
- `gsap` - Animation library
- `typescript` - Type safety

---

## Browser Support
- **Modern browsers** with WebGL support (Chrome, Firefox, Safari, Edge)
- **Fallback**: Non-WebGL browsers fade to black and unmount (no crash)
- **Mobile**: Full touch support with tap/scroll distinction

---

## Key Implementation Details

1. **Full unmount strategy**: Component renders `null` after reveal, not just hidden with CSS
2. **Dynamic color updates**: `borderColor` prop changes re-sync shader uniforms without recreation
3. **Ref API**: Allows parent to control reveal programmatically while maintaining encapsulation
4. **Debounced events**: Resize and other frequent events are debounced to prevent performance issues
5. **Canvas lifecycle**: Properly tied to component mount/unmount with cleanup
6. **Shader uniforms**: Updated every frame via requestAnimationFrame, enabling real-time animations
