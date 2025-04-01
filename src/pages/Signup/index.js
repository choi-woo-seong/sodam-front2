import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();

  // 일반회원 입력 상태
  const [formData, setFormData] = useState({
    n_userid: "",
    password: "",
    confirmPassword: "",
    name: "",
    address: "",
    email: "",
    phone1: "",
    phone2: "",
  });

  // 에러 메시지 상태
  const [errors, setErrors] = useState({});
  // 사업자 회원의 에러 상태 정의
  const [errors1, setErrors1] = useState({});
    // 오류 메시지 상태
  const [message, setMessage] = useState("");
  
  const [selectedTab, setSelectedTab] = useState("business");
  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const [cfCheckDuplicate, setcfCheckDuplicate] = useState(false);

   // 이메일 인증 관련 상태
   const [isEmailVerificationStarted, setIsEmailVerificationStarted] = useState(false);
   const [verificationCode, setVerificationCode] = useState(""); // 인증번호 상태
   const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(false); // 인증번호 유효 여부
   const [isVerificationAttempted, setIsVerificationAttempted] = useState(false);

  // 일반입력 필드 포커스 관리
  const refs = {
    n_userid: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
    name: useRef(null),
    address: useRef(null),
    email: useRef(null),
    phone1: useRef(null),
    phone2: useRef(null),
  };

  // 사업자 회원 입력 상태
  const [formData1, setFormData1] = useState({
    userid: "",
    password: "",
    confirmPassword: "",
    name: "",
    ownername: "", // 사업자명
    ownernum: "", // 사업자번호
    ownerloc: "",
    b_email: "",
    phone1: "",
    phone2: "",
  });

  // 사업자입력 필드 포커스 관리
  const refs1 = {
    userid: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
    name: useRef(null),
    ownername: useRef(null),
    ownernum: useRef(null),
    ownerloc: useRef(null),
    b_email: useRef(null),
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

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // ✅ 유선전화 (phone1): 10자리 또는 11자리 숫자
const validatePhone1 = (phoneNumber) => {
  const phoneRegex = /^[0-9]{9,11}$/; // 9~11자리 숫자
  return phoneRegex.test(phoneNumber);
};

  // 전화번호 유효성 검사 함수
const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[0-9]{11}$/; // 전화번호가 숫자만 11자리로 구성되어 있는지 확인
  return phoneRegex.test(phoneNumber);
};


  //  일반회원 이메일 인증 시작 함수
  const handleEmailCheck = () => {
    if(formData.email.length === 0 ){
      alert("이메일을 입력하지 않았습니다.");
      return;      
    }
    const payload = {
      email: formData.email,
    };
    console.log(payload);
    fetch(`${BASE_URL}/email/send-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("이메일 인증 중 오류 발생!");
      }else{
        setIsEmailVerificationStarted(true);
        alert("이메일 인증번호가 발송되었습니다."); // 실제 이메일 인증 코드 발송 부분은 서버와 연동해야 합니다.  
      }
    })
    .catch((error) => {
      console.error("이메일 인증 에러:", error);
      alert("이메일 인증 중 오류 발생. 관리자에게 문의하세요.");
    });
  };

    //  일반회원 이메일 인증 시작 함수
  const handleVerificationCodeConfirm = () => {
    setIsVerificationAttempted(true); // ✅ 인증 시도했다는 플래그 설정
    if(verificationCode.length === 0 ){
      alert("인증번호를 입력하지 않았습니다.");
      return;      
    }
    const payload = {
      email: formData.email,
      code: verificationCode,
    };
    console.log(payload);
    fetch(`${BASE_URL}/email/verify-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("이메일 인증 중 오류 발생!");
      }
      return response.json();
    })
    .then(result => {
      if(result.success){
        setIsVerificationCodeValid(result.success);
      }else{
        setIsVerificationCodeValid(result.success);
      }
    })
    .catch((error) => {
      console.error("이메일 인증 에러:", error);
      alert("이메일 인증 중 오류 발생. 관리자에게 문의하세요.");
    });

  };

  // 인증번호 입력 핸들러
  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

   //  사업자회원 이메일 인증 시작 함수
   const handleEmailCheck1 = () => {
    if(formData1.b_email.length === 0 ){
      alert("이메일을 입력하지 않았습니다.");
      return;      
    }
    const payload = {
      email: formData1.b_email,
    };
    console.log(payload);
    fetch(`${BASE_URL}/email/send-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("이메일 인증 중 오류 발생!");
      }else{
        setIsEmailVerificationStarted(true);
        alert("이메일 인증번호가 발송되었습니다."); // 실제 이메일 인증 코드 발송 부분은 서버와 연동해야 합니다.  
      }
    })
    .catch((error) => {
      console.error("이메일 인증 에러:", error);
      alert("이메일 인증 중 오류 발생. 관리자에게 문의하세요.");
    });
  };

    //  일반회원 이메일 인증 시작 함수
  const handleVerificationCodeConfirm1 = () => {
    setIsVerificationAttempted(true); // ✅ 인증 시도했다는 플래그 설정
    if(verificationCode.length === 0 ){
      alert("인증번호를 입력하지 않았습니다.");
      return;      
    }
    const payload = {
      email: formData1.b_email,
      code: verificationCode,
    };
    console.log(payload);
    fetch(`${BASE_URL}/email/verify-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("이메일 인증 중 오류 발생!");
      }
      return response.json();
    })
    .then(result => {
      if(result.success){
        setIsVerificationCodeValid(result.success);
      }else{
        setIsVerificationCodeValid(result.success);
      }
    })
    .catch((error) => {
      console.error("이메일 인증 에러:", error);
      alert("이메일 인증 중 오류 발생. 관리자에게 문의하세요.");
    });

  };

  // 인증번호 입력 핸들러
  const handleVerificationCodeChange1 = (e) => {
    setVerificationCode(e.target.value);
  };

 

