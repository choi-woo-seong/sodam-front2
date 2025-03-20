import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";


const CommunityRegister = () => {
    const navigate = useNavigate();
  
  // 자유게시판 등록 폼 데이터 상태
  const [formData, setFormData] = useState({
    c_title: "",
    c_contents: "",
  });

  // 오류 메시지 상태
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // 각 입력 필드에 대한 ref 생성
  const refs = {
    c_title: useRef(null),
    c_contents: useRef(null),
  };


  // 입력값 변경 시 호출되는 함수
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleCommunityInsert = async (e) => {
    e.preventDefault();
    console.log(formData);
    const token = localStorage.getItem("jwt"); // JWT 토큰 가져오기

    if (!token) {
      setMessage("로그인이 필요합니다.");
      return;
    }

    try {
      // FormData 객체로 폼 데이터와 파일을 전송
      const formDataToSend = new FormData();
      formDataToSend.append("c_title", formData.c_title);
      formDataToSend.append("c_contents", formData.c_contents);
  
      const response = await fetch("http://192.168.0.102:8080/api/community/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json", // ✅ JSON 데이터 전송
        },
        body: JSON.stringify(formDataToSend),
      });

      if (!response.ok) {
        throw new Error("등록에 실패했습니다.");
      }

      setMessage("성공적으로 등록되었습니다.");
      setFormData({
        c_title: "",
        c_contents: "",
      });
      navigate("/communityBoardList");
    } catch (error) {
      setErrors(error.message);
      console.error("상품 등록 오류:", error);
    }
  };

  // 폼 제출 시 호출되는 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // 모든 필드가 채워졌다면 등록 처리
      alert("등록되었습니다.");
      setFormData({
        c_title: "",
        c_contents: "",
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
              name="c_contents"
              id="c_contents"
              ref={refs.c_contents}
              value={formData.c_contents}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 제출 버튼 */}
        <button 
          className="register-submit" 
          onClick={handleCommunityInsert}
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default CommunityRegister;
