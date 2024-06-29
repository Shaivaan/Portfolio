import React, { useState } from "react";
import { Heading } from "../styled-components/Heading";
import "../styles/projects.css";
import { motion } from "framer-motion";
import { AiFillEye, AiFillGithub } from "react-icons/ai";
import { useZustandStore } from "../Zustand/Zustand";
import { imageHandler } from "../Utils/projectUtil";
import { v4 as uuidv4 } from 'uuid';


export const Projects = () => {
	const portfolioData = useZustandStore((state) => state.portfolioData);
	const {projects} = portfolioData;
	const [animateCard, setAnimateCard] = useState({ y: 0, opacity: 1 });
	

	return (
		<section id="projects" className="projects">
			<div className="heading" data-aos="fade-up">
				<Heading>
					<h2>Projects ({projects?.length}) </h2>
				</Heading>
			</div>


			<motion.div
				animate={animateCard}
				transition={{ duration: 0.5, delayChildren: 0.5 }}
				className="app__work-portfolio"
			>
				{projects.length > 0 &&
					projects.map((work, index) => (
						<motion.div
							whileInView={{ scale: [0.8, 1] }}
							transition={{ duration: 0.4 }}
							className="app__work-item app__flex"
							key={index}
						>
							<div className="app__work-img app__flex">
								<img 
								 src={work.project_image}
								 alt={work.title} />
							</div>

							<div className="app__work-content app__flex">
								<div className="tech-stacks">
									{work?.tech_used?.map((stack) => {
										return (
											<img
											    src={imageHandler(stack)}
												key={uuidv4()}
												alt={stack._key}
											/>
										);
									})}
								</div>

								<h4 className="bold-text">{work.title}</h4>
								<p
									className="p-text project_desc"
									style={{ marginTop: 10 }}
									title={work.description}
								>
									{work.description}
								</p>

								<motion.div
									transition={{
										duration: 0.25,
										ease: "easeInOut",
										staggerChildren: 0.5,
									}}
									className="project__links app__flex"
								>
									<a href={work.demo_link} target="_blank" rel="noreferrer">
										<motion.div
											whileInView={{ scale: [0.8, 1] }}
											whileHover={{ scale: [1, 0.9] }}
											transition={{ duration: 0.25 }}
											className="app__flex"
										>
											<AiFillEye />
										</motion.div>
									</a>
									<a href={work.code_link} target="_blank" rel="noreferrer">
										<motion.div
											whileInView={{ scale: [0.8, 1] }}
											whileHover={{ scale: [1, 0.9] }}
											transition={{ duration: 0.25 }}
											className="app__flex"
										>
											<AiFillGithub />
										</motion.div>
									</a>
								</motion.div>
							</div>
						</motion.div>
					))}
			</motion.div>
		</section>
	);
};