// 폼 유효성 검사 (일반 회원)
const validateForm = () => {
  const newErrors = {};
  let hasError = false;

  // 빈칸 체크
  Object.keys(formData).forEach((key) => {
    if (!formData[key]) {
      newErrors[key] = "빈칸을 입력해주세요.";
      hasError = true;
    }
  });

  // 이메일 유효성 검사
  if (formData.email && !validateEmail(formData.email)) {
    newErrors.email = "유효한 이메일을 입력해주세요.";
    hasError = true;
  }

  // 비밀번호 일치 여부
  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    hasError = true;
  }

  // 전화번호 유효성 검사 (phone1)
  if (formData.phone1 && !validatePhone1(formData.phone1)) {
    newErrors.phone1 = "전화번호는 9 ~ 11자리 숫자만 입력 가능합니다.";
    hasError = true;
  }

  // 전화번호 유효성 검사 (phone2)
  if (formData.phone2 && !validatePhoneNumber(formData.phone2)) {
    newErrors.phone2 = "휴대전화는 11자리 숫자만 입력 가능합니다.";
    hasError = true;
  }

  setErrors(newErrors);

  if (hasError) {
    const firstErrorKey = Object.keys(newErrors)[0];
    if (refs[firstErrorKey] && refs[firstErrorKey].current) {
      alert(newErrors[firstErrorKey]);  // 오류 메시지 알림
      refs[firstErrorKey].current.focus();  // 첫 번째 오류 필드에 포커스
    }
  }

  return !hasError;
};



// 폼 유효성 검사 - 사업자 회원
const validateForm1 = () => {
  const newErrors1 = {};
  let hasError = false;

  // 이메일, 전화번호 제외하고 빈칸 체크
  Object.keys(formData1).forEach((key) => {
    if (["b_email", "phone1", "phone2"].includes(key)) return;
    if (!formData1[key]) {
      newErrors1[key] = "빈칸을 입력해주세요.";
      hasError = true;
    }
  });

  // 이메일 유효성 검사
  if (!formData1.b_email || !validateEmail(formData1.b_email)) {
    newErrors1.b_email = "유효한 이메일을 입력해주세요.";
    hasError = true;
  }

  // 전화번호 유효성 검사
  if (!formData1.phone1 || !validatePhone1(formData1.phone1)) {
    newErrors1.phone1 = "전화번호는 9 ~ 11자리 숫자만 입력 가능합니다.";
    hasError = true;
  }

  if (!formData1.phone2 || !validatePhoneNumber(formData1.phone2)) {
    newErrors1.phone2 = "휴대전화는 11자리 숫자만 입력 가능합니다.";
    hasError = true;
  }

  // 비밀번호 일치 여부
  if (formData1.password !== formData1.confirmPassword) {
    newErrors1.confirmPassword = "비밀번호가 일치하지 않습니다.";
    hasError = true;
  }

  
  setErrors1(newErrors1);

  if (hasError) {
    const firstErrorKey = Object.keys(newErrors1)[0];
    const firstErrorField = refs1[firstErrorKey];
    if (firstErrorField && firstErrorField.current) {
      alert(newErrors1[firstErrorKey]);
      firstErrorField.current.focus();
    }
  }

  return !hasError;
};

