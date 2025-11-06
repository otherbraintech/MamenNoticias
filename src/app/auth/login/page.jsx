"use client";
import { useForm } from "react-hook-form";
import { signIn, useSession, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

function LoginPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  // Handle redirection if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getSession();
        if (session) {
          // Force a hard redirect to ensure the app loads with the session
          window.location.href = callbackUrl;
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [callbackUrl]);

  // Handle session changes
  useEffect(() => {
    if (status === 'authenticated' && !isLoading) {
      // Force a hard redirect when session becomes available
      window.location.href = callbackUrl;
    }
  }, [status, isLoading, callbackUrl]);

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
      
      // First, clear any existing session
      await fetch('/api/auth/signout', { method: 'POST' });
      
      // Then sign in with credentials
      const res = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
        callbackUrl: callbackUrl
      });

      if (res?.error) {
        setError(res.error);
        setIsSubmitting(false);
        return;
      }

      // Force a full page reload to ensure all session data is loaded
      if (res?.url) {
        window.location.href = res.url;
      } else {
        // If no URL, force a refresh to get the latest session
        window.location.href = callbackUrl;
      }
    } catch (err) {
      console.error('Login error:', err);
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
