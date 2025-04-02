import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  // localStorage에서 JWT 토큰을 확인 (로그인 상태를 체크)
  const token = localStorage.getItem("jwt"); // 예시로 "jwt"라는 이름으로 저장된 토큰을 사용
  
  if (!token) {
    // 로그인 상태가 아니라면 로그인 페이지로 리디렉션
    return <Navigate to="/businessLogin" />;
  }

  return element; // 로그인 상태이면 요청한 페이지를 반환
};

export default PrivateRoute;
