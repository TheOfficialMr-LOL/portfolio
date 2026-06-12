import { motion, useMotionValue, animate } from "framer-motion";
import { useState } from "react";
import "./dock.css";

type Section = "Profile" | "Techstack" | "Journey";

type DockProps = {
  activeSection: Section;
}


export default function Dock({activeSection}: DockProps) {

  const scale = useMotionValue<number>(1);
  const y = useMotionValue<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handlePress = () => {
    if (isDragging) return;

    animate(scale, 0.9, {
      type: "spring",
      stiffness: 500,
      damping: 20,
    });
  };

  const handleRelease = () => {
    if (isDragging) return;

    animate(scale, 1, {
      type: "spring",
      stiffness: 300,
      damping: 12,
    });
  };

  return (
    <div style={styles.wrapper}>
      <motion.div
        drag
        dragElastic={0.2}
        dragSnapToOrigin
        dragMomentum
        whileDrag={{ scale: 1.05 }}
        style={{
        ...styles.dock,
        scale,
        y,
        }}

        whileHover={{
          scale: 1.05,
          y: -6,
        }}


        transition={{
          type: "spring",
          stiffness: 400,
          damping: 18,
        }}

        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
        setIsDragging(false);
        handleRelease();
        }}

        onPointerDown={handlePress}
        onPointerUp={handleRelease}
        onPointerLeave={handleRelease}
      >
        <motion.button className={`icon ${activeSection === "Profile" ? "active" : ""}`} onClick={() => scrollToSection("Profile")}>
          About me
        </motion.button>

        <motion.button className={`icon ${activeSection === "Techstack" ? "active" : ""}`} onClick={() => scrollToSection("Techstack")}>
          Tech Stack
        </motion.button>

        <motion.button className={`icon ${activeSection === "Journey" ? "active" : ""}`} onClick={() => scrollToSection("Journey")}>
          My Journey
        </motion.button>
      </motion.div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "#f7f8fa",
  },

  dock: {
    position: "fixed",
    bottom: "20px",
    left: "auto",

    display: "flex",
    gap: "12px",
    padding: "10px 14px",

    background: "rgba(30,30,30,0.6)",
    backdropFilter: "blur(12px)",
    borderRadius: "24px",

    boxShadow: "0 10px 30px rgba(0,0,0,0.15), 0 1px 1px rgba(255,255,255,0.05) inset",
    cursor: "grab",
  },
  wrapper: {
    position: "fixed",
    bottom: "20px",
    left: 0,
    width: "100%",

    display: "flex",
    justifyContent: "center",
    zIndex: 100
  },
};


function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}