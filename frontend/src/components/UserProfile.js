import React, { useEffect, useState } from "react";
import PostDetail from "./PostDetail";
import "./Profile.css";
import Modal from "@material-ui/core/Modal";
import { useParams } from "react-router-dom";
import FollowModal from "./FollowModal";

export default function UserProfie() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const { userid } = useParams();
  const [isFollow, setIsFollow] = useState(false);
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [show, setShow] = useState(false);
  const [showAllFollowers, setShowAllFollowers] = useState([]);
  const [isModalTrue, setIsModalTrue] = useState(false);
  const [changePic, setChangePic] = useState(false);
  const [title, setTitle] = useState("");
  const [branch, setBranch] = useState("");
  const [grad, setGrad] = useState();

  const COMP_MAP = {
    CS: "Computer Science Engineering",
    EC: "Electornics and Commpunication Engineering",
    IT: "Information Technology",
    ME: "Mechanical Engineering",
    CE: "Civil Engineering",
    PC: "Petro-Chemical Engineering",
    AU: "Automation Engineering",
  };

  useEffect(() => {
    const branch = user?.userName?.slice(4, 6)?.toUpperCase();
    setBranch(COMP_MAP[branch]);
    const gradYear = +user?.userName?.slice(6, 8);
    setGrad(gradYear);
  }, [user]);

  const toggleDetails = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setPosts(posts);
    }
  };

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

  const handleClose = () => {
    setIsModalTrue(false);
  };

  // to follow user
  const followUser = (userId) => {
    fetch("http://localhost:5001/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsFollow(true);
      });
  };

  // to unfollow user
  const unfollowUser = (userId) => {
    fetch("http://localhost:5001/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => {
        res.json();
      })
      .then((data) => {
        setIsFollow(false);
      });
  };

  useEffect(() => {
    fetch(`http://localhost:5001/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setUser(result.user);
        setPosts(result.post);
        if (
          result.user.followers.includes(
            JSON.parse(localStorage.getItem("user"))._id
          )
        ) {
          setIsFollow(true);
        }
      });
  }, [isFollow]);

  return (
    <div className="profile">
      {/* Profile frame */}
      <div className="profile-frame">
        {/* profile-pic */}
        <div className="profile-pic">
          <img src={user.Photo ? user.Photo : picLink} alt="" />
        </div>
        {/* profile-data */}
        <div className="pofile-data">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1>{user.name}</h1>
            <button
              className="followBtn"
              onClick={() => {
                if (isFollow) {
                  unfollowUser(user._id);
                } else {
                  followUser(user._id);
                }
              }}
            >
              {isFollow ? "Unfollow" : "Follow"}
            </button>
          </div>
          <p style={{ textAlign: "initial" }}>
            {branch}'{grad}
          </p>
          <div className="profile-info" style={{ display: "flex" }}>
            <p>{posts.length} posts</p>
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
        {posts?.map((pics) => {
          return (
            <img
              key={pics._id}
              src={pics.photo}
              onClick={() => {
                // toggleDetails(pics);
              }}
              className="item"
            ></img>
          );
        })}
      </div>

      {show && (
        <PostDetail item={posts} user={user} toggleDetails={toggleDetails} />
      )}

      {isModalTrue && (
        <Modal open={isModalTrue} onClose={handleClose}>
          <FollowModal data={showAllFollowers} heading={title} />
        </Modal>
      )}
    </div>
  );
}
