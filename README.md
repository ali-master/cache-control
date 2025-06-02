<p align="center">
  <img src="./assets/logo.svg" alt="Cache Control - Type-safe cache header management for modern applications">
</p>
<p align="center">
  <sub>Built for developers who need precise control over their caching strategy 🎯</sub>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@usex/cache-control">
    <img src="https://img.shields.io/npm/v/@usex/cache-control.svg" alt="npm version">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.0+-blue.svg" alt="TypeScript">
  </a>
  <a href="https://github.com/ali-master/cache-control">
    <img src="https://img.shields.io/badge/Zero-Dependencies-green.svg" alt="Zero Dependencies">
  </a>
</p>

## 🎯 What is Cache Control?

Cache Control is your type-safe companion for managing HTTP cache headers. No more string concatenation, no more guessing directive names, no more cache invalidation nightmares. Just a clean, fluent API that makes cache management actually enjoyable.

## 🚀 Quick Start

```bash
npm install @usex/cache-control
```

```typescript
import { CacheControl } from '@usex/cache-control';

// Build cache headers with confidence
const cache = new CacheControl()
  .set('public', true)
  .set('max-age', 3600)
  .set('s-maxage', 7200)
  .set('stale-while-revalidate', 60);

console.log(cache.toString());
// Output: "public, max-age=3600, s-maxage=7200, stale-while-revalidate=60"
```

## 🌟 Why Cache Control?

### Before (The Dark Ages 🌑)
```typescript
// String manipulation chaos
res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=' + (60 * 60 * 2));
res.setHeader('CDN-Cache-Control', 'max-age=7200'); // Hope you spelled it right!
res.setHeader('Vercel-CDN-Cache-Control', '...'); // What directives are even valid here?
```

### After (The Enlightenment ✨)
```typescript
const cache = new CacheControl()
  .set('public', true)
  .set('max-age', 3600)
  .set('s-maxage', 7200);

// Type-safe, readable, maintainable
res.setHeader('Cache-Control', cache.toString());
```

## 💪 Core Features

### 🎯 Type-Safe API
Full TypeScript support means your IDE catches mistakes before they hit production.

```typescript
const cache = new CacheControl()
  .set('max-age', 3600)        // ✅ TypeScript knows this is valid
  .set('maxAge', 3600)         // ❌ TypeScript error: Invalid directive
  .set('max-age', '3600');     // ❌ TypeScript error: Must be number
```

### 🔧 Fluent Chainable Interface
Build complex cache strategies with elegant method chaining.

```typescript
const cache = new CacheControl()
  .set('private', true)
  .set('max-age', 300)
  .set('must-revalidate', true);
```

### 📝 Parse Existing Headers
Working with incoming requests? Parse headers like a pro.

```typescript
const incomingHeader = req.headers['cache-control'];
const cache = new CacheControl(incomingHeader);

// Modify and send back
cache.set('max-age', cache.get('max-age') * 2);
res.setHeader('Cache-Control', cache.toString());
```

### 🌐 Multi-Header Support
Support for platform-specific CDN headers out of the box.

```typescript
// Standard Cache-Control
const browserCache = new CacheControl().set('public', true).set('max-age', 300);

// CDN-specific headers (Cloudflare, Fastly, etc.)
const cdnCache = new CacheControl().set('public', true).set('s-maxage', 7200);

// Vercel Edge Network
const vercelCache = new CacheControl().set('stale-while-revalidate', 60);
```

## 📚 Complete API Reference

### Constructor
```typescript
// Start fresh
const cache = new CacheControl();

// Parse existing header
const cache = new CacheControl("public, max-age=3600");
```

### Available Directives

#### 📊 Cache-Control Directives Reference

