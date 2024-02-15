import React, { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  const { isAuthorized } = useContext(Context);
  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; All Rights Reserved By Siddharth.</div>
      <div>
        <Link to={"https://github.com/thesiddharth24"} target="_blank">
          {/* <FaGitHub /> */}
        </Link>
        <Link to={"https://www.linkedin.com/in/siddharth-g-103003110/"} target="_blank">
          <FaLinkedin />
        </Link>
       
      </div>
    </footer>
  );
};

export default Footer;