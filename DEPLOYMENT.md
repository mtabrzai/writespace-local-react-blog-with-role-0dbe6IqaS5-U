# Deployment Guide

## Overview

This document provides instructions for deploying **writespace** to Vercel, including environment variable configuration, CI/CD setup, and production considerations.

## Prerequisites

- **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
- **GitHub Repository**: Host your writespace code on GitHub
- **Environment Variables**: Required values for backend API and frontend configuration

## Environment Variables

Create a `.env.local` file in the root directory of your project with the following variables:

```env
VITE_API_BASE_URL=https://your-backend-api-url.com/api
```

### Required Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_API_BASE_URL` | Base URL for the backend API | `https://api.writespace.com/api` |

### Optional Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_APP_TITLE` | Application title for metadata | `writespace` |

## Vercel Deployment

### Step 1: Import Project

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repository containing the writespace code
4. Click **"Import"**

### Step 2: Configure Project

1. **Framework Preset**: Select **"Vite"** from the framework dropdown
2. **Root Directory**: Leave blank (project is in root)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### Step 3: Set Environment Variables

1. In the **"Environment Variables"** section, add all required variables from `.env.local`
2. For `VITE_API_BASE_URL`, use the production backend URL
3. Click **"Add"** to confirm each variable

### Step 4: Deploy

1. Click **"Deploy"** to start the build process
2. Wait for the deployment to complete
3. Verify the deployment by visiting the provided Vercel URL

## CI/CD Setup

### Automatic Deployments

Vercel automatically deploys your project when changes are pushed to the connected GitHub branch (default: `main`).

### Preview Deployments

- Every pull request generates a preview deployment
- Preview URLs are posted as comments in the PR
- Use these for testing before merging to production

### Production Deployments

- Merging to the `main` branch triggers a production deployment
- Production deployments are versioned and can be rolled back

## Custom Domains

1. Go to your project dashboard in Vercel
2. Navigate to **"Settings"** → **"Domains"**
3. Add your custom domain (e.g., `app.writespace.com`)
4. Follow the DNS configuration instructions provided by Vercel

## Monitoring and Logs

- **Deployment Logs**: Available in the Vercel dashboard under each deployment
- **Runtime Logs**: View real-time logs in the **"Logs"** tab of your project
- **Analytics**: Monitor performance and usage in the **"Analytics"** tab

## Rollback

To rollback to a previous deployment:

1. Go to your project dashboard
2. Click on **"Deployments"**
3. Find the deployment you want to rollback to
4. Click **"..."** → **"Promote to Production"**

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Build fails** | Check Vercel logs for errors. Verify all environment variables are set correctly. |
| **API requests fail** | Ensure `VITE_API_BASE_URL` points to the correct backend URL. Check CORS settings on the backend. |
| **Styles not loading** | Verify Tailwind CSS configuration. Ensure `dist` directory is correctly specified as the output directory. |
| **404 errors on refresh** | Configure rewrites in `vercel.json` to handle client-side routing. |

### Support

For additional help:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)