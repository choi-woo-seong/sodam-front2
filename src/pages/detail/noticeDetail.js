import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import "./detail.css";

function QADetail() {

  const [a_comments, setComments] = useState([]);  // 댓글 목록
  const [answer, setComment] = useState("");  // 댓글 입력 상태
  const [a_title, setTitle] = useState("");  // 질문 제목
  const [a_content, setContent] = useState("");  // 질문 내용
  const a_contents = "Q&A"; // 실제 데이터와 연결 필요

  // 찜 상태 (DB 연결 전에는 localStorage 사용)
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 마운트 시 localStorage에서 찜 여부 확인
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setIsBookmarked(savedBookmarks.includes(a_contents));

    // 예시 댓글 데이터 삭제 - 초기값 없이 빈 배열로 설정
    setComments([]); // 빈 배열로 설정하여 예시 댓글 삭제
  }, []);

  // 찜 버튼 클릭 시 실행 (localStorage에서 저장/삭제)
  const handleBookmarkClick = () => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (isBookmarked) {
      // 찜 해제 (배열에서 삭제)
      const updatedBookmarks = savedBookmarks.filter((item) => item !== a_contents);
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else {
      // 찜 추가 (배열에 추가)
      savedBookmarks.push(a_contents);
      localStorage.setItem("bookmarks", JSON.stringify(savedBookmarks));
      setIsBookmarked(true);
    }
  };

  // 댓글 등록 함수
  // const handleCommentSubmit = () => {
  //   if (answer.trim() === "") return; // 댓글이 비어있으면 등록하지 않음
  //   const newComment = {
  //     id: Date.now(), // 고유 ID 생성 (현재 시간)
  //     author: "익명", // 댓글 작성자
  //     content: answer, // 댓글 내용
  //     date: new Date().toLocaleDateString(), // 작성 날짜
  //   };
  //   setComments([...a_comments, newComment]); // 댓글 목록에 추가
  //   setComment(""); // 입력창 초기화
  // };

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용

  // 목록 버튼 클릭 시 이동하는 함수
  const handleGoToList = () => {
    navigate("/QABoardList"); // "/QABoardList" 페이지로 이동
  };

  return (
    <div className="detail-container">
      <div className="detail-content">
        <h2 className="detail-title">공지</h2>
        <hr />
        
        <div className="detail-header">
          <FontAwesomeIcon
            icon={faBookmark}
            className={`bookmark-icon ${isBookmarked ? "active" : ""}`}
            onClick={handleBookmarkClick}
          />
        </div>

        <div className="detail-box">
          <div className="detail-row">
            <div className="detail-label">제목</div>
            <input type="text" className="detail-text" name="a_title" id="a_title" disabled={true} value={a_title} />
          </div>
          <div className="detail-row content-row">
            <div className="detail-label">내용</div>
            <textarea className="detail-text large" name="a_contents" id="a_contents" disabled={true} value={a_content}></textarea>
          </div>
        </div>

        {/* 댓글 목록 */}
        <h3 className="detail-comment-list-title">댓글 목록</h3>
        <div className="detail-comment-table">
          {a_comments.map((c) => (
            <div key={c.id} className="detail-comment-card">
              <div className="detail-comment-author-date">
                <span>{c.author}</span> | <span>{c.date}</span>
              </div>
              <div className="detail-comment-content">
                {c.content}
              </div>
            </div>
          ))}
        </div>

        {/* 댓글 입력 */}
        <div className="detail-comment-input-section">
          <input
            type="text"
            className="detail-comment-text-input"
            placeholder="댓글을 입력해주세요."
            name="answer"
            id="answer"
            value={answer}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="detail-submit-comment-btn"
            // onClick={handleCommentSubmit}
          >
            등록
          </button>
        </div>

        <button className="detail-button" onClick={handleGoToList}>
          목록
        </button>
      </div>
    </div>
  );
}

export default QADetail;
