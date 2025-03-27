import React, { useState, useEffect } from "react";
import "../styles/MyPage.css"; 
import { useNavigate } from "react-router-dom"; 
import '@fortawesome/fontawesome-free/css/all.min.css';

function PersonMyPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState("");
    const [message, setMessage] = useState("");

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("jwt");
            if (!token) {
                setMessage("로그인이 필요합니다.");
                return;
            }

            const response = await fetch("http://192.168.0.102:8080/api/users/normal/info", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("상품 조회에 실패했습니다.");
            }

            const result = await response.json();
            console.log(result);
            setFormData(result);

        } catch (error) {
            console.error("상품 조회 오류:", error.message);
        }
    };

    useEffect(() => {
        fetchData();
        
        // 팝업 창에서 비밀번호 변경 데이터를 받을 이벤트 리스너 등록
        window.addEventListener("message", receivePasswordData, false);

        return () => {
            window.removeEventListener("message", receivePasswordData, false);
        };
    }, []);

    // 자식 창에서 비밀번호 데이터를 받아오는 함수
    const receivePasswordData = (event) => {
        if (event.origin !== window.location.origin) return; // 보안 체크

        const { n_password } = event.data;
        if (n_password) {
            setFormData((prevData) => ({
                ...prevData,
                n_password: n_password
            }));
            alert("비밀번호가 변경되었습니다.");
        }
    };

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

    const handleDelete = () => {
        const confirmDelete = window.confirm("정말 탈퇴하시겠습니까?");
        if (confirmDelete) {
            console.log("회원 탈퇴 진행");
        }
    };

    // 비밀번호 변경 팝업 창 열기
    const openPasswordPopup = () => {
        window.open(
            "/password-popup",
            "비밀번호 변경",
            "width=400,height=300,left=500,top=200"
        );
    };

    return (
        <div className="mypage-container">
            <h2>마이페이지</h2>
            <div className="signup-link">
                <p className="list" onClick={() => navigate("/personWriteList")}>
                    <i className="fa-solid fa-file-pen"></i>&nbsp;작성한 글 목록
                </p>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>아이디</label>
                    <input 
                        type="text" 
                        name="n_userid" 
                        value={formData.n_userid} 
                        onChange={handleChange} 
                        readOnly 
                    />
                </div>

                <div className="input-group">
                    <label>이름</label>
                    <input 
                        type="text" 
                        name="n_name" 
                        value={formData.n_name} 
                        onChange={handleChange} 
                        readOnly 
                    />
                </div>

                <div className="input-group">
                    <label>이메일 수정</label>
                    <input 
                        type="email" 
                        name="n_email" 
                        value={formData.n_email} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="input-group">
                    <label>연락처1 수정</label>
                    <input 
                        type="text" 
                        name="n_phone1" 
                        value={formData.n_phone1} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="input-group">
                    <label>연락처2 수정</label>
                    <input 
                        type="text" 
                        name="n_phone2" 
                        value={formData.n_phone2} 
                        onChange={handleChange} 
                    />
                </div>

                <div className="input-group">
                    <button type="button" className="password-btn" onClick={openPasswordPopup}>
                        비밀번호 변경
                    </button>
                </div>

                <div className="btn1">
                    <button type="button" className="submit-btn1" onClick={handleDelete}>탈퇴</button>
                    <button type="submit" className="submit-btn2">수정</button>
                </div>
            </form>
        </div>
    );
    
}
const openPasswordPopup = () => {
    window.open(
        "/password-popup",
        "비밀번호 변경",
        "width=400,height=300,left=500,top=200"
    );
};


export default PersonMyPage;
