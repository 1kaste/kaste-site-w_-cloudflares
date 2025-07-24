
import { SiteContent, Service, Project } from '../types';

/**
 * Determines the API URL based on the execution environment.
 * This supports local development against a Cloudflare Worker and production deployment.
 *
 * @returns {string} The appropriate API URL base path.
 */
const getApiUrl = (): string => {
    const hostname = window.location.hostname;

    // For local development, point to the default Wrangler dev server port.
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8787';
    }

    // For deployed environments on Cloudflare Pages, use a relative path.
    // Requests to `/api/*` will be automatically routed to the Functions worker.
    return '';
};

export const API_URL = getApiUrl();

// In-memory cache for the site content
let siteContentCache: SiteContent | null = null;

const defaultServices: Service[] = [
  {
    id: 'web-designs',
    title: 'Web Designs',
    description: 'We build bold, responsive websites that captivate users and drive business growth with style.',
    longDescription: "Your website is your digital storefront. We don't just build pages; we architect experiences. Our team combines bold, modern aesthetics with clean, intuitive UX to create websites that are not only visually stunning but also fast, responsive, and conversion-optimized. From corporate hubs to intricate e-commerce platforms, we deliver digital excellence that makes a statement.",
    imageUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753214408/website_peview_yamyba.png',
  },
  {
    id: 'brand-identity',
    title: 'Brand Identity',
    description: 'Forge a memorable brand identity that tells your story and connects with your audience.',
    longDescription: "A powerful brand is more than a logo—it's a feeling. We dive deep to define your brand's core essence, then build a complete visual identity system: logo, color palette, typography, and voice. Our goal is to craft a cohesive, compelling narrative that ensures you stand out and resonate deeply with your target market.",
    imageUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753214408/brand_identity_preview_image_bbjy8c.png',
  },
  {
    id: 'ai-systems',
    title: 'AI Systems',
    description: 'Develop intelligent AI systems to automate workflows, uncover insights, and innovate faster.',
    longDescription: "Unlock the future with Artificial Intelligence. We specialize in custom AI systems, from machine learning models to NLP and computer vision. Our solutions are engineered to boost efficiency, deliver predictive insights, and create new, game-changing opportunities for your business. It's not just automation; it's intelligent evolution.",
    imageUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753214409/Ai_systems_preview_vuryne.png',
  },
  {
    id: 'ai-solutions',
    title: 'AI Solutions',
    description: 'Integrate bespoke AI solutions to conquer complex challenges and future-proof your operations.',
    longDescription: "We deliver tailored AI solutions that solve real-world business problems. From AI-powered chatbots that elevate customer service to sophisticated recommendation engines that drive sales, we provide end-to-end implementation. We turn complex data into a competitive advantage, delivering measurable value and a clear path forward.",
    imageUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753224233/ai_solutions_xp0bsr.png',
  },
  {
    id: 'graphics',
    title: 'Graphics',
    description: 'Create stunning, high-impact graphics that stop the scroll and demand attention.',
    longDescription: "In a visual world, great design is non-negotiable. Our graphics team produces compelling visuals for every platform—from scroll-stopping social media assets and ad creatives to sharp infographics and polished presentation decks. We make sure your message is not just seen, but felt.",
    imageUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753224232/graphics_gpylst.png',
  },
  {
    id: 'branding',
    title: 'Branding',
    description: 'Deploy full-funnel branding strategies that define your position and build a loyal following.',
    longDescription: "We build brands with intention. Our strategic process involves deep market research, competitive analysis, and crafting a unique brand voice and messaging framework. We ensure every customer touchpoint is a consistent, powerful, and memorable experience that builds not just awareness, but loyalty.",
    imageUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753224232/branding_section_zzir42.png',
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    description: 'Execute data-driven marketing campaigns that scale your reach and maximize conversions.',
    longDescription: "We connect you with your audience through smart, data-first digital marketing. Our holistic strategies cover SEO, SEM, content marketing, and social media management, all relentlessly optimized for performance. We turn clicks into customers and data into dominance, ensuring sustainable growth and maximum ROI.",
    imageUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753224231/Digital_Marketing_oqamvh.png',
  },
  {
    id: 'software-development',
    title: 'Software Development',
    description: 'Engineer scalable, high-performance custom software solutions that power your business forward.',
    longDescription: "We are architects of digital innovation. Using agile methodologies, our team develops secure, scalable, and robust custom software. Whether you need an enterprise-grade application, a powerful CRM, or a groundbreaking SaaS product, we deliver solutions that streamline operations and create a definitive competitive edge.",
    imageUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753224232/software_dev_dnerje.png',
  },
  {
    id: 'mobile-apps',
    title: 'Mobile Apps',
    description: 'Build elegant, high-performance native and cross-platform mobile apps for iOS & Android.',
    longDescription: "Put your brand in your customers' hands. We manage the entire mobile app lifecycle—from strategy and UI/UX design to native/cross-platform development, testing, and App Store deployment. We create seamless, powerful, and intuitive mobile experiences that drive engagement and loyalty.",
    imageUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753224231/mobile_apps_l6ovlk.png',
  },
  {
    id: 'all-digital-solutions',
    title: 'All Digital Solutions',
    description: 'Your strategic partner for integrated digital services, designed to build, elevate, and scale your brand.',
    longDescription: "Kaste Brands & Designs is your one-stop partner for total digital transformation. We offer an integrated suite of services, combining bold creative, cutting-edge technology, and strategic marketing. From forging your brand identity to launching complex software and dominating your market, we have the vision and expertise to accelerate your success.",
    imageUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753224231/all_digital_solutions_vccfeg.png',
  }
];
const defaultProjects: Project[] = [];

