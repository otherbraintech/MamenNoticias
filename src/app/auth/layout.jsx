
export default function AuthLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