const handleNomalSingup = (e) => {
  e.preventDefault();

  if (cfCheckDuplicate === false) {
    alert("아이디 중복확인 해주세요");
    return;
  }

  if (isVerificationCodeValid === false) {
    alert("이메일 인증을 해주세요");
    return;
  }

  if (validateForm()) {  // 유효성 검사 추가
    const payload = {
      n_userid: formData.n_userid,
      password: formData.password,
      name: formData.name,
      address: formData.address,
      email: formData.email,
      phone1: formData.phone1,
      phone2: formData.phone2,
    };

    fetch(`${BASE_URL}/auth/register/nuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
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
  }
};



const handleSingup = (e) => {
  e.preventDefault();

  if (cfCheckDuplicate === false) {
    alert("아이디 중복확인 해주세요");
    return;
  }

  if (isVerificationCodeValid === false) {
    alert("이메일 인증을 해주세요");
    return;
  }

  if (validateForm1()) { // 유효성 검사 후, 오류가 없으면 회원가입 진행
    fetch(`${BASE_URL}/auth/register/buser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData1),
      mode: "cors",
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
  } else {
    alert("빈칸을 확인해주세요."); // 이 부분을 한 번만 출력하도록 합니다
  }
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
    if (!formData.n_userid.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }

    const url = `${BASE_URL}/api/users/check-duplicate?nUserid=${encodeURIComponent(formData.n_userid)}`;

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

    const url = `${BASE_URL}/api/users/check-duplicate2?userid=${encodeURIComponent(formData1.userid)}`;

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
            <input type="text" name="n_userid" ref={refs.n_userid} value={formData.n_userid} onChange={handleChange} />
            <button type="button" onClick={handleDuplicateCheck}>중복확인</button>
          </div>
          {isIdAvailable === false && <div className="error-msg">아이디가 이미 존재합니다.</div>}
          {isIdAvailable === true && <div className="success-msg">사용 가능한 아이디입니다.</div>}

          <div className="input-container">
            <label>비밀번호</label>
            <input type="password" name="password" ref={refs.password} value={formData.password} onChange={handleChange} />
          </div>

          <div className="input-container">
            <label>비밀번호 확인</label>
            <input type="password" name="confirmPassword" ref={refs.confirmPassword} value={formData.confirmPassword} onChange={handleChange} />
          </div>

          {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <div className="error-msg">비밀번호가 일치하지 않습니다.</div>
          )}

         {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
          <div className="success-msg">비밀번호가 일치합니다.</div>
          )}


          <div className="input-container">
            <label>이름</label>
            <input type="text" name="name" ref={refs.name} value={formData.name} onChange={handleChange} />
          </div>

          <div className="input-container">
            <label>주소</label>
            <input type="text" name="address" ref={refs.address} value={formData.address} onChange={handleChange} />
          </div>

          <div className="input-container">
          <label>이메일</label>
          <input
            type="email"
            name="email"
            ref={refs.email}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <button type="button" onClick={handleEmailCheck}>
            이메일 인증
          </button>
        </div>

        {/* 이메일 인증 번호 입력 필드가 나타나도록 */}
        {isEmailVerificationStarted && (
          <div className="input-container">
            <label>인증번호</label>
            <input
              type="text"
              value={verificationCode}
              onChange={handleVerificationCodeChange}
            />
            <button type="button" onClick={handleVerificationCodeConfirm}>
              확인
            </button>
          </div>
        )}

        {isVerificationCodeValid && <div className="success-msg">인증이 완료되었습니다.</div>}
        {isVerificationAttempted && !isVerificationCodeValid && (
          <div className="error-msg">인증번호가 틀렸습니다.</div>
        )}

        <div className="input-container">
  <label>전화번호</label>
  <input 
    type="text"  // 'number'에서 'text'로 변경하여 숫자 외의 입력을 방지
    name="phone1" 
    ref={refs.phone1} 
    value={formData.phone1} 
    onChange={(e) => {
      const value = e.target.value.replace(/[^0-9]/g, '');  // 숫자 외 문자는 제거
      if (value.length <= 11) {  // 최대 11자리 입력 제한
        setFormData({
          ...formData,
          phone1: value
        });
      }
    }} 
    className="no-spinner"
    inputMode="numeric"  // 모바일에서 숫자 키패드 표시
    maxLength="11"  // 최대 11자리 입력 가능
    minLength="11"  // 최소 11자리 입력 (필요한 경우)
    required
  />
