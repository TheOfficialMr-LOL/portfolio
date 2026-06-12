//import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

import Dock from "./components/dock";
import Profile from "./sections/profile";
import TechStack from "./sections/techstack";

type Section = "Profile" | "Techstack" | "Journey";

function App() {

  //track which section user is on
  const [activateSection, setActiveSection] = useState<Section>("Profile");

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section");

    //identify which section user is on
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          entry.isIntersecting ? setActiveSection(entry.target.id as Section) : "";
        });
      },
      {threshold: 0.5}
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div style={styles.page}>
      <br/>
      <Dock activeSection={activateSection}/>
      <section id="Profile" style={{scrollMarginTop: "80px"}}><Profile/></section>
      <br/><br/>
      <section id="Techstack"><TechStack/></section>
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
