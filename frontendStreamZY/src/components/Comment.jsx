import React, { useState, useRef, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import videoContext from '../Context/Videos/videoContext.jsx';
import axios from "axios";
// YouTube-like Comment Section (single-file React component)
// - Tailwind CSS utility classes (no external CSS required)
// - Default export: YouTubeComments
// - Features: comment input, reply threads, like/dislike, sort, load more, avatars, timestamps,
//   optimistic UI updates, accessibility, keyboard support, and compact/expanded view modes.
// - Usage: <YouTubeComments initialComments={comments} />

// NOTE: This is UI + UX-focused; backend hooks (API calls) are simulated with timeouts.

const SAMPLE_COMMENTS = [
  {
    id: "c1",
    author: "Aman Sharma",
    avatar: "https://i.pravatar.cc/48?u=aman",
    text: "Great video — learned a lot! The part about hooks was 🔥",
    timeAgo: "2 hours ago",
    likes: 24,
    liked: false,
    replies: [
      {
        id: "c1r1",
        author: "YouTubeCreator",
        avatar: "https://i.pravatar.cc/48?u=creator",
        text: "Thanks Aman — glad it helped! ❤️",
        timeAgo: "1 hour ago",
        likes: 3,
        liked: false
      }
    ]
  },
  {
    id: "c2",
    author: "Priya",
    avatar: "https://i.pravatar.cc/48?u=priya",
    text: "Can anyone share resources for further reading?",
    timeAgo: "5 hours ago",
    likes: 8,
    liked: false,
    replies: []
  }
];

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
      className={`flex items-center gap-2 text-sm px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        active ? "text-blue-500" : "text-gray-600 dark:text-gray-300"
      }`}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

export default function Comment({ initialComments = SAMPLE_COMMENTS }) {
  const [comments, setComments] = useState(initialComments);
  const [sortBy, setSortBy] = useState("top"); // 'top' or 'newest'
  const [showCount, setShowCount] = useState(5);
  const [inputText, setInputText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const inputRef = useRef(null);
  const { id } = useParams();
  const host = import.meta.env.VITE_HOST_LINK;

    const Context = useContext(videoContext);
    const { currUser } = Context;

  useEffect(() => {
    // Focus the input on mount for better UX
    if (inputRef.current) inputRef.current.focus();
  }, []);

 const handlePost = async  (e) => {
  e.preventDefault();

    if (!inputText.trim()) return;
    setIsPosting(true);

   const body = { 
      comment: inputText
    }
     
    console.log(body);

  try {
        const response = await axios.post(`${host}/v1/comments/add-comment/${id}`,  body , {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });

        if (response.data.success) {
          console.log(response.data.data);
          console.log("done addig comment");
         // setComments((prev) => [, ...prev]);
          setInputText("");
          setIsPosting(false);
        }

      } catch (error) {
        setIsPosting(false);
        console.log("Error while poating vidoe comment", error.response?.data || error.message);
      }
    }
 
  

  function toggleLike(commentId, replyId) {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        if (replyId) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === replyId ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r
            )
          };
        }
        return { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 };
      })
    );
  }

  function addReply(parentId, text) {
    if (!text.trim()) return;
    const reply = {
      id: `r_${Date.now()}`,
      author: "You (demo)",
      avatar: `https://i.pravatar.cc/48?u=${Date.now()}`,
      text: text.trim(),
      timeAgo: "just now",
      likes: 0,
      liked: false
    };
    setComments((prev) => prev.map((c) => (c.id === parentId ? { ...c, replies: [...c.replies, reply] } : c)));
  }

  function sortedComments() {
    const copy = [...comments];
    if (sortBy === "top") {
     // copy.sort((a, b) => b.likes - a.likes || new Date(b.id.slice(2)) - new Date(a.id.slice(2)));
    } else {
    //  copy.sort((a, b) => new Date(b.id.slice(2)) - new Date(a.id.slice(2)));
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
          console.log(response.data.data);
          setComments(response.data.data);
        }

      } catch (error) {
        console.log("Error while fetching vidoes", error.response?.data || error.message);
      }
    }

    getComments();
  }, [])

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
                className={`text-sm px-3 py-1 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  !inputText.trim() || isPosting ? "bg-gray-700 cursor-not-allowed" : "bg-blue-600 text-white"
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
              key={c.id}
              comment={c}
              onLike={() => toggleLike(c.id)}
              onLikeReply={(rid) => toggleLike(c.id, rid)}
              onReply={(text) => addReply(c.id, text)}
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

function CommentCard({ comment, onLike, onReply, onLikeReply }) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  return (
    <article className="flex gap-3" aria-labelledby={`comment-${comment.id}`}>
      <Avatar src={comment.avatar} alt={`${comment.author} avatar`} size={10} />

      <div className="flex-1">
        <header className="flex items-start justify-between">
          <div>
            <h3 id={`comment-${comment.id}`} className="text-sm font-medium text-black/70 dark:text-white">
              {comment.author}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">{comment.text}</p>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{comment.timeAgo}</div>
          </div>

          <div className="flex-shrink-0 flex items-start gap-2">
            <IconButton label={comment.likes} onClick={onLike} active={comment.liked}>
            <i className="fa-regular fa-thumbs-up text-base"></i>
            </IconButton>
            <IconButton label="Reply" onClick={() => setReplyOpen((s) => !s)}>
              ↩️
            </IconButton>
          </div>
        </header>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 border-l pl-4 space-y-3">
            {comment.replies.map((r) => (
              <div key={r.id} className="flex gap-3">
                <Avatar src={r.avatar} alt={`${r.author} avatar`} size={8} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-black/70 dark:text-white">{r.author}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">{r.text}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <button onClick={() => onLikeReply(r.id)} className="hover:underline focus:outline-none">
                      {r.liked ? "Liked" : "Like"} • {r.likes}
                    </button>
                    <span>{r.timeAgo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply composer (collapsed) */}
        {replyOpen && (
          <div className="mt-3 flex gap-3 items-start">
            <Avatar src={`https://i.pravatar.cc/48?u=user`} alt="You" size={8} />
            <div className="flex-1">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
                className="w-full resize-none dark:bg-black/5 dark:text-white border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Add a public reply..."
                aria-label="Add a public reply"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    onReply(replyText);
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
                    onReply(replyText);
                    setReplyText("");
                    setReplyOpen(false);
                  }}
                  disabled={!replyText.trim()}
                  className={`px-3 py-1 rounded-md text-sm font-medium focus:outline-none ${
                    !replyText.trim() ? "bg-gray-700" : "bg-blue-600 text-white"
                  }`}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
