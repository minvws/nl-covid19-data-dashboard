import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const middleware = async (request: NextRequest) => {
  const clonedURL = request.nextUrl.clone();

  // Fetch the URL from the current request, if it is not a 404 then do not continue with execution.
  const response = await fetch(request.nextUrl.href);
  if (response.status !== 404) return NextResponse.next();

  const isLevel = (level: string): boolean => request.nextUrl.pathname.startsWith(`/${level}`);
  const showGenericNotFoundPage = !(isLevel('landelijk') || isLevel('gemeente') || isLevel('artikelen'));

  if (showGenericNotFoundPage) {
    clonedURL.pathname = '/not-found/general';
    return NextResponse.rewrite(clonedURL);
  }

  if (isLevel('landelijk')) {
    clonedURL.pathname = '/not-found/nl';
    return NextResponse.rewrite(clonedURL);
  }

  if (isLevel('gemeente')) {
    clonedURL.pathname = '/not-found/gm';
    return NextResponse.rewrite(clonedURL);
  }

  if (isLevel('artikelen')) {
    clonedURL.pathname = '/not-found/article';
    return NextResponse.rewrite(clonedURL);
  }
};
