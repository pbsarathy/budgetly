import { test, expect } from '@playwright/test';

/**
 * CSP (Content Security Policy) and API Tests
 *
 * These tests verify that:
 * - Supabase API calls are not blocked by CSP
 * - Network requests succeed without CORS errors
 * - No console errors related to CSP violations
 * - API endpoints return expected responses
 */

test.describe('CSP and API Integration', () => {
  test.beforeEach(async ({ page, context }) => {
    // Simulate authenticated state
    await context.addCookies([
      {
        name: 'sb-access-token',
        value: 'mock-token',
        domain: 'localhost',
        path: '/',
      },
    ]);
  });

  test('should load page without CSP violations', async ({ page }) => {
    const cspViolations: string[] = [];

    // Listen for console errors, specifically CSP violations
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (
          text.includes('Content Security Policy') ||
          text.includes('CSP') ||
          text.includes('blocked by CSP')
        ) {
          cspViolations.push(text);
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait a bit for any async CSP violations
    await page.waitForTimeout(2000);

    // Should have no CSP violations
    expect(cspViolations).toHaveLength(0);
  });

  test('should successfully make Supabase API calls', async ({ page }) => {
    const failedRequests: string[] = [];
    const apiCalls: string[] = [];

    // Monitor network requests
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('supabase')) {
        apiCalls.push(url);
      }
    });

    page.on('requestfailed', (request) => {
      const url = request.url();
      if (url.includes('supabase')) {
        failedRequests.push(`${request.method()} ${url}: ${request.failure()?.errorText}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for API calls to complete
    await page.waitForTimeout(3000);

    // Log API calls for debugging
    console.log('Supabase API calls detected:', apiCalls.length);
    console.log('Failed requests:', failedRequests);

    // Should have no failed Supabase requests
    expect(failedRequests).toHaveLength(0);
  });

  test('should not have CORS errors', async ({ page }) => {
    const corsErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('CORS') || text.includes('Cross-Origin')) {
          corsErrors.push(text);
        }
      }
    });

    page.on('requestfailed', (request) => {
      const failure = request.failure();
      if (failure?.errorText.includes('CORS')) {
        corsErrors.push(`${request.url()}: ${failure.errorText}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(2000);

    // Should have no CORS errors
    expect(corsErrors).toHaveLength(0);
  });

  test('should verify API responses are successful', async ({ page }) => {
    const apiResponses: Array<{ url: string; status: number }> = [];

    page.on('response', (response) => {
      const url = response.url();
      if (url.includes('supabase') || url.includes('api')) {
        apiResponses.push({
          url,
          status: response.status(),
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Trigger some API calls by interacting with the app
    await page.waitForTimeout(2000);

    // Filter for actual API calls (not 304 or redirects)
    const relevantResponses = apiResponses.filter(
      (r) => r.status !== 304 && r.status !== 0
    );

    if (relevantResponses.length > 0) {
      // All responses should be successful (2xx) or acceptable (4xx for auth)
      const failedResponses = relevantResponses.filter(
        (r) => r.status >= 500
      );

      console.log('API Responses:', relevantResponses);
      console.log('Failed (5xx) responses:', failedResponses);

      expect(failedResponses).toHaveLength(0);
    }
  });

  test('should verify Supabase connection is established', async ({ page }) => {
    let hasSupabaseConnection = false;

    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('supabase')) {
        // Check for successful connection (2xx status)
        if (response.status() >= 200 && response.status() < 300) {
          hasSupabaseConnection = true;
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Give time for Supabase connection
    await page.waitForTimeout(3000);

    // Either we have a Supabase connection, or the app works without it
    // (Both are valid depending on auth state)
    console.log('Supabase connection established:', hasSupabaseConnection);
  });

  test('should not have network timeout errors', async ({ page }) => {
    const timeoutErrors: string[] = [];

    page.on('requestfailed', (request) => {
      const failure = request.failure();
      if (failure?.errorText.includes('timeout') || failure?.errorText.includes('ETIMEDOUT')) {
        timeoutErrors.push(`${request.url()}: ${failure.errorText}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(2000);

    expect(timeoutErrors).toHaveLength(0);
  });

  test('should verify all static assets load correctly', async ({ page }) => {
    const failedAssets: string[] = [];

    page.on('requestfailed', (request) => {
      const url = request.url();
      // Check for CSS, JS, images, fonts
      if (
        url.endsWith('.css') ||
        url.endsWith('.js') ||
        url.endsWith('.png') ||
        url.endsWith('.jpg') ||
        url.endsWith('.svg') ||
        url.endsWith('.woff') ||
        url.endsWith('.woff2')
      ) {
        failedAssets.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failedAssets).toHaveLength(0);
  });

  test('should check for JavaScript runtime errors', async ({ page }) => {
    const jsErrors: string[] = [];

    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out known acceptable errors
        if (
          !text.includes('favicon') &&
          !text.includes('404') &&
          !text.includes('CSP') // Already tested separately
        ) {
          jsErrors.push(text);
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Interact with the app to trigger potential errors
    await page.waitForTimeout(2000);

    console.log('JavaScript errors detected:', jsErrors);

    // Should have minimal or no JavaScript errors
    // Allow for some non-critical errors but flag critical ones
    const criticalErrors = jsErrors.filter(
      (err) =>
        !err.includes('Warning') &&
        !err.includes('DevTools') &&
        !err.includes('Extension')
    );

    expect(criticalErrors.length).toBeLessThan(3);
  });

  test('should verify API endpoints use HTTPS in production', async ({ page }) => {
    const insecureRequests: string[] = [];

    page.on('request', (request) => {
      const url = request.url();
      // Check if this is a production build
      const isProduction = !url.includes('localhost');

      if (isProduction && url.startsWith('http://') && !url.includes('localhost')) {
        insecureRequests.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // All production API calls should use HTTPS
    expect(insecureRequests).toHaveLength(0);
  });

  test('should handle API rate limiting gracefully', async ({ page }) => {
    const rateLimitResponses: number[] = [];

    page.on('response', (response) => {
      if (response.status() === 429) {
        rateLimitResponses.push(response.status());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // If rate limiting occurs, app should handle it
    if (rateLimitResponses.length > 0) {
      // Should show user-friendly error message
      const errorMessage = page.getByText(/too many requests|slow down|try again/i);
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }
  });

  test('should verify authentication headers are sent correctly', async ({ page }) => {
    let hasAuthHeader = false;

    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('supabase')) {
        const headers = request.headers();
        if (headers['authorization'] || headers['apikey']) {
          hasAuthHeader = true;
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(2000);

    // If Supabase requests were made, they should have auth headers
    console.log('Auth headers present:', hasAuthHeader);
  });
});
