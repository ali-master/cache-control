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
| `max-age` | Number | Maximum time (in seconds) a resource is considered fresh | `max-age=3600` |
| `s-maxage` | Number | Overrides max-age for shared caches (e.g., CDNs) | `s-maxage=7200` |
| `no-cache` | Boolean | Forces caches to submit request to origin server for validation before releasing cached copy | `no-cache` |
| `no-store` | Boolean | Cache should not store anything about the request or response | `no-store` |
| `no-transform` | Boolean | Caches must not modify the response body | `no-transform` |
| `public` | Boolean | Response may be cached by any cache | `public` |
| `private` | Boolean | Response is intended for a single user only | `private` |
| `must-revalidate` | Boolean | Once stale, cache must not use response without successful validation | `must-revalidate` |
| `proxy-revalidate` | Boolean | Same as must-revalidate but only for shared caches | `proxy-revalidate` |
| `immutable` | Boolean | Response body will not change over time | `immutable` |
| `stale-while-revalidate` | Number | Cache may serve stale response while revalidating in background | `stale-while-revalidate=60` |
| `stale-if-error` | Number | Cache may serve stale response if origin server responds with error | `stale-if-error=300` |
| `must-understand` | Boolean | Cache should store response only if it understands requirements | `must-understand` |
| `only-if-cached` | Boolean | Client only wants cached response (used in requests) | `only-if-cached` |

#### 🕐 Time-Based Directives
```typescript
cache
  .set('max-age', 3600)              // Browser cache duration (seconds)
  .set('s-maxage', 7200)             // CDN cache duration (seconds)
  .set('stale-while-revalidate', 60) // Serve stale while fetching fresh
  .set('stale-if-error', 300);       // Serve stale on origin error
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

This project is licensed under the MIT License. See the [LICENCE](./LICENCE) file for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ali-master">Ali Master</a> and the open source community.
</p>
