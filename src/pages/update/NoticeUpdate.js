import React, { useState, useRef } from "react";

const NoticeUpdate = ({ noticeId }) => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // 공지 등록 폼 데이터 상태
  const [formData, setFormData] = useState({
    n_title: "",
    n_content: "",
  });

  // 수정 성공 여부 상태
  const [isUpdated, setIsUpdated] = useState(false);

  // 오류 메시지 상태
  const [errors, setErrors] = useState({});

  // 중복 확인 상태
  const [isDuplicate, setIsDuplicate] = useState(false);

  // 각 입력 필드에 대한 ref 생성
  const refs = {
    n_title: useRef(null),
    n_content: useRef(null),
  };

  // 입력값 변경 시 호출되는 함수
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 중복 확인 함수
  const handleDuplicateCheck = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/notice/check-duplicate?title=${formData.n_title}`);
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

  // 공지 수정 함수
  const handleNoticeUpdate = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // 중복 확인 후 수정
      await handleDuplicateCheck();

      if (isDuplicate) {
        return; // 중복이 있을 경우 폼 제출을 막음
      }

      // PUT 요청으로 공지 수정
      fetch(`${BASE_URL}/api/notice/${noticeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
        mode: "cors", // CORS 요청을 명확히 설정
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // 수정된 공지 데이터 확인
          setIsUpdated(true);
          alert("공지 수정이 완료되었습니다.");
        })
        .catch((error) => {
          console.error("수정 중 오류 발생:", error);
          alert("수정 중 오류가 발생했습니다.");
        });
    } else {
      alert("빈칸을 확인해주세요.");
    }
  };

  // 공지 삭제 함수
  const handleNoticeDelete = () => {
    if (window.confirm("정말로 이 공지를 삭제하시겠습니까?")) {
      fetch(`${BASE_URL}/api/notice/${noticeId}`, {
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
            alert("공지 삭제가 완료되었습니다.");
            // 삭제 후 페이지 이동 (예: 공지 목록으로 돌아가기)
            window.location.href = "/notices"; // 예시: 공지 목록으로 돌아가기
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
        <h2>공지 수정</h2>
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

        {/* 수정 버튼 */}
        <button className="register-submit" type="button" onClick={handleNoticeUpdate}>
          수정
        </button>

        {/* 삭제 버튼 */}
        <button className="register-submit delete-btn" type="button" onClick={handleNoticeDelete}>
          삭제
        </button>

        {/* 수정 완료 메시지 */}
        {isUpdated && <div className="update-success">공지 수정이 완료되었습니다.</div>}
      </div>
    </div>
  );
};

export default NoticeUpdate;