</div>

<div className="input-container">
  <label>휴대전화</label>
  <input 
    type="text"  // 'number'에서 'text'로 변경
    name="phone2" 
    ref={refs.phone2} 
    value={formData.phone2} 
    onChange={(e) => {
      const value = e.target.value.replace(/[^0-9]/g, '');  // 숫자 외 문자는 제거
      if (value.length <= 11) {  // 최대 11자리 입력 제한
        setFormData({
          ...formData,
          phone2: value
        });
      }
    }} 
    className="no-spinner"
    inputMode="numeric"  // 모바일에서 숫자 키패드 표시
    maxLength="11"  // 최대 11자리 입력 가능
    minLength="11"  // 최소 11자리 입력 (필요한 경우)
    required
  />
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
            <label>이름</label>
            <input type="text" name="name" ref={refs1.name} value={formData1.name} onChange={handleChange1} />
          </div>

          <div className="input-container">
            <label>사업자명</label>
            <input type="text" name="ownername" ref={refs1.ownername} value={formData1.ownername} onChange={handleChange1} />
          </div>

          <div className="input-container">
            <label>사업자번호</label>
            <input type="number" name="ownernum" ref={refs1.ownernum} value={formData1.ownernum} onChange={handleChange1}
            className="no-spinner" 
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, ''); // 숫자 외 문자 제거
            }}/>
          </div>

          <div className="input-container">
            <label>사업장 주소</label>
            <input type="text" name="ownerloc" ref={refs1.ownerloc} value={formData1.ownerloc} onChange={handleChange1} />
          </div>

          <div className="input-container">
          <label>이메일</label>
          <input
            type="email"
            name="b_email"
            ref={refs1.b_email}
            value={formData1.b_email}
            onChange={(e) => setFormData1({ ...formData1, b_email: e.target.value })}
          />
          <button type="button" onClick={handleEmailCheck1}>
            이메일 인증
          </button>
        </div>

        {/* 이메일 인증 번호 입력 필드가 나타나도록 */}
        {isEmailVerificationStarted && (
          <div className="input-container">
            <label>인증번호</label>
            <input
              type="text"
              value={verificationCode}
              onChange={handleVerificationCodeChange1}
            />
            <button type="button" onClick={handleVerificationCodeConfirm1}>
              확인
            </button>
          </div>
        )}
        {isVerificationCodeValid && <div className="success-msg">인증이 완료되었습니다.</div>}
        {isVerificationAttempted && !isVerificationCodeValid && (
          <div className="error-msg">인증번호가 틀렸습니다.</div>
        )}

        <div className="input-container">
  <label>전화번호</label>
  <input 
    type="text"  // 'number'에서 'text'로 변경하여 숫자 외의 입력을 방지
    name="phone1" 
    ref={refs1.phone1} 
    value={formData1.phone1} 
    onChange={(e) => {
      const value = e.target.value.replace(/[^0-9]/g, '');  // 숫자 외 문자는 제거
      if (value.length <= 11) {  // 최대 11자리 입력 제한
        setFormData1({
          ...formData1,
          phone1: value
        });
      }
    }} 
    className="no-spinner"
    inputMode="numeric"  // 모바일에서 숫자 키패드 표시
    maxLength="11"  // 최대 11자리 입력 가능
    minLength="11"  // 최소 11자리 입력 (필요한 경우)
    required
  />
</div>

<div className="input-container">
  <label>휴대전화</label>
  <input 
    type="text"  // 'number'에서 'text'로 변경
    name="phone2" 
    ref={refs1.phone2} 
    value={formData1.phone2} 
    onChange={(e) => {
      const value = e.target.value.replace(/[^0-9]/g, '');  // 숫자 외 문자는 제거
      if (value.length <= 11) {  // 최대 11자리 입력 제한
        setFormData1({
          ...formData1,
          phone2: value
        });
      }
    }} 
    className="no-spinner"
    inputMode="numeric"  // 모바일에서 숫자 키패드 표시
    maxLength="11"  // 최대 11자리 입력 가능
    minLength="11"  // 최소 11자리 입력 (필요한 경우)
    required
  />
</div>


          <div className="submit-button-container">
            <button type="submit" className="submit" onClick={handleSingup}>회원가입</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Signup;
