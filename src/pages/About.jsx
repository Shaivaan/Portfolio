import React from "react";
import "../styles/about.css";

import me from "../assets/sangam.png";
import { Heading } from "../styled-components/Heading";
import { useZustandStore } from "../Zustand/Zustand";


export const About = () => {
  const portfolioData = useZustandStore((state) => state.portfolioData);
	const {user} = portfolioData;
  return (
    <section id="about" className="about">
      <div className="heading" data-aos="fade-down">
        <Heading>
          <h2>About Me</h2>
        </Heading>
      </div>

      <div className="about__content">
        <div data-aos="fade-right" className="profile__image">
          <img src={user?.profile_picture} alt="sanjeetsangam" />
        </div>

        <div className="profile__info">
          <h4 data-aos="fade-down">
          {user?.about}
            <br />
            <br />
          </h4>
        </div>
      </div>
    </section>
  );
};
