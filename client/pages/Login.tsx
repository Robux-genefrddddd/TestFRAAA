import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/build");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex items-center justify-center py-12 px-4">
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-grotesk font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CosmosPort
          </h1>
          <p className="text-muted-foreground">Welcome back to your universe</p>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
          <h2 className="text-2xl font-grotesk font-bold mb-6">Sign In</h2>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className={cn(
                  "w-full px-4 py-2 rounded-lg",
                  "border border-white/10 bg-white/5",
                  "focus:bg-white/10 focus:border-primary/50",
                  "placeholder:text-muted-foreground",
                  "transition-colors outline-none",
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={cn(
                  "w-full px-4 py-2 rounded-lg",
                  "border border-white/10 bg-white/5",
                  "focus:bg-white/10 focus:border-primary/50",
                  "placeholder:text-muted-foreground",
                  "transition-colors outline-none",
                )}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-2 rounded-lg font-medium",
                "border border-white/15 hover:border-white/30",
                "bg-gradient-to-r from-primary/10 to-secondary/10",
                "hover:from-primary/20 hover:to-secondary/20",
                "transition-all duration-300",
                "flex items-center justify-center gap-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
