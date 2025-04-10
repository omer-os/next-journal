"use client"; // Required for useState, useEffect, usePathname

import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  MessageSquare,
  Upload,
  Download,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Hook to get current route for active state
import { motion, AnimatePresence } from "framer-motion";

interface SidebarItemProps {
  href?: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  onClick?: () => void;
  danger?: boolean;
  exact?: boolean;
}

// Reusable Sidebar Item Component for cleaner code
const SidebarItem = ({
  href,
  label,
  icon: Icon,
  onClick,
  danger = false,
  exact = true,
}: SidebarItemProps) => {
  const pathname = usePathname();
  // Check if the current path matches the link's href
  const isActive =
    href && (exact ? pathname === href : pathname.startsWith(href));

  // Base classes for all items
  const commonClasses = `flex items-center gap-3.5 px-3.5 py-3 rounded-lg transition-colors duration-150 text-sm font-medium cursor-pointer`;

  // Classes for active vs inactive state (non-danger items)
  const activeInactiveClasses = isActive
    ? "bg-blue-50 text-blue-600" // Active state style
    : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"; // Inactive state style

  // Apply danger styling if needed, otherwise use active/inactive styles
  const finalClasses = danger
    ? `${commonClasses} text-red-600 hover:bg-red-50 active:bg-red-100` // Danger item style
    : `${commonClasses} ${activeInactiveClasses}`;

  // Content (Icon + Label)
  const content = (
    <>
      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
      <span>{label}</span>
    </>
  );

  // Render as Link if href is provided
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={finalClasses}>
        {content}
      </Link>
    );
  }

  // Render as Button if no href (for actions)
  return (
    <button onClick={onClick} className={`${finalClasses} w-full text-left`}>
      {content}
    </button>
  );
};

// Main Layout Component
export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname(); // Get current path

  // Automatically close sidebar when the route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Animation variants for Framer Motion
  const sidebarVariants = {
    hidden: {
      x: "-100%",
      transition: { type: "tween", duration: 0.3, ease: "easeOut" },
    },
    visible: {
      x: "0%",
      transition: { type: "tween", duration: 0.3, ease: "easeOut" },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0, transition: { duration: 0.3, ease: "linear" } },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "linear" } },
  };

  // Event Handlers
  const handleCloseSidebar = () => setIsSidebarOpen(false);
  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Placeholder action handlers (replace with actual logic)
  const handleImport = () => {
    console.log("Trigger Import Data");
    handleCloseSidebar();
  };
  const handleExport = () => {
    console.log("Trigger Export Data");
    handleCloseSidebar();
  };
  const handleErase = () => {
    // IMPORTANT: Add a confirmation dialog here!
    if (
      window.confirm(
        "Are you sure you want to erase all data? This cannot be undone."
      )
    ) {
      console.warn("Trigger Erase All Data");
      handleCloseSidebar();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {" "}
      {/* Slightly off-white bg */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              key="sidebar-backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={handleCloseSidebar}
              className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm md:hidden" // Only show backdrop on mobile/tablet
            />

            {/* Sidebar Panel */}
            <motion.div
              key="sidebar"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-0 left-0 bottom-0 z-50 // Ensure sidebar is above backdrop
                         w-72 bg-white border-r border-gray-200/80 shadow-xl
                         flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200/60 flex-shrink-0">
                <p className="text-lg font-semibold text-gray-800">Menu</p>
                {/* Close Button */}
                <button
                  onClick={handleCloseSidebar}
                  className="p-2 -mr-2 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300"
                  aria-label="Close menu"
                >
                  <X size={22} strokeWidth={2.5} />
                </button>
              </div>

              {/* Main Navigation & Actions Area */}
              <div className="flex-grow p-4 space-y-1.5 overflow-y-auto">
                {/* Navigation Links */}
                <SidebarItem
                  href="/"
                  label="Entries"
                  icon={Home}
                  onClick={handleCloseSidebar}
                  exact={true}
                />
                <SidebarItem
                  href="/chat"
                  label="Chat"
                  icon={MessageSquare}
                  onClick={handleCloseSidebar}
                  exact={true}
                />

                {/* Data Actions Section */}
                <div className="pt-4 pb-1.5">
                  {" "}
                  {/* Add spacing before divider */}
                  <p className="px-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Data
                  </p>
                  <hr className="border-gray-200/60 mb-2" />{" "}
                  {/* Use <hr> or just spacing */}
                </div>
                <SidebarItem
                  label="Import Data"
                  icon={Upload}
                  onClick={handleImport}
                />
                <SidebarItem
                  label="Export Data"
                  icon={Download}
                  onClick={handleExport}
                />

                {/* Danger Zone Section */}
                <div className="pt-4 pb-1.5">
                  <p className="px-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Danger Zone
                  </p>
                  <hr className="border-gray-200/60 mb-2" />
                </div>
                <SidebarItem
                  label="Erase All Data"
                  icon={Trash2}
                  onClick={handleErase}
                  danger={true}
                />
              </div>

              {/* Optional Footer Section */}
              <div className="p-4 border-t border-gray-200/60 flex-shrink-0">
                {/* Example: Settings or Profile Link */}
                {/* <SidebarItem href="/settings" label="Settings" icon={Settings} onClick={handleCloseSidebar} /> */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Navbar */}
      <nav
        className={`sticky z-30 top-0 left-0 right-0 h-16 // z-index lower than sidebar/backdrop
                      bg-white/85 backdrop-blur-lg
                      border-b border-gray-200/70
                      flex items-center justify-between px-4 transition-opacity duration-300 ${
                        isSidebarOpen
                          ? "opacity-50 md:opacity-100"
                          : "opacity-100"
                      }`} // Optional: Dim navbar when sidebar open on mobile
      >
        <div className="flex gap-2 items-center">
          {/* Menu Button */}
          <button
            onClick={handleToggleSidebar}
            className="p-2.5 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300"
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={2.5} />
          </button>
          {/* App Title */}
          <p className="text-lg font-semibold text-gray-800">Next Journal</p>
        </div>
        {/* Placeholder for right-side icons */}
        <div className="flex items-center gap-2"></div>
      </nav>
      {/* Main Content Area */}
      <main
        className={`flex-grow w-full max-w-3xl mx-auto px-4 py-5 transition-filter duration-300 ${
          isSidebarOpen ? "blur-sm md:blur-none" : "blur-none"
        }`}
      >
        {" "}
        {/* Optional: Blur content when sidebar open on mobile */}
        {children}
      </main>
    </div>
  );
}
