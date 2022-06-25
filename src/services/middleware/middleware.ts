import type { NextFetchEvent } from 'next/server'
import type { NextRequest } from 'next/server'

export type Middleware = (
  request: NextRequest,
  event: NextFetchEvent
) => Promise<Response | undefined> | Response | undefined;

/**
 * Authentication
 * Bot protection
 * Redirects and rewrites
 * Handling unsupported browsers
 * Feature flags and A/B tests
 * Advanced i18n routing requirements
 */
function middleware(
  request: NextRequest,
  event: NextFetchEvent
): Promise<Response | undefined> | Response | undefined {
  return;
}
