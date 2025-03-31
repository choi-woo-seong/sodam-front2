import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./nav.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function Nav() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null); // 🔹 사용자 이름 상태

  // 🔹 컴포넌트 마운트 시 localStorage에서 사용자 정보 가져오기
  useEffect(() => {
    const storedUser = localStorage.getItem('userName'); // 🔥 JSON.parse() 전에 확인
    if (storedUser) {
      setUserName(storedUser); // 🔥 그대로 사용 (JSON이 아닌 일반 문자열)
    } else {
      console.warn("🚨 localStorage에서 사용자 이름이 없습니다.");
    }
  }, []);

  // 🔹 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('userName'); // 🔥 `userName` 키 삭제
    localStorage.removeItem("recentlyViewed"); // 🔹 최근 본 항목 삭제
    localStorage.removeItem('jwt');
    setUserName(null); // 상태 초기화

    alert("로그아웃되었습니다.");
    navigate('/businessLogin'); // 로그인 페이지로 이동
  };

  const handleProfileClick = () => {
    const userType = localStorage.getItem('userType'); // 🔥 userType 가져오기
    if (userType === 'buser') {
      navigate('/businessWriteList');
    } else {
      navigate('/personWriteList');
    }
  };

  const handleNameClick = () => {
    const userType = localStorage.getItem('userType'); // 🔥 userType 가져오기
    if (userType === 'buser') {
      navigate('/businessMypage');
    } else {
      navigate('/personMypage');
    }
  };

  // 🔹 네비게이션 처리 함수 (상품등록, 비즈니스 등록 접근 제한)
  const handleNavigation = (page) => {
    const userType = localStorage.getItem('userType'); // 🔥 userType 가져오기
    if (userType === 'nuser') {
      // 일반회원은 상품 등록과 비즈니스 등록에 접근할 수 없습니다
      if (page === '/productRegister' || page === '/businessRegister') {
        alert("일반회원은 이 페이지에 접근할 수 없습니다.");
        return;
      }
    }
    navigate(page); // 조건이 맞으면 이동
  };

  return (
    <nav className="navbar">
      <div className="nav-user">
        <span id="user-name" onClick={handleNameClick}>{userName}님</span>
        <span onClick={() => navigate('/bookMarkBoardList')}>찜</span>
        <span onClick={handleLogout}>로그아웃</span>
        <i className="fas fa-user-circle clickable" onClick={handleProfileClick}></i>
      </div>

      {/* 상단: 로고  */}
      <div className="nav-logo">
        <div className="title-logo">
          <span onClick={() => navigate('/main')}>소담</span>
          <span className="highlight" onClick={() => navigate('/main')}>365</span>
        </div>
        {/* 하단: 메뉴 바 (남색 배경) */}
        <div className="nav-menu">
          <div className="nav-item-container">
            <button className="nav-item" data-page="finance">지도</button>
            <div className="submenu">
              <button data-page="finance" onClick={() => navigate('/mapDetail')}>지도 보기</button>
            </div>
          </div>
          <div className="nav-item-container">
            <button className="nav-item" data-page="finance">금융</button>
            <div className="submenu">
              <button data-page="finance" onClick={() => navigate('/bankBoardList')}>금융 안내 보기</button>
            </div>
          </div>
          <div className="nav-item-container">
            <button className="nav-item" data-page="product">상품</button>
            <div className="submenu">
              <button data-page="product" onClick={() => handleNavigation('/productRegister')}>상품 등록</button>
              <button data-page="product" onClick={() => navigate('/productBoardList')}>상품 보기</button>
            </div>
          </div>
          <div className="nav-item-container">
            <button className="nav-item" data-page="business">비즈니스</button>
            <div className="submenu">
              <button data-page="business" onClick={() => handleNavigation('/businessRegister')}>비즈니스 등록</button>
              <button data-page="business" onClick={() => navigate('/businessBoardList')}>비즈니스 보기</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
