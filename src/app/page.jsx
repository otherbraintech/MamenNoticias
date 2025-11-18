"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Footer from "@/components/Footer";

import PageLoading from "@/components/PageLoading";

function HomePage() {
  const { data: session, status } = useSession();


  if (status === "loading") {
    return <PageLoading />;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-gradient-to-br from-white via-red-50 to-white">
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
          {/* Logo MamenNoticias */}
          <div className="w-full px-2 sm:px-4">
            <div className="max-w-2xl mx-auto">
              <div className="relative w-full" style={{ paddingBottom: '25%', minHeight: '120px' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="https://i.ibb.co/sJ9GBHXC/Copilot-20251106-114651-1.png"
                    alt="Mamen Noticias"
                    width={800}
                    height={200}
                    className="w-full h-auto max-h-[200px] object-contain"
                    priority
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <p className="text-gray-600 text-sm sm:text-base md:text-lg px-2 sm:px-4">
            Tu plataforma para gestionar y publicar noticias de manera eficiente.
            <span className="block sm:inline"> Accede para comenzar a administrar el contenido.</span>
          </p>

          {/* Botón de acción */}
          <div className="pt-2 pb-4 sm:pt-4">
            <a
              href={session ? "/dashboard" : "/auth/login"}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-full text-white bg-[#F20519] hover:bg-[#d10416] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              {session ? "Ir al panel de control" : "Iniciar sesión"}
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default HomePage;
