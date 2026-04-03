"use client";

import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function RowActionsMenu({ actions = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleActionClick = (action) => {
    if (action.onClick) {
      action.onClick();
    }
    setIsOpen(false);
  };

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-visible" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center rounded border border-border bg-surface-2 p-2 text-body transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
        aria-label="Row actions menu"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 border border-border bg-surface-2 rounded shadow-lg" style={{ width: 'max-content', maxWidth: '180px' }}>
          {actions.map((action, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleActionClick(action)}
              className={`block px-3 py-2 text-sm text-left transition-colors hover:bg-surface-1 first:rounded-t last:rounded-b ${
                action.variant === "danger"
                  ? "w-full text-red-300 hover:bg-red-500/10"
                  : "w-full text-body hover:text-primary"
              }`}
              disabled={action.disabled}
            >
              <div className="flex items-center gap-2">
                {action.icon && <span className="flex shrink-0 items-center">{action.icon}</span>}
                <span>{action.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
