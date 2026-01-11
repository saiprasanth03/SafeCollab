import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
      <div className="text-center text-white animate-pulse">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          SafeCollab
        </h1>
        <p className="text-lg opacity-90">
          Secure collaboration for trusted teams
        </p>

        {/* Loader */}
        <div className="mt-8 flex justify-center">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

export default Splash;
