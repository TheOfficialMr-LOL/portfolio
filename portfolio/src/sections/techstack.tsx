import { motion } from "framer-motion";
import { PressableCard } from "../animations/popOut";

import backgroundImage from "../assets/backgroundImageLight.png";
import "./profile.css";

import androidStudio from "../assets/appLogos/androidStudioIcon.png";
import azure from "../assets/appLogos/azureIcon.png";
import cpp from "../assets/appLogos/cppIcon.png";
import docker from "../assets/appLogos/dockerIcon.png";
import firebase from "../assets/appLogos/firebaseIcon.png";
import framer from "../assets/appLogos/framerIcon.png";
import git from "../assets/appLogos/gitIcon.png";
import gradle from "../assets/appLogos/gradleIcon.png";
import micropython from "../assets/appLogos/micropythonIcon.png";
import nodejs from "../assets/appLogos/nodejsIcon.png";
import postgresql from "../assets/appLogos/postgresqlIcon.png";
import python from "../assets/appLogos/pythonIcon.png";
import react from "../assets/appLogos/reactIcon.png";
import reactNative from "../assets/appLogos/reactNativeIcon.png";
import typescript from "../assets/appLogos/typescriptIcon.png";
import cssHtml from "../assets/appLogos/css&htmlIcon.png";



//check if device is mobile to prevent some pressable containers from 'popping out,'
//which interferes with mobile scrolling
const isTouch = window.matchMedia("(pointer: coarse)").matches;
const isDeviceMobile = isTouch;


const techSections = [
  {
    title: "Core Languages",
    techs: [
      { name: "C++", color: "#0065b2", img: cpp },
      { name: "PYTHON", color: "#3776AB", img: python},
      { name: "TYPESCRIPT", color: "#3178c6", img: typescript},
    ],
  },
  {
    title: "Web & App Development",
    techs: [
      { name: "HTML/CSS", color: "#E34F26", img: cssHtml},
      { name: "REACT", color: "#000000", img: react},
      { name: "REACT NATIVE", color: "#9c61c4", img: reactNative},
      { name: "NODEJS", color: "#339933", img: nodejs},
      { name: "EXPRESSJS", color: "#444444"},
    ],
  },
  {
    title: "Tools & Platforms",
    techs: [
      { name: "POSTGRESQL", color: "#336791", img: postgresql},
      { name: "DOCKER", color: "#219cfa", img: docker},
      { name: "ANDROID STUDIO", color: "#2dd377", img: androidStudio},
			{ name: "AZURE", color: "#389cff", img: azure},
      { name: "GRADLE", color: "#02303A", img: gradle},
      { name: "GIT", color: "#F05032", img: git},
      { name: "WSL", color: "#4D4D4D"},
      { name: "FIREBASE", color: "#f0cb4f", img: firebase},
    ],
  },
  {
    title: "Other",
    techs: [
      { name: "MICROPYTHON", color: "#2B2728", img: micropython},
      { name: "FRAMER MOTION", color: "#0055FF", img: framer},
      { name: "CHARTJS", color: "#FF6384"},
    ],
  },
];



export default function TechStack() {
	let animationIndex: number = 1;
	return (
			<div style={styles.techStackWrapper}>
				<PressableCard hoverScale={1.02} isMobile={isDeviceMobile}>
					<div className="cardContainer noSelect">
					<img
						src={backgroundImage}
						alt="abstract tech background"
						style={styles.backgroundImage}
					/>

					<div style={styles.techStackSection}>
						<div style={styles.sectionHeader}><h2 style={{top: "-10px", color: "#fff"}}>Tech Stack</h2></div>

						{techSections.map((section) => (
							<div key={section.title}>
								<h3 style={{textAlign: "left"}}>{section.title}</h3>

								{/*Render tech buttons*/}
								<div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
									{section.techs.map((tech) => {
										const delay: number = animationIndex * 0.2;
										animationIndex++;

										return (
										<PressableCard hoverScale={1.1} key={animationIndex}>
											<motion.div
												key={tech.name}
												initial={{ x: 600, opacity: 0, y: -200 }}
												animate={{ x: 0, opacity: 1, y: 0 }}
												transition={{
													delay: delay,
													type: "spring",
													stiffness: 400,
													damping: 15,
												}}
												style={{
													backgroundColor: tech.color,
													color: "#fff",
													padding: "10px 14px",
													borderRadius: "12px",
													fontWeight: 600,
													
												}}
											>
												<div style={{display: "inline-flex", gap: "10px"}}>
													{tech.img && (<img src={tech.img} alt={tech.name} style={{ width: "24px", height: "24px", position: "relative", top: "3px" }}/>)}
													<span style={{position: "relative", top: tech.img ? "2px" : "0px", fontFamily: "Verdana, Geneva, sans-serif", fontWeight: "800", fontSize: "12px", color: tech.name == "FIREBASE" ? "#333333" : "#fff"}}>{tech.name}</span>
												</div>
											</motion.div>
										</PressableCard>
										);
									})}
								</div>
							</div>
						))}
					</div>
				</div>
			</PressableCard>
		</div>
	);
}

const styles: { [key: string]: React.CSSProperties } = {

	techStackWrapper: {
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
    marginBottom: "40px",
  },
	techStackSection: {
		position: "relative",
		zIndex: 1,
		overflow: "hidden",

    padding: "20px",
    boxSizing: "border-box",

		background: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(12px)",
    borderRadius: "24px",
		boxShadow: "0 10px 30px rgba(0,0,0,0.05), 0 1px 1px rgba(255,255,255,0.05) inset",
	},
	backgroundImage: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		objectFit: "cover",
		borderRadius: "24px",
		zIndex: 0,
		pointerEvents: "none",
	},
	
	sectionHeader: {
		display: "flex",
		alignItems: "center",
		marginTop: "-20px",
		width: "100%",
		height: "40px",
		marginLeft: "-20px",
		fontWeight: "700",
		
		background: "linear-gradient(135deg, #713ec9 0%, #555bcc 45%, #7b61ff 100%)",
		backdropFilter: "blur(10px)",
		borderBottom: "1px solid #8fb4e194",
		
		padding: "10px 20px",
		borderTopLeftRadius: "12px",
		borderTopRightRadius: "12px",
	},
	techBox: {
		display: "inline-flex", 
		gap: "10px",
	},
}