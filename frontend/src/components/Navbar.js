import React, { useContext, useEffect } from "react";
import rgpvlogo from "../img/rgpvlogo.jpg";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

export default function Navbar({ login }) {

  const { setModalOpen } = useContext(LoginContext);

  const loginStatusMobile = () => {
    const token = localStorage.getItem("jwt");

    if (login || token) {
      return [
        <>
          <Link to="/">
          <span class="material-symbols-outlined">
          home
          </span>
          </Link>
          <Link to="/profile">
            <li><span class="material-symbols-outlined">account_circle</span></li>
          </Link>
          <Link to="/createPost">
            <li><span class="material-symbols-outlined">add_a_photo</span></li>
          </Link>

          <Link to={""}>
            <li  onClick={() => setModalOpen(true)}>
            <span class="material-symbols-outlined">logout</span>
            </li>
          </Link>
        </>,
      ];
    } else {
      return [
        <>
          <Link to="/signup">
            <li>SignUp</li>
          </Link>
          <Link to="/signin">
            <li>SignIn</li>
          </Link>
        </>,
      ];
    }
  };

  const loginStatus = () => {
    const token = localStorage.getItem("jwt");

    if (login || token) {
      return [
        <>
          <Link to="/">Home</Link>
          <Link to="/profile">
            <li>Profile</li>
          </Link>
          <Link to="/createPost">Create Post</Link>

          <Link to={""}>
            <button className="primaryBtn" onClick={() => setModalOpen(true)}>
              Log Out
            </button>
          </Link>
        </>,
      ];
    } else {
      return [
        <>
          <Link to="/signup">
            <li>SignUp</li>
          </Link>
          <Link to="/signin">
            <li>SignIn</li>
          </Link>
        </>,
      ];
    }
  };

  return (
    <>
      <div className="navbar">
        <img id="rgpv-logo" src={rgpvlogo} width="40px" style={logoStyle} />
        <ul className="nav-menu">{loginStatus()}</ul>
        <ul className="nav-mobile">{loginStatusMobile()}</ul>
      </div>
    </>
  );
}

const logoStyle = {
  position: "absolute",
  left: "20px",
};
