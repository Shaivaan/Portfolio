import React, { useRef } from "react";
import "../styles/contact.css";

import { MdEmail } from "react-icons/md";
import { RiInstagramFill } from "react-icons/ri";

import emailjs from "emailjs-com";
import { Heading } from "../styled-components/Heading";
import { useZustandStore } from "../Zustand/Zustand";

export const Contact = () => {
	const form = useRef();
	const portfolioData = useZustandStore((state) => state.portfolioData);
	const {user} = portfolioData;
	const sendEmail = (e) => {
		e.preventDefault();
		emailjs
			.sendForm(
				process.env.REACT_APP_EMAILJS_SERVICE,
				process.env.REACT_APP_EMAILJS_TEMPLATE,
				form.current,
				process.env.REACT_APP_EMAILJS_ID
			)
			.then(
				(result) => {
					e.target.reset();
				},
				(error) => {
					e.target.reset();
				}
			);
	};

	return (
		<section id="contacts" className="contacts">
			<div className="heading" data-aos="fade-up">
				<Heading>
					<h2>Contacts</h2>
				</Heading>
			</div>

			<div className="contact__container">
				<div className="contact__options">
					<article className="contact__option" data-aos="fade-up">
						<MdEmail className="contact__option-icon" />
						<h4>Email</h4>
						<h5 id="mail">{user?.email}</h5>
						<a
							className="mail"
							href="mailto:asanjeetsangam15@gmail.com"
							target="_blank"
							rel="noreferrer"
						>
							Send a message
						</a>
					</article>
				</div>

				{/* end of contact options */}

				<form ref={form} onSubmit={sendEmail}>
					<input
						type="text"
						name="name"
						placeholder="Your Full Name"
						required
						data-aos="fade-up"
					/>

					<input
						type="email"
						name="email"
						placeholder="Enter you email"
						required
						data-aos="fade-up"
					/>

					<textarea
						name="message"
						id=""
						rows="7"
						placeholder="Your Message"
						required
						data-aos="fade-up"
					></textarea>

					<button type="submit" className="btn btn-primary">
						Send Message
					</button>
				</form>
			</div>
		</section>
	);
};
