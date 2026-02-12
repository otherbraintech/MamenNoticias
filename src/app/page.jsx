"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Footer from "@/components/Footer";
import PageLoading from "@/components/PageLoading";
import { MdArrowForward, MdDashboard, MdLogin } from "react-icons/md";

function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <PageLoading message="Preparando plataforma..." />;
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-white">
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-red-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[10%] left-[-5%] w-72 h-72 bg-blue-50 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-4xl mx-auto text-center space-y-8 sm:space-y-12 relative z-10">
          {/* Logo Container */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-600/5 to-transparent rounded-full blur-2xl group-hover:from-red-600/10 transition-all duration-700"></div>
            <Image
              src="https://i.ibb.co/sJ9GBHXC/Copilot-20251106-114651-1.png"
              alt="Mamen Noticias"
              width={800}
              height={200}
              className="w-full h-auto max-w-2xl mx-auto object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
              priority
            />
          </div>

          {/* Value Proposition */}
          <div className="space-y-4">
            <h2 className="text-sm sm:text-base font-black uppercase tracking-[0.4em] text-red-600">
              Gestión Estratégica de Medios
            </h2>
            <p className="text-gray-500 text-lg sm:text-xl md:text-2xl font-bold max-w-2xl mx-auto leading-tight italic">
              &quot;Plataforma integral para el monitoreo, filtrado y reporte de noticias digitales en tiempo real.&quot;
            </p>
          </div>

          {/* Primary CTA */}
          <div className="pt-4 flex flex-col items-center gap-4">
            <a
              href={session ? "/dashboard" : "/auth/login"}
              className="group flex items-center justify-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xs sm:text-sm tracking-[0.2em] uppercase hover:bg-black transition-all duration-300 shadow-2xl shadow-gray-400 hover:shadow-black/20 active:scale-95"
            >
              {session ? (
                <>
                  <MdDashboard size={20} className="text-red-500 shrink-0" />
                  <span>Panel de Control</span>
                </>
              ) : (
                <>
                  <MdLogin size={20} className="text-red-500 shrink-0" />
                  <span>Acceso Administrador</span>
                </>
              )}
              <MdArrowForward size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
              V 2.0 • MONITOREO ACTIVO
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
