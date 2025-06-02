import { CacheControl } from "./cache-control";

/**
 * Minimal type definitions for framework response objects
 */
export interface ExpressResponse {
  setHeader(name: string, value: string | number | readonly string[]): this;
  set(field: string, value: string | string[]): this;
  header(field: string, value: string | string[]): this;
}

export interface FastifyReply {
  header(name: string, value: any): this;
  headers(headers: { [key: string]: any }): this;
}

export type SupportedResponse =
  | ExpressResponse
  | FastifyReply
  | { setHeader(name: string, value: string): void };

/**
 * CDN Provider types
 */
export const CDNProviders = {
  // Major CDN Providers
  vercel: "Vercel-CDN-Cache-Control",
  cloudflare: "Cloudflare-CDN-Cache-Control",
  fastly: "Surrogate-Control",
  "aws-cloudfront": "CloudFront-Cache-Control",
  akamai: "Edge-Control",
  bunny: "Bunny-Cache-Control",
  keycdn: "X-KeyCDN-Cache-Control",

  // Generic CDN headers
  "cdn-cache-control": "CDN-Cache-Control",
  "edge-control": "Edge-Control",
  "surrogate-control": "Surrogate-Control",

  // Platform-specific
  netlify: "Netlify-CDN-Cache-Control",
  render: "X-Render-Cache-Control",
  railway: "X-Railway-Cache-Control",

  // Enterprise CDNs
  "azure-front-door": "X-Azure-Cache-Control",
  "google-cloud-cdn": "X-Cloud-CDN-Cache-Control",
  "alibaba-cdn": "Ali-Swift-Cache-Control",
} as const;

export type CDNProvider = keyof typeof CDNProviders;
export type CDNHeaderName = (typeof CDNProviders)[CDNProvider];

/**
 * Get the appropriate CDN cache control header name for a specific provider
 * @param provider - The CDN provider name
 * @returns The CDN-specific cache control header name
 */
export function getCDNHeaderName(provider: CDNProvider): CDNHeaderName {
  return CDNProviders[provider];
}

/**
 * Generate CDN-specific cache control headers from a CacheControl instance
 * @param cache - The CacheControl instance
 * @param provider - The CDN provider name
 * @returns Object with the CDN header name and value
 */
export function getCDNHeader(
  cache: CacheControl,
  provider: CDNProvider,
): { header: CDNHeaderName; value: string } {
  const headerName = getCDNHeaderName(provider);
  const value = cache.toString();

  return {
    header: headerName,
    value: value,
  };
}

/**
 * Generate multiple CDN headers from a CacheControl instance
 * @param cache - The CacheControl instance
 * @param providers - Array of CDN provider names
 * @returns Array of objects with CDN header names and values
 */
export function getCDNHeaders(
  cache: CacheControl,
  providers: CDNProvider[],
): Array<{ header: CDNHeaderName; value: string }> {
  return providers.map((provider) => getCDNHeader(cache, provider));
}

/**
 * Type guard to check if response is a Fastify reply
 */
function isFastifyReply(response: any): response is FastifyReply {
  return typeof response.header === "function" && !response.setHeader;
}

/**
 * Apply CDN-specific cache headers to a response object
 * @param response - Express Response, Fastify Reply, or any object with setHeader method
 * @param cache - The CacheControl instance
 * @param providers - Array of CDN provider names or single provider
 * @returns The response object for chaining
 *
 * @example
 * // Express
 * app.get('/api/data', (req, res) => {
 *   const cache = new CacheControl().set('public', true).set('s-maxage', 3600);
 *   applyCDNHeaders(res, cache, 'vercel');
 *   res.json({ data: 'example' });
 * });
 *
 * @example
 * // Fastify
 * fastify.get('/api/data', async (request, reply) => {
 *   const cache = new CacheControl().set('public', true).set('s-maxage', 3600);
 *   applyCDNHeaders(reply, cache, ['vercel', 'cloudflare']);
 *   return { data: 'example' };
 * });
 */
export function applyCDNHeaders<T extends SupportedResponse>(
  response: T,
  cache: CacheControl,
  providers: CDNProvider | CDNProvider[],
): T {
  const providerList = Array.isArray(providers) ? providers : [providers];
  const headers = getCDNHeaders(cache, providerList);

  headers.forEach(({ header, value }) => {
    if (isFastifyReply(response)) {
      // Fastify uses .header() method
      response.header(header, value);
    } else {
      // Express and generic response objects use .setHeader()
      response.setHeader(header, value);
    }
  });

  return response;
}

/**
 * Get all available CDN providers
 * @returns Array of all CDN provider names
 */
export function getAllCDNProviders(): CDNProvider[] {
  return Object.keys(CDNProviders) as CDNProvider[];
}

/**
 * Check if a string is a valid CDN provider
 * @param provider - The provider name to check
 * @returns True if the provider is valid
 */
export function isValidCDNProvider(provider: string): provider is CDNProvider {
  return provider in CDNProviders;
}
