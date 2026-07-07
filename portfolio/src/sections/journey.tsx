import experience from "../data/experience";
import image from "../assets/projects/tictactoe/audioSetting.png";

import { motion, useMotionValue, useMotionValueEvent, animate, type AnimationPlaybackControls, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {X} from "lucide-react";
import "./journey.css";

const Xbutton = motion.create(X);

export default function Journey() {
	const [openGallery, setOpenGallery] = useState<number | null>(null);

	const containerRef = useRef<HTMLDivElement>(null);
	const startX = useRef(0);
	const scrollStart = useRef(0);
	const [isDragging, setIsDragging] = useState(false);

	const velocity = useRef(0);
	const lastX = useRef(0);
	const animation = useRef<number | null>(null);

	const onPointerDown = (e: React.PointerEvent) => {
		if (!containerRef.current) return;

		setIsDragging(true);
		containerRef.current.setPointerCapture(e.pointerId);
		startX.current = e.clientX;
		lastX.current = e.clientX;
		scrollStart.current = containerRef.current.scrollLeft;
		velocity.current = 0;

		if (animation.current) {
			cancelAnimationFrame(animation.current);
		}
	};


	const onPointerMove = (e: React.PointerEvent) => {
		if (!isDragging || !containerRef.current) return;

		const dx = e.clientX - lastX.current;
		velocity.current = dx;
		containerRef.current.scrollLeft -= dx;
		lastX.current = e.clientX;
	};


	const onPointerUp = (e: React.PointerEvent) => {
		setIsDragging(false);

		containerRef.current?.releasePointerCapture(e.pointerId);
		inertia();
	};

	const inertia = () => {
		if (!containerRef.current) return;

		velocity.current *= 0.98; //drag friction
		containerRef.current.scrollLeft -= velocity.current;
		if (Math.abs(velocity.current) > 0.5) {
			animation.current = requestAnimationFrame(inertia);
		}
	};

	const cancelInertia = () => {
		if (animation.current) {
			cancelAnimationFrame(animation.current);
			animation.current = null;
		}
	};

	return (
		<div>
			<AnimatePresence>
				{openGallery !== null && <ProjectImageGallery images={experience[openGallery].images} setOpenGallery={setOpenGallery}/>}
			</AnimatePresence>
			<div 	
				ref={containerRef}
				style={{...styles.cardHolder, cursor: isDragging ? "grabbing" : "grab"}}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerLeave={onPointerUp}
			>
				{[...experience].reverse().map((exp, key) => (
					<ProjectCard 
						key={exp.title}
						experience={exp}
						onExplode={cancelInertia}
						setOpenGallery={setOpenGallery}
						ID={(experience.length - 1) - key}
					/>
				))}
				<br/>
			</div>
		</div>
	);
}




function ProjectCard({experience, onExplode, setOpenGallery, ID}: any) {
	const [pressed, setPressed] = useState<boolean>(false);
	const [hovered, setHovered] = useState<boolean>(false);

	const [phase, setPhase] = useState<"stack" | "exploding" | "gallery">("stack");
	const stackRef = useRef<HTMLDivElement>(null);
	const isExploding = phase === "exploding";

	useEffect(() => {
		if (isExploding) {
			onExplode?.();
			const timer = setTimeout(() => {setOpenGallery(ID)}, 250);
			return () => clearTimeout(timer);
		}
	}, [isExploding, onExplode]);


	return (
		<div style={styles.card}>
			{/*Header*/}
			<div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
				<p style={{fontSize: "14px", color: "#999999"}}>{experience.start} - {experience.end}</p>
				<p style={{fontSize: "14px", color: "#999999"}}>{experience.company}</p>
			</div>

			<p style={{fontWeight: "600", fontSize: "18px", marginTop: "-10px"}}>{experience.role}</p>
			<p style={{fontWeight: "400", fontSize: "16px", textAlign: "center", marginLeft: "-4%"}}>{experience.title}</p>

	
			<motion.div 
				ref={stackRef}
				style={styles.imageStack}
				onPointerDown={(e) => {e.stopPropagation();!isExploding ? setPressed(true) : null}}
				onPointerUp={(e) => {e.stopPropagation();setPressed(false); setPhase("exploding");}}
				onPointerEnter={() => {!isExploding ? setHovered(true) : null}}
				onPointerLeave={() => {
					if (!isExploding) {
						setHovered(false);
						setPressed(false);
					}
				}}				

				whileTap="pressed"
				animate={pressed ? "pressed" : hovered ? "hover" : "idle"}
				variants={{
					idle: {
							x: 0,
							scale: 1,
					},
					hover: {
							x: -25,
							scale: 1.05,
					},
					pressed: {
							x: 0,
							scale: 0.8,
					}
				}}
				transition={{
						type: "spring",
						stiffness: 280,
						damping: 22,
				}}
			>
				<div style={{...styles.layer, transform: isExploding?"translate(36px, 36px) scale(0.88)":pressed?"translate(20px, 20px) scale(0.92)":hovered?"translate(55px, 36px) scale(0.88)":"translate(36px, 36px) scale(0.88)", transition: "transform 0.25s cubic-bezier(.2,.8,.2,1), opacity 0.4s ease", opacity: phase === "exploding" ? 0 : 0.4, backgroundColor: experience.overlayColor, borderColor: experience.borderColor ?? "rgba(255,255,255)"}} />
				<div style={{...styles.layer, transform: isExploding?"translate(24px, 24px) scale(0.94)":pressed?"translate(12px, 12px) scale(0.96)":hovered?"translate(35px, 24px) scale(0.94)":"translate(24px, 24px) scale(0.94)", transition: "transform 0.25s cubic-bezier(.2,.8,.2,1), opacity 0.4s ease", opacity: phase === "exploding" ? 0 : 0.7, backgroundColor: experience.overlayColor, borderColor: experience.borderColor ?? "rgba(255,255,255)"}} />
				<div style={{...styles.layer, transform: isExploding?"translate(12px, 12px) scale(0.98)":pressed?"translate(6px, 6px) scale(0.99)":hovered?"translate(18px, 12px) scale(0.98)":"translate(12px, 12px) scale(0.98)", transition: "transform 0.25s cubic-bezier(.2,.8,.2,1), opacity 0.4s ease", opacity: phase === "exploding" ? 0 : 1.0, backgroundColor: experience.overlayColor, borderColor: experience.borderColor ?? "rgba(255,255,255)"}} />

				<div style={styles.imageBlurRight}/>
				<div style={styles.imageBlurBottom}/>

				<div style={{display: phase === "exploding" ? "none" : "block"}}>
					<div style={styles.glassOverlay}/>
					<div style={styles.glassShimmer}/>
					<img src={experience.coverImage ?? image} style={styles.backgroundImage}/>
				</div>

				{(phase === "exploding" && experience.images) && experience.images.map((src: string, i: number) => {
					const angle = (-150 + (120 * i) / (experience.images.length - 1)) * (Math.PI / 180);
					//-150 to 30 degrees in radians
					const distance = 1000;

					return (
						<div style={{}}>
							<motion.img
								key={i}
								src={src}
								style={{
									position: "absolute",
									inset: 0,
									width: "100%",
									height: "100%",
									objectFit: "cover",
									borderRadius: 20,
									zIndex: 200,
								}}
								initial={{
									x: 0,
									y: 0,
									scale: 0.9,
									opacity: 1,
								}}
								animate={{
									x: Math.cos(angle) * distance,
									y: Math.sin(angle) * distance,
									rotate: (Math.random() - 0.5) * 20,
									opacity: 1,
									scale: 1,
								}}

								transition={{
									type: "spring",
									stiffness: 180,
									damping: 40,
									delay: i*0.04,
								}}

								onAnimationComplete={() => {
									setPhase("stack");
									setPressed(false);
								}}
							/>
						</div>
					);
				})}
			</motion.div>
		</div>
	);
}



function ProjectImageGallery({ images, setOpenGallery }: any) {
	const containerRef = useRef<HTMLDivElement>(null);

	const [uiDragging, setUiDragging] = useState(false);
	const dragging = useRef(false);

	const x = useMotionValue(0);
	
	const [width, setWidth] = useState<number>(window.visualViewport?.width ?? window.innerWidth)
	const imageWidth = Math.min(width*0.9, 550)

	const imageRefs = useRef<HTMLDivElement[]>([]);
	const imagePositions = useRef<number[]>([]);
	const pointerStartX = useRef(0);
	const dragStartX = useRef(0);

	const lastX = useRef(0);
	const lastTime = useRef(0);
	const velocity = useRef(0);

	const inertiaAnimation = useRef<number | null>(null);
	const snapAnimation = useRef<AnimationPlaybackControls | null>(null);

	const [activeIndex, setActiveIndex] = useState(0);
	const activeIndexRef = useRef(0);

	useEffect(() => {
		const handleResize = () => {
			setWidth(window.visualViewport?.width ?? window.innerWidth);
			requestAnimationFrame(() => {
				cacheImagePositions();
				snapToClosest();
			});
		};

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				handleResize();
			});
		});
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [images]);


	//function used to control scroll bounding of the images container
	const clampX = (value: number) => {
		if (!containerRef.current || !imageRefs.current.length)
			return value;

		const containerCenter = containerRef.current.offsetWidth / 2;
		const first = imageRefs.current[0];
		const last = imageRefs.current[imageRefs.current.length - 1];

		const firstCenter = first.offsetLeft + first.offsetWidth / 2;
		const lastCenter = last.offsetLeft + last.offsetWidth / 2;
		
		const maxX = containerCenter - firstCenter;
		const minX = containerCenter - lastCenter;

		return Math.max(minX, Math.min(maxX, value));
	};

	const cacheImagePositions = () => {
		if (!imageRefs.current.length)
			return;

		imagePositions.current = imageRefs.current.map(item => item.offsetLeft + item.offsetWidth / 2);
	};

	const onPointerDown = (e: React.PointerEvent) => {
		if (!containerRef.current) return;

		snapAnimation.current?.stop();

		setUiDragging(true);
		dragging.current = true;

		containerRef.current.setPointerCapture(e.pointerId);

		pointerStartX.current = e.clientX;
		dragStartX.current = x.get();

		lastX.current = e.clientX;
		lastTime.current = performance.now();
		velocity.current = 0;

		if (inertiaAnimation.current) cancelAnimationFrame(inertiaAnimation.current);
	};

	const onPointerMove = (e: React.PointerEvent) => {
		if (!dragging.current) return;

		const now = performance.now();
		const dx = e.clientX - lastX.current;
		const dt = now - lastTime.current || 16;

		const instantVelocity = (dx / dt) * 16;
		velocity.current = velocity.current * 0.8 + instantVelocity * 0.2;

		const totalDx = e.clientX - pointerStartX.current;

		x.set(clampX(dragStartX.current + totalDx));

		lastX.current = e.clientX;
		lastTime.current = now;
	};

	const snapToClosest = () => {
		if (!containerRef.current || !imageRefs.current.length) return;

		const viewportCenter = containerRef.current.offsetWidth / 2;
		let closestIndex = 0;
		let closestDistance = Infinity;

		imagePositions.current.forEach((center, i) => {
			const visibleCenter = center + x.get();
			const distance = Math.abs(visibleCenter - viewportCenter);

			if (distance < closestDistance) {
				closestDistance = distance;
				closestIndex = i;
			}
		});

		const target = viewportCenter - imagePositions.current[closestIndex];
		snapAnimation.current?.stop();

		snapAnimation.current = animate(x, clampX(target), {
				duration: 0.3,
				ease: "easeInOut",
			}
		);
	};

	const startInertia = () => {
		const step = () => {
			velocity.current *= 0.92;

			if (Math.abs(velocity.current) < 3) {
				snapToClosest();
				inertiaAnimation.current = null;
				return;
			}

			const next = clampX(x.get() + velocity.current);

			if (next === x.get()) {
				snapToClosest();
				inertiaAnimation.current = null;
				return;
			}

			x.set(next);
			inertiaAnimation.current = requestAnimationFrame(step);
		};

		inertiaAnimation.current =
			requestAnimationFrame(step);
	};

	const onPointerUp = (e: React.PointerEvent) => {
		if (!containerRef.current) return;

		setUiDragging(false);
		dragging.current = false;
		containerRef.current.releasePointerCapture(e.pointerId);

		startInertia();
	};

	const updateCenterEffect = () => {
		if (!containerRef.current) return;

		const viewportCenter = containerRef.current.offsetWidth / 2;
		let closestIndex = 0;
		let closestDistance = Infinity;

		imagePositions.current.forEach((center, i) => {
			const visibleCenter = center + x.get(); 
			const distance = Math.abs(visibleCenter - viewportCenter);

			if (distance < closestDistance) {
				closestDistance = distance;
				closestIndex = i;
			}
		});

		if (activeIndexRef.current !== closestIndex) {
			activeIndexRef.current = closestIndex;
			setActiveIndex(closestIndex);
		}
	};

	useMotionValueEvent(x, "change", updateCenterEffect);

	return (
		<motion.div
			ref={containerRef}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			style={{
				...styles.galleryWrapper,
				cursor: uiDragging ? "grabbing" : "grab",
				touchAction: "none",
				userSelect: "none",
				WebkitUserSelect: "none",
			}}

			initial={{
				opacity: 0,
				backdropFilter: "blur(0px)",
			}}
			animate={{
				opacity: 1,
				backdropFilter: "blur(10px)",
			}}
			exit={{
				opacity: 0,
				backdropFilter: "blur(0px)",
			}}
			transition={{
				duration: 0.35,
				ease: "easeOut",
			}}
		>
			<Xbutton
				whileHover={{ scale: 1.5 }}
				transition={{ type: "spring", stiffness: 400, damping: 20 }}
				size={40} 
				style={{position: "absolute", color: "#fff", right: 0, padding: "10px", cursor: "pointer"}}
				onPointerDown={() => setOpenGallery(null)}
			/>
			<motion.div
				style={{
					...styles.imageContainer,
					x,
					paddingLeft: "50vw",
					paddingRight: "50vw",
					pointerEvents: "none",
					touchAction: "none",
					marginTop: "100px"
				}}
				className="noSelect"	
			>
				{images.map((src: string, i: number) => (
					<div
						key={i}
						ref={el => {
							if (el) imageRefs.current[i] = el;
						}}
						style={{
							flex: "0 0 auto",
						}}
						className="noSelect"
					>
						<motion.img
							src={src}
							draggable={false}
							style={{
								display: "block",
								width: `${imageWidth}px`,
								aspectRatio: "5/4",
								objectFit: "cover",
								borderRadius: "25px",
								pointerEvents: "none",
								boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
								willChange: "transform",
							}}
							animate={{scale: activeIndex === i ? 1 : 0.6}}
							transition={{duration: 0.3, ease: "easeInOut"}}
						/>
					</div>
				))}
			</motion.div>
			<SemiCircleProgress current={activeIndex + 1} total={images.length} />
		</motion.div>
	);
}


