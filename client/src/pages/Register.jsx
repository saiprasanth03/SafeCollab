

// import PageWrapper from "../components/PageWrapper";
// import { useState } from "react";
// import { registerUser } from "../services/api";
// import { Link, useNavigate } from "react-router-dom";

// function Register() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await registerUser({ email, password });

//     if (res.token) {
//       localStorage.setItem("token", res.token);
//       navigate("/login");
//     } else {
//       alert(res.message);
//     }
//   };

//   return (
//    <PageWrapper>  
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 px-4">
//       <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
//         <h1 className="text-3xl font-extrabold text-center text-gray-800">
//           Create Account 🚀
//         </h1>
//         <p className="text-center text-gray-500 mt-2">
//           Join <span className="font-semibold text-blue-600">SafeCollab</span>
//         </p>

//         <form onSubmit={handleSubmit} className="mt-8 space-y-5">
//           <label className="block text-xs sm:text-sm font-medium text-gray-600 ">
//               Email
//             </label>
//           <input
//             type="email"
//             placeholder="team@company.com"
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//             <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
//               Password
//             </label>
//           <input
//             type="password"
//             placeholder="Create a strong password"
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">
//             Register
//           </button>
//         </form>

//         <p className="text-center text-sm text-gray-600 mt-6">
//           Already have an account?{" "}
//           <Link to="/login" className="text-blue-600 font-semibold underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//    </PageWrapper>  
//   );
// }

// export default Register;










import PageWrapper from "../components/PageWrapper";
import { useState } from "react";
import { registerUser } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerUser({ email, password });

      if (res?.message === "User registered successfully") {
        toast.success("Registration successful 🎉 Please login");
        navigate("/login", { replace: true });
      } else {
        toast.error(res?.message || "Registration failed");
      }
    } catch (err) {
      toast.error(
        err.message?.includes("fetch")
          ? "Server is waking up, please try again ⏳"
          : err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 px-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-extrabold text-center text-gray-800">
            Create Account 🚀
          </h1>
          <p className="text-center text-gray-500 mt-2">
            Join <span className="font-semibold text-blue-600">SafeCollab</span>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="team@company.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Create a strong password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Register;




