import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faUser } from "@fortawesome/free-solid-svg-icons";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./detail.css";

function CommunityDetail() {

  const [c_comments, setComments] = useState([]); // 댓글 목록
  const [c_comment, setComment] = useState(""); // 댓글 입력 상태
  const [c_title, setTitle] = useState(""); // 게시글 제목
  const [c_content, setContent] = useState(""); // 게시글 내용
  const c_contents = "자유게시판"; // 실제 데이터와 연결 필요
  const { id } = useParams(); // URL에서 productId 파라미터 가져오기
  const [errors, setErrors] = useState(""); // 오류 메시지
  const [message, setMessage] = useState(""); // 성공/실패 메시지
  const [isBookmarked, setIsBookmarked] = useState(false);

  const navigate = useNavigate();

  // 로그인한 유저 정보
  const [currentUserId, setCurrentUserId] = useState(null);

  // 댓글 수정 관련 상태
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  const [communityDetails, setCommunityDetails] = useState({
    c_title: "제목",
    c_content: "설명",
    authorName: "",
    authorType: "",
    createdAt: "",
    id: "",
  });

  const commentInputRef = useRef(null); // 댓글 수정 입력 필드를 위한 ref

  useEffect(() => {
    // JWT에서 사용자 ID 추출 (실제 사용 시 디코딩 필요)
    const token = localStorage.getItem("jwt");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1])); // JWT 디코딩
      setCurrentUserId(decoded.userId);
    }

    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setIsBookmarked(savedBookmarks.includes(c_contents));

    fetchCommunityDetails();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/comment/byCommunity/${id}");
      if (!response.ok) throw new Error("댓글 조회 실패");

      const result = await response.json();
      setComments(result);
    } catch (error) {
      console.error("댓글 조회 오류:", error);
      setErrors(error.message);
    }
  };

  const fetchCommunityDetails = async () => {
    try {
      const response = await fetch("/api/community/communityDetail/${id}");
      if (!response.ok) throw new Error("게시글 조회 실패");

      const data = await response.json();
      setCommunityDetails({
        c_title: data.c_title,
        c_content: data.c_content,
        authorName: data.authorName,
        authorType: data.authorType,
        createdAt: data.createdAt,
        id: data.id,
      });
    } catch (error) {
      console.error("게시글 가져오기 실패:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");
    if (!token) {
      setMessage("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          c_title: communityDetails.c_title,
          c_comment,
          authorName: communityDetails.authorName,
          authorType: communityDetails.authorType,
          communityId: communityDetails.id,
        }),
      });

      if (!response.ok) throw new Error("댓글 등록 실패");

      // setMessage("댓글이 등록되었습니다."); // 성공 메시지
      setComment(""); // 댓글 입력 초기화
      fetchData(); // 댓글 목록 갱신

      alert("댓글이 등록되었습니다."); // 등록 성공 시 alert 표시
      navigate(`/communityDetail/${id}`); // 댓글 등록 후 게시글로 돌아가기

    } catch (error) {
      setErrors({ message: error.message }); // 오류 메시지를 상태에 설정
      console.error("댓글 등록 오류:", error);

      alert("댓글 등록 실패: " + error.message); // 실패 시 alert 표시
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch("/api/comment/update/${commentId}", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ c_comment: editedComment }),
      });

      if (!response.ok) throw new Error("댓글 수정 실패");

      setEditingCommentId(null);
      setEditedComment(""); // 수정 후 인풋 초기화
      fetchData();
    } catch (error) {
      console.error("댓글 수정 오류:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch("/api/comment/delete/${commentId}", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("댓글 삭제 실패");

      fetchData();
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };

  // 댓글 수정 버튼 클릭 시 포커스 설정
  useEffect(() => {
    if (editingCommentId !== null && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [editingCommentId]); // editingCommentId가 변경될 때마다 실행

  return (
    <div className="detail-container">
      <div className="detail-content">
        <h2 className="detail-title">자유게시판</h2>
        <hr />
        <div className="detail-author-date">
          <span className="author">
            <FontAwesomeIcon icon={faUser} /> &nbsp;
            {communityDetails.authorName}&nbsp;
          </span>
          <span className="created-date">
            작성일: {new Date(communityDetails.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="detail-box">
          <div className="detail-row">
            <div className="detail-label">제목</div>
            <input type="text" className="detail-text" value={communityDetails.c_title} disabled />
          </div>
          <div className="detail-row content-row">
            <div className="detail-label">내용</div>
            <textarea className="detail-text large" value={communityDetails.c_content} disabled />
          </div>
        </div>

        {/* 성공/실패 메시지 표시 */}
        {message && <div className="message">{message}</div>}

        <h3 className="detail-comment-list-title">댓글 목록</h3>
        <div className="detail-comment-table">
          {c_comments.map((c) => (
            <div key={c.id} className="detail-comment-card" style={{ position: "relative" }}>
              <div className="detail-comment-author-date">
                <FontAwesomeIcon icon={faUser} /> {c.authorName} | {new Date(c.createdAt).toLocaleDateString()}
              </div>
              <div className="detail-comment-content">
                {editingCommentId === c.id ? (
                  <input
                    ref={commentInputRef} // 댓글 수정 입력에 ref 추가
                    type="text"
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                  />
                ) : (
                  c.c_comment
                )}
              </div>
              {/* 현재 로그인한 사용자와 댓글 작성자가 동일할 때만 수정/삭제 버튼을 보이도록 조건 추가 */}
              {c.authorId === currentUserId && (
                <div className="comment-actions">
                  {editingCommentId === c.id ? (
                    <button className="save-button" onClick={() => handleUpdateComment(c.id)}>저장</button>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPen} onClick={() => setEditingCommentId(c.id)} />
                      <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteComment(c.id)} />
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 댓글 입력 */}
        <div className="detail-comment-input-section">
          <input
            type="text"
            className="detail-comment-text-input"
            placeholder="댓글을 입력해주세요."
            name="c_comment"
            id="c_comment"
            value={c_comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="detail-submit-comment-btn"
            onClick={handleCommentSubmit}
          >
            등록
          </button>
        </div>

        <button className="detail-button" onClick={() => navigate("/communityBoardList")}>목록</button>
      </div>
    </div>
  );
}

export default CommunityDetail;
