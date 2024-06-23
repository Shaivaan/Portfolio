import React, { useState } from "react";
import { Link } from "react-scroll";
import { HomeButton } from "../styled-components/HomeButton";
import "../styles/home.css";
import Typical from "react-typical";
import { motion } from "framer-motion";

import homeIMG from "../assets/book.png";

import { images } from "../constants";

import { AiFillLinkedin, AiFillGithub, AiFillYoutube, AiFillInstagram } from "react-icons/ai";

import { Socials } from "../styled-components/Socials";
import { useZustandStore } from "../Zustand/Zustand";

const scaleVariants = {
	whileInView: {
		scale: [0, 1],
		opacity: [0, 1],
		transition: {
			duration: 1,
			ease: "easeInOut",
		},
	},
};

export const Home = () => {
	const [contact] = useState(true);
	const portfolioData = useZustandStore((state) => state.portfolioData);
	const {user} = portfolioData;

	return (
		<section id="home" className="home" data-aos="zoom">
			<div className="home__content">
				<h3 data-aos="fade-down">Hello, I am </h3>
				<h1 data-aos="fade-down">{user?.first_name} {user?.last_name}</h1>
				<h2>
					<span style={{ color: "#814309" }}>
						<Typical
							steps={[
								"React 👨‍💻",
								1000,
								"Typescript 😎",
								1000,
								"MERN 📽️",
								1000,
							]}
							loop={Infinity}
							wrapper="p"
						/>
					</span>
				</h2>

				<div className="home__buttons">
					<a
						download
						href={user?.showCase?.resume}
						target="_blank"
						rel="noreferrer"
						data-aos="fade-right"
					>
						<HomeButton>
							<span>Resume</span>
							<i></i>
						</HomeButton>
					</a>

					<HomeButton data-aos="fade-left" contact={contact}>
						<span>
							<Link to="contacts" offset={-100}>
								Contact Me
							</Link>
						</span>
						<i></i>
					</HomeButton>
				</div>

				<div className="socials__buttons">
					<a
						href={user?.showCase?.linked_in}
						target="_blank"
						rel="noreferrer"
						data-aos="flip-up"
					>
						<Socials icon="linkedin">
							<AiFillLinkedin />
						</Socials>
					</a>

					<a
						href={user?.showCase?.github}
						rel="noreferrer"
						target="_blank"
						data-aos="flip-up"
					>
						<Socials icon="github">
							<AiFillGithub />
						</Socials>
					</a>
					{user?.showCase?.youtube && <a
						href={user?.showCase?.youtube}
						target="_blank"
						rel="noreferrer"
						data-aos="flip-up"
					>
						<Socials icon="youtube">
							<AiFillYoutube />
						</Socials>
					</a>}		
					{user?.showCase?.instagram && <a
						href={user?.showCase?.instagram}
						target="_blank"
						rel="noreferrer"
						data-aos="flip-up"
					>
						<Socials icon="insta">
							<AiFillInstagram />
						</Socials>
					</a>}
				</div>
			</div>

			<div className="home__img">
				<motion.img
					whileInView={{ scale: [0.8, 1] }}
					transition={{ duration: 1, ease: "easeInOut" }}
					src={homeIMG}
					alt="home"
				/>
				<motion.img
					whileInView={{ scale: [0, 1] }}
					transition={{ duration: 1, ease: "easeInOut" }}
					src={images.circle}
					alt="profile_circle"
					className="overlay_circle"
				/>
			</div>

			<motion.div
				variants={scaleVariants}
				whileInView={scaleVariants.whileInView}
				className="app__header-circles"
			>
				{[images.react, images.redux, images.sass, images.javascript].map(
					(circle, index) => (
						<div className="circle-cmp app__flex" key={`circle-${index}`}>
							<img src={circle} alt="profile_bg" />
						</div>
					)
				)}
			</motion.div>
		</section>
	);
};
