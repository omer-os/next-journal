import React, { useState, useRef, useCallback } from "react";
import {
  Paperclip,
  MapPin,
  Smile,
  Hash,
  Mic,
  Send,
  Maximize2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimateChangeInHeight } from "./ui/animate-change-in-height";

interface EntryInputProps {
  onSubmit?: (text: string) => void;
}

export default function EntryInput({ onSubmit }: EntryInputProps) {
  const [entryText, setEntryText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setEntryText(e.target.value);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        const maxHeight = isExpanded ? Infinity : 200;
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = `${Math.min(
          scrollHeight,
          maxHeight
        )}px`;
      }
    },
    [isExpanded]
  );

  const handleSubmit = useCallback(() => {
    if (!entryText.trim()) return;
    onSubmit?.(entryText);
    setEntryText("");
    setIsExpanded(false);
  }, [entryText, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const isSubmitKey =
        e.key === "Enter" &&
        (isExpanded ? e.metaKey || e.ctrlKey : !e.shiftKey);
      if (isSubmitKey) {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    },
    [isExpanded, handleSubmit]
  );

  const hasContent = entryText.trim().length > 0;

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      <AnimateChangeInHeight className="shadow-lg bg-white border rounded-2xl border-gray-200">
        <motion.div
          initial={false}
          animate={{
            scale: 1,
            y: 0,
          }}
          transition={{
            type: "tween",
            duration: 0.2,
            ease: "easeOut",
          }}
          className={`flex flex-col bg-white z-50 relative ${
            isExpanded
              ? "fixed left-0 right-0 max-w-4xl mx-auto"
              : "mx-auto p-3"
          }`}
        >
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200 p-4"
            >
              <span className="text-lg font-semibold text-gray-700">
                New Journal Entry
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                onClick={() => setIsExpanded(false)}
                aria-label="Collapse input"
              >
                <X size={20} />
              </motion.button>
            </motion.div>
          )}

          <div
            className={`flex items-start space-x-2 ${
              isExpanded ? "flex-grow p-4" : ""
            }`}
          >
            <motion.textarea
              ref={textareaRef}
              rows={1}
              value={entryText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onClick={() => !isExpanded && setIsExpanded(true)}
              placeholder="What's on your mind?"
              className={`w-full focus:outline-none text-base resize-none bg-transparent placeholder-gray-500 ${
                isExpanded ? "text-lg min-h-[40em]" : "py-2"
              }`}
            />
          </div>

          <motion.div
            initial={false}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              type: "tween",
              duration: 0.2,
            }}
            className={`flex items-end justify-between ${
              isExpanded ? "mt-auto p-4 border-t border-gray-200" : "pt-1"
            }`}
          >
            <motion.div
              className="flex items-center space-x-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ActionButton
                icon={<Paperclip size={18} />}
                label="Attach file"
              />
              <ActionButton icon={<MapPin size={18} />} label="Add location" />
              <ActionButton icon={<Smile size={18} />} label="Add mood" />
              <ActionButton icon={<Hash size={18} />} label="Add tags" />
              {!isExpanded && (
                <ActionButton
                  icon={<Maximize2 size={18} />}
                  label="Expand input"
                  onClick={() => setIsExpanded(true)}
                />
              )}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!hasContent}
              className={`p-2.5 rounded-full flex items-center justify-center transition-all duration-200 ${
                hasContent
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              aria-label={hasContent ? "Send entry" : "Enter text to send"}
            >
              {hasContent ? <Send size={20} /> : <Mic size={20} />}
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimateChangeInHeight>
    </>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
}) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
    onClick={onClick}
    aria-label={label}
  >
    {icon}
  </motion.button>
);
