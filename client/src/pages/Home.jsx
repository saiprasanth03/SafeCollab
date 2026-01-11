import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

function Home() {
  const navigate = useNavigate();

  return (
   <PageWrapper>
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-6">
      
      {/* CENTER CONTENT */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-3xl text-center text-white">
          {/* LOGO / NAME */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            SafeCollab
          </h1>

          {/* MOTTO */}
          <p className="mt-4 text-lg sm:text-xl text-white/90">
            Secure collaboration for trusted teams
          </p>

          {/* DESCRIPTION */}
          <p className="mt-6 text-sm sm:text-base text-white/80">
            Create private groups, control access by role, and collaborate
            confidently with your team — all in one secure platform.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-white/90 transition"
            >
              Register
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 rounded-xl border border-white text-white font-semibold hover:bg-white/10 transition"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER (BOTTOM OF SCREEN) */}
      <p className="text-xs text-white/60 text-center pb-4">
        © {new Date().getFullYear()} SafeCollab. All rights reserved.
      </p>
    </div>
   </PageWrapper>  
  );
}

export default Home;
