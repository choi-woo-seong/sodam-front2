import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import "./detail.css";

function BankDetail() {
  const navigate = useNavigate(); // 🔹 페이지 이동을 위한 useNavigate 사용
  const g_contents = "금융"; // 📌 실제 데이터와 연결 필요

  // 📌 찜 상태 (DB 연결 전에는 localStorage 사용)
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 📌 금융 정보
  const [bankDetails, setBankDetails] = useState({
    g_title: "금융 상품 제목",
    g_contents: "금융 상품 설명"
  });

  // 📌 ID 중복 확인 상태
  const [isIdAvailable, setIsIdAvailable] = useState(null);

  // 📌 1️⃣ 마운트 시 localStorage에서 찜 여부 확인
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setIsBookmarked(savedBookmarks.includes(g_contents));

    // 금융 상품 정보 API 호출 (예시로 금융 정보 호출)
    fetch("http://192.168.0.102:8080/api/banks/details") // 예시 API URL
      .then((response) => response.json())
      .then((data) => {
        setBankDetails({
          g_title: data.title || "금융 상품 제목",
          g_contents: data.content || "금융 상품 설명"
        });
      })
      .catch((error) => {
        console.error("금융 데이터 가져오기 실패:", error);
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
