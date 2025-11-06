"use client";
import { useForm } from "react-hook-form";
import { signIn, useSession, getSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';

function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  // Efecto para manejar el montaje del componente
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Efecto para redirigir si ya hay sesión
  useEffect(() => {
    if (status === 'authenticated' && mounted) {
      // Usar window.location para forzar una recarga completa
      window.location.href = callbackUrl;
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status, callbackUrl, mounted]);

  // Efecto para verificar la sesión al cargar
  useEffect(() => {
    const verifySession = async () => {
      try {
        const session = await getSession();
        if (session) {
          window.location.href = callbackUrl;
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        setIsLoading(false);
      }
    };

    if (mounted) {
      verifySession();
    }
  }, [mounted, callbackUrl]);



  // Show loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-[calc(100vh-7rem)] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState(null);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError(null);
      setIsSubmitting(true);
      
      // Cerrar sesión primero para limpiar cualquier estado anterior
      await signOut({ redirect: false });
      
      // Intentar iniciar sesión
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
        callbackUrl: callbackUrl
      });

      if (result?.error) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      // Forzar recarga completa de la página
      if (result?.url) {
        window.location.href = result.url;
      } else {
        window.location.href = callbackUrl;
      }
    } catch (err) {
      console.error('Error en inicio de sesión:', err);
      setError('Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.');
      setIsSubmitting(false);
    }
  });

  return (
    <div className="min-h-[calc(100vh-7rem)] flex justify-center items-center bg-white px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-[#f5f5f5] p-8 rounded-lg shadow-lg"
      >
        {error && (
          <p className="bg-[#e01717] text-white text-sm p-3 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <h1 className="text-[#F20519] font-bold text-3xl text-center mb-6">
          Iniciar Sesión
        </h1>

        <label htmlFor="identifier" className="text-[#F20519] mb-1 block text-sm font-medium">
          Usuario o Email:
        </label>
        <input
          type="text"
          {...register("identifier", {
            required: { value: true, message: "El usuario o correo es obligatorio" },
          })}
          className="p-3 rounded w-full border border-gray-300 mb-2 focus:outline-none focus:ring-2 focus:ring-[#1c3881]"
          placeholder="usuario o email"
        />
        {errors.identifier && (
          <span className="text-[#e01717] text-xs">{errors.identifier.message}</span>
        )}

        <label
          htmlFor="password"
          className="text-[#F20519] mt-4 mb-1 block text-sm font-medium"
        >
          Contraseña:
        </label>
        <input
          type="password"
          {...register("password", {
            required: { value: true, message: "La contraseña es obligatoria" },
          })}
          className="p-3 rounded w-full border border-gray-300 mb-2 focus:outline-none focus:ring-2 focus:ring-[#1c3881]"
          placeholder="******"
        />
        {errors.password && (
          <span className="text-[#e01717] text-xs">
            {errors.password.message}
          </span>
        )}

        <button
          type="submit"
          className="w-full bg-[#F20519] text-white p-3 rounded-lg font-semibold hover:bg-[#d10416] transition-colors mt-6"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
