import { cn } from "@/app/lib/util";
import { IconLayoutNavbarCollapse, IconX } from "@tabler/icons-react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { useRef, useState, useCallback, useEffect } from "react";
import { cloneElement } from "react";

/* ============================================
   MASTER WRAPPER
============================================ */
export const FloatingDock = ({ items, desktopClassName, mobileClassName }) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

/* ============================================
   OPTIMIZED MOBILE DOCK
============================================ */
const FloatingDockMobile = ({ items, className }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative block md:hidden", className)}>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="absolute bottom-full right-0 mb-3 flex flex-col gap-2 z-40"
        >
          {items.map((item) => (
            <div key={item.title} className="relative group">
              <a
                href={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                  setOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg 
                  bg-white/10 border border-white/20 hover:bg-white/20 
                  transition-all"
              >
                <div className="h-4 w-4 text-white">{item.icon}</div>
              </a>

              <div
                className="absolute right-full top-1/2 -translate-y-1/2 
                mr-2 px-2 py-1 bg-black text-white text-xs rounded 
                opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {item.title}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg 
        bg-white/10 border border-white/20 hover:bg-white/20 transition-all z-40"
      >
        {open ? (
          <IconX className="h-4 w-4 text-white" />
        ) : (
          <IconLayoutNavbarCollapse className="h-4 w-4 text-white" />
        )}
      </button>
    </div>
  );
};

/* ============================================
   OPTIMIZED DESKTOP FLOATING DOCK
============================================ */
const FloatingDockDesktop = ({ items, className }) => {
  const mouseX = useMotionValue(Infinity);

  // Throttled to VERY low processing
  const handleMouseMove = useCallback((e) => {
    if (Math.abs(mouseX.get() - e.pageX) > 32) {
      mouseX.set(e.pageX);
    }
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-12 items-end gap-2.5 rounded-lg bg-white/5 px-2 pb-1.5 md:flex",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer key={item.title} mouseX={mouseX} {...item} />
      ))}
    </div>
  );
};

/* ============================================
   ULTRA-LIGHT ICON (scale transform only)
============================================ */
function IconContainer({ mouseX, title, icon, href, onClick }) {
  const ref = useRef(null);
  const centerX = useRef(0);

  // Cache bounding box ONCE
  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    centerX.current = rect.left + rect.width / 2;
  }, []);

  // Minimal animation range, very smooth & light
  const scale = useTransform(mouseX, (x) => {
    const dist = Math.abs(x - centerX.current);
    if (dist > 90) return 1; // baseline
    return 1.15 - dist / 300; // small, smooth pulse
  });

  return (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <motion.div
        ref={ref}
        style={{ scale }}
        className="flex h-9 w-9 items-center justify-center"
      >
        <div className="text-green-400">
          {cloneElement(icon, { className: "text-green-400 h-6 w-6" })}
        </div>
      </motion.div>
    </a>
  );
}
