import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BusinessUpdate = () => {

  const { id } = useParams(); // URL에서 ID 가져오기
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt"); // JWT 토큰 가져오기

  // 비즈니스 데이터 상태
  const [formData, setFormData] = useState({
    b_title: "",
    b_price: "",
    b_contents: "",
    b_link: "",
  });

  const [isUpdated, setIsUpdated] = useState(false); // 수정 성공 여부
  const [errors, setErrors] = useState({}); // 오류 메시지 상태

  // 입력 필드 참조
  const refs = {
    b_title: useRef(null),
    b_price: useRef(null),
    b_contents: useRef(null),
    b_link: useRef(null),
  };

  // ✅ 기존 데이터 불러오기
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const response = await fetch(`/api/biz/businessDetail/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("비즈니스 데이터를 가져오지 못했습니다.");

        const data = await response.json();
        setFormData({
          b_title: data.b_title || "",
          b_price: data.b_price || "",
          b_contents: data.b_contents || "",
          b_link: data.b_link || "",
        });
      } catch (error) {
        console.error("비즈니스 데이터 가져오기 실패:", error);
      }
    };

    fetchBusinessDetails();
  }, [id, token]);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    if (!formData.b_title) newErrors.b_title = true;
    if (!formData.b_price) newErrors.b_price = true;
    if (!formData.b_contents) newErrors.b_contents = true;
    if (!formData.b_link) newErrors.b_link = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      refs[Object.keys(newErrors)[0]].current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  // ✅ 비즈니스 수정 요청
  const handleBusinessUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("빈칸을 확인해주세요.");
      return;
    }

    try {
      const response = await fetch(`/api/biz/update/${id}`, {
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
      alert("비즈니스 수정이 완료되었습니다.");
      navigate(`/businessDetail/${id}`); // 수정 완료 후 상세 페이지로 이동
    } catch (error) {
      console.error("비즈니스 수정 중 문제 발생:", error);
      alert("비즈니스 수정 중 오류가 발생했습니다.");
    }
  };

  // ✅ 비즈니스 삭제 요청
  const handleBusinessDelete = async () => {
    if (!window.confirm("정말로 이 비즈니스를 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/biz/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
      });

      if (!response.ok) throw new Error("삭제 실패");

      alert("비즈니스 삭제가 완료되었습니다.");

      navigate("/businessBoardList"); // 수정 완료 후 상세 페이지로 이동
    } catch (error) {
      console.error("비즈니스 삭제 중 문제 발생:", error);
      alert("삭제 실패");
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
      </div>
    </div>
  );
};

export default BusinessUpdate;
