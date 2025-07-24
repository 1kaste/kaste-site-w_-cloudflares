
import React from 'react';
import { useSiteContent } from './contexts/SiteContentContext';
import type { SiteContent } from '../types';

const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0'; // Fallback for invalid hex
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
};

const generateStyleString = (content: SiteContent | null): string => {
    if (!content) return '';
    
    const { branding } = content;
    const { colors } = branding;
    
    const primaryRgb = hexToRgb(colors.primary);
    const secondaryRgb = hexToRgb(colors.secondary);
      
    return `
        :root {
          --color-brand-primary: ${colors.primary};
          --color-brand-secondary: ${colors.secondary};
          --color-brand-bg: ${colors.background};
          --color-brand-surface: ${colors.surface};
          --color-brand-light: ${colors.lightText};
          --color-brand-gray: ${colors.grayText};
          --color-brand-dark-text: ${colors.darkText};
          --color-brand-primary-glow: rgba(${primaryRgb}, 0.7);
          --color-brand-secondary-glow: rgba(${secondaryRgb}, 0.7);
          --color-brand-secondary-rgb: ${secondaryRgb};
        }
      `;
}

const BrandingStyles: React.FC = () => {
  const { content } = useSiteContent();

  const styles = React.useMemo(() => generateStyleString(content), [content]);

  return <style id="branding-styles">{styles}</style>;
};

export default BrandingStyles;
