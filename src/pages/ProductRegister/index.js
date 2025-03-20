import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ProductRegister = () => {
  const navigate = useNavigate();
  // 상품 등록 폼 데이터 상태
  const [formData, setFormData] = useState({
    p_title: "",
    p_price: "",
    p_contents: "",
    p_link: "",
  });

  // 오류 메시지 상태
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // 각 입력 필드에 대한 ref 생성
  const refs = {
    p_title: useRef(null),
    p_price: useRef(null),
    p_contents: useRef(null),
    p_link: useRef(null),
  };

  // 금액 입력 시 쉼표 추가
  const formatPrice = (value) => {
    return value
      .replace(/[^0-9]/g, '') // 숫자가 아닌 모든 문자를 제거
      .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 3자리마다 쉼표 추가
  };

  // 폼 입력값 변경 시 호출되는 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    // 금액 입력 시 쉼표 추가
    if (name === "p_price") {
      const formattedPrice = formatPrice(value);
      setFormData({ ...formData, [name]: formattedPrice });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // // 파일 첨부 처리
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   setFormData({ ...formData });
  // };

  // 폼 유효성 검사 함수
  const validateForm = () => {
    const newErrors = {};

    // 제목 유효성 검사
    if (!formData.p_title) {
      newErrors.p_title = true;
    }

    // 금액 유효성 검사
    if (!formData.p_price) {
      newErrors.p_price = true;
    }

    // 설명 유효성 검사
    if (!formData.p_contents) {
      newErrors.p_contents = true;
    }

    // 링크 유효성 검사
    if (!formData.p_link) {
      newErrors.p_link = true;
    }

    setErrors(newErrors);

    // 첫 번째 오류가 발생한 입력 필드에 포커스를 설정
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      refs[firstErrorField].current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleProductInsert = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("jwt"); // JWT 토큰 가져오기
    if (!token) {
      setMessage("로그인이 필요합니다.");
      return;
    }
  
    try {
      const formDataToSend = {
        p_title: formData.p_title,
        p_price: formData.p_price.replace(/,/g, ""), // 쉼표 제거
        p_contents: formData.p_contents,
        p_link: formData.p_link,
      };
  
      const response = await fetch("http://192.168.0.102:8080/api/products/create", {
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
      setFormData({
        p_title: "",
        p_price: "",
        p_contents: "",
        p_link: "",
      });
  
      navigate("/productBoardList");
    } catch (error) {
      setErrors(error.message);
      console.error("상품 등록 오류:", error);
    }
  };
  

  // 폼 제출 시 호출되는 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("등록되었습니다.");
    } else {
      alert("빈칸을 확인해주세요.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <h2>상품 등록</h2>
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
              type="text"
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

          {/* 이미지 파일 첨부 */}
          <div className="register-row">
            <div className="register-label">사진 첨부</div>
            <input
              type="file"
              className="register-text"
              name="p_image"
              id="p_image"
              ref={refs.p_image}
              // onChange={handleFileChange}
            />
          </div>
        </div>

        {/* 제출 버튼 */}
        <button className="register-submit" type="button" onClick={handleProductInsert}>
          등록
        </button>
      </div>
    </div>
  );
};

export default ProductRegister;