function SemiCircleProgress({current, total}: {current: number, total: number}) {
  const progress = current / total;

  const radius = 80;
  const circumference = Math.PI * radius; //semi circle circumference

  const offset = circumference - (progress) * circumference;

  return (
    <div style={{position: "absolute", bottom: "clamp(15px, 15vh, 100px)", left: "50%", transform: "translateX(-50%)",}}>
      <svg width="220" height="120" viewBox="0 0 220 120">
        {/*background arc*/}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#ddd"
          strokeWidth="10"
          strokeLinecap="round"
					opacity="0.5"
        />

        {/*progress arc*/}
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          
					animate={{
						strokeDashoffset: offset
					}}
					transition={{
						duration: 0.2
					}}
        />


				<text
					x="100"
					y="90"
					textAnchor="middle"
					dominantBaseline="middle"
					fontSize="30"
					fill="#ffffff"
					fontWeight="bold"
					letterSpacing={4}
				>
					{current}/{total}
				</text>
      </svg>
    </div>
  );
}


const styles: { [key: string]: React.CSSProperties } = {
	cardHolder: {
		padding: "20px",
		display: "flex",
		flexDirection: "row",
		gap: "30px",
		overflowX: "auto",
		scrollbarWidth: "none",

		userSelect: "none",
		touchAction: "pan-y",
	},
	card: {
		textAlign: "left",
		fontWeight: "500",
		backgroundColor: "aliceblue",
		borderRadius: "12px",
		boxShadow: "0 10px 30px rgba(0,0,0,0.1), 0 1px 1px rgba(255,255,255,0.05) inset",

		display: "flex",
		flexDirection: "column",

		width: "500px",
		maxWidth: "100%",

		height: "600px",

		flexShrink: 0,

		paddingLeft: "20px",
		paddingRight: "20px",

		boxSizing: "border-box",
	},
	imageStack: {
		position: "relative",
		width: "60%",
		aspectRatio: "16 / 9",
		alignSelf: "center",
		marginTop: "20px",
		marginLeft: "-5%",
		top: "-30px",
		cursor: "pointer",
	},
	layer: {
		position: "absolute",
		inset: 0,
		borderRadius: "20px",
		background: "rgba(131, 173, 255, 0.5)",
		backdropFilter: "blur(12px)",
		boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
		border: "2px solid rgba(255,255,255)",
	},
	backgroundImage: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		objectFit: "cover",
		borderRadius: "20px",
		zIndex: 3,
		//border: "1px solid rgba(255,255,255,0.7)",
		boxShadow: `
			0 10px 20px rgba(0,0,0,0.18),
			inset 0 1px 2px rgba(255,255,255,0.5)
		`,
		pointerEvents: "none",
	},
	imageBlurRight: {
		position: "absolute",
		right: 0,
		top: 0,
		width: "30px",
		height: "100%",
		borderRadius: "0 20px 20px 0",
		backdropFilter: "blur(12px)",
		zIndex: 4,
		pointerEvents: "none",
		maskImage: "linear-gradient(to left, white 0%, transparent 100%)",
		WebkitMaskImage: "linear-gradient(to left, white 0%, transparent 100%)",
	},
	imageBlurBottom: {
		position: "absolute",
		left: 0,
		bottom: 0,
		width: "100%",
		height: "30px",
		borderRadius: "0 0 20px 20px",
		backdropFilter: "blur(12px)",
		zIndex: 4,
		pointerEvents: "none",
		maskImage: "linear-gradient(to top, white 0%, transparent 100%)",
		WebkitMaskImage: "linear-gradient(to top, white 0%, transparent 100%)",
	},
	glassOverlay: {
		position: "absolute",
		inset: 0,
		borderRadius: "20px",
		zIndex: 4,
		pointerEvents: "none",

		background: `
			linear-gradient(
				135deg,
				rgba(216, 216, 216, 0.35),
				rgba(255,255,255,0.05) 40%,
				rgba(255,255,255,0)
			)
		`,

		//boxShadow: `
		//	inset 0 1px 2px rgba(255,255,255,0.8),
		//	inset 0 -20px 40px rgba(0,0,0,0.12)
		//`,

		border: "1px solid rgba(255,255,255,0.45)",
	},
	glassShimmer: {
		position: "absolute",
		inset: 0,

		borderRadius: "20px",

		zIndex: 5,
		pointerEvents: "none",

		background: `
			linear-gradient(
				120deg,
				transparent 30%,
				rgba(255, 255, 255, 0.52) 50%,
				transparent 70%
			)
		`,

		backgroundSize: "200% 200%",
		animation: "shimmer 6s infinite",
		mixBlendMode: "overlay",
	},
	galleryWrapper: {
		background: "rgba(0, 0, 0, 0.6)",
		zIndex: 100,
		position: "fixed",
		inset: 0,
		width: "100%",
		height: "100%",
		backdropFilter: "blur(10px)",
		overflowX: "hidden",
		overflowY: "hidden",
		scrollbarWidth: "none",
	},
	imageContainer: {
		display: "inline-flex",
		flexDirection: "row",
		minWidth: "max-content",
		overflowX: "auto",
		scrollbarWidth: "none",
		userSelect: "none",
	},
};