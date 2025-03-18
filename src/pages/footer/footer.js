import React from 'react';
import './footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <span><i className="fas fa-headset"></i>창업, 경영, 대출 상담</span>
        <span className="highlight-num">1357</span>
        <span><i className="fas fa-desktop"></i>시스템 오류 문의</span>
        <span className="highlight-num">1644 - 5302</span>
      </div>
      <div className="footer-info">
        <p>ⓒ 2025 SODAM365, All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default Footer;