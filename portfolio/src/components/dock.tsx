import { motion, useMotionValue, animate } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import "./dock.css";


import { User } from "lucide-react";
import { Wrench } from "lucide-react";
import { Waypoints } from "lucide-react";

type Section = "Profile" | "Techstack" | "Journey";
type Position = "Down" | "Up" | "Left" | "Right";

type DockProps = {
  activeSection: Section;
}

type SnapPosition = {
  x: number;
  y: number;
};

let dockSizes = {
  vertical: {width: 71, height: 193},
  horizontal: {width: 0, height: 0}
}


const stiffness = 400;
const damping = 18;


export default function Dock({activeSection}: DockProps) {

  //track dock's position to show snap previews
  const dockRef = useRef<HTMLDivElement>(null);
  const [dockPosition, setDockPosition] = useState<Position>("Down");
  const [previewPosition, setPreviewPosition] = useState<Position | null>(null);
  const [highlightPreview, setHighlightPreview] = useState<boolean>(false);
  const [showSnapPreview, setshowSnapPreview] = useState<boolean>(false);
  const dockOnVerticalAxis =
    previewPosition && showSnapPreview
      ? previewPosition === "Right" || previewPosition === "Left"
      : dockPosition === "Right" || dockPosition === "Left";
    
  const scale = useMotionValue<number>(1);
  const y = useMotionValue<number>(-1000); //setting to -1000 to prevent dock initial position from appearing on screen
  const x = useMotionValue<number>(-1000);//as it will be recalculated  
  const lastPointer = useRef({x: 0, y: 0}); //track mouse for mobile
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [viewport, setViewport] = useState({
    width: window.visualViewport?.width ?? window.innerWidth,
    height: window.visualViewport?.height ?? window.innerHeight
  });
  const snapDistance = (viewport.width > 600) ? Math.min(viewport.width, viewport.height) * 0.15 : 80;
  const hideDistance = snapDistance * 1.4;
  const snapLockDistance = (viewport.width > 600) ? snapDistance * 0.8 : snapDistance + 20;

  const activeSnapRef = useRef<Position | null>(null); //ensures dock calculations don't occur during rotation


  //set viewport and ignore viewport height changes on annoying browsers
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      setViewport(prev => {
        if (prev.width === width) return prev;
        return {
          width,
          height: window.innerHeight,
        };
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


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

  //calculate dock width and height when it's horizontal (initial render)
  useEffect(() => {
    //only render once
    if (dockSizes.horizontal.height + dockSizes.horizontal.width != 0) return;
    const dock = dockRef.current?. getBoundingClientRect();
    if (!dock) return;

    dockSizes.horizontal = {width: dock.width, height: dock.height};
  }, []);


  //position dock in it's original position (bottom)
  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;

    requestAnimationFrame(() => {
      const rect = dock.getBoundingClientRect();
      x.set(viewport.width / 2 - rect.width / 2);
      y.set(viewport.height - rect.height - 20);
    });
  }, [viewport.width, viewport.height]);


  //storing snap positions
  const snapPositions: Record<Position, () => SnapPosition> = {

    Down: () => {
      return {
        x: viewport.width / 2 - dockSizes.horizontal.width / 2,
        y: viewport.height - dockSizes.horizontal.height - 20
      };
    },

    Right: () => {
      const rect = dockRef.current!.getBoundingClientRect();
      return {
        x: viewport.width - dockSizes.vertical.width*3 - 20,
        y: viewport.height / 2 - dockSizes.vertical.height / 2 - rect.top + y.get()
      };
    },

    Left: () => {
      const rect = dockRef.current!.getBoundingClientRect();
      return {
        x: 20 - 145,
        y: y.get() + (viewport.height / 2 - dockSizes.vertical.height / 2 - rect.top)
      };
    },

    Up: () => {
      return {
        x: viewport.width / 2 - dockSizes.horizontal.width / 2,
        y: 20
      };
    },
  };


  //logic for controlling dock's snapping as it moves around the screen
  const getHomePosition = () => {
    const dock = dockRef.current;
    if (!dock) return { x: 0, y: 0 };

    let homePosition = {x: 0, y: 0};

    dockPosition === "Down" ? homePosition = snapPositions.Down()
    : dockPosition === "Right" ? homePosition = snapPositions.Right()
    : dockPosition === "Left" ? homePosition = snapPositions.Left()
    : homePosition = snapPositions.Up();

    return homePosition;
  };

  const snapDock = () => {
    const dock = dockRef.current;
    if (!dock) return;

    const isMobile = viewport.width < 600;

    let rightDistance;
    let leftDistance;
    let upDistance;
    let downDistance;
    if (isMobile) {
      //snap based on finger position
      const pointerX = lastPointer.current.x;
      const pointerY = lastPointer.current.y - window.scrollY;

      rightDistance = viewport.width - pointerX;
      leftDistance = pointerX;
      upDistance = pointerY;
      downDistance = viewport.height - pointerY;
    } else {
      //snap based on dock position
      const rect = dock.getBoundingClientRect();
      rightDistance = viewport.width - rect.right;
      leftDistance = rect.left;
      upDistance = rect.top;
      downDistance = viewport.height - rect.bottom;
    }
    

    const animateDock = (target: SnapPosition) => {
      animate(x, target.x, {
        type: "spring",
        stiffness,
        damping,
      });
      animate(y, target.y, {
        type: "spring",
        stiffness,
        damping,
      });
    };
        
    //right snap
    if (rightDistance < snapLockDistance) {
      setDockPosition("Right");
      const target = snapPositions.Right()
      animateDock(target)
      setPreviewPosition(null);
      return;
    }

    //left snap
    if (leftDistance < snapLockDistance) {
      setDockPosition("Left");
      const target = snapPositions.Left();
      animateDock(target);
      setPreviewPosition(null);
      return;
    }

    //down snap
    if (downDistance < snapLockDistance) {
      setDockPosition("Down");
      const target = snapPositions.Down();
      animateDock(target);
      setPreviewPosition(null);
      return;
    }

    //up snap
    if (upDistance < snapLockDistance) {
      setDockPosition("Up");
      const target = snapPositions.Up();
      animateDock(target);
      setPreviewPosition(null);
      return;
    }


    //return home
    const home = getHomePosition();
    animateDock(home);
    setPreviewPosition(null);
  };

  return (
    <div style={styles.wrapper}>
      {/*Dock position previews*/}

      {/*Blur*/}
      {showSnapPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(8px)",
            pointerEvents: "none",
            zIndex: 0
          }}
        />
      )}

      {/*Dock position right preview*/}
      {(previewPosition === "Right" && dockPosition !== "Right") && (
        <motion.div
          initial={{ opacity: 0, x: 500, y: "-50%" }}
          animate={{ opacity: 1, x: 0, y: "-50%" }}
          style={{
            ...styles.dockPreviewPlaceholder,
            ...(highlightPreview ? styles.preview : {}),
            top: "50%",
            right: 20,
            borderLeft: "1px solid rgba(255,255,255,0.2)",
          }}
        />
      )}
      {/*Dock position left preview*/}
      {(previewPosition === "Left" && dockPosition !== "Left") && (
        <motion.div
          initial={{ opacity: 0, x: -500, y: "-50%" }}
          animate={{ opacity: 1, x: 0, y: "-50%" }}
          style={{
            ...styles.dockPreviewPlaceholder,
            ...(highlightPreview ? styles.preview : {}),
            top: "50%",
            left: 20,
            borderRight: "1px solid rgba(255,255,255,0.2)",
          }}
        />
      )}
      {/*Dock position up preview*/}
      {(previewPosition === "Up" && dockPosition !== "Up") && (
        <motion.div
          initial={{ opacity: 0, y: -500 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            ...styles.dockPreviewPlaceholder,
            width: dockSizes.horizontal.width, 
            height: dockSizes.horizontal.height,
            maxWidth: "3000px",
            ...(highlightPreview ? styles.preview : {}),
            top: 20,
            left: "50%",
            translateX: "-50%",
            borderBottom: "1px solid rgba(255,255,255,0.2)",  
          }}
        />
      )}
      {/*Dock position down preview*/}
      {(previewPosition === "Down" && dockPosition !== "Down") && (
        <motion.div
          initial={{ opacity: 0, y: 500 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            ...styles.dockPreviewPlaceholder,
            width: dockSizes.horizontal.width, 
            height: dockSizes.horizontal.height,
            ...(highlightPreview ? styles.preview : {}),
            maxWidth: "3000px",
            bottom: 20,
            left: "50%",
            translateX: "-50%",
            borderTop: "1px solid rgba(255,255,255,0.2)",  
          }}
        />
      )}




      {/*Dock*/}
      <motion.div
        ref={dockRef}
        drag
        dragElastic={0.2}
        dragSnapToOrigin={false}
        dragMomentum
        whileDrag={{ scale: 1.05 }}
        style={{
          ...styles.dock,
          x,
          y,
          scale,
          transformOrigin: dockOnVerticalAxis ? "70% 120%" : "50% 50%",
        }}
        animate={{
          rotate: dockOnVerticalAxis ? 90 : 0,
        }}

        whileHover={{
          scale: 1.1,
        }}


        transition={{
          type: "spring",
          stiffness: 400,
          damping: 18,
        }}

        onDragStart={() => {
          setIsDragging(true);
          activeSnapRef.current = null;
        }}
        onDragEnd={() => {
          setIsDragging(false);
          handleRelease();
          setshowSnapPreview(false);

          snapDock();
        }}
        onDrag={(event, info) => {

          const rect = dockRef.current?.getBoundingClientRect();
          if (!rect) return;
          const e = event as PointerEvent;

          const pointerX = e.clientX;
          const pointerY = e.clientY;
        
          if (isDragging) {
            lastPointer.current = {
              x: info.point.x,
              y: info.point.y
            };
          }
          const isMobile = viewport.width < 600;
          const distances: Record<Position, number> = isMobile
          ? {
              Left: pointerX,
              Right: viewport.width - pointerX,
              Up: pointerY,
              Down: viewport.height - pointerY,
            }
          : {
              Left: x.get() + 140,
              Right: viewport.width - (x.get() + dockSizes.horizontal.width - 200),
              Up: y.get(),
              Down: viewport.height - (y.get() + dockSizes.horizontal.height),
            };
          console.log(distances);
          const closest = Object.entries(distances).sort((a, b) => a[1] - b[1])[0];

          (closest[1] < snapLockDistance) ? setHighlightPreview(true) : setHighlightPreview(false);
          if (!showSnapPreview) {

            if (closest[1] <= snapDistance && dockPosition !== closest[0]) {
              const position = closest[0] as Position;

              activeSnapRef.current = position;

              setshowSnapPreview(true);
              setPreviewPosition(position);

            }

          } else {

            const lockedPosition = activeSnapRef.current;
            if (lockedPosition) {
              const lockedDistance = distances[lockedPosition];

              //remove preview when leaving the locked zone
              if (lockedDistance > hideDistance) {
                activeSnapRef.current = null;
                setshowSnapPreview(false);
                setPreviewPosition(null);
              }
            }
          }
        }}

        onPointerDown={handlePress}
        onPointerUp={() => {
          //if (!isDragging) return;
          handleRelease();
        }}
        onPointerLeave={handleRelease}
      >
        <motion.button className={`icon ${activeSection === "Profile" ? "active" : ""} noSelect`} onClick={() => scrollToSection("Profile")} style={{transform: dockOnVerticalAxis ? "rotate(270deg)":""}}>
          {dockOnVerticalAxis ? (
            <User size={24}/>
          ) : (
            "About me"
          )}
        </motion.button>

        <button className={`icon ${activeSection === "Techstack" ? "active" : ""} noSelect`} onClick={() => scrollToSection("Techstack")} style={{transform: dockOnVerticalAxis ? "rotate(270deg)":""}}>
          {dockOnVerticalAxis ? (
            <Wrench size={24}/>
          ) : (
            "Techstack"
          )}
        </button>

        <button className={`icon ${activeSection === "Journey" ? "active" : ""} noSelect`} onClick={() => scrollToSection("Journey")} style={{transform: dockOnVerticalAxis ? "rotate(270deg)":""}}>
          {dockOnVerticalAxis ? (
            <Waypoints size={24}/>
          ) : (
            "My Journey"
          )}
        </button>
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
    display: "flex",
    gap: "12px",
    padding: "10px 14px",

    background: "rgba(30,30,30,0.6)",
    backdropFilter: "blur(12px)",
    borderRadius: "24px",

    boxShadow: "0 10px 30px rgba(0,0,0,0.15), 0 1px 1px rgba(255,255,255,0.05) inset",
    cursor: "grab",
    pointerEvents: "auto",
    zIndex: 52,
  },
  wrapper: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    pointerEvents: "none",
    left: 0,
    bottom: 0,
  },
  preview: {
    background: "rgba(255, 255, 255, 0.4)",
    zIndex: 51
  },
  dockPreviewPlaceholder: {
    position: "fixed",
    width: dockSizes.vertical.width,
    height: dockSizes.vertical.height,
    maxWidth: "70px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(20px)",
    pointerEvents: "none",
    borderRadius: "24px",
  },
};


function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


