import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";


const QARegister = () => {
    const navigate = useNavigate();
  
  // Q&A 등록 폼 데이터 상태
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  // 각 입력 필드에 대한 오류 메시지를 저장하는 상태 변수
  const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
  

  // 중복 확인 상태
  const [isDuplicate, setIsDuplicate] = useState(false);

  // 각 입력 필드에 대한 ref 생성
  const refs = {
    title: useRef(null),
    content: useRef(null),
  };

  // 폼의 입력값 변경 시 호출되는 함수
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };




  // 폼 유효성 검사 함수
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) newErrors[key] = true;  // 오류 메시지 대신 true 값을 설정
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      refs[Object.keys(newErrors)[0]].current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleQAInsert = async (e) => {
    e.preventDefault();
    console.log(formData);
    const token = localStorage.getItem("jwt"); // JWT 토큰 가져오기

    if (!token) {
      setMessage("로그인이 필요합니다.");
      return;
    }

    try {
      // FormData 객체로 폼 데이터와 파일을 전송
      const formDataToSend = {
        title: formData.title,
        content: formData.content,
      };
 
      const response = await fetch("http://192.168.0.102:8080/api/question/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // JWT 토큰 포함
          "Content-Type": "application/json", // ✅ JSON 데이터 전송
        },
        body: JSON.stringify(formDataToSend), // ✅ JSON 문자열로 변환하여 전송
      });

      if (!response.ok) {
        throw new Error("등록에 실패했습니다.");
      }

      setMessage("성공적으로 등록되었습니다.");
      setFormData({
        title: "",
        content: "",
      });
      navigate("/QABoardList");
    } catch (error) {
      setErrors(error.message);
      console.error(" 등록 오류:", error);
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
        <h2>Q&A 등록</h2>
        <hr />
        <div className="register-box">
          {/* 제목 입력 */}
          <div className="register-row">
            <div className="register-label">제목</div>
            <input
              type="text"
              className="register-text"
              name="title"
              id="title"
              ref={refs.title}
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* 내용 입력 */}
          <div className="register-row content-row">
            <div className="register-label">내용</div>
            <textarea
              className="register-text large"
              name="content"
              id="content"
              ref={refs.content}
              value={formData.content}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 제출 버튼 */}
        <button className="register-submit" type="submit"
         onClick={handleQAInsert} >
          등록
        </button>
      </div>
    </div>
  );
};

export default QARegister;
