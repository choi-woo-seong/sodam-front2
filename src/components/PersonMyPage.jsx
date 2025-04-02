import React, { useState, useEffect } from "react";
import "../styles/MyPage.css"; 
import { useNavigate } from "react-router-dom"; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import PersonPasswordPopup from "./PersonPasswordPopup"; // 새로 만든 모달 방식의 비밀번호 변경창 import

function PersonMyPage() {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false); // 모달 상태 추가
    const [formData, setFormData] = useState({
        n_userid: "",
        password: "",
        confirmPassword: "",
        name: "",
        email: "",
        phone1: "",
        phone2: "",
        address:""
    });
    

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("jwt");
            if (!token) {
                setMessage("로그인이 필요합니다.");
                return;
            }

            const response = await fetch(
                `${BASE_URL}/api/users/normal/info`, 
                {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

            if (!response.ok) {
                throw new Error("회원정보 조회에 실패했습니다.");
            }

            const result = await response.json();
            console.log(result);
            setFormData(result);
        } catch (error) {
            console.error("회원정보 조회 오류:", error.message);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ 
            ...formData,
             [e.target.name]: e.target.value 
            });
    };

    const validateForm = () => {
        const newErrors = {};
    
        if (!formData.name.trim()) newErrors.name = "이름을 입력하세요.";
    
        // 이메일 유효성 검사 추가 (정규 표현식 사용)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!formData.email.trim()) {
            newErrors.email = "이메일을 입력하세요.";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "올바른 이메일 형식이 아닙니다.";
        }
    
        if (!formData.address.trim()) newErrors.address = "주소를 입력하세요.";
        if (!formData.phone1.trim()) newErrors.phone1 = "연락처1을 입력하세요.";
        if (!formData.phone2.trim()) newErrors.phone2 = "연락처2를 입력하세요.";
    
        setErrors(newErrors);
    
        // 🚀 빈 칸이 있는 경우 해당 입력 필드로 포커스 이동
        if (Object.keys(newErrors).length > 0) {
            const firstErrorKey = Object.keys(newErrors)[0]; // 첫 번째 오류 필드 찾기
            const firstErrorField = document.querySelector(`[name="${firstErrorKey}"]`);
            if (firstErrorField) {
                firstErrorField.focus(); // 🚀 해당 입력 필드에 포커스 주기
            }
    
            alert(Object.values(newErrors).join("\n")); // 오류 메시지 표시
            return false;
        }
    
        return true;
    };
    
    
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // validateForm()에서 오류 메시지를 출력하므로 추가 alert 불필요
    
        const token = localStorage.getItem("jwt");
        try {
            const response = await fetch(
                `${BASE_URL}/api/users/normal/update`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                    mode: "cors"
                }
            );
    
            if (!response.ok) throw new Error("수정 실패");
    
            alert("수정이 완료되었습니다.");
            navigate(""); // 수정 후 상세 페이지로 이동
        } catch (error) {
            console.error("수정 중 오류 발생:", error);
            alert("수정 중 오류가 발생했습니다.");
        }
    };
    
    const setDelete = async (e) => {
        if (validateForm()) {
            const token = localStorage.getItem("jwt");
            try {
                const response = await fetch(
                    `${BASE_URL}/api/users/normal/delete`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (!response.ok) 
                    throw new Error("수정 실패");
                
                // 알림 메시지 표시
                alert("탈퇴가 완료되었습니다.");
                navigate("/personLogin"); // 수정 후 상세 페이지로 이동
            } catch (error) {
                console.error("탈퇴 중 오류 발생:", error);
                alert("탈퇴 중 오류가 발생했습니다.");
            }
        } else {
            alert("빈칸을 확인해주세요.");
        }
    };

     // 🚀 handleDelete 함수 추가 (탈퇴 버튼 동작)
    const handleDelete = () => {
        const confirmDelete = window.confirm("정말 탈퇴하시겠습니까?");
        if (confirmDelete) {
            setDelete();
        }
    };

    // 비밀번호 변경 모달 열기
    const openPasswordPopup = () => {
        setIsPasswordPopupOpen(true);
    };

    // 비밀번호 변경 후 상태 업데이트
    const handlePasswordChange = (newPassword) => {
        setFormData((prevData) => ({
            ...prevData,
            n_password: newPassword
        }));
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
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        readOnly 
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
                    <label>주소 수정</label>
                    <input 
                        type="text" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange} 
                    />
                </div>

                <div className="input-group">
                <label>전화번호 수정</label>
                <input
                    type="text"
                    name="phone1"
                    value={formData.phone1}
                    onChange={(e) => {
                        // 숫자만 입력할 수 있도록 필터링
                        const value = e.target.value.replace(/[^0-9]/g, '');  // 숫자만 남기기
                        if (value.length <= 11) {  // 11자 이상 입력되지 않도록 제한
                            setFormData({
                                ...formData,
                                phone1: value
                            });
                        }
                    }}
                    inputMode="numeric" // 숫자 전용 키패드 표시
                    maxLength="11" // 최대 길이 11자
                    minLength="11" // 최소 길이 11자
                    required
                />
            </div>
            <div className="input-group">
                <label>휴대전화 수정</label>
                <input
                    type="text"
                    name="phone2"
                    value={formData.phone2}
                    onChange={(e) => {
                        // 숫자만 입력할 수 있도록 필터링
                        const value = e.target.value.replace(/[^0-9]/g, '');  // 숫자만 남기기
                        if (value.length <= 11) {  // 11자 이상 입력되지 않도록 제한
                            setFormData({
                                ...formData,
                                phone2: value
                            });
                        }
                    }}
                    inputMode="numeric" // 숫자 전용 키패드 표시
                    maxLength="11" // 최대 길이 11자
                    minLength="11" // 최소 길이 11자
                    required
                />
            </div>


                <div className="btn1">
                    <button type="button" className="submit-btn1" onClick={handleDelete}>탈퇴</button>
                    <button type="submit" className="submit-btn2">수정</button>
                </div>
            </form>

            {/* 비밀번호 변경 모달 */}
            <PersonPasswordPopup
                isOpen={isPasswordPopupOpen}
                closeModal={() => setIsPasswordPopupOpen(false)}
                onPasswordChange={handlePasswordChange}
            />
        </div>
    );
}

export default PersonMyPage;
