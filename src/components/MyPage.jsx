import React, { useState } from "react";
import "../styles/MyPage.css"; // 스타일 적용
import { useNavigate } from "react-router-dom"; 
import '@fortawesome/fontawesome-free/css/all.min.css';

function MyPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: "",
        password: "",
        confirmPassword: "",
        name: "",
        businessName: "",
        businessNumber: "",
        email: "",
        phone1: "",
        phone2: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const confirmUpdate = window.confirm("수정하시겠습니까?");
        if (confirmUpdate) {
            console.log("수정된 데이터:", formData);
        }
    };

    // 🚀 handleDelete 함수 추가 (탈퇴 버튼 동작)
    const handleDelete = () => {
        const confirmDelete = window.confirm("정말 탈퇴하시겠습니까?");
        if (confirmDelete) {
            console.log("회원 탈퇴 진행");
            // 여기서 실제 탈퇴 API 요청을 추가하면 됨
        }
    };

    return (
        <div className="mypage-container">
            <h2>마이페이지</h2>
            <div className="signup-link">
                <p className="list" onClick={() => navigate("/writeList")}>
                <i class="fa-solid fa-list-ul"></i>작성한 글 목록</p>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>아이디</label>
                    <input 
                        type="text" 
                        name="id" 
                        value={formData.id} 
                        onChange={handleChange} 
                        readOnly 
                    />
                </div>
                <div className="input-group">
                    <label>비밀번호 수정</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="input-group">
                    <label>비밀번호 확인</label>
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="input-group">
                    <label>이름</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        readOnly 
                    />
                </div>
                <div className="input-group">
                    <label>사업자 명</label>
                    <input 
                        type="text" 
                        name="businessName" 
                        value={formData.businessName} 
                        onChange={handleChange} 
                        readOnly 
                    />
                </div>
                <div className="input-group">
                    <label>사업자 번호</label>
                    <input 
                        type="text" 
                        name="businessNumber" 
                        value={formData.businessNumber} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="input-group">
                    <label>이메일 수정</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="input-group">
                    <label>연락처1 수정</label>
                    <input 
                        type="text" 
                        name="phone1" 
                        value={formData.phone1} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="input-group">
                    <label>연락처2 수정</label>
                    <input 
                        type="text" 
                        name="phone2" 
                        value={formData.phone2} 
                        onChange={handleChange} 
                    />
                </div>

                <div className="btn1">
                    <button type="button" className="submit-btn1" onClick={handleDelete}>탈퇴</button>
                    <button type="submit" className="submit-btn2">수정</button>
                </div>
            </form>
        </div>
    );
}

export default MyPage;
