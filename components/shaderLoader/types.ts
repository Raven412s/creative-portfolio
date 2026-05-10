import type { Vector2, Color } from 'three';

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
   * @default 'CLICK TO REVEAL'
   */
  clickPrompt?: string;

  /**
   * Callback fired when the reveal animation completes.
   */
  onReveal?: () => void;

  /**
   * Callback fired during animation with a normalized progress value [0, 1].
   * Useful for syncing other animations or UI state.
   */
  onProgress?: (progress: number) => void;

  /**
   * Callback fired if the reveal is programmatically cancelled.
   */
  onCancel?: () => void;

  /**
   * Content rendered beneath the loader overlay.
   * Becomes interactive once the loader animation completes.
   */
  children?: React.ReactNode;
}

export interface ShaderLoaderRef {
  /** Programmatically trigger the reveal animation. No-op if already revealed. */
  reveal: () => void;

  /**
   * Cancel the reveal animation and hide the loader immediately.
   * Fires onCancel callback.
   */
  cancel: () => void;

  /** Returns true if the reveal animation has completed. */
  isRevealed: () => boolean;
}

/** Three.js uniform block for the ShaderLoader material. */
export interface ShaderUniforms {
  uTransition: { value: number };
  uResolution: { value: Vector2 };
  uTime: { value: number };
  uBorderColor: { value: Color };
}