| Directive | Type | Description | Example |
|-----------|------|-------------|---------|
| `max-age` | Number | **Browser Cache Duration** - Specifies the maximum amount of time (in seconds) a resource is considered fresh. After this time expires, the cache must check with the origin server before using the cached copy | `max-age=3600` |
| `s-maxage` | Number | **CDN Cache Duration** - Overrides `max-age` for shared caches like CDNs and proxies. Allows different cache durations for browsers vs edge servers | `s-maxage=7200` |
| `max-stale` | Number | **Accept Stale Content** - Indicates the client is willing to accept a response that has exceeded its expiration time by up to the specified number of seconds. Useful for offline functionality | `max-stale=300` |
| `min-fresh` | Number | **Require Fresh Content** - Client wants a response that will still be fresh for at least the specified number of seconds. Ensures content validity for time-sensitive operations | `min-fresh=60` |
| `no-cache` | Boolean | **Always Validate** - Forces caches to submit the request to the origin server for validation before releasing a cached copy. Ensures users get the latest content while still benefiting from caching | `no-cache` |
| `no-store` | Boolean | **Never Store** - The cache must not store either the request or response. Used for sensitive information like personal banking data or medical records | `no-store` |
| `no-transform` | Boolean | **Preserve Original** - Intermediate caches or proxies must not modify the response body (no compression, image optimization, etc.). Critical for applications requiring exact byte-for-byte responses | `no-transform` |
| `only-if-cached` | Boolean | **Offline Mode** - Client only wants a cached response and won't accept a network request. Returns 504 (Gateway Timeout) if no cached response is available. Perfect for offline-first applications | `only-if-cached` |
| `public` | Boolean | **Cacheable by All** - Response may be cached by any cache, even if it would normally be non-cacheable. Explicitly marks responses as safe for CDN and browser caching | `public` |
| `private` | Boolean | **User-Specific** - Response is intended for a single user and must not be stored by shared caches like CDNs. Browser cache only. Used for personalized content | `private` |
| `must-revalidate` | Boolean | **Strict Validation** - Once stale, cache must not use the response without successful validation with the origin server. Prevents serving outdated content even in error scenarios | `must-revalidate` |
| `proxy-revalidate` | Boolean | **CDN Validation** - Like `must-revalidate` but only applies to shared caches. Allows browsers to be more lenient while keeping CDN content strict | `proxy-revalidate` |
| `must-understand` | Boolean | **Cache Compatibility** - Cache should only store the response if it understands the requirements for caching based on status code and request method. Ensures proper cache behavior | `must-understand` |
| `immutable` | Boolean | **Never Changes** - Indicates the response body will not change over time. Browsers can skip revalidation even when user hits refresh. Perfect for versioned static assets | `immutable` |
| `stale-while-revalidate` | Number | **Background Refresh** - Cache may serve stale content while asynchronously revalidating in the background. Improves perceived performance by avoiding loading delays | `stale-while-revalidate=60` |
| `stale-if-error` | Number | **Fallback Content** - Cache may serve stale content if the origin server responds with 5xx errors or is unreachable. Improves reliability during outages | `stale-if-error=300` |

#### 🕐 Time-Based Directives
```typescript
cache
  .set('max-age', 3600)              // Browser cache: 1 hour
  .set('s-maxage', 7200)             // CDN cache: 2 hours
  .set('max-stale', 300)             // Accept content up to 5 min stale
  .set('min-fresh', 60)              // Require at least 1 min fresh
  .set('stale-while-revalidate', 60) // Serve stale while fetching fresh
  .set('stale-if-error', 300);       // Serve stale for 5 min on errors
```

#### 🔒 Access Control Directives
```typescript
cache
  .set('public', true)     // Any cache can store
  .set('private', true);   // Only browser can store
```

#### 🚫 Validation Directives
```typescript
cache
  .set('no-cache', true)         // Must revalidate before use
  .set('no-store', true)         // Don't store at all
  .set('must-revalidate', true)  // No stale content allowed
  .set('proxy-revalidate', true); // CDNs must revalidate
```

#### ⚡ Performance Directives
```typescript
cache
  .set('immutable', true)      // Content never changes
  .set('no-transform', true)   // Don't modify (compress, etc.)
  .set('must-understand', true); // Only cache if you understand
```

### Methods

```typescript
// Set a directive
cache.set('max-age', 3600);

// Get a directive value
const maxAge = cache.get('max-age'); // 3600

// Check if directive exists
if (cache.has('public')) {
  // ...
}

// Remove a directive
cache.delete('private');

// Clear all directives
cache.clear();

// Convert to string
const header = cache.toString();
```

## 🎮 Real-World Examples

### Static Assets (1 Year Cache)
```typescript
const staticAssets = new CacheControl()
  .set('public', true)
  .set('max-age', 31536000)
  .set('immutable', true);
```

### API Responses (Cache with Revalidation)
```typescript
const apiResponse = new CacheControl()
  .set('private', true)
  .set('max-age', 0)
  .set('must-revalidate', true);
```

### Dynamic Content (Stale-While-Revalidate)
```typescript
const dynamicContent = new CacheControl()
  .set('public', true)
  .set('max-age', 300)
  .set('stale-while-revalidate', 60)
  .set('stale-if-error', 3600);
```

### User-Specific Content
```typescript
const userContent = new CacheControl()
  .set('private', true)
  .set('max-age', 600)
  .set('must-revalidate', true);
```

### Offline-First Application
```typescript
// Request headers for offline support
const offlineRequest = new CacheControl()
  .set('only-if-cached', true)
  .set('max-stale', 86400); // Accept day-old content when offline
```

### Time-Sensitive Content
```typescript
// Ensure content is fresh for critical operations
const criticalData = new CacheControl()
  .set('no-cache', true)
  .set('min-fresh', 300); // Must be fresh for at least 5 minutes
```

## 🔥 Pro Tips

### 1. CDN vs Browser Caching
```typescript
// Short browser cache, long CDN cache
const smartCache = new CacheControl()
  .set('public', true)
  .set('max-age', 300)      // 5 minutes for browsers
  .set('s-maxage', 86400);  // 24 hours for CDNs
```

### 2. Cache Invalidation Strategy
```typescript
// Use stale-while-revalidate for better UX
const betterUX = new CacheControl()
  .set('public', true)
  .set('max-age', 300)
  .set('stale-while-revalidate', 60);
```

### 3. Security First
```typescript
// Sensitive data should never be cached publicly
const secureData = new CacheControl()
  .set('private', true)
  .set('no-store', true);
```

## 🤝 Contributing

Got ideas? Found a bug? PRs are welcome! Check out our [contributing guidelines](https://github.com/ali-master/cache-control).

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ali-master">Ali Master</a> and the open source community.
</p>
