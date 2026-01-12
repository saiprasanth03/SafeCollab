



import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMyGroups, getMyRole } from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [groups, setGroups] = useState([]);
  const [role, setRole] = useState(null);
  const [activeGroupId, setActiveGroupId] = useState(
    localStorage.getItem("activeGroupId") || ""
  );

  /* ===============================
     LOAD GROUPS (ONCE)
  =============================== */
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const res = await getMyGroups();
        setGroups(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Failed to load groups", err);
      }
    };

    loadGroups();
  }, []);

  /* ===============================
     LOAD ROLE (WHEN GROUP CHANGES)
  =============================== */
  useEffect(() => {
    if (!activeGroupId) return;

    const loadRole = async () => {
      try {
        const res = await getMyRole();
        setRole(res.role);
      } catch (err) {
        console.error("Failed to load role", err);
        setRole(null);
      }
    };

    loadRole();
  }, [activeGroupId, location.pathname]);

  /* ===============================
     SWITCH GROUP
  =============================== */
  const switchGroup = (groupId) => {
    if (!groupId) return;

    localStorage.setItem("activeGroupId", groupId);
    setActiveGroupId(groupId);

    // SPA navigation (NO reload)
    navigate("/dashboard", { replace: true });
  };

  /* ===============================
     LOGOUT (ONLY WHEN CLICKED)
  =============================== */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeGroupId");
    localStorage.removeItem("userEmail");

    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full h-14 bg-white border-b flex items-center justify-between px-4 sm:px-6">
      {/* LOGO */}
      <h1
        className="font-bold text-lg text-blue-600 cursor-pointer"
        onClick={() => navigate("/groups")}
      >
        SafeCollab
      </h1>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        {/* GROUP SWITCHER (HIDDEN ON MOBILE) */}
        {groups.length > 0 && (
          <select
            value={activeGroupId}
            onChange={(e) => switchGroup(e.target.value)}
            className="hidden sm:block border rounded px-2 py-1 text-sm"
          >
            <option value="" disabled>
              Select group
            </option>
            {groups.map((g) => (
              <option key={g.groupId} value={g.groupId}>
                {g.name}
              </option>
            ))}
          </select>
        )}

        {/* MEMBERS (ADMIN ONLY) */}
        {role === "admin" && activeGroupId && (
          <button
            onClick={() => navigate("/members")}
            className="text-sm text-blue-600 hover:underline"
          >
            Members
          </button>
        )}

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
