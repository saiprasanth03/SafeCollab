function LandingLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
      <div className="relative">
        {/* Animated ring */}
        <div className="w-20 h-20 border-4 border-white/30 rounded-full animate-spin"></div>
        <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-wide">
        SafeCollab
      </h1>

      <p className="mt-2 text-white/80 text-sm">
        Secure collaboration for trusted teams
      </p>
    </div>
  );
}

export default LandingLoader;
