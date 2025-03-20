import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";


const NoticeRegister = () => {
    const navigate = useNavigate();
  
  // 공지 등록 폼 데이터 상태
  const [formData, setFormData] = useState({
    n_title: "",
    n_contents: "",
  });

  // 각 입력 필드에 대한 오류 메시지를 저장하는 상태 변수
  const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
  

  // 중복 확인 상태
  const [isDuplicate, setIsDuplicate] = useState(false);

  // 각 입력 필드에 대한 ref 생성
  const refs = {
    n_title: useRef(null),
    n_contents: useRef(null),
  };
  

  // 폼의 입력값 변경 시 호출되는 함수
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

    setErrors(newErrors);

    // 첫 번째 빈 필드에 포커스를 맞추기
    if (Object.keys(newErrors).length > 0) {
      refs[Object.keys(newErrors)[0]].current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };
  const handleProductInsert = async (e) => {
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
      formDataToSend.append("n_title", formData.n_title);
      formDataToSend.append("n_contents", formData.n_contents);
    
      const response = await fetch("http://192.168.0.102:8080/api/products/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // JWT 토큰 포함
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("등록에 실패했습니다.");
      }

      setMessage("성공적으로 등록되었습니다.");
      setFormData({
        n_title: "",
        n_contents: "",
      });
      navigate("/noticeBoardList");
    } catch (error) {
      setErrors(error.message);
      console.error("상품 등록 오류:", error);
    }
  };

  // 폼 제출 시 호출되는 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // 중복 확인 후 폼 제출
      await handleDuplicateCheck();

      if (isDuplicate) {
        return; // 중복이 있을 경우 폼 제출을 막음
      }

      alert("등록 되었습니다.");
      setFormData({
        n_title: "",
        n_contents: "",
      });
    } else {
      alert("빈칸을 확인해주세요.");
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
            {errors.n_title && <span className="error">{errors.n_title}</span>}
          </div>

          {/* 내용 입력 */}
          <div className="register-row content-row">
            <div className="register-label">내용</div>
            <textarea
              className="register-text large"
              name="n_contents"
              id="n_contents"
              ref={refs.n_contents}
              value={formData.n_contents}
              onChange={handleChange}
            />
            {errors.n_contents && <span className="error">{errors.n_contents}</span>}
          </div>
        </div>

        {/* 제출 버튼 */}
        <button className="register-submit" type="submit"
         onClick={handleDuplicateCheck} >
          등록
        </button>
      </div>
    </div>
  );
};

export default NoticeRegister;
