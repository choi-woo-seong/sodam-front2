import React from 'react';
import './footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="social-icons">
        <a href="#"><i className="fab fa-facebook-f"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
        <a href="#"><i className="fas fa-blog"></i></a>
      </div>
      <nav className="footer-menu">
        <a href="/mapDetail">MAP</a> <span>|</span>
        <a href="/bankBoardList">BANK</a> <span>|</span>
        <a href="/productBoardList">PRODUCT</a> <span>|</span>
        <a href="/businessBoardList">BUSINESS</a>
      </nav>
      <div className="footer-info">
        <p>상호 : (주)소담365</p>
        <p>사업자등록번호 : 000-00-00000 | 통신판매업신고번호 : 제0000-서울강남-0000호</p>
        <p>연락처 : 00-000-0000 | 팩스 : 000-0000-0000 | 이메일 : sodam365@gmail.com</p>
        <p>주소 : 서울특별시 서초구 강남대로 405 통영빌딩</p>
      </div>
      <div className="footer-bottom">
        <a href="#">이용약관</a> <span>|</span>
        <a href="#">개인정보처리방침</a>
        <p>Copyright ⓒ SODAM365</p>
      </div>
    </footer>
  );
}

export default Footer;
