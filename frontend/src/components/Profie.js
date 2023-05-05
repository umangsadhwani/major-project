import React, { useEffect, useState } from "react";
import PostDetail from "./PostDetail";
import "./Profile.css";
import Modal from "@material-ui/core/Modal";
import { Link } from "react-router-dom";
import ProfilePic from "./ProfilePic";
import FollowModal from "./FollowModal";

export default function Profie() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  const [showAllFollowers, setShowAllFollowers] = useState([]);
  const [isModalTrue, setIsModalTrue] = useState(false);
  const [changePic, setChangePic] = useState(false);
  const [title, setTitle] = useState("");

  const toggleDetails = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setPosts(posts);
    }
  };

  const changeprofile = () => {
    if (changePic) {
      setChangePic(false);
    } else {
      setChangePic(true);
    }
  };

  const handleClose = () => {
    setIsModalTrue(false);
  };

  useEffect(() => {
    fetch(
      `http://localhost:5001/user/${
        JSON.parse(localStorage.getItem("user"))._id
      }`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setPic(result.post);
        setUser(result.user);
      });
  }, []);

  const getFollowers = async () => {
    const { followers = [] } = user;
    const allFollowersPromises = followers.map(async (id) => {
      const res = await fetch(`http://localhost:5001/user/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
      const data = await res.json();
      return data.user;
    });
    const allFollowers = await Promise.all(allFollowersPromises);
    setShowAllFollowers(allFollowers);
    setTitle("Followers");
    setIsModalTrue(true);
  };

  const getFollowing = async () => {
    const { following = [] } = user;
    const allFollowersPromises = following.map(async (id) => {
      const res = await fetch(`http://localhost:5001/user/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
      const data = await res.json();
      return data.user;
    });
    const allFollowers = await Promise.all(allFollowersPromises);
    setShowAllFollowers(allFollowers);
    setTitle("Following");
    setIsModalTrue(true);
  };

  return (
    <div className="profile">
      {/* Profile frame */}
      <div className="profile-frame">
        {/* profile-pic */}
        <div className="profile-pic">
          <img
            onClick={changeprofile}
            src={user.Photo ? user.Photo : picLink}
            alt=""
          />
        </div>
        {/* profile-data */}
        <div className="pofile-data">
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className="profile-info" style={{ display: "flex" }}>
            <p>{pic ? pic.length : "0"} posts</p>
            <p
              onClick={getFollowers}
              style={{ color: "blue", cursor: "pointer" }}
            >
              {user.followers ? user.followers.length : "0"} followers
            </p>
            <p
              onClick={getFollowing}
              style={{ color: "blue", cursor: "pointer" }}
            >
              {user.following ? user.following.length : "0"} following
            </p>
          </div>
        </div>
      </div>
      <hr
        style={{
          width: "90%",
          opacity: "0.8",
          margin: "25px auto",
        }}
      />
      {/* Gallery */}
      <div className="gallery">
        {pic.map((pics) => {
          return (
            <img
              key={pics._id}
              src={pics.photo}
              onClick={() => {
                toggleDetails(pics);
              }}
              className="item"
            ></img>
          );
        })}
      </div>
      {show && (
        <PostDetail item={posts} user={user} toggleDetails={toggleDetails} />
      )}
      {changePic && <ProfilePic changeprofile={changeprofile} />}
      {isModalTrue && (
        <Modal open={isModalTrue} onClose={handleClose}>
          <FollowModal data={showAllFollowers} heading={title} />
        </Modal>
      )}
    </div>
  );
}
