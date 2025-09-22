import { NextRequest, NextResponse } from 'next/server';

const USER = process.env.SWAGGER_USER || 'chat2mail';
const PASS = process.env.SWAGGER_PASSWORD || 'a8a8a8a8';

function decodeBasicAuth(header: string | null): { user: string; pass: string } | null {
  if (!header || !header.startsWith('Basic ')) return null;
  try {
    const base64 = header.slice('Basic '.length).trim();
    const decoded = Buffer.from(base64, 'base64').toString('utf8');
    const idx = decoded.indexOf(':');
    const user = idx >= 0 ? decoded.slice(0, idx) : '';
    const pass = idx >= 0 ? decoded.slice(idx + 1) : '';
    return { user, pass };
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  // Only guard /docs paths
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/docs')) return NextResponse.next();

  const auth = decodeBasicAuth(req.headers.get('authorization'));
  if (auth && auth.user === USER && auth.pass === PASS) {
    return NextResponse.next();
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Swagger"' },
  });
}

export const config = {
  matcher: ['/docs/:path*'],
};

