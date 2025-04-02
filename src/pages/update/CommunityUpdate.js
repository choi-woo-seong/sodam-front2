import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CommunityUpdate = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [formData, setFormData] = useState({
    c_title: "",
    c_content: "",
  });
  
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isUpdated, setIsUpdated] = useState(false);
  const [errors, setErrors] = useState({});

  const refs = {
    c_title: useRef(null),
    c_content: useRef(null),
  };

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/community/communityDetail/${id}`);
        if (!response.ok) throw new Error("게시글 조회 실패");

        const data = await response.json();
        setFormData({
          c_title: data.c_title,
          c_content: data.c_content,
        });
      } catch (error) {
        console.error("게시글 가져오기 실패:", error);
      }
    };

    fetchCommunityDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) newErrors[key] = "입력하세요.";
    });

    if (Object.keys(newErrors).length > 0) {
      refs[Object.keys(newErrors)[0]].current.focus();
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCommunityUpdate = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const token = localStorage.getItem("jwt");
      fetch(`${BASE_URL}/api/community/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) throw new Error("수정 실패");
          return response.json();
        })
        .then(() => {
          setIsUpdated(true);
          alert("자유게시판 글 수정이 완료되었습니다.");
          navigate(`/communityDetail/${id}`); // 수정 후 상세 페이지로 이동
        })
        .catch((error) => {
          console.error("수정 중 문제 발생:", error);
          alert("수정 중 오류가 발생했습니다.");
        });
    } else {
      alert("빈칸을 확인해주세요.");
    }
  };

  const handleCommunityDelete = () => {
    if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
      const token = localStorage.getItem("jwt");
      fetch(`${BASE_URL}/api/community/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) throw new Error("삭제 실패");
          alert("자유게시판 글 삭제가 완료되었습니다.");
          navigate("/communityBoardList"); 

        })
        .catch((error) => {
          console.error("삭제 중 문제 발생:", error);
          alert("삭제 중 오류가 발생했습니다.");
        });
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <h2>자유게시판 수정</h2>
        <hr />
        <div className="register-box">
          <div className="register-row">
            <div className="register-label">제목</div>
            <input
              type="text"
              className="register-text"
              name="c_title"
              ref={refs.c_title}
              value={formData.c_title}
              onChange={handleChange}
            />
          </div>

          <div className="register-row content-row">
            <div className="register-label">내용</div>
            <textarea
              className="register-text large"
              name="c_content"
              ref={refs.c_content}
              value={formData.c_content}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="register-submit" onClick={handleCommunityUpdate}>
          수정
        </button>

        <button className="register-submit delete-btn" onClick={handleCommunityDelete}>
          삭제
        </button>

      </div>
    </div>
  );
};

export default CommunityUpdate;
