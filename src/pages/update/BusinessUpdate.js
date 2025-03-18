import React, { useState, useRef } from "react";


const BusinessUpdate = ({ businessId }) => {
  // 비즈니스 등록 폼 데이터 상태
  const [formData, setFormData] = useState({
    b_title: "",
    b_price: "",
    b_contents: "",
    b_link: "",
  });

  // 수정 성공 여부 상태
  const [isUpdated, setIsUpdated] = useState(false);

  // 오류 메시지 상태
  const [errors, setErrors] = useState({});

  // 각 입력 필드에 대한 ref 생성
  const refs = {
    b_title: useRef(null),
    b_price: useRef(null),
    b_contents: useRef(null),
    b_link: useRef(null),
  };

  // 폼 입력값 변경 시 호출되는 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 폼 유효성 검사 함수
  const validateForm = () => {
    const newErrors = {};

    // 제목 유효성 검사
    if (!formData.b_title) {
      newErrors.b_title = true;
    }

    // 금액 유효성 검사
    if (!formData.b_price) {
      newErrors.b_price = true;
    }

    // 설명 유효성 검사
    if (!formData.b_contents) {
      newErrors.b_contents = true;
    }

    // 링크 유효성 검사
    if (!formData.b_link) {
      newErrors.b_link = true;
    }

    setErrors(newErrors);

    // 첫 번째 오류가 발생한 입력 필드에 포커스를 설정
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      refs[firstErrorField].current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  // 비즈니스 수정 함수
  const handleBusinessUpdate = (e) => {
    e.preventDefault();
    if (validateForm()) {
      fetch(`http://192.168.0.102:8080/api/business/${businessId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
        mode: "cors", // CORS 요청을 명확히 설정
      })
        .then((response) => {
          // 응답 상태 코드 확인
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("수정 실패");
          }
        })
        .then((data) => {
          console.log(data); // 응답 내용 로그 출력
          setIsUpdated(true);  // 수정 완료 상태 설정
          alert("비즈니스 수정이 완료되었습니다.");
        })
        .catch((error) => {
          console.error("비즈니스 수정 중 문제 발생:", error);
          alert("비즈니스 수정 중 오류가 발생했습니다.");
        });
    } else {
      alert("빈칸을 확인해주세요.");
    }
  };

  // 비즈니스 삭제 함수
  const handleBusinessDelete = () => {
    if (window.confirm("정말로 이 비즈니스를 삭제하시겠습니까?")) {
      fetch(`http://192.168.0.102:8080/api/business/${businessId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors", // CORS 요청을 명확히 설정
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            alert("비즈니스 삭제가 완료되었습니다.");
            // 삭제 후 페이지 이동 (예: 비즈니스 목록으로 돌아가기)
            window.location.href = "/business"; // 예시: 비즈니스 목록으로 돌아가기
          } else {
            alert(data.message);
          }
        })
        .catch((error) => {
          console.error("비즈니스 삭제 중 문제 발생:", error);
        });
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <h2>비즈니스 수정</h2>
        <hr />
        <div className="register-box">
          {/* 제목 입력 */}
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

          {/* 금액 입력 */}
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

          {/* 설명 입력 */}
          <div className="register-row content-row">
            <div className="register-label">내용</div>
            <textarea
              className="register-text large"
              name="b_contents"
              id="b_contents"
              ref={refs.b_contents}
              value={formData.b_contents}
              onChange={handleChange}
            />
          </div>

          {/* 링크 입력 */}
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

        {/* 수정 버튼 */}
        <button className="register-submit" type="button" onClick={handleBusinessUpdate}>
          수정
        </button>

        {/* 삭제 버튼 */}
        <button className="register-submit delete-btn" type="button" onClick={handleBusinessDelete}>
          삭제
        </button>

        {/* 수정 완료 메시지 */}
        {isUpdated && <div className="update-success">비즈니스 수정이 완료되었습니다.</div>}
      </div>
    </div>
  );
};

export default BusinessUpdate;
