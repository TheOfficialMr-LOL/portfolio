import { useMotionValue, animate, motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  hoverScale?: number;
};

function usePopOut() {
  const scale = useMotionValue(1);

  const press = () => {
    animate(scale, 0.9, {
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

export function PressableCard({ children, hoverScale }: Props) {
  const { scale, press, release } = usePopOut();

  return (
    <motion.div

    whileHover={{
        scale: hoverScale ?? 1.06,
        y: 0,
    }}
    transition={{
        type: "spring",
        stiffness: 400,
        damping: 18,
    }}

    style={{ scale , cursor: "grab"}}
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={release}
    >
      {children}
    </motion.div>
  );
}