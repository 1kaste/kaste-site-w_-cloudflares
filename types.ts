

export interface Project {
  id: string;
  title: string;
  description: string;
  serviceId: string;
  status: 'live' | 'coming-soon';
  imageUrl?: string;
  demoLink?: string;
  presentation?: {
    type: 'gallery' | 'video';
    urls: string[];
  };
}

export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
}

export interface Branding {
  logoUrl: string;
  splashScreen: {
      brandName: string;
      description: string;
  };
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    lightText: string;
    grayText: string;
    darkText: string;
  };
}

export interface CyclingContent {
  id: string;
  icon: string; // Icon name from lucide-react
  text: string;
}

export interface HeaderContent {
  cyclingContent: CyclingContent[];
  contact: {
    phone: string;
    whatsapp: string;
  }
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  iconUrl: string;
}
export interface FooterContent {
  tagline: string;
  contact: {
    email: string;
    location: string;
  };
  socialLinks: SocialLink[];
  navLinks: {
      id: string;
      label: string;
      url:string;
  }[];
}

export interface IconSource {
  type: 'custom' | 'lucide' | 'url';
  value: string;
}

export interface HomepageContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImageUrl: string;
  };
  featuredServices: {
    title: string;
    subtitle: string;
    serviceIds: string[];
  };
  clientMarquee: {
    title: string;
    clients: { id: string; name: string; logoUrl: string; }[][]; // Array of arrays for rows
  };
  tabsSection: {
    title: string;
    subtitle: string;
    tabs: {
      id: 'ai' | 'stack' | 'projects';
      label: string;
      icon: string;
      items: {
        id: string;
        icon: IconSource;
        title: string;
        description: string;
        iconClassName?: string;
      }[];
    }[];
  };
  stats: {
    title: string;
    subtitle: string;
    items: {
      id: string;
      icon: string;
      value: string;
      label: string;
    }[];
  };
}

export interface AboutPageContent {
    hero: {
        title: string;
        subtitle: string;
        highlightedText: string;
    };
    mission: {
        title: string;
        body: string;
        imageUrl: string;
        points: {
            id: string;
            icon: string;
            title: string;
            text: string;
        }[];
    };
    principles: {
        title: string;
        subtitle: string;
        items: {
            id: string;
            icon: string;
            title: string;
            text: string;
        }[];
    };
    cta: {
        title: string;
        subtitle: string;
        buttonText: string;
    }
}

export interface ContactPageContent {
    hero: {
        title: string;
        subtitle: string;
    };
    details: {
        email: string;
        phone: string;
        location: string;
    };
}

export interface PopupSettings {
    enabled: boolean;
    type: 'announcement' | 'special';
    icon: string;
    title: string;
    message: string;
    ctaText: string;
    ctaLink: string;
    imageUrl?: string;
}

export interface SiteContent {
  branding: Branding;
  header: HeaderContent;
  footer: FooterContent;
  homepage: HomepageContent;
  about: AboutPageContent;
  contact: ContactPageContent;
  services: Service[];
  projects: Project[];
  popup: PopupSettings;
}