import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const BusinessRegister = () => {
  const navigate = useNavigate();

  // 비즈니스 등록 폼 데이터 상태
  const [formData, setFormData] = useState({
    b_title: "",
    b_price: "",
    b_contents: "",
    b_link: "",
  });

  // 오류 메시지 상태
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // 입력 필드의 ref 생성
  const refs = {
    b_title: useRef(null),
    b_price: useRef(null),
    b_contents: useRef(null),
    b_link: useRef(null),
  };

  // 가격 입력 시 쉼표 추가
  const formatPrice = (value) => {
    return value
      .replace(/[^0-9]/g, '') // 숫자가 아닌 모든 문자를 제거
      .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 3자리마다 쉼표 추가
  };

  // 입력값 변경 시 호출되는 함수
  const handleChange = (e) => {
    let { name, value } = e.target;

    // 금액 입력 시 쉼표 추가
    if (name === "b_price") {
      value = formatPrice(value);
    }

    setFormData({ ...formData, [name]: value });
  };

  // 폼 제출 시 빈칸 확인 함수
  const validateForm = () => {
    let hasError = false;

    // 각 필드가 비어있는지 체크
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== "b_image") {  // 이미지 필드는 필수가 아니므로 제외
        hasError = true;
      }
    });

    // 빈칸이 있으면 얼럿을 띄우고 반환
    if (hasError) {
      alert("빈칸을 확인해주세요.");
      return true;  // 유효성 검사 실패
    }

    return false; // 유효성 검사 성공
  };

  // 비즈니스 등록 함수
  const handleBusinessInsert = (e) => {
    e.preventDefault();

    // 폼 유효성 검사
    if (validateForm()) {
      return; // 유효성 검사 실패 시 등록을 진행하지 않음
    }

    const token = localStorage.getItem("jwt"); // JWT 토큰 가져오기
    if (!token) {
      setErrors({ message: "로그인이 필요합니다." });
      return;
    }

    // 서버 요청 전에 오류 상태를 초기화
    setErrors({});
    setMessage("");

    const formDataToSend = {
      b_title: formData.b_title,
      b_price: formData.b_price.replace(/,/g, ""), // 쉼표 제거
      b_contents: formData.b_contents,
      b_link: formData.b_link,
    };

    console.log(formDataToSend);

    fetch("http://192.168.0.102:8080/api/biz/create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json", // ✅ JSON 데이터 전송
      },
      body: JSON.stringify(formDataToSend), // ✅ JSON 문자열로 변환하여 전송
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("등록에 실패했습니다.");
        }
        return response.json(); // 서버 응답을 JSON으로 반환
      })
      .then((data) => {
        // 서버에서 성공적인 응답을 받은 후 처리
        setMessage("성공적으로 등록되었습니다.");
        setFormData({
          b_title: "",
          b_price: "",
          b_contents: "",
          b_link: "",
        });

        // 성공 시 오류 메시지 초기화 후 등록 완료 알림 표시
        setErrors({});
        alert("등록되었습니다.");
        navigate("/businessBoardList");
      })
      .catch((error) => {
        // 오류가 발생하면 catch로 들어옵니다
        setErrors({ message: error.message }); // 오류 메시지를 상태에 설정
        console.error("비즈니스 등록 오류:", error);

        // 등록 실패 시 바로 알림 표시
        alert("등록 실패: " + error.message);
      });
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <h2>비즈니스 등록</h2>
        <hr />

        <div className="register-box">
          <div className="register-row">
            <div className="register-label">제목</div>
            <input 
              type="text" 
              className="register-text" 
              name="b_title" 
              id="b_title" 
              ref={refs.b_title} 
              value={formData.b_title} 
              onChange={handleChange} 
            />
          </div>
          <div className="register-row">
            <div className="register-label">금액</div>
            <input 
              type="text" 
              className="register-text" 
              name="b_price" 
              id="b_price" 
              ref={refs.b_price} 
              value={formData.b_price} 
              onChange={handleChange} 
            />
          </div>
          <div className="register-row content-row">
            <div className="register-label">내용</div>
            <textarea 
              className="register-text large" 
              name="b_contents" 
              id="b_contents" 
              ref={refs.b_contents} 
              value={formData.b_contents} 
              onChange={handleChange} 
            ></textarea>
          </div>
          <div className="register-row">
            <div className="register-label">링크</div>
            <input 
              type="text" 
              className="register-text" 
              name="b_link" 
              id="b_link" 
              ref={refs.b_link} 
              value={formData.b_link} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* 오류 메시지 표시 */}
        {errors.message && <div className="error-message">{errors.message}</div>}

        <button 
          className="register-submit" 
          onClick={handleBusinessInsert} 
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default BusinessRegister;
