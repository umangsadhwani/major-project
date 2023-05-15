import React from "react";
import { Link } from "react-router-dom";

const ModalContent = ({ data, heading }) => {
  return (
    <div style={modalStyles}>
      <h3>{heading}</h3>
      <ul style={ulStyle}>
        {data.map((user) => (
          <li
            style={{
              listStyle: "none",
            }}
          >
            <a
              href={`/profile/${user._id}`}
              style={{
                color: "blue",
                display: "flex",
                alignItems: "center",
                margin: "0.5rem 0",
              }}
            >
              <img
                src={user.Photo}
                alt={"user"}
                width={"35px"}
                style={{
                  borderRadius: "100%",
                  padding: "0 12px 0 0",
                }}
              />
              {user.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModalContent;

const ulStyle = {
  display: "block",
  margin: "0",
  padding: "0",
  maxHeight: "500px",
  overflowY: "scroll",
};

const modalStyles = {
  backgroundColor: "white",
  margin: 0,
  position: "absolute",
  padding: "0.5rem",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  borderRadius: "20px",
};
