import React, { useState, useRef } from "react";

const CommunityUpdate = ({ communityId }) => {
  // 자유게시판 폼 데이터 상태
  const [formData, setFormData] = useState({
    c_title: "",
    c_content: "",
  });

  // 수정 성공 여부 상태
  const [isUpdated, setIsUpdated] = useState(false);

  // 오류 메시지 상태
  const [errors, setErrors] = useState({});

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
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  // 자유게시판 글 수정 함수
  const handleCommunityUpdate = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      fetch(`http://192.168.0.102:8080/api/community/${communityId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
        mode: "cors", // CORS 요청을 명확히 설정
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("수정 실패");
          }
        })
        .then((data) => {
          console.log(data);
          setIsUpdated(true);  // 수정 완료 상태 설정
          alert("자유게시판 글 수정이 완료되었습니다.");
        })
        .catch((error) => {
          console.error("수정 중 문제 발생:", error);
          alert("수정 중 오류가 발생했습니다.");
        });
    } else {
      alert("빈칸을 확인해주세요.");
    }
  };

  // 자유게시판 글 삭제 함수
  const handleCommunityDelete = () => {
    if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
      fetch(`http://192.168.0.102:8080/api/community/${communityId}`, {
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
            alert("자유게시판 글 삭제가 완료되었습니다.");
            // 삭제 후 페이지 이동 (예: 게시판 목록으로 돌아가기)
            window.location.href = "/community"; // 예시: 자유게시판 목록으로 돌아가기
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
        <h2>자유게시판 수정</h2>
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

        {/* 수정 버튼 */}
        <button className="register-submit" type="button" onClick={handleCommunityUpdate}>
          수정
        </button>

        {/* 삭제 버튼 */}
        <button className="register-submit delete-btn" type="button" onClick={handleCommunityDelete}>
          삭제
        </button>

        {/* 수정 완료 메시지 */}
        {isUpdated && <div className="update-success">자유게시판 글 수정이 완료되었습니다.</div>}
      </div>
    </div>
  );
};

export default CommunityUpdate;
