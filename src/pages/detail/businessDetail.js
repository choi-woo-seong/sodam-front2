import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faUser } from "@fortawesome/free-solid-svg-icons";
import "./detail.css";

function BusinessDetail() {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용
  const { id } = useParams(); // URL에서 productId 파라미터 가져오기

  const [businessDetails, setBusinessDetails] = useState({
    b_title: "비즈니스 제목",
    b_price: "100,000 원",
    b_contents: "비즈니스 상품 설명",
    b_link: "https://www.example.com",
    ownerloc: "지도",
    username: "작성자",
    createdDate: "작성일",
  });

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [message, setMessage] = useState("");

  // 비즈니스 데이터 가져오기
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const response = await fetch(`http://192.168.0.102:8080/api/biz/businessDetail/${id}`);
        if (!response.ok) {
          throw new Error("비즈니스 데이터 조회에 실패했습니다.");
        }

        const data = await response.json();
        if (data) {
          setBusinessDetails({
            b_title: data.b_title || "제목",
            b_price: data.b_price || "금액",
            b_contents: data.b_contents || "설명",
            b_link: data.b_link || "http://링크.com",
            ownerloc: data.ownerloc || "지도",
            username: data.username || "작성자",
            createdDate: data.createdDate || "작성일",
          });
        }
      } catch (error) {
        console.error("비즈니스 데이터 가져오기 실패:", error);
      }
    };

    fetchBusinessDetails();
  }, [id]);

  // 목록으로 돌아가기
  const handleGoToList = () => {
    navigate("/businessBoardList"); // "/businessBoardList" 페이지로 이동
  };

  // 길 찾기 버튼 클릭 시 mapDetail 페이지로 이동
  const handleGoToMap = () => {
    navigate("/mapDetail", { state: { address: businessDetails.ownerloc } });
  };

  return (
    <div className="detail-container">
      <div className="detail-content">
        <h2 className="detail-title">비즈니스</h2>
        <hr />

        {/* 작성자 아이콘과 작성일 표시 */}
        <div className="detail-author-date">
          <span className="author">
            <FontAwesomeIcon icon={faUser} /> &nbsp;
            {businessDetails.username}&nbsp;
          </span>
          <span className="created-date">
            작성일: {new Date(businessDetails.createdDate).toLocaleDateString()}
          </span>
        </div>

        <div className="detail-header">
          <FontAwesomeIcon
            icon={faBookmark}
            className={isBookmarked ? "active" : ""}
            // onClick={handleBookmarkClick} // 찜 버튼 클릭 핸들러 필요
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

          <div className="detail-row">
            <div className="detail-label">지도</div>
            <input
              type="text"
              className="detail-text"
              name="ownerloc"
              id="ownerloc"
              value={businessDetails.ownerloc}
              disabled={true}
            />
          </div>
        </div>

        <div className="map-link">
          <p className="mapbutton" onClick={handleGoToMap}>
            <i className="fa-solid fa-location-dot"></i>&nbsp;길 찾기
          </p>
        </div>

        <button className="detail-button" onClick={handleGoToList}>
          목록
        </button>
      </div>
    </div>
  );
}

export default BusinessDetail;
