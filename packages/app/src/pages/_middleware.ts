import { NextResponse, NextRequest } from 'next/server';

const DISALLOWED_HTTP_METHODS = ['POST', 'PUT', 'DELETE'];

export function middleware(req: NextRequest) {
  const method = req.method.toUpperCase();
  if (DISALLOWED_HTTP_METHODS.includes(method)) {
    return new Response(undefined, {
      status: 403,
    });
  }

  /**
   * Ensure the correct language by resetting the original hostname
   * Next.js will use the hostname to detect the language it should serve.
   */
  const response = NextResponse.next();
  response.headers.set(
    'host',
    req.headers.get('x-original-host') || req.headers.get('host') || ''
  );

  /**
   * Remove header from Sanity proxyed assets
   */
  response.headers.delete('via');

  return response;
}
