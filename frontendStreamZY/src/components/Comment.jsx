import React, { useState, useRef, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import videoContext from '../Context/Videos/videoContext.jsx';
import axios from "axios";



function Avatar({ src, alt, size = 10 }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full flex-shrink-0 h-${size} w-${size} object-cover`}
      onError={(e) => (e.currentTarget.src = "https://i.pravatar.cc/48?img=12")}
    />
  );
}

function IconButton({ children, label, onClick, active }) {
  return (
    <button
      aria-pressed={!!active}
      onClick={onClick}
      className={`flex items-center gap-2 text-sm px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-400 ${active ? "text-blue-500" : "text-gray-600 dark:text-gray-300"
        }`}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

export default function Comment() {
  const [comments, setComments] = useState("");
  const [sortBy, setSortBy] = useState("top"); // 'top' or 'newest'
  const [showCount, setShowCount] = useState(5);
  const [inputText, setInputText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const inputRef = useRef(null);
  const { id } = useParams();
  const host = import.meta.env.VITE_HOST_LINK;

  const Context = useContext(videoContext);
  const { currUser, timeAgo } = Context;

  useEffect(() => {
    // Focus the input on mount for better UX
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();

    if (!inputText.trim()) return;
    setIsPosting(true);

    const body = {
      comment: inputText
    }

    try {
      const response = await axios.post(`${host}/v1/comments/add-comment/${id}`, body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      if (response.data.success) {
        let newReply = response.data.data;
        setComments(prev => [...prev, newReply])
        setInputText("");
        setIsPosting(false);
      }

    } catch (error) {
      setIsPosting(false);
      console.log("Error while poating vidoe comment", error.response?.data || error.message);
    }
  }

  function sortedComments() {
    const copy = [...comments];
    if (sortBy === "top") {
      // copy.sort((a, b) => b.likes - a.likes || new Date(b.id.slice(2)) - new Date(a.id.slice(2)));
      // } else {
      copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return copy;
  }

  useEffect(() => {
    if (!id) {
      return;
    }

    const getComments = async () => {
      try {
        const response = await axios.get(`${host}/v1/comments/getAll-comments/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });

        if (response.data.success) {
          setComments(response.data.data);
        }

      } catch (error) {
        console.log("Error while fetching vidoes", error.response?.data || error.message);
      }
    }

    getComments();
  }, [id, comments])

  return (
    <section aria-labelledby="comments-heading" className="w-full mx-auto px-3 py-2">
      <div className="flex items-center justify-between mb-3">
        <h2 id="comments-heading" className="text-lg font-semibold text-gray-700 dark:text-white/80">
          {comments.length} Comments
        </h2>

        <div className="flex items-center gap-2 dark:bg-gray-900/10">
          <label htmlFor="sort" className="sr-only dark:bg-gray-900/10">Sort comments</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-700 dark:bg-black/40 dark:text-white/80 border-[1px] dark:border-white/20 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="top">Top comments</option>
            <option value="newest">Newest first</option>
          </select>
        </div>
      </div>

      {/* Composer */}
      <div className="flex gap-3 mb-4">
        <Avatar src={`${currUser?.avatar}`} alt="Your avatar" size={10} />
        <div className="flex-1">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Add a public comment..."
            rows={2}
            className="w-full h-14 resize-none dark:bg-black/5 dark:text-white border-[1px] dark:border-white/20 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Add a public comment"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                handlePost();
              }
            }}
          />

          <div className="flex items-center justify-between mt-2 dark:text-white/80">


            <div className="flex items-center gap-2">
              <button
                onClick={() => setInputText("")}
                disabled={!inputText || isPosting}
                className="text-sm px-3 py-1 rounded-md hover:bg-gray-100 bg-gray-500 dark:bg-white/20 cursor-pointer dark:hover:bg-white/5 focus:outline-none"
              >
                Cancel
              </button>

              <button
                onClick={handlePost}
                disabled={!inputText.trim() || isPosting}
                className={`text-sm px-3 py-1 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${!inputText.trim() || isPosting ? "bg-gray-700 cursor-not-allowed" : "bg-blue-600 text-white"
                  }`}
                aria-disabled={!inputText.trim() || isPosting}
              >
                {isPosting ? "Posting..." : "Comment"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {sortedComments()
          .slice(0, showCount)
          .map((c) => (
            <CommentCard
              key={c._id}
              comment={c}
              onLike={() => toggleLike(c.id)}
              onLikeReply={(rid) => toggleLike(c.id, rid)}
            />
          ))}
      </div>

      <div className="mt-4 text-center">
        {showCount < comments.length ? (
          <button
            onClick={() => setShowCount((s) => s + 5)}
            className="px-4 py-2 rounded-md border-[1px] dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none"
          >
            Load more replies
          </button>
        ) : (
          comments.length > 0 && (
            <button
              onClick={() => setShowCount(5)}
              className="px-4 py-2 rounded-md border-[1px] dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none"
            >
              Show less
            </button>
          )
        )}
      </div>
    </section>
  );
}

