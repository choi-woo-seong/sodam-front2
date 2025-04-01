import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons"; // 작성자 아이콘 추가
import "./detail.css";

function BankDetail() {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate(); // 🔹 페이지 이동을 위한 useNavigate 사용
  const g_contents = "금융"; // 📌 실제 데이터와 연결 필요

  const { id } = useParams(); // URL에서 productId 파라미터 가져오기

  // 📌 찜 상태 (DB 연결 전에는 localStorage 사용)
  const [isBookmarked, setIsBookmarked] = useState(false);

  
  // 오류 메시지 상태
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");


// 📌 금융 정보
const [bankDetails, setBankDetails] = useState({
  g_title: "금융 상품 제목",
  g_name: "관리자", // 작성자 추가
  createdAt: "2025-03-19", // 작성일 추가
  irt: "", // 금리
  lnLmt: "", // 대출한도
  finPrdNm: "", // 금리상품명
  hdlInst: "", // 취급기관
  maxTotLnTrm: "", // 총대출기간
  rdptMthd: "", // 상환방법
  trgt: "", // 대상
  usge: "" // 용도
});


  // 📌 ID 중복 확인 상태
  const [isIdAvailable, setIsIdAvailable] = useState(null);

  const fetchFavoriteDetails = async (e) => {
    const token = localStorage.getItem("jwt"); // JWT 토큰 가져오기

    if (!token) {
      setMessage("로그인이 필요합니다.");
      return;
    }
    
    try {
      // 📌 찜 추가 (배열에 추가)
      const formDataToSend = {
        targetId: id,
        targetType: "GOV",
      };

      const response = await fetch(`${BASE_URL}/api/bookmark/check`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json", // ✅ JSON 데이터 전송
        },
        body: JSON.stringify(formDataToSend)
      }); // 예시 API URL
      if (!response.ok) {
        throw new Error("찜 데이터 체크에 실패했습니다.");
      }

      const data = await response.json();

      if (data.favorited) {
        setIsBookmarked(data.favorited);
      } else {
        setIsBookmarked(data.favorited);
      }
    } catch (error) {
      console.error("찜 데이터 가져오기 실패:", error);
    }
  };

  // 📌 1️⃣ 마운트 시 localStorage에서 찜 여부 확인
  useEffect(() => {

   // 상품 데이터 API 호출 (예시로 제품 정보 호출)
  const fetchBankDetails = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/gov/govDetail/${id}`); // 예시 API URL
    if (!response.ok) {
      throw new Error("금융 데이터 조회에 실패했습니다.");
    }

    const data = await response.json();

    console.log(data);

    if (data) {
      setBankDetails({
        g_title: data.g_title || "제목",
        g_name: data.g_name || "작성자", // 작성자 데이터 추가
        createdAt: data.createdAt || "작성일", // 작성일 데이터 추가
        irt: data.irt || "", // 금리
        lnLmt: data.lnLmt || "", // 대출한도
        finPrdNm: data.finPrdNm || "", // 금리상품명
        hdlInst: data.hdlInst || "", // 취급기관
        maxTotLnTrm: data.maxTotLnTrm || "", // 총대출기간
        rdptMthd: data.rdptMthd || "", // 상환방법
        trgt: data.trgt || "", // 대상
        usge: data.usge || "" // 용도
      });
    } else {
      console.error("빈 데이터 응답:", data);
    }
  } catch (error) {
    console.error("금융 데이터 가져오기 실패:", error);
  }
};


    fetchBankDetails();
    fetchFavoriteDetails();
  }, [id]); // 빈 배열을 두어 페이지 로드시 한 번만 실행

  // 📌 찜 버튼 클릭 시 실행 (localStorage에서 저장/삭제)
  const handleBookmarkClick = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwt"); // JWT 토큰 가져오기

    if (!token) {
      setMessage("로그인이 필요합니다.");
      return;
    }
      // 📌 찜 추가 (배열에 추가)
      try {
        const formDataToSend = {
          targetId: id,
          targetType: "GOV",
          targetPgm:"bankDetail",
        };

        console.log(formDataToSend)
    
        const response = await fetch(`${BASE_URL}/api/bookmark/toggle`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json", // ✅ JSON 데이터 전송
          },
          body: JSON.stringify(formDataToSend), // ✅ JSON 문자열로 변환하여 전송
        });
    
        if (!response.ok) {
          throw new Error("등록에 실패했습니다.");
        }
    
        setMessage("성공적으로 등록되었습니다.");
     
      } catch (error) {
        setErrors(error.message);
        console.error("찜 등록 오류:", error);
      }
      fetchFavoriteDetails();
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
            관리자 &nbsp; {/* 작성자 이름 */}
          </span>
          <span className="created-date">
            작성일: {new Date(bankDetails.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="detail-header">
          <FontAwesomeIcon
            icon={faBookmark}
            className={`bookmark-icon ${isBookmarked ? "active" : ""}`}
            onClick={handleBookmarkClick}
          />
        </div>

         <div className="detail-box">
        {/*  <div className="detail-row">
            <div className="detail-label">제목</div>
            <input
              type="text"
              className="detail-text"
              name="g_title"
              id="g_title"
              value={bankDetails.g_title}
              disabled={true}
            />
          </div> */}
          <div className="detail-row">
            <div className="detail-label">금리상품명</div>
            <input
              type="text"
              className="detail-text"
              name="finPrdNm"
              id="finPrdNm"
              value={bankDetails.finPrdNm}
              disabled={true}
            />
          </div>

          <div className="detail-row">
            <div className="detail-label">금리</div>
            <input
              type="text"
              className="detail-text"
              name="irt"
              id="irt"
              value={bankDetails.irt}
              disabled={true}
            />
          </div>
          <div className="detail-row">
            <div className="detail-label">대출한도</div>
            <input
              type="text"
              className="detail-text"
              name="lnLmt"
              id="lnLmt"
              value={bankDetails.lnLmt}
              disabled={true}
            />
          </div>
          <div className="detail-row">
            <div className="detail-label">대상</div>
            <input
              type="text"
              className="detail-text"
              name="trgt"
              id="trgt"
              value={bankDetails.trgt}
              disabled={true}
            />
          </div>
          <div className="detail-row">
            <div className="detail-label">용도</div>
            <input
              type="text"
              className="detail-text"
              name="usge"
              id="usge"
              value={bankDetails.usge}
              disabled={true}
            />
          </div>
          <div className="detail-row">
            <div className="detail-label">취급기관</div>
            <input
              type="text"
              className="detail-text"
              name="hdlInst"
              id="hdlInst"
              value={bankDetails.hdlInst}
              disabled={true}
            />
          </div>
          <div className="detail-row">
            <div className="detail-label">총대출기간(년)</div>
            <input
              type="text"
              className="detail-text"
              name="maxTotLnTrm"
              id="maxTotLnTrm"
              value={bankDetails.maxTotLnTrm}
              disabled={true}
            />
          </div>
          <div className="detail-row">
            <div className="detail-label">상환방법</div>
            <input
              type="text"
              className="detail-text"
              name="rdptMthd"
              id="rdptMthd"
              value={bankDetails.rdptMthd}
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

export default BankDetail;
