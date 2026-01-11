function GlobalLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
      <div className="text-center text-white">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 animate-pulse">
          SafeCollab
        </h1>

        <p className="opacity-90 mb-6">
          Secure collaboration for trusted teams
        </p>

        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

export default GlobalLoader;
