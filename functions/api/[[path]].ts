import { Router, IRequest, error, json } from 'itty-router';
import { defaultSiteContent } from './_defaults';

// --- Cloudflare Pages Types (Manual Definitions) ---
// These are definitions to avoid needing @cloudflare/workers-types
// in environments where it might not be available, ensuring robustness.

/**
 * A KVNamespace provides access to a corresponding instance of the Cloudflare
 * Workers KV store.
 */
interface KVNamespace {
  get(key: string, type: 'text'): Promise<string | null>;
  get<T>(key: string, type: 'json'): Promise<T | null>;
  get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>;
  get(key: string, type: 'stream'): Promise<ReadableStream | null>;

  put(
    key: string,
    value: string | ReadableStream | ArrayBuffer | FormData,
    options?: {
      expiration?: string | number;
      expirationTtl?: number;
      metadata?: any;
    }
  ): Promise<void>;
}

interface EventContext<
  Env = unknown,
  Params extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> {
  request: Request;
  env: Env;
  params: Record<Params, string | string[]>;
  waitUntil(promise: Promise<any>): void;
  next(input?: Request | string, init?: RequestInit): Promise<Response>;
  functionPath: string;
  data: Data;
}

type PagesFunction<
  Env = unknown,
  Params extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> = (
  context: EventContext<Env, Params, Data>
) => Response | Promise<Response>;
// --- End Manual Type Definitions ---


// Define the bindings that Cloudflare Pages will inject into the environment.
export interface Env {
  SITE_CONTENT_KV: KVNamespace;
  MASTER_PASSWORD?: string; // This should be set as a secret in the Pages project settings.
}

const router = Router();

// A helper to add CORS headers to a response. This is useful for local development.
const withCors = (response: Response): Response => {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
};

// Handle CORS preflight requests.
router.options('*', () => {
    return withCors(new Response(null, { status: 204 }));
});


// GET /api/content
router.get('/api/content', async (request: IRequest, env: Env) => {
  let content = await env.SITE_CONTENT_KV.get('site_content', 'json');
  if (!content) {
    console.log('No content found in KV, seeding with default content.');
    content = defaultSiteContent;
    await env.SITE_CONTENT_KV.put('site_content', JSON.stringify(content));
  }
  return json(content);
});

// POST /api/content
router.post('/api/content', async (request: IRequest, env: Env) => {
    try {
        const newContentString = await request.text();
        // Basic validation to ensure we're not storing garbage
        const newContent = JSON.parse(newContentString); 
        await env.SITE_CONTENT_KV.put('site_content', newContentString);
        return json(newContent);
    } catch(e) {
      return error(400, "Invalid JSON in request body.");
    }
});

// POST /api/content/reset
router.post('/api/content/reset', async (request: IRequest, env: Env) => {
    const contentString = JSON.stringify(defaultSiteContent);
    await env.SITE_CONTENT_KV.put('site_content', contentString);
    return json(defaultSiteContent);
});

// POST /api/admin/login
router.post('/api/admin/login', async (request: IRequest, env: Env) => {
    try {
        const { password } = await request.json();
        const masterPassword = env.MASTER_PASSWORD;

        if (!masterPassword) {
            console.error('CRITICAL: MASTER_PASSWORD secret is not set in Cloudflare environment.');
            return error(500, 'Server configuration error.');
        }

        if (password === masterPassword) {
            return json({ success: true });
        } else {
            return error(401, 'Invalid credentials');
        }
    } catch (e) {
        return error(400, 'Invalid request body.');
    }
});


// 404 for all other routes starting with /api
router.all('/api/*', () => error(404, 'API route not found.'));


// This is the entrypoint for the Cloudflare Pages Function.
// It wires up the router and adds error handling and CORS.
export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    try {
        // itty-router's handle method can throw, so we wrap it
        const response = await router.handle(request, env, context);
        return withCors(response);
    } catch (e) {
        console.error('Router error:', e);
        // itty-router error responses are already Response objects
        if (e instanceof Response) {
            return withCors(e);
        }
        if (e instanceof Error) {
          return withCors(error(500, e.message));
        }
        return withCors(error(500, 'An unknown error occurred.'));
    }
};
