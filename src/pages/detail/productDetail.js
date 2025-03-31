import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faUser } from "@fortawesome/free-solid-svg-icons"; // faUser 아이콘 추가
import "./detail.css";

function ProductDetail() {
  const navigate = useNavigate(); // 🔹 페이지 이동을 위한 useNavigate 사용
  const p_contents = "상품"; // 📌 실제 데이터와 연결 필요

  const { id } = useParams(); // URL에서 productId 파라미터 가져오기

  // 📌 찜 상태 (DB 연결 전에는 localStorage 사용)
  const [isBookmarked, setIsBookmarked] = useState(false);


  // 오류 메시지 상태
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // 📌 API에서 가져오는 상품 정보
  const [productDetails, setProductDetails] = useState({
    p_title: "상품 제목",
    p_price: "상품 금액",
    p_contents: "상품 설명",
    p_link: "http://상품링크.com",
    username: "작성자", // 작성자 추가
    createdAt: "작성일", // 작성일 추가
    p_image: null, // 상품 이미지 추가
  });

  // 📌 ID 중복 확인 상태
  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://192.168.0.102:8080/api/products/productDetail/${id}`); // 예시 API URL
      if (!response.ok) {
        throw new Error("상품 데이터 조회에 실패했습니다.");
      }

      const data = await response.json();

      if (data) {
        setProductDetails({
          p_title: data.p_title || "상품 제목",
          p_price: data.p_price || "상품 금액",
          p_contents: data.p_contents || "상품 설명",
          p_link: data.p_link || "http://상품링크.com",
          username: data.username || "작성자", // 작성자 데이터 추가
          createdAt: data.createdAt || "작성일", // 작성일 데이터 추가
          p_image: data.p_image || null, // 상품 이미지 추가
        });
      } else {
        console.error("빈 데이터 응답:", data);
      }
    } catch (error) {
      console.error("상품 데이터 가져오기 실패:", error);
    }
  };

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
        targetType: "PRODUCT",
        targetPgm:"productDetail",
      };

      const response = await fetch("http://192.168.0.102:8080/api/bookmark/check", {
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
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setIsBookmarked(savedBookmarks.includes(p_contents));

    // 상품 데이터 API 호출 
    fetchProductDetails();
    // 찜 데이터 API 호출 
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
          targetType: "PRODUCT",
        };

        console.log(formDataToSend)
    
        const response = await fetch("http://192.168.0.102:8080/api/bookmark/toggle", {
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
    navigate("/productBoardList"); // 🔹 "/noticelist" 페이지로 이동
  };

  return (
    <div className="detail-container">
      <div className="detail-content">
        <h2 className="detail-title">상품</h2>
        <hr />

        {/* 작성자 아이콘과 작성일 표시 */}
        <div className="detail-author-date">
          <span className="author">
            <FontAwesomeIcon icon={faUser} /> &nbsp;{/* 사람 아이콘 추가 */}
            {productDetails.username}&nbsp;
          </span>
          <span className="created-date">
            작성일: {new Date(productDetails.createdAt).toLocaleDateString()}
            </span>
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
              name="p_title"
              id="p_title"
              value={productDetails.p_title}
              disabled={true}
            />
          </div>
          <div className="detail-row">
            <div className="detail-label">금액</div>
            <input
              type="text"
              className="detail-text"
              name="p_price"
              id="p_price"
              value={productDetails.p_price}
              disabled={true}
            />
          </div>

          {/* 상품 이미지가 있을 경우 표시 */}
          {productDetails.p_image && (
            <div className="detail-row">
              <div className="detail-label">사진</div>
              <img
                src={productDetails.p_image} // 이미지 URL
                alt="상품 이미지"
                className="product-image"
              />
            </div>
          )}

          <div className="detail-row content-row">
            <div className="detail-label">내용</div>
            <textarea
              className="detail-text large"
              name="p_contents"
              id="p_contents"
              value={productDetails.p_contents}
              disabled={true}
            ></textarea>
          </div>
          <div className="detail-row">
            <div className="detail-label">링크</div>
            <input
              type="text"
              className="detail-text"
              name="p_link"
              id="p_link"
              value={productDetails.p_link}
              disabled={true}
            />
          </div>
        </div>

        <div className="map-link">
                <p className="map" onClick={() => navigate("/mapDetail")}>
                <i class="fa-solid fa-location-dot"></i>&nbsp;길 찾기</p>
            </div>

        <button className="detail-button" onClick={handleGoToList}>
          목록
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
