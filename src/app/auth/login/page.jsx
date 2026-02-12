"use client";
import { useForm } from "react-hook-form";
import { signIn, useSession, getSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import Image from "next/image";
import { MdEmail, MdLock, MdLogin } from "react-icons/md";

function LoginPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(null);
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && mounted) {
      window.location.href = callbackUrl;
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status, callbackUrl, mounted]);

  const onSubmit = async (data) => {
    const toastId = toast.loading('Verificando credenciales...');
    try {
      setError(null);
      setIsSubmitting(true);
      await signOut({ redirect: false });
      
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
        callbackUrl: callbackUrl
      });

      if (result?.error) {
        toast.error('Credenciales incorrectas', { id: toastId });
        setError("Usuario o contraseña no válidos");
        setIsSubmitting(false);
        return;
      }

      toast.success('¡Bienvenido!', { id: toastId });
      setTimeout(() => {
        window.location.href = result?.url || callbackUrl;
      }, 800);
    } catch (error) {
      toast.error('Error del servidor', { id: toastId });
      setError('Ocurrió un error al iniciar sesión');
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-red-50 border-t-[#F22233] rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-black text-gray-400 uppercase tracking-widest">Iniciando sistema...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-[#F22233]/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[30rem] h-[30rem] bg-[#2BC7D9]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200 p-8 sm:p-12 border border-white/20">
          <div className="flex flex-col items-center mb-10">
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2 mb-2">
              <span className="text-[#F22233]">MAMEN</span> 
              <span className="uppercase tracking-widest text-[#2BC7D9]">Noticias</span>
            </h1>
            <div className="h-1 w-12 bg-[#F22233] rounded-full mb-4"></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Acceso de Administrador</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] uppercase font-black tracking-widest border border-red-100 text-center animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            <div className="space-y-1.5 focus-within:z-10">
              <label className="text-[10px] uppercase font-bold text-gray-400 block ml-4 mb-1.5 tracking-widest">Usuario o Email</label>
              <div className="relative group">
                <MdEmail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#F22233] transition-colors" />
                <input
                  type="text"
                  autoComplete="username"
                  {...register("identifier", { required: "El usuario es obligatorio" })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-300"
                  placeholder="admin@mamen.noticias"
                />
              </div>
              {errors.identifier && (
                <span className="text-[10px] font-bold text-red-500 ml-4 italic">{errors.identifier.message}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 block ml-4 mb-1.5 tracking-widest">Contraseña</label>
              <div className="relative group">
                <MdLock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#F22233] transition-colors" />
                <input
                  type="password"
                  autoComplete="current-password"
                  {...register("password", { required: "La contraseña es obligatoria" })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-300"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <span className="text-[10px] font-bold text-red-500 ml-4 italic">{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-xs tracking-[0.2em] uppercase hover:bg-black transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-black/10 active:scale-95 flex items-center justify-center gap-2 group disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <MdLogin size={20} className="text-[#F22233] group-hover:scale-110 transition-transform" />
                  <span>Ingresar al Sistema</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
            MAMEN NOTICIAS &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
