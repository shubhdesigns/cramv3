import React, { useState, useEffect } from 'react';
import { Mail, Github } from 'lucide-react';
import { useFirebase } from '../firebase/init.js';

export default function LoginFormIsland() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [firebaseModule, setFirebaseModule] = useState<any>(null);

  // Initialize Firebase when component mounts
  useEffect(() => {
    useFirebase((module) => {
      setFirebaseModule(module);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseModule) {
      setError('Firebase not initialized');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await firebaseModule.signInWithEmail(email, password);
      // Redirect will be handled by auth state change
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!firebaseModule) {
      setError('Firebase not initialized');
      return;
    }

    try {
      const googleProvider = firebaseModule.googleProvider;
      if (!googleProvider) throw new Error("Authentication not initialized");
      
      await firebaseModule.signInWithProvider(googleProvider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGithubSignIn = async () => {
    if (!firebaseModule) {
      setError('Firebase not initialized');
      return;
    }

    try {
      const { GithubAuthProvider } = await import('firebase/auth');
      const provider = new GithubAuthProvider();
      await firebaseModule.signInWithProvider(provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neon-pink mb-2">
          <span className="glitch-text" data-text="Welcome Back">Welcome Back</span>
        </h2>
        <p className="text-light/80">Sign in to continue your learning journey</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-dark border border-neon-blue/20 rounded-lg hover:bg-neon-blue/10 transition-colors"
        >
          <Mail className="w-5 h-5 text-neon-blue" />
          <span className="text-light">Continue with Google</span>
        </button>

        <button
          onClick={handleGithubSignIn}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-dark border border-neon-blue/20 rounded-lg hover:bg-neon-blue/10 transition-colors"
        >
          <Github className="w-5 h-5 text-neon-blue" />
          <span className="text-light">Continue with GitHub</span>
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neon-blue/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-dark text-light/60">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-light/80 mb-2">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-dark border border-neon-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue/50 text-light placeholder-light/40"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-light/80 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-dark border border-neon-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue/50 text-light placeholder-light/40"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-neon-blue/20 text-neon-pink focus:ring-neon-pink"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-light/80">
              Remember me
            </label>
          </div>

          <a href="/forgot-password" className="text-sm text-neon-pink hover:text-neon-pink/80 transition-colors">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-3 bg-neon-pink text-dark rounded-lg hover:bg-neon-pink/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="loading-cyber" />
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <p className="text-center text-light/80">
        Don't have an account?{' '}
        <a href="/signup" className="text-neon-pink hover:text-neon-pink/80 transition-colors">
          Sign up
        </a>
      </p>
    </div>
  );
} 