function CommentCard({ comment  }) {

  const [replyOpen, setReplyOpen] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [liked, setLiked] = useState(false);
  const [disliked, setdisliked] = useState(false);
  const [totalLike, setTotalLike] = useState(0);
  const [opens, setOpens] = useState(true);
  const [replycomment, setReplyComment] = useState("");
  const [cmenu, setCMenu] = useState(false)
  const host = import.meta.env.VITE_HOST_LINK;

  const Context = useContext(videoContext);
  const { currUser, timeAgo } = Context;
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const reduceComments = (_id_) => {
  setReplyComment(prev =>
    prev.filter(comment => comment._id !== _id_)
  );
};

 const deleteComment = async () => {

    if (!comment?._id) {
      return;
    }
    console.log(comment?._id)
       try {
          const response = await axios.delete(`${host}/v1/replyComment/delete-comment/${comment?._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            withCredentials: true,
            timeout: 150000
          });
    
          if (response.data.success) { 
            console.log("deleted the comment - reply")
           reduceComments(comment?._id)
          }
        }catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
      }



  const toggleOpen = async () => {
    if (!opens) {
      setOpens(true);
      setReplyComment("");
    } else {

      try {
        const response = await axios.get(`${host}/v1/replyComment/getAll-comments-reply/${comment?._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });

        if (response.data.success) {
          setReplyComment(response.data.data);
        }

      } catch (error) {
        console.log("Error while fetching vidoes", error.response?.data || error.message);
      }

      setOpens(false);
    }
  }

  useEffect(() => { }, [replycomment])

  const addReply = async (text) => {
    if (!text.trim()) return;

    setReplying(true)

    const body = {
      comment: text
    }

    try {
      const response = await axios.post(`${host}/v1/replyComment/add-comment-reply/${comment?._id}`, body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      if (response.data.success) {
        let newReply = response.data.data;
        setReplyComment(prev => [...prev, newReply])
        setReplying(false)
      }

    } catch (error) {
      setReplying(false);
      console.log("Error while poating vidoe comment", error.response?.data || error.message);
    }

  }

  useEffect(() => {
    if (!comment?._id) {
      return;
    }

    const fetechisCommentLiked = async () => {
      try {
        const response = await axios.get(`${host}/v1/likes/fetch-user-comment-like/${comment?._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });

        if (response.data.success) {
          setLiked(response.data.data.isLiked);
          setdisliked(response.data.data.dislike);
        }

      } catch (error) {
        console.log("Error while fetching vidoes", error.response?.data || error.message);
      }
    }

    fetechisCommentLiked();

  }, [comment?._id])

  useEffect(() => {

    if (!comment._id) {
      return;
    }

    const fetechTotalLikes = async () => {
      try {
        const response = await axios.get(`${host}/v1/likes/fetch-total-comment-like/${comment._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });

        if (response.data.success) {
          setTotalLike(response.data.data?.length)
        }

      } catch (error) {
        console.log("Error while fetching vidoes", error.response?.data || error.message);
      }
    }

    fetechTotalLikes();

  }, [comment?._id, liked, disliked])


  const handleToggleLikeComment = async (e) => {
    e.preventDefault();

    if (!comment?._id) {
      return;
    }

    try {
      const response = await axios.patch(`${host}/v1/likes/toggle-comment-like/${comment?._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      if (response.data.success) {
        if ((response.data.data.likeComment?.isCommentLiked == true && response.data.data.toggleCommentLike?.isCommentLiked == undefined) || (response.data.data.toggleCommentLike?.isCommentLiked == true && response.data.data.likeComment?.isCommentLiked == undefined)) {
          setLiked(true);
          setdisliked(false);
        } else if (response.data.data.toggleCommentLike?.isCommentLiked == false && response.data.data.likeComment?.isCommentLiked == undefined) {
          setLiked(false);
        }
      }

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }


  const handleToggleDisLikeComment = async (e) => {
    e.preventDefault();

    if (!comment?._id) {
      return;
    }

    try {

      const response = await axios.patch(`${host}/v1/likes/toggle-comment-like&dislike/${comment?._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      if (response.data.success) {
        if ((response.data.data.dislikeComment?.isCommentDisLiked == true && response.data.data.toggleCommentLike?.isCommentDisLiked == undefined) || (response.data.data.toggleCommentLike?.isCommentDisLiked == true && response.data.data.dislikeComment?.isCommentDisLiked == undefined)) {
          setdisliked(true);
          setLiked(false);
        } else if (response.data.data.toggleCommentLike?.isCommentDisLiked == false && response.data.data.dislikeComment?.isCommentDisLiked == undefined) {
          setdisliked(false);
        }
      }

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }


  return (
    <article className="flex justify-between" aria-labelledby={`comment-${comment?._id}`}>
        <div className="flex gap-3">
      <Avatar src={comment?.owner?.avatar} alt={`${comment?.owner?.username} avatar`} size={10} />

      <div className="flex-1">
        <header className="flex flex-col items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 id={`comment-${comment?._id}`} className="text-sm font-medium text-black/70 dark:text-white">
                {comment?.owner?.username}
              </h3>
              <div className="text-xs text-gray-500 dark:text-gray-400 overflow-hidden">{timeAgo(comment?.createdAt)}</div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">{comment?.content}</p>
          </div>

          <div className="flex-shrink-0 flex items-start gap-1 my-2">
            <IconButton label={totalLike} onClick={handleToggleLikeComment} >
              <i className={`fa-${liked ? "solid" : "regular"} fa-thumbs-up`}></i>
            </IconButton>
            <IconButton onClick={handleToggleDisLikeComment} >
              <i className={`fa-${disliked ? "solid" : "regular"} fa-thumbs-down pt-1 ml-1`}></i>
            </IconButton>
            <IconButton label="Reply" onClick={() => setReplyOpen((s) => !s)}>
            </IconButton>
          </div>
        </header>
        {/* Replies */}

        {opens == false && (
          <div className="mt-3 border-l dark:border-white/20  pl-4 space-y-3">
            {replycomment.map((r) => (
              <ReplyCommentCard key={r?._id} reply_Comment={r}  reduceComments={reduceComments}/>
            ))}
          </div>
        )}

        {comment.replies != 0 && (
          <button className="my-2 flex cursor-pointer h-8 w-max items-center gap-[15px] py-[6px] pl-6 pr-[70px] rounded-lg hover:bg-black/10 dark:hover:bg-white/5" onClick={toggleOpen}>
            <label htmlFor="menu-toggle" className="cursor-pointer block text-sm">{opens ? (
              `${comment?.replies} replies`
            ) : ("Hide Replies")}</label>
            <i className={`fa-solid fa-angle-${opens ? "down" : "up"} text-sm`}></i>
          </button>

        )}

        {/* Reply composer (collapsed) */}
        {replyOpen && (
          <div className="mt-3 flex gap-3 items-start">
            <Avatar src={`${currUser?.avatar}`} alt="You" size={8} />
            <div className="flex-1">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
                className="w-full resize-none dark:bg-black/5 dark:text-white border-[1px] dark:border-white/20 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Add a public reply..."
                aria-label="Add a public reply"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    addReply(replyText);
                    setReplyText("");
                    setReplyOpen(false);
                  }
                }}
              />

              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setReplyOpen(false);
                    setReplyText("");
                  }}
                  className="px-3 py-1 rounded-md text-sm hover:bg-gray-100 bg-gray-500 dark:hover:bg-white/5 focus:outline-none dark:text-white/70"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addReply(replyText);
                    setReplyText("");
                    setReplyOpen(false);
                  }}
                  disabled={!replyText.trim() || replying}
                  className={`px-3 py-1 rounded-md text-sm font-medium focus:outline-none ${!replyText.trim() ? "bg-gray-700" : "bg-blue-600 text-white"
                    }`}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
       </div>
   
       <div className="relative">
  {currUser?._id === comment?.owner?._id && (
    <div
      onClick={() => setCMenu((prev) => !prev)}
      className="flex w-7 h-7 items-center justify-center rounded-full cursor-pointer 
                 hover:bg-gray-200 hover:dark:bg-white/20"
    >
      <i className="fa-solid fa-ellipsis-vertical"></i>
    </div>
  )}
     </div>

  {cmenu && (
    <div  className="absolute right-full top-10 mt-2 w-32 
                    bg-white/5 border-[1px] rounded shadow-md z-50 dark:border-white/20">
      <div
        onClick={() => {
          console.log("Edit clicked");
          setCMenu(false);
        }}
        className="px-4 py-2 cursor-pointer hover:bg-gray-200 hover:dark:bg-black/40"
      >
        Edit
      </div>

      <div
        onClick={() => {
        deleteComment();
        setCMenu(false);
        }}
        className="px-4 py-2 cursor-pointer text-red-600 hover:bg-gray-200 hover:dark:bg-black/40"
      >
        Delete
      </div>
    </div>
  )}
    </article>
  );
}



