import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_PATHS = ['/auth/login', '/api/auth', '/_next'];
const PROTECTED_PATHS = ['/dashboard', '/cursos'];

// Lista de rutas de API que no requieren autenticación
const PUBLIC_API_PATHS = [
  '/api/auth',
  '/_next/static',
  '/_next/image',
  '/favicon.ico'
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));
  const isPublicApiPath = PUBLIC_API_PATHS.some(path => pathname.startsWith(path));
  
  // Ignorar rutas públicas y rutas de Next.js internas
  if (isPublicPath || isPublicApiPath) {
    return NextResponse.next();
  }

  try {
    // Obtener el token de sesión
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production'
    });

    // Construir la URL base para redirecciones
    const baseUrl = process.env.NEXTAUTH_URL || 
                   (process.env.NODE_ENV === 'production' 
                     ? 'https://' + (request.headers.get('host') || 'mamen-noticias.vercel.app')
                     : 'http://' + (request.headers.get('host') || 'localhost:3000'));

    // Si el usuario está autenticado y está en la página de login, redirigir al dashboard
    if (token && pathname.startsWith('/auth/login')) {
      const url = new URL('/dashboard', baseUrl);
      return NextResponse.redirect(url);
    }

    // Si la ruta está protegida y no hay token, redirigir al login
    if (isProtectedPath && !token) {
      const url = new URL('/auth/login', baseUrl);
      // Solo establecer callbackUrl si no es una ruta de API
      if (!pathname.startsWith('/api/')) {
        url.searchParams.set('callbackUrl', pathname);
      }
      return NextResponse.redirect(url);
    }

    // Para rutas de API protegidas
    if (pathname.startsWith('/api/') && !token) {
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: 'No autorizado',
          error: 'Se requiere autenticación para acceder a este recurso'
        }), 
        { 
          status: 401, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    // Si todo está bien, continuar con la solicitud
    return NextResponse.next();
  } catch (error) {
    console.error('Error en el middleware:', error);
    
    // En caso de error, redirigir a la página de error o login
    const baseUrl = process.env.NEXTAUTH_URL || 'https://mamen-noticias.vercel.app';
    const url = new URL('/auth/login', baseUrl);
    url.searchParams.set('error', 'Ocurrió un error inesperado');
    return NextResponse.redirect(url);
  }

  // Permitir el acceso a la ruta
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - api/auth (rutas de autenticación)
     * - favicon.ico (favicon)
     * - public folder
     */
    '/((?!_next/static|_next/image|api/auth|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|css|js)$).*)',
  ],
};
