// This layout will be used for all auth routes
// It doesn't include the Navbar

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
