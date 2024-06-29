import React, { useEffect } from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Heading } from "../styled-components/Heading";
import { motion } from "framer-motion";
import { useZustandStore } from "../Zustand/Zustand";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';




const Experiences = () => {
	const portfolioData = useZustandStore((state) => state.portfolioData);
	const {workExp} = portfolioData;
	useEffect(() => {
		const query = '*[_type == "experiences"]';

	}, []);
	return (
		<section id="experience">
			<div className="heading" data-aos="fade-up" style={{ marginBottom: "1rem" }} key={uuidv4()}>
				<Heading>
					<h2>Experiences </h2>
				</Heading>
			</div>

			<VerticalTimeline lineColor={"#2c2d42"}>
				{workExp?.length > 0 &&
					workExp.map((experience) => (
						<VerticalTimelineElement
							contentStyle={{
								background: "#1d1836",
								color: "#fff",
							}}
							contentArrowStyle={{ borderRight: "7px solid  #232631" }}
							// date={experience.year}
							iconStyle={{
								background: "#b5daf8",
								display: "grid",
								placeItems: "center",
								overflow: "hidden",
							}}
							icon={
								<img
									// src={urlFor(experience.imgUrl)}
									src={experience.company_logo}
									style={{
										width: "80%",
										objectFit: " contain",
										mixBlendMode: "multiply",
									}}
									// alt={urlFor(experience.imgUrl)}
								/>
							}
							key={experience._id}
						>
							<motion.div className="app__skills-exp-item">
								<div className="app__skills-exp-year">
									<p className="bold-text">{secondToYearProvider(experience.joining_date.seconds)} - {experience.is_currently_working ?  'Currently Working' : secondToYearProvider(experience.end_date.seconds) } </p>
								</div>
								<motion.div className="app__skills-exp-works">
										<div key={experience.role}>
											<motion.div
												whileInView={{ opacity: [0, 1] }}
												transition={{ duration: 0.5 }}
												className="app__skills-exp-work"
												data-tip
												data-for={experience.role}
											>
												<h4 className="bold-text">{experience.role}</h4>
												<p className="p-text">{experience.company_name}</p>
											</motion.div>
											<div id={experience.role} className="skills-tooltip">
												{experience.exp_desciption}
											</div>
										</div>
								</motion.div>
							</motion.div>
						</VerticalTimelineElement>
					))}
			</VerticalTimeline>
		</section>
	);
};

const secondToYearProvider=(seconds)=>{
	return moment(seconds * 1000).format('MMM YYYY')
}

export default Experiences;
