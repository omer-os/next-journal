import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Paperclip,
  MapPin,
  Smile,
  Send,
  CirclePlus,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { saveJournalEntry } from "@/utils/storage";
import { JournalEntry } from "@/utils/types";

interface EntryInputProps {
  onEntryAdded: () => void;
}

const generateSummary = async (text: string): Promise<string> => {
  try {
    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate summary");
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Failed to generate summary";
  }
};

export default function EntryInput({ onEntryAdded }: EntryInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Set height based on content, respecting min/max defined in style
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = parseInt(textarea.style.maxHeight, 10) || Infinity;
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, []);

  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      // Focus and initial height adjustment
      textareaRef.current.focus();
      // Delay adjustment slightly to ensure rendering is complete
      requestAnimationFrame(adjustTextareaHeight);
    }
  }, [isExpanded, adjustTextareaHeight]);

  // Adjust height on text input
  useEffect(() => {
    if (isExpanded) {
      adjustTextareaHeight();
    }
  }, [text, isExpanded, adjustTextareaHeight]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    // No need to call adjustTextareaHeight here, the useEffect [text] handles it
  };

  const handleSubmit = async () => {
    if (!text.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const summary = await generateSummary(text.trim());

      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        text: text.trim(),
        createdAt: new Date().toISOString(),
        images: [],
        summary,
      };

      saveJournalEntry(newEntry);
      setText("");
      setIsExpanded(false);
      onEntryAdded();
    } catch (error) {
      console.error("Error creating entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: "easeOut" } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.85, y: "-40%" },
    visible: {
      opacity: 1,
      scale: 1,
      y: "-50%",
      transition: { type: "spring", damping: 30, stiffness: 250, mass: 0.9 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: "-45%",
      transition: { duration: 0.25, ease: "easeIn" },
    },
  };

  const bottomBarVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 25, delay: 0.1 },
    },
    exit: {
      y: "100%",
      opacity: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  return (
    <div className="flex flex-col justify-end">
      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-md"
            />

            <motion.div
              key="modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white fixed top-1/2 left-1/2 z-50 -translate-x-1/2 w-[92%] max-w-2xl h-[75vh] max-h-[700px] // Increased height
                         border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              style={{ y: "-50%" }} // Ensure transform origin is correct
            >
              <div className="p-4 pb-2 flex flex-col h-full">
                {/* Header/Close Button */}
                <div className="flex items-center border-b border-gray-200/50 justify-between mb-2 flex-shrink-0">
                  <h1 className="text-lg font-bold">New Entry</h1>
                  <motion.button
                    onClick={() => setIsExpanded(false)}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close modal"
                  >
                    <X size={22} />
                  </motion.button>
                </div>

                {/* Textarea takes remaining space */}
                <div className="flex-grow overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent flex">
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleInput}
                    rows={1} // Start with 1 row, height adjusts automatically
                    placeholder="Share your thoughts, ideas, or feelings..."
                    className="w-full h-full focus:outline-none text-lg resize-none bg-transparent placeholder-gray-400 py-1 text-gray-800"
                  />
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100 flex-shrink-0">
                  <div className="flex items-center space-x-1">
                    {[
                      { icon: <Paperclip size={20} />, label: "Attach file" },
                      { icon: <MapPin size={20} />, label: "Add location" },
                      { icon: <Smile size={20} />, label: "Add mood" },
                    ].map(({ icon, label }) => (
                      <motion.button
                        key={label}
                        className="h-10 w-10 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.15, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        title={label}
                        aria-label={label}
                        disabled={isSubmitting}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 15,
                        }}
                      >
                        {icon}
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    className={`px-6 py-2.5 rounded-full flex items-center justify-center gap-2.5 font-semibold text-sm transition-all duration-250 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      text.trim() && !isSubmitting
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/40"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!text.trim() || isSubmitting}
                    whileHover={
                      text.trim() && !isSubmitting ? { scale: 1.05, y: -1 } : {}
                    }
                    whileTap={
                      text.trim() && !isSubmitting ? { scale: 0.97 } : {}
                    }
                    transition={{ type: "spring", stiffness: 350, damping: 15 }}
                    onClick={handleSubmit}
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Loader2 className="w-5 h-5 animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="send"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-2"
                        >
                          <Send size={18} />
                          <span>Post Entry</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New Bottom Bar Trigger */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            key="bottom-bar"
            variants={bottomBarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 z-30 p-3"
          >
            <motion.button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-3 w-full max-w-md mx-auto bg-white text-gray-500 p-3 px-4 rounded-xl border border-gray-200/80 shadow-sm hover:border-gray-300 hover:text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              whileHover={{
                scale: 1.02,
                borderColor: "rgb(147 197 253)",
                boxShadow: "0 4px 12px -1px rgba(0, 0, 0, 0.07)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <CirclePlus size={22} className="text-blue-500" />
              <span className="font-medium text-sm">Add New Entry...</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
