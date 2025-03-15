import { useState, useRef, useEffect, ReactNode } from "react";

interface PopoverProps {
  buttonText: string;
  children: ReactNode;
}

const Popover: React.FC<PopoverProps> = ({ buttonText, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {buttonText}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 p-4 bg-white shadow-lg rounded">
          {children}
          <button
            onClick={() => setIsOpen(false)}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Popover;
