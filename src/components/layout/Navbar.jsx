import { FiSearch, FiBell, FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser, logout } from "../../utils/auth";

function useToday() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function Navbar() {
  const today = useToday();

  const navigate = useNavigate();
  const location = useLocation();

  const user = getUser();

  const pageInfo = {
    "/": {
      title: "Dashboard",
      subtitle: today,
    },
    "/upload": {
      title: "Upload Documents",
      subtitle: "Add manuals, SOPs & reports",
    },
    "/assistant": {
      title: "AI Assistant",
      subtitle: "Industrial Knowledge Intelligence",
    },
    "/analytics": {
      title: "Analytics",
      subtitle: "Platform usage & statistics",
    },
    "/reports": {
      title: "Reports",
      subtitle: "Generated AI reports",
    },
    "/settings": {
      title: "Settings",
      subtitle: "Manage your account",
    },
  };

  const current =
    pageInfo[location.pathname] || {
      title: "INDUSMIND AI",
      subtitle: today,
    };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials =
    user?.initials ||
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    "U";

  return (
    <header className="sticky top-0 z-10 h-20 flex items-center justify-between gap-6 px-6 lg:px-8 bg-ink-900/85 backdrop-blur border-b border-ink-600">

      <div className="min-w-0">
        <h1 className="font-display text-xl font-semibold text-paper-100 truncate">
          {current.title}
        </h1>

        <p className="text-xs text-paper-500 mt-0.5">
          {current.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">

        <div className="hidden md:flex items-center gap-2 bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 w-64">

          <FiSearch size={15} className="text-paper-500" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-paper-100 w-full"
          />

        </div>

        <button
          className="relative w-10 h-10 rounded-lg bg-ink-800 border border-ink-600 flex items-center justify-center"
        >
          <FiBell size={17} />
        </button>

        <div className="flex items-center gap-3 border-l border-ink-600 pl-4">

          <div className="text-right hidden sm:block">

            <p className="text-sm font-medium text-paper-100">
              {user?.name || "Administrator"}
            </p>

            <p className="text-xs text-paper-500">
              {user?.role || "User"}
            </p>

          </div>

          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            {initials}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-white text-sm"
          >
            <FiLogOut />
            Logout
          </button>

        </div>

      </div>

    </header>
  );
}