import React from 'react';

// Using a generic props type to allow passing down className, size, etc.
interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
}

interface ImgIconProps {
  size?: string | number;
  className?: string;
}

export const WhatsAppIcon: React.FC<SvgIconProps> = ({ size = 24, ...props }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    width={size}
    height={size}
    {...props}
  >
    <title>WhatsApp</title>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.49 1.32 4.95L2 22l5.25-1.38c1.41.81 3.02 1.24 4.7 1.24 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM7.34 6.26h.28c.24 0 .58.01.83.43l.06.07c.45.54.73 1.29.83 1.48.12.22.18.39.04.65-.14.26-.22.42-.42.58-.2.16-.42.24-.58.38-.16.14-.34.3-.18.6s.93 1.69 2.16 2.86c1.55 1.48 2.82 1.88 3.24 2.06.42.18.68.16.92-.08.24-.24.94-1.13 1.18-1.52.24-.38.48-.32.83-.18l3.18 1.5c.34.16.56.24.62.38.06.14.02.82-.36 1.52-.38.7-2.35 2.2-2.77 2.2-.42 0-1.02-.16-1.92-.54-.9-.38-3.24-1.52-6.13-4.1-2.5-2.25-4.18-4.7-4.62-5.5s-.8-1.22-.8-2.24c0-1.02.5-1.52.7-1.72s.4-.23.6-.23zm.02 0" />
  </svg>
);

const createImgIcon = (src: string, alt: string): React.FC<ImgIconProps> => 
  ({ size = 24, className }) => (
    <img src={src} alt={alt} width={size} height={size} className={className} />
  );

export const LinkedinIcon = createImgIcon("https://res.cloudinary.com/dwwvh34yi/image/upload/v1753228294/linkedin_ltqxuy.svg", "LinkedIn");
export const TwitterIcon = createImgIcon("https://res.cloudinary.com/dwwvh34yi/image/upload/v1753228294/twitter_itf6wp.svg", "X (Twitter)");
export const InstagramIcon = createImgIcon("https://res.cloudinary.com/dwwvh34yi/image/upload/v1753228456/instagram_wd9tua.svg", "Instagram");
export const TikTokIcon = createImgIcon("https://res.cloudinary.com/dwwvh34yi/image/upload/v1753228295/tiktok_avr92v.svg", "TikTok");
export const BehanceIcon = createImgIcon("https://res.cloudinary.com/dwwvh34yi/image/upload/v1753228293/behance_jcdldl.svg", "Behance");
export const GithubIcon = createImgIcon("https://res.cloudinary.com/dwwvh34yi/image/upload/v1753228293/github_agymjn.svg", "GitHub");
export const FacebookIcon = createImgIcon("https://res.cloudinary.com/dwwvh34yi/image/upload/v1753228337/facebook-color_xx6keh.svg", "Facebook");
