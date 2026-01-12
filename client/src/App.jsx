import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyGroups from "./pages/MyGroups";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import GroupMembersPage from "./pages/GroupMembersPage";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import GlobalLoader from "./components/GlobalLoader";

function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [loading, setLoading] = useState(() => {
    // ✅ show loader ONLY on first page load
    return !sessionStorage.getItem("appLoaded");
  });
  useEffect(() => {
    // Always show loader on refresh
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <GlobalLoader />;
  }

  return (
   <div className="no-select"> 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/groups" element={<ProtectedRoute><MyGroups /></ProtectedRoute>}/>
        <Route path="/dashboard"element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/members" element={<ProtectedRoute><GroupMembersPage /></ProtectedRoute>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
   </div>
  );
}

export default App;


