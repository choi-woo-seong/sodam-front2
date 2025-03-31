import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NoticeRegister = () => {
  const navigate = useNavigate();
  
  // 공지 등록 폼 데이터 상태
  const [formData, setFormData] = useState({
    n_title: "",
    n_content: "",
  });

  // 각 입력 필드에 대한 오류 메시지를 저장하는 상태 변수
  const [errors, setErrors] = useState({});

  // 각 입력 필드에 대한 ref 생성
  const refs = {
    n_title: useRef(null),
    n_content: useRef(null),
  };

  // 폼의 입력값 변경 시 호출되는 함수
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 폼 유효성 검사 함수
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) newErrors[key] = "입력하세요.";  // 오류 메시지
    });

    setErrors(newErrors);

    // 첫 번째 빈 필드에 포커스를 맞추기
    if (Object.keys(newErrors).length > 0) {
      refs[Object.keys(newErrors)[0]].current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleNoticeInsert = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!validateForm()) {
      alert("빈칸을 확인해주세요."); // 빈칸이 있을 경우 얼럿 메시지 표시
      return; // 유효성 검사 실패 시 더 이상 진행하지 않음
    }

    const token = localStorage.getItem("jwt"); // JWT 토큰 가져오기

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const formDataToSend = {
        n_title: formData.n_title,
        n_content: formData.n_content,
      };

      const response = await fetch("http://192.168.0.102:8080/api/notice/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json", // JWT 토큰 포함
        },
        body: JSON.stringify(formDataToSend), // ✅ JSON 문자열로 변환하여 전송
      });

      if (!response.ok) {
        throw new Error("등록에 실패했습니다.");
      }

      alert("등록되었습니다."); // 등록 성공 시 alert 표시
      setFormData({
        n_title: "",
        n_content: "",
      });
      navigate("/noticeBoardList");

    } catch (error) {
      console.error("공지 등록 오류:", error);
      alert("등록 실패: " + error.message); // 실패 시 alert 표시
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <h2>공지사항 등록</h2>
        <hr />
        <div className="register-box">
          {/* 제목 입력 */}
          <div className="register-row">
            <div className="register-label">제목</div>
            <input
              type="text"
              className="register-text"
              name="n_title"
              id="n_title"
              ref={refs.n_title}
              value={formData.n_title}
              onChange={handleChange}
            />
          </div>

          {/* 내용 입력 */}
          <div className="register-row content-row">
            <div className="register-label">내용</div>
            <textarea
              className="register-text large"
              name="n_content"
              id="n_content"
              ref={refs.n_content}
              value={formData.n_content}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 제출 버튼 */}
        <button className="register-submit" type="button" onClick={handleNoticeInsert}>
          등록
        </button>
      </div>
    </div>
  );
};

export default NoticeRegister;
