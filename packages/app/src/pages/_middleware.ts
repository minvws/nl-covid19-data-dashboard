import { NextResponse, NextRequest } from 'next/server';

const DISALLOWED_HTTP_METHODS = ['POST', 'PUT', 'DELETE'];

export function middleware(req: NextRequest) {
  const method = req.method.toUpperCase();

  if (DISALLOWED_HTTP_METHODS.includes(method)) {
    return new Response(undefined, {
      status: 403,
    });
  }

  const response = NextResponse.next();

  /**
   * Ensure the correct language by resetting the original hostname
   * Next.js will use the hostname to detect the language it should serve.
   */
  response.headers.set(
    'host',
    req.headers.get('x-original-host') || req.headers.get('host') || ''
  );

  return response;

  //   return NextResponse.next();

  //   const basicAuth = req.headers.get('authorization');

  //   if (basicAuth) {
  //     const auth = basicAuth.split(' ')[1];
  //     const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':');

  //     if (user === '4dmin' && pwd === 'testpwd123') {
  //       return NextResponse.next();
  //     }
  //   }

  //   return new Response('Auth required', {
  //     status: 401,
  //     headers: {
  //       'WWW-Authenticate': 'Basic realm="Secure Area"',
  //     },
  //   });
}
