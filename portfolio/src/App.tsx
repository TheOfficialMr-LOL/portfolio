//import { motion, useMotionValue, animate } from "framer-motion";
//import { useState } from "react";

import Dock from "./components/dock";
import Profile from "./sections/profile";

function App() {

  return (
    <div style={styles.page}>
      <br/>
      <Dock/>
      <Profile/>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "#f0f0f0",
    paddingBottom: "30px"
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
  },
};

export default App
