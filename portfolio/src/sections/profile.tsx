import profileImg from "../assets/LOL-img.jpg";
import { motion, useMotionValue, animate } from "framer-motion";


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
					<div style={{display: "flex", marginTop: "60px", justifyContent: "space-between", alignItems: "center", padding: "0 100px"}}>
            {/*Left section (profile picture + name)*/}
            <div style={{marginLeft: "0px"}}>
								<motion.img
									src = {profileImg}
									alt = "profile picture"
									style = {{
										...styles.profilePic, 
										scale
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
            </div>

            {/*Right section (about me)*/}
						<div style={{textAlign: "left", maxWidth: "500px", marginTop: "-100px", fontWeight: "500"}}>
								<h2 style={{color: "#5850c0"}}>About Me</h2>
								<li>Full-stack developer</li>
								<li>Discovered a passion for coding at the age of 11</li>
								<li>4+ years of software development experience</li>
								<li>Obsessive over clean, playful, and minimalistic UI designs</li>
								<li>Pursuing a lifelong endeavour in understanding how the world and the software systems within it work</li>
						</div>
					</div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    profilePic: {
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        objectFit: "cover",
        
        boxShadow: "0 0 20px rgba(0, 53, 67, 0.43)",

        cursor: "grab"
    }
};