// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, ShoppingBag, Trophy, Users, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Card, CardContent } from "../components/ui/card";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <ShoppingBag className="h-6 w-6" />, title: "Wide Selection", desc: "1000+ premium products" },
    { icon: <Trophy className="h-6 w-6" />, title: "Top Quality", desc: "100% authentic gear" },
    { icon: <Users className="h-6 w-6" />, title: "Community", desc: "50k+ active members" },
    { icon: <TrendingUp className="h-6 w-6" />, title: "Best Prices", desc: "Competitive pricing" },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-8 lg:p-16 flex flex-col justify-center">
        <div className="absolute inset-0 bg-black/10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-lg mx-auto w-full"
        >
          <Link to="/" className="flex items-center space-x-3 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <span className="font-bold text-2xl text-white">SF</span>
            </div>
            <span className="font-bold text-3xl">Sports Firm</span>
          </Link>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">Elevate Your <br /> Performance</h1>
          <p className="text-lg text-white/90 mb-12">Premium sports equipment and athletic gear for champions.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((item, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-500">Enter your credentials to access your account</p>
          </div>
          <Card className="shadow-lg border border-gray-100">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                  <input id="email" type="email" placeholder="you@example.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                  <input id="password" type="password" placeholder="••••••••" value={password}
                    onChange={(e) => setPassword(e.target.value)} required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <Button type="submit" size="lg" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? "Signing in..." : <> Sign In <ArrowRight className="ml-2 h-5 w-5" /> </>}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="mt-6 flex flex-col items-center space-y-3">
            <p className="text-sm text-gray-500">Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">Create Account</Link>
            </p>
            <Link to="/" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">← Back to home</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
  