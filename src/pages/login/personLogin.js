import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import "./login.css";

const PersonLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [Token, setToken] = useState("");
  const [UserName, setUserName] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");

  // 로그인 폼 상태
  const [formData, setFormData] = useState({
    n_userid: "",
    password: "",
  });

  // 입력값 핸들링
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const refs = {
    n_userid: useRef(null),
    password: useRef(null),
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://192.168.0.102:8080/auth/login/nuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 🔥 백엔드 DTO 맞춰서 snake_case 사용
        body: JSON.stringify({
          n_userid: formData.n_userid,
          password: formData.password,
        }),
        mode: "cors",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "로그인 실패");
      }

      const data = await response.json();

      // ✅ 로컬 스토리지에 저장
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userType", "nuser"); // 일반 사용자용

      setToken(data.token);
      setUserName(data.name);
      setErrorMessage("");
      navigate("/main");
    } catch (error) {
      console.error("로그인 오류:", error.message);
      alert("로그인 실패! 관리자에게 문의하세요.");
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
        <Link
          to="/businessLogin"
          className={`login-tab ${location.pathname === "/businessLogin" ? "active" : ""}`}
        >
          사업자 회원
        </Link>
        <Link
          to="/personLogin"
          className={`login-tab ${location.pathname === "/personLogin" ? "active" : ""}`}
        >
          일반 회원
        </Link>
      </div>

      <div className="login-form-container" onKeyDown={handleKeyDown}>
        <div className="login-input-container3">
          <input
            type="text"
            placeholder="아이디"
            className="login-input-box"
            name="n_userid"
            id="n_userid"
            ref={refs.n_userid}
            value={formData.n_userid}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="login-input-box"
            name="password"
            id="password"
            ref={refs.password}
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button className="login-login-button" onClick={handleLogin}>
          로그인
        </button>
      </div>

      <div className="login-divider-down"></div>
      <p className="login-register" onClick={() => navigate("/signup")}>
        회원가입
      </p>
    </div>
  );
};

export default PersonLogin;
