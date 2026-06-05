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