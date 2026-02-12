"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { CiLogout } from "react-icons/ci";
import { MdWarningAmber, MdClose } from "react-icons/md";
import { toast } from 'sonner';

export default function SignOutButton() {
  const [showModal, setShowModal] = useState(false);

  const handleSignOut = () => setShowModal(true);

  const confirmSignOut = async () => {
    const toastId = toast.loading('Cerrando sesión...');
    setShowModal(false);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      await signOut({ redirect: false, callbackUrl: "/" });
      toast.success('Sesión cerrada con éxito', { id: toastId });
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión', { id: toastId });
    }
  };

  return (
    <>
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 font-bold text-xs tracking-widest uppercase bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 active:scale-95"
      >
        <span>Salir</span>
        <CiLogout size={18} className="stroke-2" />
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-[2.5rem] shadow-2xl p-8 sm:p-10 max-w-sm w-full text-center animate-in zoom-in-95 duration-300"
          >
            <div className="w-20 h-20 bg-red-50 text-[#F22233] rounded-3xl flex items-center justify-center mx-auto mb-6">
              <MdWarningAmber size={40} />
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight leading-tight">
              ¿CERRAR SESIÓN?
            </h2>
            <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
              Deberás volver a iniciar sesión para gestionar las noticias.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={confirmSignOut}
                className="w-full py-4 bg-[#F22233] text-white rounded-2xl font-bold hover:opacity-90 shadow-lg shadow-red-100 transition-all active:scale-95 uppercase text-xs tracking-widest flex items-center justify-center gap-2"
              >
                <CiLogout size={20} className="stroke-2" />
                SÍ, CERRAR SESIÓN
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold hover:bg-gray-100 transition-all active:scale-95 uppercase text-xs tracking-widest"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
