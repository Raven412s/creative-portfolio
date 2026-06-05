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