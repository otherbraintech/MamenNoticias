"use client";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (status === "loading") return; // Esperar a que cargue
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, status, router]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState(null);

  const onSubmit = handleSubmit(async (data) => {
    const res = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });

    if (res.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
      router.refresh();
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
