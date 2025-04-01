import React, { useState, useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faUser } from "@fortawesome/free-solid-svg-icons"; // faUser 아이콘 추가
import "./detail.css";

function NoticeDetail() {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용
  const [n_comments, setComments] = useState([]);  // 댓글 목록
  const [answer, setComment] = useState("");  // 댓글 입력 상태
  const n_content = "공지"; // 실제 데이터와 연결 필요

  const { id } = useParams(); // URL에서 productId 파라미터 가져오기
  

   // 📌 API에서 가져오는 상품 정보
    const [noticeDetails, setNoticeDetails] = useState({
      n_title: "제목",
      n_content: "설명",
      user: "작성자", // 작성자 추가
      createdAt: "작성일", // 작성일 추가
    });

      // 📌 ID 중복 확인 상태
      const [isIdAvailable, setIsIdAvailable] = useState(null);
    

  // 마운트 시 localStorage에서 찜 여부 확인
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];


    // 상품 데이터 API 호출 (예시로 제품 정보 호출)
    const fetchNoticeDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/notice/noticeDetail/${id}`); // 예시 API URL
        if (!response.ok) {
          throw new Error("공지 데이터 조회에 실패했습니다.");
        }

        const data = await response.json();

        if (data) {
          setNoticeDetails({
            n_title: data.n_title || "제목",
            n_content: data.n_content || "설명",
            user: data.user || "작성자", // 작성자 데이터 추가
            createdAt: data.createdAt || "작성일", // 작성일 데이터 추가
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
                   관리자 &nbsp;
                 </span>
                 <span className="created-date">
                  작성일: {new Date(noticeDetails.createdAt).toLocaleDateString()}
                  </span>
               </div>


        <div className="detail-box">
          <div className="detail-row">
            <div className="detail-label">제목</div>
            <input 
            type="text" 
            className="detail-text" 
            name="n_title" 
            id="n_title" 
            disabled={true} 
            value={noticeDetails.n_title} />
          </div>
          <div className="detail-row content-row">
            <div className="detail-label">내용</div>
            <textarea 
            className="detail-text large" 
            name="n_content" 
            id="n_content" 
            disabled={true} 
            value={noticeDetails.n_content}></textarea>
          </div>
        </div>
        <button className="detail-button" onClick={handleGoToList}>
          목록
        </button>

      </div>
    </div>
  );
}

export default NoticeDetail;
