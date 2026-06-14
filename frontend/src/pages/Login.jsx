import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Loader2, LogIn, UserPlus, Microscope, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await login(username, password);
      } else {
        await register(username, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue to-cyan flex items-center justify-center">
            <Microscope size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {mode === 'login'
              ? 'Sign in to access your dashboard and history'
              : 'Register to save and track your analyses'}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          {error && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-2">
              <AlertCircle size={16} className="text-danger shrink-0 mt-0.5" />
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue text-text"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue text-text"
                placeholder={mode === 'login' ? 'Enter your password' : 'At least 6 characters'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue to-cyan hover:shadow-lg hover:shadow-cyan/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : mode === 'login' ? (
                <><LogIn size={18} /> Sign In</>
              ) : (
                <><UserPlus size={18} /> Create Account</>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-text-secondary">
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button onClick={() => { setMode('register'); setError(''); }} className="text-blue font-medium hover:underline cursor-pointer">
                  Register
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(''); }} className="text-blue font-medium hover:underline cursor-pointer">
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-text-secondary">
          Demo account — username <span className="font-mono font-medium">demo</span>, password <span className="font-mono font-medium">demo12345</span>
        </div>
        <div className="mt-4 text-center">
          <Link to="/analyze" className="text-sm text-blue hover:underline">Continue without an account →</Link>
        </div>
      </div>
    </div>
  );
}
