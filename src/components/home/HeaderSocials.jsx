import React from "react";
import { BsLinkedin } from "react-icons/bs";
import { VscGithub } from "react-icons/vsc";
import { RiInstagramFill } from "react-icons/ri";

const HeaderSocials = () => {
  return (
    <div className="header__socials">
      <a
        href="https://www.linkedin.com/in/shivanshu-mishra-2b61a221b/"
        target="_blank"
      >
        <BsLinkedin />
      </a>
      <a href="https://github.com/Shaivaan" target="_blank">
        <VscGithub />
      </a>
      {/* <a href="https://www.instagram.com/san_arts_official_/" target="_blank">
        <RiInstagramFill />
      </a> */}
    </div>
  );
};

export default HeaderSocials;
