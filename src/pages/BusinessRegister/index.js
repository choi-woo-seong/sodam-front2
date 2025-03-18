import React, { useState, useRef } from "react";
import "./Register.css"; 

const BusinessRegister = () => {
  // 비즈니스 등록 폼 데이터 상태
  const [formData, setFormData] = useState({
    b_title: "",
    b_price: "",
    b_contents: "",
    b_link: "",
  });

  // 입력 필드의 ref 생성
  const refs = {
    b_title: useRef(null),
    b_price: useRef(null),
    b_contents: useRef(null),
    b_link: useRef(null),
  };

  // 중복확인 함수
  const handleDuplicateCheck = () => {
    fetch(`http://192.168.0.102:8080/api/users/check-duplicate?userid=${formData.userid}`)
        .then(response => response.json())
        .then(data => {
           
        })
        .catch(error => {
            console.error("중복 확인 오류 발생:", error);
        });
};

  // 입력값 변경 시 호출되는 함수
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 폼 제출 시 빈칸 확인 함수
  const handleSubmit = () => {
    let hasError = false;

    // 각 필드가 비어있는지 체크
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        if (!hasError) {
          // 첫 번째 빈 필드에 포커스를 맞추기
          refs[key].current.focus();
          hasError = true;
        }
      }
    });

    

    // 빈칸이 있을 경우 얼럿 표시
    if (hasError) {
      alert("빈 칸을 확인해주세요.");
    } else {
      // 모든 필드가 채워졌으면 제출 처리
      alert("등록되었습니다.");
      // 폼 초기화 (예시)
      setFormData({
        b_title: "",
        b_price: "",
        b_contents: "",
        b_link: "",
      });
    }
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
              type="number" 
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

        <button 
          className="register-submit" 
          onClick={handleDuplicateCheck} 
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default BusinessRegister;
