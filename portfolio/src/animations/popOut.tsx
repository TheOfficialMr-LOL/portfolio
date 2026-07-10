import { useMotionValue, animate, motion, type MotionStyle  } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  hoverScale?: number;
  isMobile?: boolean;
  style?:  MotionStyle;
  onPress?: any;
  "data-clickable"?: boolean;
};

function usePopOut(isMobile: boolean) {
  const scale = useMotionValue(1);

  const press = () => {
    animate(scale, isMobile ? 1 : 0.9, {
      type: "spring",
      stiffness: 500,
      damping: 20,
    });
  };

  const release = () => {
    animate(scale, 1, {
      type: "spring",
      stiffness: 300,
      damping: 12,
    });
  };

  return { scale, press, release };
}

export function PressableCard({ children, hoverScale, isMobile = false, style, onPress }: Props) {
  const { scale, press, release } = usePopOut(isMobile);

  return (
    <motion.div
    data-clickable
      whileHover={
        isMobile
          ? {y: 0}
          : {
              scale: hoverScale ?? 1.06,
              y: 0
            }
        }
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 18,
      }}

      style={{ scale , cursor: "grab", ...style}}
      onPointerDown={(e) => {
        e.stopPropagation();
        press();
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        release();
        onPress?.();
      }}
      onPointerLeave={release}
    >
      {children}
    </motion.div>
  );
}