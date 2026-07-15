import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
import api from "../services/api";
import { saveAuth } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login/", {
        email: formData.email,
        password: formData.password,
      });

      saveAuth(response.data);

      navigate("/");
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md rounded-2xl bg-slate-900 shadow-2xl border border-slate-800 p-8">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white">
            INDUSMIND AI
          </h1>

          <p className="text-slate-400 mt-2">
            Industrial Knowledge Intelligence Platform
          </p>

        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-500/20 border border-red-500 text-red-300 p-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>

            <label className="text-slate-300 text-sm">
              Email Address
            </label>

            <div className="mt-2 relative">

              <Mail
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 text-white py-3 pl-10 pr-4 outline-none focus:border-blue-500"
              />

            </div>

          </div>

          <div>

            <label className="text-slate-300 text-sm">
              Password
            </label>

            <div className="mt-2 relative">

              <Lock
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 text-white py-3 pl-10 pr-12 outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400"
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>

            </div>

          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3 font-semibold text-white flex justify-center items-center gap-2"
          >
            <LogIn size={18}/>

            {loading ? "Signing In..." : "Login"}

          </button>

        </form>

      </div>

    </div>
  );
}