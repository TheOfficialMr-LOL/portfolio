import profileImg from "../assets/LOL-img.jpg";
import discordIcon from "../assets/discord.png";
import githubIcon from "../assets/github.png";
import linkedinIcon from "../assets/linkedin.png";
import gmailIcon from "../assets/gmail.png";
import externalLink from "../assets/external-link.png";

import { motion, useMotionValue, animate } from "framer-motion";

import "./profile.css";
import { PressableCard } from "../animations/popOut";


{/*
function socialCard(icon: string, text: string, link: boolean, name: string) {
	const animation = popOut();

	return (
		<motion.div
		className="socialsBox"
			style={{ scale: animation.scale }}
			onPointerDown={animation.press}
			onPointerUp={animation.release}
			onPointerLeave={animation.release}
		>
			<img src={icon} alt={`${name} icon`} className="socialIcon"/> <br/>
			<span>{text}</span>
			{link && <img src={externalLink} alt="external link logo" className="externalLinkIcon"></img>}
		</motion.div>
	);
}
*/}




export default function Profile() {
    const scale = useMotionValue<number>(1);

    const handlePress = () => {
    animate(scale, 0.9, {
      type: "spring",
      stiffness: 500,
      damping: 20,
    });
  };

  const handleRelease = () => {
    animate(scale, 1, {
      type: "spring",
      stiffness: 300,
      damping: 12,
    });
  };

    return (
        <div>
					{/*About me section*/}
					<div className="aboutMe">
            {/*Left section (profile picture + name)*/}
            <div style={{marginLeft: "0px"}}>
								<motion.img
									className="profilePic"
									src = {profileImg}
									alt = "profile picture"
									style = {{scale}}

									whileHover={{
										scale: 1.05,
										y: -6,
									}}
									transition={{
										type: "spring",
										stiffness: 400,
										damping: 18,
									}}
									onPointerDown={handlePress}
									onPointerUp={handleRelease}
									onPointerLeave={handleRelease}
								/>
        
                <br/>
                <br/>
                <span style={{fontWeight: "bold", color: "#5850c0"}}>Aeshan Jiniwal ● <i style={{fontWeight: "600"}}>He/Him</i></span>
                <br/>
                <span style={{fontWeight: "600", color: "#4039a1", fontSize: "14px"}}>AKA</span>
                <br/>
                <span style={{fontWeight: "bold", color: "#5850c0"}}>Mr LOL</span>
								<br/>
								<br/>
								
								<div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
									<PressableCard pressScale={1.09}>
										<div className="socialsBox" onClick={() => window.open("https://www.linkedin.com/in/aeshan-jiniwal-505874381/", "_blank")}>
											<img src={linkedinIcon} alt="LinkedIn" className="socialIcon"/> <br/>
											<span>Aeshan Jiniwal</span>
											<img src={externalLink} alt="external link logo" className="externalLinkIcon"></img>
										</div>
									</PressableCard>

									<PressableCard pressScale={1.09}>
										<div className="socialsBox" onClick={() => window.open("https://github.com/TheOfficialMr-LOL", "_blank")}>
											<img src={githubIcon} alt="GitHub" className="socialIcon"/> <br/>
											<span>TheOfficialMr-LOL</span>
											<img src={externalLink} alt="external link logo" className="externalLinkIcon"></img>
										</div>
									</PressableCard>

									<PressableCard pressScale={1.09}>
										<div className="socialsBox" onClick={() => window.open("https://discord.com/users/745301207043801129", "_blank")}>
											<img src={discordIcon} alt="Discord" className="socialIcon"/> <br/>
											<span>TheOfficialMr_LOL</span>
											<img src={externalLink} alt="external link logo" className="externalLinkIcon"></img>
										</div>
									</PressableCard>

									<PressableCard pressScale={1.09}>
										<div className="socialsBox" onClick={() => window.open("mailto:aeshan.jiniwal@gmail.com", "_blank")}>
											<img src={gmailIcon} alt="Gmail" className="socialIcon"/> <br/>
											<span>aeshan.jiniwal@gmail.com</span>
										</div>
									</PressableCard>

								</div>

            </div>

            {/*Right section (about me)*/}
						<div style={{textAlign: "left", maxWidth: "500px", marginTop: "-100px", fontWeight: "500"}}>
								<h2 style={{color: "#5850c0"}}>About Me</h2>
								<li>Full-stack developer</li>
								<li>Discovered a passion for coding at the age of 11</li>
								<li>4+ years 	experience in software development </li>
								<li>Obsessive over clean, playful, and minimalistic UI designs</li>
								<li>Pursuing a lifelong endeavour in understanding how the world and the software systems within it work</li>
						</div>
					</div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
  
};