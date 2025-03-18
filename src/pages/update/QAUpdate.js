import React, { useState, useRef } from "react";

const QAUpdate = ({ qaId }) => {
  // Q&A 등록/수정 폼 데이터 상태
  const [formData, setFormData] = useState({
    a_title: "",
    a_content: "",
  });

  // 오류 메시지 상태
  const [errors, setErrors] = useState({});

  // 중복 확인 상태
  const [isDuplicate, setIsDuplicate] = useState(false);

  // 각 입력 필드에 대한 ref 생성
  const refs = {
    a_title: useRef(null),
    a_content: useRef(null),
  };

  // 입력값 변경 시 호출되는 함수
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 중복 확인 함수
  const handleDuplicateCheck = async () => {
    try {
      const response = await fetch(`http://192.168.0.102:8080/api/users/check-duplicate?userid=${formData.a_title}`);
      const data = await response.json();

      if (data.isDuplicate) {
        setIsDuplicate(true);
        alert("중복된 제목입니다. 다른 제목을 사용해주세요.");
      } else {
        setIsDuplicate(false);
      }
    } catch (error) {
      console.error("중복 확인 오류 발생:", error);
    }
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

  // Q&A 수정 함수
  const handleQAUpdate = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // 중복 확인 후 수정
      await handleDuplicateCheck();

      if (isDuplicate) {
        return; // 중복이 있을 경우 수정하지 않음
      }

      // PUT 요청으로 Q&A 수정
      fetch(`http://192.168.0.102:8080/api/qa/${qaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
        mode: "cors", // CORS 설정
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // 수정된 Q&A 데이터 확인
          alert("Q&A 수정이 완료되었습니다.");
        })
        .catch((error) => {
          console.error("수정 중 오류 발생:", error);
          alert("수정 중 오류가 발생했습니다.");
        });
    } else {
      alert("빈칸을 확인해주세요.");
    }
  };

  // Q&A 삭제 함수
  const handleQADelete = () => {
    if (window.confirm("정말로 이 Q&A를 삭제하시겠습니까?")) {
      fetch(`http://192.168.0.102:8080/api/qa/${qaId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors", // CORS 설정
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            alert("Q&A 삭제가 완료되었습니다.");
            // 삭제 후 페이지 이동 (예시: Q&A 목록으로 돌아가기)
            window.location.href = "/qa"; // 예시: Q&A 목록으로 돌아가기
          } else {
            alert(data.message);
          }
        })
        .catch((error) => {
          console.error("삭제 중 문제 발생:", error);
        });
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <h2>Q&A 수정</h2>
        <hr />
        <div className="register-box">
          {/* 제목 입력 */}
          <div className="register-row">
            <div className="register-label">제목</div>
            <input
              type="text"
              className="register-text"
              name="a_title"
              id="a_title"
              ref={refs.a_title}
              value={formData.a_title}
              onChange={handleChange}
            />
          </div>

          {/* 내용 입력 */}
          <div className="register-row content-row">
            <div className="register-label">내용</div>
            <textarea
              className="register-text large"
              name="a_content"
              id="a_content"
              ref={refs.a_content}
              value={formData.a_content}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 수정 버튼 */}
        <button className="register-submit" type="button" onClick={handleQAUpdate}>
          수정
        </button>

        {/* 삭제 버튼 */}
        <button className="register-submit delete-btn" type="button" onClick={handleQADelete}>
          삭제
        </button>
      </div>
    </div>
  );
};

export default QAUpdate;