function ReplyCommentCard({ reply_Comment, reduceComments }) {

  const [rliked, setRLiked] = useState(false);
  const [disrliked, setRdisliked] = useState(false);
  const [totalReplyLike, setTotalReplyLike] = useState(0);
  const [menu, setMenu] = useState(false);
  const host = import.meta.env.VITE_HOST_LINK;

  const Context = useContext(videoContext);
  const { currUser, timeAgo } = Context;
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {

    if (!reply_Comment?._id) {
      return;
    }
    const fetchIsLiked = async () => {
      try {
        const response = await axios.get(`${host}/v1/likes/fetch-user-comment-reply-like/${reply_Comment?._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });

        if (response.data.success) {
          setRLiked(response.data.data.isLiked);
          setRdisliked(response.data.data.dislike);
        }

      } catch (error) {
        console.log("Error while fetching vidoes", error.response?.data || error.message);
      }
    }

    fetchIsLiked();
  }, [reply_Comment?._id])


  useEffect(() => {
    if (!reply_Comment?._id) {
      return;
    }
    const fetechTotalReplyLikes = async () => {
      try {
        const response = await axios.get(`${host}/v1/likes/fetch-total-comment-reply-like/${reply_Comment?._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });

        if (response.data.success) {
          setTotalReplyLike(response.data.data?.length)
        }

      } catch (error) {
        console.log("Error while fetching vidoes", error.response?.data || error.message);
      }
    }

    fetechTotalReplyLikes();
  }, [reply_Comment?._id, rliked, disrliked])

  const handleToggleLikeCommentReply = async (e) => {
    e.preventDefault();

    if (!reply_Comment?._id) {
      return;
    }

    try {
      const response = await axios.patch(`${host}/v1/likes/toggle-comment-reply-like/${reply_Comment?._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      if (response.data.success) {
        if ((response.data.data.likeComment?.isReplyLiked == true && response.data.data.toggleCommentLike?.isReplyLiked == undefined) || (response.data.data.toggleCommentLike?.isReplyLiked == true && response.data.data.likeComment?.isReplyLiked == undefined)) {
          setRLiked(true);
          setRdisliked(false);
        } else if (response.data.data.toggleCommentLike?.isReplyLiked == false && response.data.data.likeComment?.isReplyLiked == undefined) {
          setRLiked(false);
        }
      }

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }


  const handleToggleDisLikeCommentReply = async (e) => {
    e.preventDefault();

    if (!reply_Comment?._id) {
      return;
    }

    try {
      const response = await axios.patch(`${host}/v1/likes/toggle-comment-reply-like&dislike/${reply_Comment?._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      if (response.data.success) {
        if ((response.data.data.dislikeComment?.isReplyDisLiked == true && response.data.data.toggleCommentLike?.isReplyDisLiked == undefined) || (response.data.data.toggleCommentLike?.isReplyDisLiked == true && response.data.data.dislikeComment?.isReplyDisLiked == undefined)) {
          setRdisliked(true);
          setRLiked(false);
        } else if (response.data.data.toggleCommentLike?.isReplyDisLiked == false && response.data.data.dislikeComment?.isReplyDisLiked == undefined) {
          setRdisliked(false);
        }
      }

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }

  const deleteReplyComment = async () => {

    if (!reply_Comment?._id) {
      return;
    }
    console.log(reply_Comment?._id)
       try {
          const response = await axios.delete(`${host}/v1/replyComment/delete-comment-reply/${reply_Comment?._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            withCredentials: true,
            timeout: 150000
          });
    
          if (response.data.success) { 
            console.log("deleted the comment - reply")
           reduceComments(reply_Comment?._id)
          }
        }catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
      }

  return (
    <>
    <div key={reply_Comment?._id} className="flex  justify-between">
      <div className="flex gap-3">
      <Avatar src={reply_Comment?.owner?.avatar} alt={`${reply_Comment.owner.username} avatar`} size={8} />
      <div className="flex-1">
        <div className="text-sm font-medium text-black/70 dark:text-white">{reply_Comment?.owner?.username}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">{reply_Comment?.content}</div>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
          <IconButton label={totalReplyLike} onClick={handleToggleLikeCommentReply} >
            <i className={`fa-${rliked ? "solid" : "regular"} fa-thumbs-up text-xs`}></i>
          </IconButton>
          <IconButton onClick={handleToggleDisLikeCommentReply} >
            <i className={`fa-${disrliked ? "solid" : "regular"} fa-thumbs-down pt-1 ml-1 text-xs`}></i>
          </IconButton>
          <span>{timeAgo(reply_Comment?.createdAt)}</span>
        </div>
      </div>
      </div>
      <div className="relative">
  {currUser?._id === reply_Comment?.owner?._id && (
    <div
      onClick={() => setMenu((prev) => !prev)}
      className="flex w-7 h-7 items-center justify-center rounded-full cursor-pointer 
                 hover:bg-gray-200 hover:dark:bg-white/20"
    >
      <i className="fa-solid fa-ellipsis-vertical"></i>
    </div>
  )}

  {menu && (
    <div ref={menuRef} className="absolute right-full top-10 mt-2 w-32 
                    bg-white/5 border-[1px] rounded shadow-md z-50 dark:border-white/20">
      <div
        onClick={() => {
          console.log("Edit clicked");
          setMenu(false);
        }}
        className="px-4 py-2 cursor-pointer hover:bg-gray-200 hover:dark:bg-black/40"
      >
        Edit
      </div>

      <div
        onClick={() => {
          deleteReplyComment()
          setMenu(false);
        }}
        className="px-4 py-2 cursor-pointer text-red-600 hover:bg-gray-200 hover:dark:bg-black/40"
      >
        Delete
      </div>
    </div>
  )}
</div>
</div>

</>
  );
}
