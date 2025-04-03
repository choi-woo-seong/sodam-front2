import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const QAUpdate = () => {

  const { id } = useParams(); // URL에서 ID 가져오기
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt"); // JWT 토큰 가져오기

  // Q&A 데이터 상태
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [isUpdated, setIsUpdated] = useState(false); // 수정 성공 여부
  const [errors, setErrors] = useState({}); // 오류 메시지 상태

  // 입력 필드 참조
  const refs = {
    title: useRef(null),
    content: useRef(null),
  };

  // ✅ 기존 데이터 불러오기
  useEffect(() => {
    const fetchQAData = async () => {
      try {
        const response = await fetch(`/api/question/questionDetail/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Q&A 데이터를 가져오지 못했습니다.");

        const data = await response.json();
        setFormData({
          title: data.title || "",
          content: data.content || "",
        });
      } catch (error) {
        console.error("Q&A 데이터 가져오기 실패:", error);
      }
    };

    fetchQAData();
  }, [id, token]);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = true;
    if (!formData.content) newErrors.content = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      refs[Object.keys(newErrors)[0]].current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  // ✅ Q&A 수정 요청
  const handleQAUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("빈칸을 확인해주세요.");
      return;
    }

    try {
      const response = await fetch(`/api/question/update/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
        mode: "cors",
      });

      if (!response.ok) throw new Error("수정 실패");

      setIsUpdated(true);
      alert("Q&A 수정이 완료되었습니다.");
      navigate(`/qaDetail/${id}`);
    } catch (error) {
      console.error("수정 중 오류 발생:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  // ✅ Q&A 삭제 요청
  const handleQADelete = async () => {
    if (!window.confirm("정말로 이 Q&A를 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/question/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
      });

      if (!response.ok) throw new Error("삭제 실패");

      alert("Q&A 삭제가 완료되었습니다.");
      navigate("/QABoardList"); 
    } catch (error) {
      console.error("삭제 중 문제 발생:", error);
      alert("삭제 실패");
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
