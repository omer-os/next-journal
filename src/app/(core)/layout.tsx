"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Home,
  MessageSquare,
  Upload,
  Download,
  Trash2,
  X,
  FileText,
  Edit2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { clearAllEntries } from "@/utils/storage";
import { usePathname } from "next/navigation";

// Create a context for entry actions
export const EntryActionContext = createContext<{
  handleSummarize: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
  isEditMode: boolean;
  isSummarizing: boolean;
}>({
  handleSummarize: () => {},
  handleEdit: () => {},
  handleDelete: () => {},
  isEditMode: false,
  isSummarizing: false,
});

interface SidebarProps {
  onClose: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };
  const transition = { type: "spring", stiffness: 300, damping: 30 };

  const handleEraseAllData = () => {
    setShowConfirmDialog(true);
  };

  const confirmEraseAllData = () => {
    clearAllEntries();
    setShowConfirmDialog(false);
    onClose();
    // Reload the page to reflect changes
    window.location.reload();
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={sidebarVariants}
      transition={transition}
      className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 flex flex-col"
    >
      <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-lg">
        <h2 className="text-xl font-semibold mb-1">Daily Journal</h2>
        <p className="text-sm text-blue-100">Your personal space</p>
      </div>
      <nav className="flex-grow p-6 space-y-3">
        <motion.div
          variants={itemVariants}
          transition={{ ...transition, delay: 0.1 }}
        >
          <Link
            href="/"
            className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors"
          >
            <Home size={20} className="mr-3" />
            Home
          </Link>
        </motion.div>
        <motion.div
          variants={itemVariants}
          transition={{ ...transition, delay: 0.2 }}
        >
          <Link
            href="/chat"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <MessageSquare size={20} className="mr-3" />
            Chat
          </Link>
        </motion.div>
      </nav>
      <div className="p-6 border-t border-gray-100 space-y-3">
        <motion.button
          variants={itemVariants}
          transition={{ ...transition, delay: 0.3 }}
          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <Upload size={20} className="mr-3" />
          Export Data
        </motion.button>
        <motion.button
          variants={itemVariants}
          transition={{ ...transition, delay: 0.4 }}
          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <Download size={20} className="mr-3" />
          Import Data
        </motion.button>
        <motion.button
          variants={itemVariants}
          transition={{ ...transition, delay: 0.5 }}
          className="flex items-center w-full px-4 py-3 text-red-600 border border-red-200 hover:bg-red-50 rounded-xl transition-colors"
          onClick={handleEraseAllData}
        >
          <Trash2 size={20} className="mr-3" />
          Erase All Data
        </motion.button>
      </div>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-blue-100 hover:text-white p-2 rounded-full hover:bg-blue-800 transition-colors"
      >
        <X size={24} />
      </button>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">
              Erase All Data
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to erase all your journal entries? This
              action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={confirmEraseAllData}
              >
                Erase All
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

interface OverlayProps {
  onClick: () => void;
  zIndex?: string;
}

const Overlay = ({ onClick, zIndex = "z-40" }: OverlayProps) => {
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const transition = { type: "tween", duration: 0.2 };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
      transition={transition}
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm ${zIndex}`}
      onClick={onClick}
    />
  );
};

// Create a component for the action buttons
const EntryActionButtons = () => {
  const {
    handleSummarize,
    handleEdit,
    handleDelete,
    isEditMode,
    isSummarizing,
  } = useContext(EntryActionContext);

  return (
    <>
      <button
        className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
        title="Summarize"
        onClick={handleSummarize}
        disabled={isSummarizing}
      >
        {isSummarizing ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
        ) : (
          <FileText size={20} />
        )}
      </button>
      <button
        className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
        title="Edit"
        onClick={handleEdit}
        disabled={isEditMode}
      >
        <Edit2 size={20} />
      </button>
      <button
        className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
        title="Delete"
        onClick={handleDelete}
      >
        <Trash2 size={20} />
      </button>
    </>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isEntryPage = pathname?.startsWith("/entry/");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-30">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Daily Journal</h1>
        </div>
        <div className="flex items-center space-x-2">
          {isEntryPage && <EntryActionButtons />}
        </div>
      </header>

      <main className="flex-grow overflow-y-auto bg-gray-50">{children}</main>

      <AnimatePresence>
        {isSidebarOpen && (
          <Overlay key="overlay" onClick={closeSidebar} zIndex="z-40" />
        )}
        {isSidebarOpen && <Sidebar key="sidebar" onClose={closeSidebar} />}
      </AnimatePresence>
    </div>
  );
}
