import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons"; // 작성자 아이콘 추가
import "./detail.css";

function BankDetail() {
  const navigate = useNavigate(); // 🔹 페이지 이동을 위한 useNavigate 사용
  const g_contents = "금융"; // 📌 실제 데이터와 연결 필요

   const { id } = useParams(); // URL에서 productId 파라미터 가져오기

  // 📌 찜 상태 (DB 연결 전에는 localStorage 사용)
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 📌 금융 정보
  const [bankDetails, setBankDetails] = useState({
    g_title: "금융 상품 제목",
    g_contents: "금융 상품 설명",
    g_name: "관리자", // 작성자 추가
    g_createdAt: "2025-03-19" // 작성일 추가
  });

  // 📌 ID 중복 확인 상태
  const [isIdAvailable, setIsIdAvailable] = useState(null);

  // 📌 1️⃣ 마운트 시 localStorage에서 찜 여부 확인
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setIsBookmarked(savedBookmarks.includes(g_contents));

    // 상품 데이터 API 호출 (예시로 제품 정보 호출)
    const fetchBankDetails = async () => {
      try {
        const response = await fetch(`http://192.168.0.102:8080/api/products/productDetail/${id}`); // 예시 API URL
        if (!response.ok) {
          throw new Error("금융 데이터 조회에 실패했습니다.");
        }

        const data = await response.json();

        if (data) {
          setBankDetails({
            g_title: data.g_title || "제목",
            g_contents: data.g_contents || "설명",
            g_name: data.g_name || "작성자", // 작성자 데이터 추가
            g_createdDate: data.g_createdDate || "작성일", // 작성일 데이터 추가
          });
        } else {
          console.error("빈 데이터 응답:", data);
        }
      } catch (error) {
        console.error("금융 데이터 가져오기 실패:", error);
      }
    };

    fetchBankDetails();
  }, [id]); // 빈 배열을 두어 페이지 로드시 한 번만 실행

  // 📌 찜 버튼 클릭 시 실행 (localStorage에서 저장/삭제)
  const handleBookmarkClick = () => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (isBookmarked) {
      // 📌 찜 해제 (배열에서 삭제)
      const updatedBookmarks = savedBookmarks.filter((item) => item !== g_contents);
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else {
      // 📌 찜 추가 (배열에 추가)
      savedBookmarks.push(g_contents);
      localStorage.setItem("bookmarks", JSON.stringify(savedBookmarks));
      setIsBookmarked(true);
    }
  };

  // 🔹 목록 버튼 클릭 시 이동하는 함수
  const handleGoToList = () => {
    navigate("/bankBoardList"); // 🔹 "/bankBoardList" 페이지로 이동
  };

  return (
    <div className="detail-container">
      <div className="detail-content">
        <h2 className="detail-title">금융</h2>
        <hr />

        {/* 작성자 아이콘과 작성일 표시 */}
        <div className="detail-author-date">
          <span className="author">
            <FontAwesomeIcon icon={faUser} />&nbsp; {/* 사람 아이콘 추가 */}
            {bankDetails.g_name} &nbsp; {/* 작성자 이름 */}
          </span>
          <span className="created-date">작성일: {bankDetails.g_createdAt}</span> {/* 작성일 표시 */}
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
            <input
              type="text"
              className="detail-text"
              name="g_title"
              id="g_title"
              value={bankDetails.g_title}
              disabled={true}
            />
          </div>
          <div className="detail-row content-row">
            <div className="detail-label">내용</div>
            <textarea
              className="detail-text large"
              name="g_contents"
              id="g_contents"
              value={bankDetails.g_contents}
              disabled={true}
            ></textarea>
          </div>
        </div>

        <button className="detail-button" onClick={handleGoToList}>
          목록
        </button>
      </div>
    </div>
  );
}

export default BankDetail;
