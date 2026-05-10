import React, { Suspense } from 'react';
import ShaderLoaderClient from './shader-loader-client';
import type { ShaderLoaderProps, ShaderLoaderRef } from './types';

/**
 * ShaderLoader — full-page WebGL reveal loader for Next.js 16.
 *
 * Server-component wrapper that suspends until the client chunk is ready.
 * All WebGL logic lives in ShaderLoader.client.tsx.
 *
 * @example
 * ```tsx
 * <ShaderLoader duration={3000} borderColor="#00ff00" onReveal={handleReveal}>
 *   <YourPage />
 * </ShaderLoader>
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