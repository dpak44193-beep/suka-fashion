import React from 'react';
import logoImage from '../../assets/suka-logo.png';

export type BrandLogoSize = 'sm' | 'md' | 'lg';

const SIZE_PX: Record<BrandLogoSize, { h: number; maxW: number }> = {
  sm: { h: 28, maxW: 80 },
  md: { h: 32, maxW: 96 },
  lg: { h: 40, maxW: 112 },
};

interface BrandLogoProps {
  size?: BrandLogoSize;
  className?: string;
  alt?: string;
}

/**
 * Brand logo with fixed pixel bounds (global img { max-width:100% } would otherwise blow it up).
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
  alt = 'Suka Fashions',
}) => {
  const { h, maxW } = SIZE_PX[size];

  return (
    <img
      src={logoImage}
      alt={alt}
      className={`brand-logo brand-logo--${size} block shrink-0 object-contain ${className}`}
      style={{
        height: h,
        maxHeight: h,
        width: 'auto',
        maxWidth: maxW,
      }}
      width={maxW}
      height={h}
      decoding="async"
    />
  );
};
