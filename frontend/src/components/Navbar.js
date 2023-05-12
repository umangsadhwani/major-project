import React, { useContext } from "react";
import rgpvlogo from "../img/rgpvlogo.jpg";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

export default function Navbar({ login }) {
  const { setModalOpen } = useContext(LoginContext);

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
          <Link style={{ marginLeft: "20px" }} to="/followingpost">
            My Following
          </Link>
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
        <img src={rgpvlogo} width="40px" style={logoStyle} />
        <ul className="nav-menu">{loginStatus()}</ul>
      </div>
    </>
  );
}

const logoStyle = {
  position: "absolute",
  left: "20px",
};
