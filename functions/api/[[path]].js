// This default structure is used by the worker if no data is provided on creation.
const defaultSiteContent = {
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
  services: [
    {
        id: 'web-designs',
        title: 'Web Designs',
        description: 'We build bold, responsive websites that captivate users and drive business growth with style.',
        longDescription: "Your website is your digital storefront. We don't just build pages; we architect experiences.",
        imageUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753214408/website_peview_yamyba.png',
    }
  ],
  projects: [],
};

// --- Atlas Data API Configuration ---
// These should be set as secrets in your Cloudflare Worker environment:
// - DATA_API_BASE_URL: e.g. "https://data.mongodb-api.com/app/data-xxxxx/endpoint/data/v1"
// - DATA_API_KEY: Your MongoDB Atlas Data API Key
// - DATA_SOURCE: e.g., "Cluster0" (Optional, falls back to "Cluster0")
// - DATABASE_NAME: e.g., "kaste-db" (Optional, falls back to "kaste-db")
// - COLLECTION_NAME: e.g., "sitecontents" (Optional, falls back to "sitecontents")
// - MASTER_PASSWORD: The password for the admin panel.

// Generic helper function to call the Atlas Data API
async function atlasFetch(action, params, env) {
    const DATA_API_BASE_URL = env.DATA_API_BASE_URL;
    const DATA_API_KEY = env.DATA_API_KEY;
    const DATA_SOURCE = env.DATA_SOURCE || "Cluster0";
    const DATABASE_NAME = env.DATABASE_NAME || "kaste-db";
    const COLLECTION_NAME = env.COLLECTION_NAME || "sitecontents";

    if (!DATA_API_BASE_URL || !DATA_API_KEY) {
        throw new Error('Database credentials (DATA_API_BASE_URL or DATA_API_KEY) are not configured in worker secrets.');
    }

    const response = await fetch(`${DATA_API_BASE_URL}/action/${action}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': DATA_API_KEY,
        },
        body: JSON.stringify({
            dataSource: DATA_SOURCE,
            database: DATABASE_NAME,
            collection: COLLECTION_NAME,
            ...params,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Atlas API Error: ${response.status} ${errorText}`);
    }
    return response.json();
}

async function handleGetContent(env) {
    try {
        let data = await atlasFetch('findOne', { filter: {} }, env);
        if (!data.document) {
            console.log('No content found, creating default document.');
            await atlasFetch('insertOne', { document: { content: defaultSiteContent } }, env);
            return defaultSiteContent;
        }
        return data.document.content;
    } catch(e) {
        console.error("Failed to get content from Atlas, returning default content.", e);
        return defaultSiteContent;
    }
}

async function handleUpdateContent(request, env) {
    const newContent = await request.json();
    await atlasFetch('updateOne', {
        filter: {},
        update: { $set: { content: newContent } },
        upsert: true,
    }, env);
    return { success: true };
}

async function handleResetContent(env) {
    // Note: This is a destructive operation.
    await atlasFetch('deleteOne', { filter: {} }, env);
    await atlasFetch('insertOne', { document: { content: defaultSiteContent } }, env);
    return { success: true };
}

async function handleLogin(request, env) {
    const { password } = await request.json();
    const masterPassword = env.MASTER_PASSWORD;
    
    if (!masterPassword) {
        console.error("MASTER_PASSWORD secret is not set in the worker environment.");
        return { success: false, message: 'Server configuration error.' };
    }
    
    if (password === masterPassword) {
        return { success: true };
    } else {
        return { success: false, message: 'Invalid credentials' };
    }
}


/**
 * onRequest is the magic function that handles all incoming requests
 * to this Pages Function.
 * @param {EventContext<Env, Params, Data>} context - The context object.
 */
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust for production
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  let responseData;
  let status = 200;

  try {
    // The path is now relative to `/api/`
    const apiPath = url.pathname.replace('/api/', '/');
    switch (apiPath) {
      case '/content':
        if (request.method === 'GET') {
          responseData = await handleGetContent(env);
        } else if (request.method === 'POST') {
          responseData = await handleUpdateContent(request, env);
        }
        break;
      case '/content/reset':
        if (request.method === 'POST') {
          responseData = await handleResetContent(env);
        }
        break;
      case '/admin/login':
        if (request.method === 'POST') {
          const loginResult = await handleLogin(request, env);
          responseData = loginResult;
          if (!loginResult.success) {
            status = loginResult.message === 'Server configuration error.' ? 500 : 401;
          }
        }
        break;
      default:
        responseData = { error: 'Not Found' };
        status = 404;
    }
  } catch (error) {
    console.error('Worker error:', error);
    responseData = { error: 'Internal Server Error', details: error.message };
    status = 500;
  }

  if (!responseData) {
    responseData = { error: 'Method Not Allowed' };
    status = 405;
  }

  return new Response(JSON.stringify(responseData), {
    status: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Adjust for production
    },
  });
}
