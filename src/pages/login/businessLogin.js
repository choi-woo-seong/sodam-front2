import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useRef } from "react";
import { useEffect } from 'react';
import "./login.css";

const BusinessLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [Token, setToken] = useState("");
  const [UserName, setUserName] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");

  // 일반폼 입력 상태
  const [formData, setFormData] = useState({
    userid: "",
    password: "",
    ownernum: "",
  });

  // 일반입력값 변경 핸들러
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const refs = {
    userid: useRef(null),
    password: useRef(null),
    ownernum: useRef(null),
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://192.168.0.102:8080/auth/login/buser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            mode: 'cors', 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "로그인 실패");
        }

        const data = await response.json();
        localStorage.setItem("jwt", data.token); // 🔥 JWT 저장
        localStorage.setItem("userName", data.name); // 🔥 사용자 이름 저장
        localStorage.setItem("userType", "buser"); // 🔥 userType 저장

        setToken(data.token);
        setUserName(data.name);
        setErrorMessage("");
        navigate("/main")

    } catch (error) {
        console.error("로그인 오류:", error.message);
        alert("로그인 실패!! 관리자에게 문의바랍니다.");
        setErrorMessage(error.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  useEffect(() => {
    document.body.classList.add("login-page-body");

    // 컴포넌트가 언마운트될 때 body 클래스 제거
    return () => {
      document.body.classList.remove("login-page-body");
    };
  }, []);
  
  return (
    <div className="login-container">
      <h1 className="login-title">
        소담<span className="login-highlight">365</span>
      </h1>

      <div className="login-divider-up"></div>

      <div className="login-tab-container">
        <Link to="/businessLogin" className={`login-tab ${location.pathname === "/businessLogin" ? "active" : ""}`}>
          사업자 회원
        </Link>
        <Link to="/personLogin" className={`login-tab ${location.pathname === "/personLogin" ? "active" : ""}`}>
          일반 회원
        </Link>
      </div>

      <div className="login-form-container" onKeyDown={handleKeyDown}>
        <div className="login-input-container3">
          <input type="text" placeholder="아이디" className="login-input-box" name="userid" id="userid" ref={refs.userid} value={formData.userid} onChange={handleChange} />
          <input type="password" placeholder="비밀번호" className="login-input-box" name="password" id="password" ref={refs.password} value={formData.password} onChange={handleChange}  />
          <input type="number" placeholder="사업자 번호" className="login-input-box"  name="ownernum" id="ownernum" ref={refs.ownernum} value={formData.ownernum} onChange={handleChange} />
        </div>
        <button className="login-login-button" onClick={handleLogin}>로그인</button>
      </div>
      <div className="login-divider-down"></div>

      <p className="login-register" onClick={() => navigate("/signup")}>회원가입</p>
    </div>
  );
};

export default BusinessLogin;
