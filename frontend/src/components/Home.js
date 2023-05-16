import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import DEFAULT_IMAGE from "../img/cf.jpg";

export default function Home() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);
  const [userList, setUserList] = useState([]);
  const [currPostPhoto, setCurrPostPhoto] = useState("");

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("./signup");
    }

    // Fetching all posts
    fetch("http://localhost:5001/allposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      })
      .catch((err) => console.log(err));

    // fetching all users
    fetch("http://localhost:5001/allusers", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        ContentType: "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("res ", result);
        setUserList(result);
      })
      .catch((err) => console.log(err));
  }, []);

  // to show and hide comments
  const toggleComment = (posts, imgSrc) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(posts);
      setCurrPostPhoto(imgSrc);
    }
  };

  const likePost = (id) => {
    fetch("http://localhost:5001/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      });
  };
  const unlikePost = (id) => {
    fetch("http://localhost:5001/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      });
  };

  // function to make comment
  const makeComment = (text, id) => {
    fetch("http://localhost:5001/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        setComment("");
        notifyB("Comment posted");
      });
  };

  return (
    <div className="home">
      <div className="leftSection">
        <h2
          style={{
            position: "sticky",
            top: 0,
            backgroundColor: "white",
            padding: "10px 0",
          }}
        >
          People you may know..{" "}
        </h2>
        <ul>
          {userList.map((user) => {
            return (
              <li
                key={`${user.name} + 1`}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={user.Photo ? user.Photo : DEFAULT_IMAGE}
                  alt={"user"}
                  width={"35px"}
                  style={{
                    borderRadius: "100%",
                    padding: "0 12px 0 0",
                  }}
                />
                <a href={`/profile/${user._id}`}>{user.name}</a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="homeContainer">
        {/* card */}
        {data.map((posts) => {
          return (
            <div className="card">
              {/* card header */}
              <div className="card-header">
                <div className="card-pic">
                  <img
                    src={posts.postedBy.Photo ? posts.postedBy.Photo : picLink}
                    alt=""
                  />
                </div>
                <h5>
                  <Link to={`/profile/${posts.postedBy._id}`}>
                    {posts.postedBy.name}
                  </Link>
                </h5>
              </div>
              {/* card image */}
              <div className="card-image">
                <img src={posts.photo} alt="" />
              </div>

              {/* card content */}
              <div className="card-content">
                {posts.likes.includes(
                  JSON.parse(localStorage.getItem("user"))._id
                ) ? (
                  <span
                    className="material-symbols-outlined material-symbols-outlined-red"
                    onClick={() => {
                      unlikePost(posts._id);
                    }}
                  >
                    favorite
                  </span>
                ) : (
                  <span
                    className="material-symbols-outlined"
                    onClick={() => {
                      likePost(posts._id);
                    }}
                  >
                    favorite
                  </span>
                )}

                <p>{posts.likes.length} Likes</p>
                <p>{posts.body} </p>
                <p
                className="vlc"
                  style={{ fontWeight: "bold", cursor: "pointer" }}
                  onClick={() => {
                    toggleComment(posts, posts.postedBy.Photo);
                  }}
                >
                  View all comments
                </p>
              </div>

              {/* add Comment */}
              <div className="add-comment">
                <span className="material-symbols-outlined">mood</span>
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <button
                  className="comment"
                  onClick={() => {
                    makeComment(comment, posts._id);
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          );
        })}

        {/* show Comment */}
        {show && (
          <div className="showComment">
            <div className="container">
              <div className="postPic">
                <img src={item.photo} alt="" />
              </div>
              <div className="details">
                {/* card header */}
                <div
                  className="card-header"
                  style={{ borderBottom: "1px solid #00000029" }}
                >
                  <div className="card-pic">
                    <img
                      src={
                        currPostPhoto
                          ? currPostPhoto
                          : "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                      }
                      alt=""
                    />
                  </div>
                  <h5>{item.postedBy.name}</h5>
                </div>

                {/* commentSection */}
                <div
                  className="comment-section"
                  style={{ borderBottom: "1px solid #00000029" }}
                >
                  {item.comments.map((comment) => {
                    return (
                      <p className="comm">
                        <span
                          className="commenter"
                          style={{ fontWeight: "bolder" }}
                        >
                          {comment.postedBy.name}{" "}
                        </span>

                        <span className="commentText">{comment.comment}</span>
                      </p>
                    );
                  })}
                </div>

                {/* card content */}
                <div className="card-content">
                  <p>{item.likes.length} Likes</p>
                  <p>{item.body}</p>
                </div>

                {/* add Comment */}
                <div className="add-comment">
                  <span className="material-symbols-outlined">mood</span>
                  <input
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  />
                  <button
                    className="comment"
                    onClick={() => {
                      makeComment(comment, item._id);
                      toggleComment();
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
            <div
              className="close-comment"
              onClick={() => {
                toggleComment();
              }}
            >
              <span className="material-symbols-outlined material-symbols-outlined-comment">
                close
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="rightSection">
        <h2>Important Links</h2>
        <ul>
          <li>
            <a href="https://www.linkedin.com/company/training-and-placement-cell-uitrgpv-bhopal/?originalSubdomain=in">
              RGPV - TNP Linkedin
            </a>
          </li>
          <li>
            <a href="https://www.uitrgpv.ac.in/">UIT-RGPV Official Website</a>
          </li>
          <li>
            <a href="https://www.uitrgpv.ac.in/theinstitute/placementrecords.aspx">
              Year Wise Placement Data
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
