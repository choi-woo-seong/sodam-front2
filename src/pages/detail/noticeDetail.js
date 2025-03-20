import React, { useState, useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faUser } from "@fortawesome/free-solid-svg-icons"; // faUser 아이콘 추가
import "./detail.css";

function NoticeDetail() {
  const [n_comments, setComments] = useState([]);  // 댓글 목록
  const [answer, setComment] = useState("");  // 댓글 입력 상태
  const [n_title, setTitle] = useState("");  // 질문 제목
  const [n_content, setContent] = useState("");  // 질문 내용
  const n_contents = "공지"; // 실제 데이터와 연결 필요

  const { id } = useParams(); // URL에서 productId 파라미터 가져오기
  

  // 찜 상태 (DB 연결 전에는 localStorage 사용)
  const [isBookmarked, setIsBookmarked] = useState(false);

   // 📌 API에서 가져오는 상품 정보
    const [noticeDetails, setNoticeDetails] = useState({
      n_title: "제목",
      n_contents: "설명",
      n_name: "작성자", // 작성자 추가
      n_createdDate: "작성일", // 작성일 추가
    });

  // 마운트 시 localStorage에서 찜 여부 확인
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setIsBookmarked(savedBookmarks.includes(n_contents));


    // 상품 데이터 API 호출 (예시로 제품 정보 호출)
    const fetchNoticeDetails = async () => {
      try {
        const response = await fetch(`http://192.168.0.102:8080/api/products/productDetail/${id}`); // 예시 API URL
        if (!response.ok) {
          throw new Error("공지 데이터 조회에 실패했습니다.");
        }

        const data = await response.json();

        if (data) {
          setNoticeDetails({
            n_title: data.n_title || "제목",
            n_contents: data.n_contents || "설명",
            n_name: data.n_name || "작성자", // 작성자 데이터 추가
            n_createdDate: data.n_createdDate || "작성일", // 작성일 데이터 추가
          });
        } else {
          console.error("빈 데이터 응답:", data);
        }
      } catch (error) {
        console.error("공지 데이터 가져오기 실패:", error);
      }
    };

    fetchNoticeDetails();
  }, [id]); // 빈 배열을 두어 페이지 로드시 한 번만 실행

    // 댓글 등록 함수
  // const handleCommentSubmit = () => {
  //   if (answer.trim() === "") return; // 댓글이 비어있으면 등록하지 않음
  //   const newComment = {
  //     id: Date.now(), // 고유 ID 생성 (현재 시간)
  //     author: "익명", // 댓글 작성자
  //     content: answer, // 댓글 내용
  //     date: new Date().toLocaleDateString(), // 작성 날짜
  //   };
  //   setComments([...n_comments, newComment]); // 댓글 목록에 추가
  //   setComment(""); // 입력창 초기화
  // };

  // 찜 버튼 클릭 시 실행 (localStorage에서 저장/삭제)
  const handleBookmarkClick = () => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (isBookmarked) {
      // 찜 해제 (배열에서 삭제)
      const updatedBookmarks = savedBookmarks.filter((item) => item !== n_contents);
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else {
      // 찜 추가 (배열에 추가)
      savedBookmarks.push(n_contents);
      localStorage.setItem("bookmarks", JSON.stringify(savedBookmarks));
      setIsBookmarked(true);
    }
  };

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용

  // 목록 버튼 클릭 시 이동하는 함수
  const handleGoToList = () => {
    navigate("/noticeBoardList"); // "/noticeBoardList" 페이지로 이동
  };

  return (
    <div className="detail-container">
      <div className="detail-content">
        <h2 className="detail-title">공지사항</h2>
        <hr />
        
        {/* 작성자 아이콘과 작성일 표시 */}
       <div className="detail-author-date">
                 <span className="author">
                   <FontAwesomeIcon icon={faUser} /> &nbsp;{/* 사람 아이콘 추가 */}
                   {noticeDetails.n_name}&nbsp;
                 </span>
                 <span className="created-date">작성일: {noticeDetails.n_createdDate}</span>
               </div>

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
            <input type="text" className="detail-text" name="n_title" id="n_title" disabled={true} value={n_title} />
          </div>
          <div className="detail-row content-row">
            <div className="detail-label">내용</div>
            <textarea className="detail-text large" name="n_contents" id="n_contents" disabled={true} value={n_content}></textarea>
          </div>
        </div>

        {/* 댓글 목록 */}
        <h3 className="detail-comment-list-title">댓글 목록</h3>
        <div className="detail-comment-table">
          {n_comments.map((c) => (
            <div key={c.id} className="detail-comment-card">
              <div className="detail-comment-author-date">
                {/* 댓글 작성자 앞에 사람 아이콘 추가 */}
                <FontAwesomeIcon icon={faUser} /> {/* 사람 아이콘 추가 */}
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

export default NoticeDetail;
