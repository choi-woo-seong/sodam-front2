import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  // 일반회원 입력 상태
  const [formData, setFormData] = useState({
    nUserid: "",
    nPassword: "",
    confirmPassword: "",
    nName: "",
    address: "",
    nEmail: "",
    nPhone1: "",
    nPhone2: "",
  });

  // 에러 메시지 상태
  const [errors, setErrors] = useState({});
  const [selectedTab, setSelectedTab] = useState("business");
  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const [cfCheckDuplicate, setcfCheckDuplicate] = useState(false);

  // 일반입력 필드 포커스 관리
  const refs = {
    nUserid: useRef(null),
    nPassword: useRef(null),
    confirmPassword: useRef(null),
    nName: useRef(null),
    address: useRef(null),
    nEmail: useRef(null),
    nPhone1: useRef(null),
    nPhone2: useRef(null),
  };

  // 사업자 회원 입력 상태
  const [formData1, setFormData1] = useState({
    userid: "",
    password: "",
    confirmPassword: "",
    name: "",
    ownerloc: "",
    email: "",
    ownername: "", // 사업자명
    ownernum: "", // 사업자번호
    phone1: "",
    phone2: "",
  });

  // 사업자입력 필드 포커스 관리
  const refs1 = {
    userid: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
    name: useRef(null),
    ownerloc: useRef(null),
    email: useRef(null),
    ownername: useRef(null),
    ownernum: useRef(null),
    phone1: useRef(null),
    phone2: useRef(null),
  };

  // 일반입력값 변경 핸들러
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 사업자 입력값 변경 핸들러
  const handleChange1 = (e) => {
    setFormData1({ ...formData1, [e.target.name]: e.target.value });
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) newErrors[key] = "입력하세요.";
    });

    if (formData.nPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      refs[Object.keys(newErrors)[0]].current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  // 일반 회원가입 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && isIdAvailable) {
      alert("회원가입 완료!");
    } else {
      alert("빈칸을 확인해주세요.");
    }
  };

  // 중복확인 함수 (일반 회원)
  const handleDuplicateCheck = () => {
    setcfCheckDuplicate(true);
    if (!formData.nUserid.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }

    const url = `http://192.168.0.102:8080/api/users/check-duplicate?nUserid=${encodeURIComponent(formData.nUserid)}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("서버 응답 오류: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log("중복 확인 응답:", data);

        if (data.isDuplicate) {
          setIsIdAvailable(false);
          alert("이미 사용 중인 아이디입니다.");
        } else {
          setIsIdAvailable(true);
          alert("사용 가능한 아이디입니다.");
        }
      })
      .catch((error) => {
        console.error("중복 확인 오류 발생:", error);
        alert("서버 요청 중 오류가 발생했습니다.");
      });
  };

  // 중복확인 함수 (사업자 회원)
  const handleDuplicateCheck2 = () => {
    setcfCheckDuplicate(true);
    if (!formData1.userid.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }

    const url = `http://192.168.0.102:8080/api/users/check-duplicate2?userid=${encodeURIComponent(formData1.userid)}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("서버 응답 오류: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log("중복 확인 응답:", data);

        if (data.isDuplicate) {
          setIsIdAvailable(false);
          alert("이미 사용 중인 아이디입니다.");
        } else {
          setIsIdAvailable(true);
          alert("사용 가능한 아이디입니다.");
        }
      })
      .catch((error) => {
        console.error("중복 확인 오류 발생:", error);
        alert("서버 요청 중 오류가 발생했습니다.");
      });
  };

  // 일반 회원가입 처리
  const handleNomalSingup = (e) => {
    e.preventDefault();
    console.log("회원가입 데이터:", formData);

    if (cfCheckDuplicate === false) {
      alert("아이디 중복확인 해주세요");
      return;
    }

    const payload = {
      n_userid: formData.nUserid,
      n_password: formData.nPassword,
      n_name: formData.nName,
      address: formData.address,
      n_email: formData.nEmail,
      n_phone1: formData.nPhone1,
      n_phone2: formData.nPhone2,
    };

    fetch("http://192.168.0.102:8080/auth/register/nuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload), // 올바른 payload로 전송
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("회원가입 실패");
        }
        return response.json();
      })
      .then((data) => {
        alert("회원가입 성공!");
        navigate("/personLogin");
      })
      .catch((error) => {
        console.error("회원가입 에러:", error);
        alert("회원가입 중 오류 발생. 관리자에게 문의하세요.");
      });
  };

  // 사업자 회원가입 처리
  const handleSingup = (e) => {
    e.preventDefault();
    console.log("회원가입 데이터:", formData1);

    if (cfCheckDuplicate === false) {
      alert("아이디 중복확인 해주세요");
    } else {
      fetch("http://192.168.0.102:8080/auth/register/buser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData1),
        mode: "cors", // CORS 요청을 명확히 설정
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            alert("회원가입 성공!");
            navigate("/businessLogin");
          } else {
            console.error("회원가입 실패", data.message);
          }
        })
        .catch((error) => {
          console.error("서버와 연결 중 오류 발생:", error);
        });
    }
  };

  useEffect(() => {
    document.body.classList.add("signup-page-body");

    return () => {
      document.body.classList.remove("signup-page-body");
    };
  }, []);

  return (
    <div className="signup-container">
      <h1 className="signup-title">
        소담<span className="signup-highlight">365</span>
      </h1>

      <div className="signup-divider"></div>

      <div className="signup-buttons">
        <button onClick={() => setSelectedTab("business")} className={selectedTab === "business" ? "active" : ""}>
          사업자 회원
        </button>
        <button onClick={() => setSelectedTab("general")} className={selectedTab === "general" ? "active" : ""}>
          일반 회원
        </button>
      </div>

      {selectedTab === "general" && (
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>아이디</label>
            <input type="text" name="nUserid" ref={refs.nUserid} value={formData.nUserid} onChange={handleChange} />
            <button type="button" onClick={handleDuplicateCheck}>중복확인</button>
          </div>
          {isIdAvailable === false && <div className="error-msg">아이디가 이미 존재합니다.</div>}
          {isIdAvailable === true && <div className="success-msg">사용 가능한 아이디입니다.</div>}

          <div className="input-container">
            <label>비밀번호</label>
            <input type="password" name="nPassword" ref={refs.nPassword} value={formData.nPassword} onChange={handleChange} />
          </div>

          <div className="input-container">
            <label>비밀번호 확인</label>
            <input type="password" name="confirmPassword" ref={refs.confirmPassword} value={formData.confirmPassword} onChange={handleChange} />
          </div>

          {formData.nPassword && formData.confirmPassword && formData.nPassword !== formData.confirmPassword && (
            <div className="error-msg">비밀번호가 일치하지 않습니다.</div>
          )}

          {formData.nPassword && formData.confirmPassword && formData.nPassword === formData.confirmPassword && (
            <div className="success-msg">비밀번호가 일치합니다.</div>
          )}

          <div className="input-container">
            <label>이름</label>
            <input type="text" name="nName" ref={refs.nName} value={formData.nName} onChange={handleChange} />
          </div>

          <div className="input-container">
            <label>주소</label>
            <input type="text" name="address" ref={refs.address} value={formData.address} onChange={handleChange} />
          </div>

          <div className="input-container">
            <label>이메일</label>
            <input type="email" name="nEmail" ref={refs.nEmail} value={formData.nEmail} onChange={handleChange} />
          </div>

          <div className="input-container">
            <label>전화번호</label>
            <input type="number" name="nPhone1" ref={refs.nPhone1} value={formData.nPhone1} onChange={handleChange} />
            <input type="number" name="nPhone2" ref={refs.nPhone2} value={formData.nPhone2} onChange={handleChange} />
          </div>

          <div className="submit-button-container">
            <button type="submit" className="submit" onClick={handleNomalSingup}>회원가입</button>
          </div>
        </form>
      )}

      {selectedTab === "business" && (
        <form onSubmit={handleSingup}>
          <div className="input-container">
            <label>아이디</label>
            <input type="text" name="userid" ref={refs1.userid} value={formData1.userid} onChange={handleChange1} />
            <button type="button" onClick={handleDuplicateCheck2}>중복확인</button>
          </div>
          {isIdAvailable === false && <div className="error-msg">아이디가 이미 존재합니다.</div>}
          {isIdAvailable === true && <div className="success-msg">사용 가능한 아이디입니다.</div>}

          <div className="input-container">
            <label>비밀번호</label>
            <input type="password" name="password" ref={refs1.password} value={formData1.password} onChange={handleChange1} />
          </div>

          <div className="input-container">
            <label>비밀번호 확인</label>
            <input type="password" name="confirmPassword" ref={refs1.confirmPassword} value={formData1.confirmPassword} onChange={handleChange1} />
          </div>

          {formData1.password && formData1.confirmPassword && formData1.password !== formData1.confirmPassword && (
            <div className="error-msg">비밀번호가 일치하지 않습니다.</div>
          )}

          {formData1.password && formData1.confirmPassword && formData1.password === formData1.confirmPassword && (
            <div className="success-msg">비밀번호가 일치합니다.</div>
          )}

          <div className="input-container">
            <label>사업자명</label>
            <input type="text" name="ownername" ref={refs1.ownername} value={formData1.ownername} onChange={handleChange1} />
          </div>

          <div className="input-container">
            <label>사업자번호</label>
            <input type="text" name="ownernum" ref={refs1.ownernum} value={formData1.ownernum} onChange={handleChange1} />
          </div>

          <div className="input-container">
            <label>사업장 주소</label>
            <input type="text" name="ownerloc" ref={refs1.ownerloc} value={formData1.ownerloc} onChange={handleChange1} />
          </div>

          <div className="input-container">
            <label>이메일</label>
            <input type="email" name="email" ref={refs1.email} value={formData1.email} onChange={handleChange1} />
          </div>

          <div className="input-container">
            <label>전화번호</label>
            <input type="number" name="phone1" ref={refs1.phone1} value={formData1.phone1} onChange={handleChange1} />
            <input type="number" name="phone2" ref={refs1.phone2} value={formData1.phone2} onChange={handleChange1} />
          </div>

          <div className="submit-button-container">
            <button type="submit" className="submit" onClick={handleNomalSingup}>회원가입</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Signup;
