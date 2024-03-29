import React from "react";
import RSbtn from "./RSbtn";
import "./home.css";



import sanjeet from "../../assets/nph.png";
import HeaderSocials from "./HeaderSocials";

import Typewriter from "typewriter-effect";

const Home = () => {
  return (
    <header id="home">
      <div className="container home__container">
        <div className="about__myself">
          <h5 style={{ color: "yellow" }}>Hello I'm</h5>

          <h1>
            <Typewriter
              options={{
                autoStart: true,
                loop: true,
                delay: 50,
                strings: ["Shivanshu Mishra"],
              }}
            ></Typewriter>
          </h1>

          <h4
            style={{
              color: "red",
              fontWeight: "bold",
              background: "yellow",
              padding: "0.2rem 1rem",
              width: "max-content",
              margin: "auto",
            }}
          >
            Full Stack Developer
          </h4>
          <h5 className="about__cont">
            I am a{" "}
            <span
              style={{
                color: "white",
                fontWeight: "bold",
                background: "red",
                padding: "0.2rem",
              }}
            >
              Full Stack web developer
            </span>
            . I love programming and also love to make wonderful web apps. I
            will love to contribute more in this field and also I will be love
            to face new challenges in the upcoming days. Apart from coding,{" "}
            <span
              style={{ color: "skyblue", background: "red", padding: "0.2rem" }}
            >
              Gaming{" "}
            </span>
             is my favorite which I like the most.
          </h5>
          <RSbtn />
        </div>

        <HeaderSocials />

        <div className="me__image">
          <div className="glowing__border">
            <div className="me">
              <img src={sanjeet} alt="" />
            </div>

            <div className="my__about">
              I am a Full Stack web developer. I love programming and also love
              to make wonderful web apps. I will love to contribute more in this
              field and also I will be love to face new challenges in the
              upcoming days. Apart from coding, Gaming is my favorite which I
              like the most.
            </div>
          </div>
        </div>

        <a href="#contact" className="scroll_down">
          Scroll Down
        </a>
      </div>
    </header>
  );
};

export default Home;
