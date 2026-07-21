import { useEffect, useState } from "react";
import { FiMenu, FiBell, FiLogOut, FiShoppingBag } from "react-icons/fi";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useVendorAuthStore } from "../../store/vendorAuthStore";
import { useVendorNotificationStore } from "../../store/vendorNotificationStore";
import toast from "react-hot-toast";
import Button from "../../../Admin/components/Button";
import VendorNotificationWindow from "./VendorNotificationWindow";
import { appLogo } from "../../../../data/logos";

const VendorHeader = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vendor, logout } = useVendorAuthStore();
  const { unreadCount, fetchNotifications } = useVendorNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => fetchNotifications(), 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/vendor/login");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Get page name from pathname
  const getPageName = (pathname) => {
    const path = pathname.split("/").pop() || "dashboard";
    const pageNames = {
      dashboard: "Dashboard",
      products: "Products",
      orders: "Orders",
      analytics: "Analytics",
      earnings: "Earnings",
      settings: "Settings",
      profile: "Profile",
    };
    return pageNames[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  const pageName = getPageName(location.pathname);
  const storeName = vendor?.storeName || vendor?.name || "Vendor Store";

  return (
    <header
      className="bg-white/80 backdrop-blur-md border-b border-gray-100 fixed top-0 left-0 lg:left-64 right-0 z-30 shadow-[0_4px_24px_rgba(10,25,47,0.02)]"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}>
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Left: Menu Button, App Logo, & Page Heading */}
        <div className="flex items-center gap-3 lg:gap-4">
          <Button
            onClick={onMenuClick}
            variant="icon"
            className="lg:hidden text-gray-700"
            icon={FiMenu}
          />

          {/* App Logo */}
          <Link to="/vendor/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <img
              src={appLogo.src}
              alt={appLogo.alt || "SikhStreet Logo"}
              className="h-8 sm:h-10 w-auto object-contain mix-blend-multiply"
            />
          </Link>

          {/* Page Heading & Store Name */}
          <div className="hidden sm:block border-l border-gray-200 pl-3">
            <h1 className="text-lg lg:text-xl font-bold text-vendor-primary tracking-tight leading-tight">
              {pageName}
            </h1>
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
              <FiShoppingBag className="text-vendor-accent flex-shrink-0" />
              <span className="truncate max-w-[150px] lg:max-w-[200px]">{storeName}</span>
            </p>
          </div>
        </div>

        {/* Right: Notifications & Logout */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              data-notification-button
              onClick={toggleNotifications}
              variant="icon"
              className="text-gray-700"
              icon={FiBell}
            />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}

            {/* Notification Window - positioned relative to this container */}
            <VendorNotificationWindow
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              position="right"
            />
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            icon={FiLogOut}
            size="sm"
            className="text-vendor-primary hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-gray-200 font-bold transition-all">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;