export const defaultSiteContent: SiteContent = {
  branding: {
    logoUrl: "https://res.cloudinary.com/dwwvh34yi/image/upload/v1751848854/Brands_Designs_1_yismag.svg",
    splashScreen: {
      brandName: "Kaste Brands & Designs",
      description: "Building Bold Brands & Smart Solutions",
    },
    colors: {
      primary: '#0A777B',
      secondary: '#F5B841',
      background: '#1A1A1A',
      surface: '#2A2A2A',
      lightText: '#F9F9F9',
      grayText: '#EDEDED',
      darkText: '#1A1A1A',
    }
  },
  header: {
    cyclingContent: [
      { id: 'cc_1', icon: 'Sparkles', text: "Creative Solutions" },
      { id: 'cc_2', icon: 'TrendingUp', text: "Digital Growth" },
      { id: 'cc_3', icon: 'BrainCircuit', text: "AI-Powered Innovation" },
      { id: 'cc_4', icon: 'Brush', text: "Strategic Branding" },
    ],
    contact: {
      phone: '+254795071901',
      whatsapp: '254795071901',
    }
  },
  footer: {
    tagline: 'Building bold brands and smart solutions for the digital age.',
    contact: {
      email: 'info@kastebrands.co.ke',
      location: 'Nairobi, Kenya',
    },
    navLinks: [
        { id: 'footer_nav_home', label: 'Home', url: '/' },
        { id: 'footer_nav_about', label: 'About', url: '/about' },
        { id: 'footer_nav_services', label: 'Services', url: '/services' },
        { id: 'footer_nav_contact', label: 'Contact', url: '/contact' },
    ],
    socialLinks: [
      { id: 'sl_linkedin', url: "https://linkedin.com/company/kaste-brands", label: "LinkedIn", iconUrl: "https://res.cloudinary.com/dwwvh34yi/image/upload/v1753228294/linkedin_ltqxuy.svg" },
      { id: 'sl_twitter', url: "https://twitter.com/kastebrands", label: "X (Twitter)", iconUrl: "https://res.cloudinary.com/dwwvh34yi/image/upload/v1753228294/twitter_itf6wp.svg" },
      { id: 'sl_instagram', url: "https://instagram.com/kastebrands", label: "Instagram", iconUrl: "https://res.cloudinary.com/dwwvh34yi/image/upload/v1753228456/instagram_wd9tua.svg" },
      { id: 'sl_tiktok', url: "https://www.tiktok.com/@kastebrands", label: "TikTok", iconUrl: "https://res.cloudinary.com/dwwvh34yi/image/upload/v1753228295/tiktok_avr92v.svg" },
      { id: 'sl_behance', url: "https://www.behance.net/kastebrands", label: "Behance", iconUrl: "https://res.cloudinary.com/dwwvh34yi/image/upload/v1753228293/behance_jcdldl.svg" },
      { id: 'sl_github', url: "https://github.com/kastebrands", label: "GitHub", iconUrl: "https://res.cloudinary.com/dwwvh34yi/image/upload/v1753228293/github_agymjn.svg" },
      { id: 'sl_facebook', url: "https://facebook.com/KasteBrands", label: "Facebook", iconUrl: "https://res.cloudinary.com/dwwvh34yi/image/upload/v1753228337/facebook-color_xx6keh.svg" },
      { id: 'sl_whatsapp', url: "https://wa.me/254795071901", label: "WhatsApp", iconUrl: "https://res.cloudinary.com/dwwvh34yi/image/upload/v1753226530/whatsapp-svgrepo-com_tdqmtd.svg" },
    ]
  },
  homepage: {
    hero: {
      title: 'Build Bold.<br />Operate Smart.<br />Scale Fast.',
      subtitle: 'Fueling brands with bold digital energy. We help businesses thrive in the digital era through intelligent tech solutions and creative branding that drives growth.',
      backgroundImageUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753291053/hero_section_1_rnglfv.png',
    },
    featuredServices: {
      title: 'Featured Services',
      subtitle: 'Expertise to elevate every facet of your brand.',
      serviceIds: ['web-designs', 'ai-systems', 'brand-identity'],
    },
    clientMarquee: {
      title: 'Trusted by Industry Innovators',
      clients: [
        [
          { id: 'client_nexus', name: 'NEXUS', logoUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753313001/client-logos/nexus_white.svg' },
          { id: 'client_quantum', name: 'Quantum', logoUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753313002/client-logos/quantum_white.svg' },
        ],
        [
          { id: 'client_helios', name: 'Helios', logoUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753313011/client-logos/helios_white.svg' },
          { id: 'client_odyssey', name: 'Odyssey', logoUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753313012/client-logos/odyssey_white.svg' },
        ]
      ],
    },
    tabsSection: {
      title: 'Our Innovation Hub',
      subtitle: "A glimpse into the technologies we master and the projects we're building.",
      tabs: [
        { id: 'ai', label: 'AI Tools', icon: 'BrainCircuit', items: [
            { id: 'tab_ai_gemini', icon: { type: 'custom', value: 'GeminiIcon'}, title: 'Gemini & GPT Models', description: 'For advanced text generation, summarization, and analysis.' },
        ]},
        { id: 'stack', label: 'Our Stack', icon: 'Code', items: [
            { id: 'tab_stack_react', icon: { type: 'custom', value: 'ReactIcon'}, title: 'React & Next.js', description: 'For building scalable and performant web applications.' },
        ]},
        { id: 'projects', label: 'In The Works', icon: 'Loader', items: [
            { id: 'tab_proj_content', icon: { type: 'lucide', value: 'Lightbulb' }, title: 'AI-Powered Content Platform', description: 'Developing a SaaS for automated content creation and optimization.', iconClassName: "text-yellow-400"},
        ]},
      ],
    },
    stats: {
        title: 'Data-Driven Success',
        subtitle: 'Our track record, by the numbers.',
        items: [
            { id: 'stat_projects', icon: 'Briefcase', value: '75+', label: 'Projects Delivered' },
        ]
    }
  },
  about: {
      hero: {
          title: "We're Not Just an Agency.",
          highlightedText: "We're Your Growth Partner.",
          subtitle: "Kaste Brands & Designs was born from a simple belief: audacious ideas deserve brilliant execution."
      },
      mission: {
          title: "Where Vision Meets Velocity",
          body: "We're not just service providers; we are your strategic partners in digital evolution.",
          imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
          points: [
              { id: 'mission_point_strat', icon: 'Target', title: 'Strategic Precision', text: 'Every design, every line of code, is crafted with purpose to achieve your business objectives.'},
          ]
      },
      principles: {
          title: "Our Guiding Principles",
          subtitle: "This is the ethos that drives our work and our relationships.",
          items: [
              { id: 'principle_partner', icon: 'HeartHandshake', title: 'Radical Partnership', text: 'No black boxes. No jargon. We operate as a true extension of your team.'},
          ]
      },
      cta: {
          title: "Ready to build something extraordinary?",
          subtitle: "Let's challenge the status quo together. Tell us about your vision.",
          buttonText: "Start the Conversation"
      }
  },
  contact: {
      hero: {
          title: "Get In Touch",
          subtitle: "Have a project in mind or just want to say hello? We'd love to hear from you."
      },
      details: {
          email: 'info@kastebrands.co.ke',
          phone: '+254 795 071 901',
          location: 'Nairobi, Kenya (Remote First)'
      }
  },
  popup: {
    enabled: false,
    type: 'announcement',
    icon: 'Megaphone',
    title: 'New Announcement!',
    message: 'Check out our latest news or special offers. You can customize this message in the admin panel.',
    ctaText: 'Learn More',
    ctaLink: '/about',
    imageUrl: '',
  },
  services: defaultServices,
  projects: defaultProjects,
};

// This function is called on app start and on websocket update
export const fetchAndCacheSiteContent = async (): Promise<SiteContent> => {
  try {
    const response = await fetch(`${API_URL}/api/content`, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
    }
    const content: SiteContent = await response.json();
    siteContentCache = content;
    return content;
  } catch (e) {
    console.error("Error fetching site content from API, using fallback.", e);
    // As a fallback, use the hardcoded default content
    if (!siteContentCache) {
      siteContentCache = JSON.parse(JSON.stringify(defaultSiteContent));
    }
    return siteContentCache!;
  }
};

export const saveSiteContent = async (content: SiteContent): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/content`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
        cache: 'no-store',
    });
    if (!response.ok) {
        throw new Error(`Failed to save content: ${response.statusText}`);
    }
    // Update cache after successful save
    siteContentCache = content;
  } catch (e) {
    console.error("Error saving site content to API", e);
    throw e; // re-throw to be handled by the caller
  }
};

export const resetSiteContent = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/content/reset`, {
        method: 'POST',
        cache: 'no-store',
    });
    if (!response.ok) {
        throw new Error(`Failed to reset content: ${response.statusText}`);
    }
    // Fetch the new (reset) content to update the cache
    await fetchAndCacheSiteContent();
  } catch (e) {
    console.error("Error resetting site content via API", e);
    throw e;
  }
};

// This is the primary method components will use to get content.
// It's synchronous and relies on the cache being populated by `fetchAndCacheSiteContent`.
export const getSiteContent = (): SiteContent => {
  if (!siteContentCache) {
    console.warn("getSiteContent called before cache was initialized. Returning default content.");
    // Return a deep copy of the default content as a temporary fallback.
    return JSON.parse(JSON.stringify(defaultSiteContent));
  }
  return siteContentCache;
};

// This function is for internal use by the app to get the raw cached content
// or null if not yet loaded.
export const getCachedSiteContent = (): SiteContent | null => {
    return siteContentCache;
}


// --- Convenience helpers ---
export const getServices = (): Service[] => {
  return getSiteContent().services;
};

export const getServiceById = (id: string): Service | undefined => {
  const content = getSiteContent();
  return content.services.find(service => service.id === id);
};

export const getProjects = (): Project[] => {
    return getSiteContent().projects;
};

export const getProjectsByServiceId = (serviceId: string): Project[] => {
    const content = getSiteContent();
    return content.projects.filter(p => p.serviceId === serviceId);
}
