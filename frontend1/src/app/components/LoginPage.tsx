import { Shield, User, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const success = login(username, password);
    
    if (success) {
      toast.success("Login successful! Welcome back.");
      navigate("/");
    } else {
      setError("Invalid username or password");
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: '#0B0F1A' }}
    >
      {/* Animated Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #FF7A18 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #FFB800 0%, transparent 70%)' }}
        />
      </div>

      {/* Login Card */}
      <div 
        className="w-full max-w-md rounded-2xl p-8 relative z-10"
        style={{
          backgroundColor: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #FF7A18 0%, #FFB800 100%)',
              boxShadow: '0 0 30px rgba(255, 122, 24, 0.4)'
            }}
          >
            <Shield className="w-10 h-10" style={{ color: '#0B0F1A' }} />
          </div>
          <h1 className="text-2xl mb-1" style={{ color: '#F9FAFB' }}>PowerGuard AI</h1>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>Electricity Theft Detection System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div 
              className="p-3 rounded-xl text-sm text-center"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444'
              }}
            >
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: '#F9FAFB' }}>
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all focus:ring-2"
                style={{
                  backgroundColor: '#0B0F1A',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#F9FAFB',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: '#F9FAFB' }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all focus:ring-2"
                style={{
                  backgroundColor: '#0B0F1A',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#F9FAFB',
                }}
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded" />
              <span style={{ color: '#9CA3AF' }}>Remember me</span>
            </label>
            <a href="#" className="hover:underline" style={{ color: '#FF7A18' }}>
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #FF7A18 0%, #FFB800 100%)',
              color: '#0B0F1A',
              boxShadow: '0 0 30px rgba(255, 122, 24, 0.4)',
            }}
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-6" style={{ color: '#9CA3AF' }}>
          Protected by enterprise-grade security
        </p>
        
        {/* Demo Credentials */}
        <div 
          className="mt-4 p-3 rounded-xl text-center text-xs"
          style={{
            backgroundColor: 'rgba(255, 122, 24, 0.1)',
            border: '1px solid rgba(255, 122, 24, 0.2)',
            color: '#9CA3AF'
          }}
        >
          <p style={{ color: '#FF7A18', marginBottom: '4px' }}>Demo Credentials</p>
          <p>Username: <span style={{ color: '#F9FAFB' }}>admin</span></p>
          <p>Password: <span style={{ color: '#F9FAFB' }}>admin123</span></p>
        </div>
      </div>
    </div>
  );
}