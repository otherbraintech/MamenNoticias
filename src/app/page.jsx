"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-red-50 to-white">
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-2xl mx-auto text-center px-4">
          {/* Logo MamenNoticias */}
          <div className="w-full">
          <div className="max-w-2xl mx-auto">
              <Image
                src="https://i.ibb.co/sJ9GBHXC/Copilot-20251106-114651-1.png"
                alt="Mamen Noticias"
                width={800}
                height={200}
                className="mx-auto w-full max-w-2xl h-auto object-contain"
                priority
                style={{
                  minHeight: '120px',
                  maxHeight: '200px',
                  width: 'auto'
                }}
              />
            </div>
          </div>

         

          {/* Descripción */}
          <p className="text-gray-600 mb-4 text-base sm:text-lg max-w-2xl mx-auto">
            Tu plataforma para gestionar y publicar noticias de manera eficiente.
            Accede para comenzar a administrar el contenido.
          </p>

          {/* Botón de acción */}
          <div className="mt-8">
            <a
              href={session ? "/dashboard" : "/auth/login"}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#F20519] hover:bg-[#d10416] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 shadow-lg hover:shadow-xl transform"
            >
              {session ? "Ir al panel de control" : "Iniciar sesión"}
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs sm:text-sm text-gray-500">
            &copy; {new Date().getFullYear()} 
            <span className="block sm:inline sm:ml-2">
              Desarrollado por <span className="font-medium">OtherBrain</span>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
