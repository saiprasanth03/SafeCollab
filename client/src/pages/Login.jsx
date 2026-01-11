import PageWrapper from "../components/PageWrapper";
import { useState } from "react";
import { loginUser } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      console.log("LOGIN RESPONSE:", res); // 🔍 IMPORTANT DEBUG

      if (res?.token) {
        localStorage.setItem("token", res.token); // ✅ STORE TOKEN
        localStorage.setItem("userEmail", email); 
        toast.success("Login successful 🎉");
        navigate("/groups");                      // ✅ REDIRECT
      } else {
        toast.error(res.message || "Login failed");

      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <PageWrapper>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mt-2 text-sm sm:text-base">
          Login to{" "}
          <span className="font-semibold text-indigo-600">SafeCollab</span>
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 sm:mt-8 space-y-4 sm:space-y-5"
        >
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm sm:text-base hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-gray-600 mt-5 sm:mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
   </PageWrapper>  
  );
}

export default Login;
