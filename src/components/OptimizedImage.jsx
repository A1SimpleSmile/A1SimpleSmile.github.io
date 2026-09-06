import { useState } from 'react'

// Responsive, performant <img> primitive.
//  - Use WebP sources with fallback to the given format via <source>.
//  - srcSet provides resolution variants (1x/2x) for crisp HiDPi displays.
//  - loading="lazy" + decoding="async" for non-critical images.
//
// Example:
//   <OptimizedImage webp={["/img/a-1x.webp", "/img/a-2x.webp"]}
//                   fallback="/img/a.png"
//                   alt="示意圖" />
export default function OptimizedImage({
  webp = [],
  fallback = '',
  alt = '',
  eager = false,
  className = '',
  width,
  height,
}) {
  const [error, setError] = useState(false)

  // srcSet built from paired (url, 1x/2x) variants; by default the first entry
  // is treated as 1x and the second as 2x (Apple-style density selection).
  const srcSet = webp.length ? `${webp[0]} 1x${webp[1] ? `, ${webp[1]} 2x` : ''}` : undefined
  const src = error || !webp.length ? fallback : webp[0]

  return (
    <picture>
      {webp.length > 0 && !error && (
        <source type="image/webp" srcSet={srcSet} />
      )}
      <img
        src={src}
        srcSet={srcSet}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
        width={width}
        height={height}
        onError={() => setError(true)}
      />
    </picture>
  )
}
