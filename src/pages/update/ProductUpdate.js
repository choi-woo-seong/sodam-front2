import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductUpdate = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  // 상품 데이터 상태
  const [formData, setFormData] = useState({
    p_title: "",
    p_price: "",
    p_contents: "",
    p_link: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const refs = {
    p_title: useRef(null),
    p_price: useRef(null),
    p_contents: useRef(null),
    p_link: useRef(null),
  };

  useEffect(() => {
    // 상품 정보 가져오기
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/productDetail/${id}`);
        if (!response.ok) throw new Error("상품 조회 실패");

        const data = await response.json();
        setFormData({
          p_title: data.p_title || "",
          p_price: data.p_price || "",
          p_contents: data.p_contents || "",
          p_link: data.p_link || "",
        });
      } catch (error) {
        console.error("상품 데이터 가져오기 실패:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  // 데이터 수정 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 수정 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    if (!formData.p_title) newErrors.p_title = "제목을 입력하세요.";
    if (!formData.p_price) newErrors.p_price = "가격을 입력하세요.";
    if (!formData.p_contents) newErrors.p_contents = "내용을 입력하세요.";
    if (!formData.p_link) newErrors.p_link = "링크를 입력하세요.";
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleProductUpdate = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const token = localStorage.getItem("jwt");
      try {
        const response = await fetch(`/api/products/productUpdate/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
          mode: "cors",
        });

        if (!response.ok) throw new Error("수정 실패");
        
        // 알림 메시지 표시
        alert("상품 수정이 완료되었습니다.");
        navigate(`/productDetail/${id}`); // 수정 후 상세 페이지로 이동
      } catch (error) {
        console.error("수정 중 오류 발생:", error);
        alert("수정 중 오류가 발생했습니다.");
      }
    } else {
      alert("빈칸을 확인해주세요.");
    }
  };

  const handleProductDelete = async () => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      const token = localStorage.getItem("jwt");

      try {
        const response = await fetch(`/api/products/productDelete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("삭제 실패");

        // 알림 메시지 표시
        alert("상품 삭제가 완료되었습니다.");
        navigate("/productBoardList"); 

      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <h2>상품 수정</h2>
        <hr />
        <div className="register-box">
          {/* 제목 입력 */}
          <div className="register-row">
            <div className="register-label">제목</div>
            <input
              type="text"
              className="register-text"
              name="p_title"
              id="p_title"
              ref={refs.p_title}
              value={formData.p_title}
              onChange={handleChange}
            />
          </div>

          {/* 금액 입력 */}
          <div className="register-row">
            <div className="register-label">금액</div>
            <input
              type="number"
              className="register-text"
              name="p_price"
              id="p_price"
              ref={refs.p_price}
              value={formData.p_price}
              onChange={handleChange}
            />
          </div>

          {/* 설명 입력 */}
          <div className="register-row content-row">
            <div className="register-label">내용</div>
            <textarea
              className="register-text large"
              name="p_contents"
              id="p_contents"
              ref={refs.p_contents}
              value={formData.p_contents}
              onChange={handleChange}
            />
          </div>

          {/* 링크 입력 */}
          <div className="register-row">
            <div className="register-label">링크</div>
            <input
              type="text"
              className="register-text"
              name="p_link"
              id="p_link"
              ref={refs.p_link}
              value={formData.p_link}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 수정 버튼 */}
        <button className="register-submit" type="button" onClick={handleProductUpdate}>
          수정
        </button>

        {/* 삭제 버튼 */}
        <button className="register-submit delete-btn" type="button" onClick={handleProductDelete}>
          삭제
        </button>

      </div>
    </div>
  );
};

export default ProductUpdate;
