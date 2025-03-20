import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faUser } from "@fortawesome/free-solid-svg-icons";
import "./detail.css";

function BusinessDetail() {
  const navigate = useNavigate(); // 🔹 페이지 이동을 위한 useNavigate 사용
  const b_contents = "비즈니스"; // 📌 실제 데이터와 연결 필요

  const { id } = useParams(); // URL에서 productId 파라미터 가져오기

  // 📌 찜 상태 (DB 연결 전에는 localStorage 사용)
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 📌 비즈니스 상품 정보
  const [businessDetails, setBusinessDetails] = useState({
    b_title: "비즈니스 제목",
    b_price: "100,000 원",
    b_contents: "비즈니스 상품 설명",
    b_link: "https://www.example.com",
    b_username: "작성자", // 작성자 추가
    b_createdDate: "작성일", // 작성일 추가
  });

  // 📌 ID 중복 확인 상태
  const [isIdAvailable, setIsIdAvailable] = useState(null);

  // 📌 1️⃣ 마운트 시 localStorage에서 찜 여부 확인
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setIsBookmarked(savedBookmarks.includes(b_contents));

    // 비즈니스 데이터 API 호출 (예시로 제품 정보 호출)
    const fetchBusinessDetails = async () => {
      try {
        const response = await fetch(`http://192.168.0.102:8080/api/biz/businessDetail/${id}`); // 예시 API URL
        if (!response.ok) {
          throw new Error("비즈니스 데이터 조회에 실패했습니다.");
        }

        const data = await response.json();

        if (data) {
          setBusinessDetails({
            b_title: data.b_title || "제목",
            b_price: data.b_price || " 금액",
            b_contents: data.b_contents || " 설명",
            b_link: data.b_link || "http://링크.com",
            b_name: data.b_username || "작성자", // 작성자 데이터 추가
            b_createdDate: data.b_createdDate || "작성일", // 작성일 데이터 추가
            b_image: data.b_image || null, // 상품 이미지 추가
          });
        } else {
          console.error("빈 데이터 응답:", data);
        }
      } catch (error) {
        console.error("비즈니스 데이터 가져오기 실패:", error);
      }
    };

    fetchBusinessDetails();
  }, [id]); // 빈 배열을 두어 페이지 로드시 한 번만 실행

  // 📌 찜 버튼 클릭 시 실행 (localStorage에서 저장/삭제)
  const handleBookmarkClick = () => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (isBookmarked) {
      // 📌 찜 해제 (배열에서 삭제)
      const updatedBookmarks = savedBookmarks.filter((item) => item !== b_contents);
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else {
      // 📌 찜 추가 (배열에 추가)
      savedBookmarks.push(b_contents);
      localStorage.setItem("bookmarks", JSON.stringify(savedBookmarks));
      setIsBookmarked(true);
    }
  };

  // 🔹 목록 버튼 클릭 시 이동하는 함수
  const handleGoToList = () => {
    navigate("/businessBoardList"); // 🔹 "/businessBoardList" 페이지로 이동
  };

  return (
    <div className="detail-container">
      <div className="detail-content">
        <h2 className="detail-title">비즈니스</h2>
        <hr />

        {/* 작성자 아이콘과 작성일 표시 */}
        <div className="detail-author-date">
          <span className="author">
           <FontAwesomeIcon icon={faUser} /> &nbsp;{/* 사람 아이콘 추가 */}
                       {businessDetails.b_username}&nbsp;
                     </span>
                     <span className="created-date">작성일: {businessDetails.b_createdDate}</span>
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
              name="b_title"
              id="b_title"
              value={businessDetails.b_title}
              disabled={true}
            />
          </div>
          <div className="detail-row">
            <div className="detail-label">금액</div>
            <input
              type="text"
              className="detail-text"
              name="b_price"
              id="b_price"
              value={businessDetails.b_price}
              disabled={true}
            />
          </div>

          {/* 비즈니스 이미지가 있을 경우 표시 */}
          {/* {businessDetails.b_image && (
            <div className="detail-row">
              <div className="detail-label">사진</div>
              <img
                src={businessDetails.b_image} // 이미지 URL
                alt="비즈니스 이미지"
                className="business-image"
              />
            </div>
          )} */}

          <div className="detail-row content-row">
            <div className="detail-label">내용</div>
            <textarea
              className="detail-text large"
              name="b_contents"
              id="b_contents"
              value={businessDetails.b_contents}
              disabled={true}
            ></textarea>
          </div>
          <div className="detail-row">
            <div className="detail-label">링크</div>
            <input
              type="text"
              className="detail-text"
              name="b_link"
              id="b_link"
              value={businessDetails.b_link}
              disabled={true}
            />
          </div>
        </div>

        <button className="detail-button" onClick={handleGoToList}>
          목록
        </button>
      </div>
    </div>
  );
}

export default BusinessDetail;
