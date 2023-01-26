import React from "react";
import "./projects.css";
import ikea from "../../assets/ikea.png";
import whatsapp from "../../assets/whatsapp.png";
import html from "../../assets/icons/html.png";
import css from "../../assets/icons/css.jpg";
import js from "../../assets/icons/javascript.png";
import mongo from "../../assets/icons/mongodb.png";
import node from "../../assets/icons/node.png";
import github from "../../assets/icons/github.png";
import git from "../../assets/icons/git.png";
import vscode from "../../assets/icons/vscode.png";
import react from "../../assets/icons/react.png";
import firebase from "../../assets/icons/firebase.png";
import socket from "../../assets/icons/socket.png";
import ts from "../../assets/icons/typescript.png"

const data = [
  {
    id: 1,
    image: "https://user-images.githubusercontent.com/93570605/170944498-56402034-3161-44b1-a10a-33d826fd8433.png",
    title: "Youtube",
    github: "https://github.com/Shaivaan/Youtube",
    demo: "https://youtubewhite.netlify.app/",
    projectType: "Solo Project",
    des: "YouTube is an American online video sharing and social media platform owned by Google. It was launched on February 14, 2005, by Steve Chen, Chad Hurley, and Jawed Karim.",
    techStach: [react,html, css, ts, vscode, git, github],
  },
  {
    id: 5,
    image: "https://user-images.githubusercontent.com/93570605/175881304-a570b272-9ddd-4936-bbec-10cb12f4b4ab.png",
    title: "Weather App",
    github: "https://github.com/Shaivaan/Weather-App",
    demo: "https://merryweather.netlify.app/",
    projectType: "Solo Project",
    des: "Weather app which shows the information of weather, temperature, humidity ,sunrise and sunset for mostly all of the locations in India.",
    techStach: [html, css, js, vscode, git, github, react],
  },
  {
    id: 6,
    image: "https://user-images.githubusercontent.com/60216125/155872036-fe58a60f-166e-45b5-a1da-f9695b234a6c.png",
    title: "SEPHORA",
    github: "https://github.com/Shaivaan/Sephora-Unit-4",
    demo: "https://clever-banach-bb22fa.netlify.app/",
    projectType: "Group Project",
    des: "Sephora is a French multinational retailer of personal care and beauty products,feauturing nearly 3,000 brands.",
    techStach: [ html, css, js, vscode, git, github,node],
  },
  {
    id: 3,
    image: ikea,
    title: "IKEA",
    github: "https://github.com/Shaivaan/IKEA-India",
    demo: "https://elated-fermat-69db6c.netlify.app/",
    projectType: "Group Project",
    des: "IKEA is a global leader in life at home. Founded in Sweden in 1943, IKEA is now a worldwide retailer of affordable, well-designed products.",
    techStach: [html, css, js, vscode, git, github],
  },
  {
    id: 4,
    image: "https://user-images.githubusercontent.com/93570605/162711251-f24a367e-9657-409e-bf1b-18b9aafbab30.png",
    title: "Recruitment System",
    github: "https://github.com/Shaivaan/Recruitment-System-Frontend",
    demo: "https://recruitment-system-app.netlify.app/",
    projectType: "Group Project",
    des: "The web application which make easier to find and fill the vacancies in companies.Enhanced from user as well as admin-end where job applying for user and adding jobs.",
    techStach: [react,html, css, js, vscode, git, github,node ],
  },
  {
    id: 2,
    image: "https://user-images.githubusercontent.com/93570605/171992787-7c773791-7703-4977-8b78-30f8dadae6c5.png",
    title: "Interview Book",
    github: "https://github.com/Shaivaan/Interview-Book-Frontend",
    demo: "https://interviewbook.netlify.app/",
    projectType: "Solo Project",
    des: "This project includes the topics which are important for web development interview.It consist important topics of HTML,CSS,JS and React with some extra topics.",
    techStach: [html, css, js, vscode, git, github, mongo, node],
  },

];

const Projects = () => {
  return (
    <section id="projects">
      <h2>Projects</h2>

      <div className="container projects__container">
        {data.map(
          ({ id, image, title, github, demo, projectType, des, techStach }) => {
            return (
              <article key={id} className="projects__item">
                <div className="projects__item-image">
                  <img src={image} alt="" />
                </div>
                <h3>{title}</h3>

                <h5>{projectType}</h5>

                <h5>{des}</h5>

                <div className="tech_stacks">
                  {techStach.map((e) => {
                    return (
                      <div>
                        <img src={e} />
                      </div>
                    );
                  })}
                </div>

                <div className="projects__item-cta">
                  <a href={github} className="btn" target="_blank">
                    Github
                  </a>
                  <a href={demo} className="btn btn-primary" target="_blank">
                    Live Demo
                  </a>
                </div>
              </article>
            );
          }
        )}
      </div>
    </section>
  );
};

export default Projects;

`



`;
