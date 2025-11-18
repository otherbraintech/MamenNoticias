"use client";

export default function PageLoading() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-700 font-medium">Cargando...</p>
      </div>
    </div>
  );
}
