import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import "./detail.css";

function BusinessDetail() {
  const navigate = useNavigate(); // 🔹 페이지 이동을 위한 useNavigate 사용
  const b_contents = "비즈니스"; // 📌 실제 데이터와 연결 필요

  // 📌 찜 상태 (DB 연결 전에는 localStorage 사용)
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 📌 비즈니스 상품 정보
  const [businessDetails, setBusinessDetails] = useState({
    b_title: "비즈니스 상품 제목",
    b_price: "100,000 원",
    b_contents: "비즈니스 상품 설명",
    b_link: "https://www.example.com"
  });

  // 📌 ID 중복 확인 상태
  const [isIdAvailable, setIsIdAvailable] = useState(null);

  // 📌 1️⃣ 마운트 시 localStorage에서 찜 여부 확인
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setIsBookmarked(savedBookmarks.includes(b_contents));

    // 비즈니스 상품 정보 API 호출 (예시로 비즈니스 정보 호출)
    fetch("http://192.168.0.102:8080/api/business/details") // 예시 API URL
      .then((response) => response.json())
      .then((data) => {
        setBusinessDetails({
          b_title: data.title || "비즈니스 상품 제목",
          b_price: data.price || "금액 미제공",
          b_contents: data.content || "비즈니스 상품 설명",
          b_link: data.link || "링크 미제공"
        });
      })
      .catch((error) => {
        console.error("비즈니스 데이터 가져오기 실패:", error);
      });

    // 예시로 사용되는 중복 아이디 확인 API 호출
    fetch(`http://192.168.0.102:8080/api/users/check-duplicate?userid=testuser123`) // 테스트용 userid
      .then(response => response.json())
      .then(data => {
        if (data) {
          // 이미 존재하는 아이디
          setIsIdAvailable(false);
          alert("이미 사용 중인 아이디입니다.");
        } else {
          // 사용 가능한 아이디
          setIsIdAvailable(true);
          alert("사용 가능한 아이디입니다.");
        }
      })
      .catch(error => {
        console.error("중복 확인 오류 발생:", error);
      });
  }, []); // 빈 배열을 두어 페이지 로드시 한 번만 실행

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
