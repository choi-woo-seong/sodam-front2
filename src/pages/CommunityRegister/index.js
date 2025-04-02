import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CommunityRegister = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();

  // 자유게시판 등록 폼 데이터 상태
  const [formData, setFormData] = useState({
    c_title: "",
    c_content: "",
  });

  // 오류 메시지 상태
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // 각 입력 필드에 대한 ref 생성
  const refs = {
    c_title: useRef(null),
    c_content: useRef(null),
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

    // 유효성 검사
    if (!validateForm()) {
      alert("빈칸을 확인해주세요."); // 빈칸이 있을 경우 얼럿 메시지 표시
      return; // 유효성 검사 실패 시 더 이상 진행하지 않음
    }

    console.log(formData);
    const token = localStorage.getItem("jwt"); // JWT 토큰 가져오기

    if (!token) {
      setMessage("로그인이 필요합니다.");
      return;
    }

    try {
      const formDataToSend = {
        c_title: formData.c_title,
        c_content: formData.c_content,
      };

      const response = await fetch(`${BASE_URL}/api/community/create`, {
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
        c_content: "",
      });

      alert("등록되었습니다."); // 등록 성공 시 alert 표시
      navigate("/communityBoardList");

    } catch (error) {
      setErrors({ message: error.message }); // 오류 메시지를 상태에 설정
      console.error("상품 등록 오류:", error);

      // 등록 실패 시 바로 alert 표시
      alert("등록 실패: " + error.message); // 실패 시 alert 표시
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
            {errors.c_title && <span className="error">제목을 입력하세요.</span>}
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
            {errors.c_content && <span className="error">내용을 입력하세요.</span>}
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
