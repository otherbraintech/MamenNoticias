"use client";

export default function PageLoading({ message = "Iniciando sistema..." }) {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-[200] flex items-center justify-center p-6">
      <div className="flex flex-col items-center">
        {/* Modern Spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-red-50 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#F22233] rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-4 bg-red-50 rounded-full animate-pulse opacity-50"></div>
        </div>
        
        <p className="mt-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">
          {message}
        </p>
        
        <div className="mt-4 flex gap-1">
          <div className="w-1.5 h-1.5 bg-[#F22233] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-[#F22233] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-[#F22233] rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
