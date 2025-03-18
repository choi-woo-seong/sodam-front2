import React, { useState, useRef } from "react";

const CommunityRegister = () => {
  // 자유게시판 등록 폼 데이터 상태
  const [formData, setFormData] = useState({
    c_title: "",
    c_content: "",
  });

  // 각 입력 필드에 대한 ref 생성
  const refs = {
    c_title: useRef(null),
    c_content: useRef(null),
  };

  // 입력값 변경 시 호출되는 함수
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  // 폼 유효성 검사 함수
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) newErrors[key] = "입력하세요.";  // 오류 메시지
    });

    // 첫 번째 빈 필드에 포커스를 맞추기
    if (Object.keys(newErrors).length > 0) {
      refs[Object.keys(newErrors)[0]].current.focus();
    }
    
    return Object.keys(newErrors).length === 0;
  };

  

  // 폼 제출 시 호출되는 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // 모든 필드가 채워졌다면 등록 처리
      alert("등록되었습니다.");
      setFormData({
        c_title: "",
        c_content: "",
      });
    } else {
      // 빈칸이 있을 경우 얼럿 표시
      alert("빈칸을 확인해주세요.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <h2>자유게시판 등록</h2>
        <hr />
        <div className="register-box">
          {/* 제목 입력 */}
          <div className="register-row">
            <div className="register-label">제목</div>
            <input
              type="text"
              className="register-text"
              name="c_title"
              id="c_title"
              ref={refs.c_title}
              value={formData.c_title}
              onChange={handleChange}
            />
          </div>

          {/* 내용 입력 */}
          <div className="register-row content-row">
            <div className="register-label">내용</div>
            <textarea
              className="register-text large"
              name="c_content"
              id="c_content"
              ref={refs.c_content}
              value={formData.c_content}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 제출 버튼 */}
        <button 
          className="register-submit" 
          type="submit" 
          onClick={handleDuplicateCheck}
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default CommunityRegister;
