# Environment Configuration Guide

## Setting Up Environment Variables

This Next.js application uses environment variables for configuration. Follow these steps to set up your environment:

### 1. Create Environment File

Copy the `env.example` file to create your local environment configuration:

```bash
# For development
cp env.example .env.local

# For production
cp env.example .env.production
```

### 2. Configure Variables

Edit your environment file and update the following variables:

#### Required Variables

- **NEXT_PUBLIC_STRAPI_URL**: The URL of your Strapi backend server
  - Development: `http://localhost:1337`
  - Production: `https://your-strapi-domain.com`

#### Optional Variables

- **NEXT_PUBLIC_APP_NAME**: Application name (default: "Tenant App NZL")
- **NEXT_PUBLIC_APP_VERSION**: Application version (default: "1.0.0")
- **NODE_ENV**: Environment mode (`development` or `production`)

### 3. Environment File Priority

Next.js loads environment variables in this order (higher priority overrides lower):

1. `.env.local` (always loaded, except in test environment)
2. `.env.development` (when NODE_ENV=development)
3. `.env.production` (when NODE_ENV=production)
4. `.env`

### 4. Security Notes

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` or `.env.production` files to version control
- Use `.env.example` as a template for other developers

### 5. Current Usage

The application currently uses these environment variables:

- `NEXT_PUBLIC_STRAPI_URL` - Used in:
  - `/lib/apiUtils.ts` - For API calls to fetch units
  - `/app/components/AuthProvider.tsx` - For authentication API calls

### 6. Adding New Variables

When adding new environment variables:

1. Add them to `env.example` with comments
2. Use `NEXT_PUBLIC_` prefix for client-side variables
3. Update this documentation
4. Consider adding TypeScript types for better development experience
