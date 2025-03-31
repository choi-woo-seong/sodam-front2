import React, {useState, useEffect} from "react";
import "../styles/MyPage.css"; // 스타일 적용
import {useNavigate} from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import BusinessPasswordPopup from "./BusinessPasswordPopup";

function BusinessMyPage() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false); // 모달 상태 추가
    const [formData, setFormData] = useState({
        id: "",
        password: "",
        confirmPassword: "",
        name: "",
        ownername: "",
        ownernum: "",
        ownerloc: "",
        email: "",
        phone1: "",
        phone2: ""
    });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("jwt");
            if (!token) {
                setMessage("로그인이 필요합니다.");
                return;
            }

            const response = await fetch(
                "http://192.168.0.102:8080/api/users/business/info",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
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
    // 수정 폼 유효성 검사
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) 
            newErrors.name = "이름을 입력하세요.";
        if (!formData.ownername) 
            newErrors.ownername = "사업자 명을 입력하세요.";
        if (!formData.ownernum) 
            newErrors.ownernum = "사업자 번호을 입력하세요.";
        if (!formData.ownerloc) 
            newErrors.ownerloc = "사업자 주소을 입력하세요.";
        if (!formData.email) 
            newErrors.email = "이메일을 입력하세요.";
        if (!formData.phone1) 
            newErrors.phone1 = "연락처1을 입력하세요.";
        if (!formData.phone2) 
            newErrors.phone2 = "연락처2를 입력하세요.";
        setErrors(newErrors);

        return Object
            .keys(newErrors)
            .length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const token = localStorage.getItem("jwt");
            try {
                const response = await fetch(
                    `http://192.168.0.102:8080/api/users/business/update`,
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

                if (!response.ok) 
                    throw new Error("수정 실패");
                
                // 알림 메시지 표시
                alert("수정이 완료되었습니다.");
                navigate(""); // 수정 후 상세 페이지로 이동
            } catch (error) {
                console.error("수정 중 오류 발생:", error);
                alert("수정 중 오류가 발생했습니다.");
            }
        } else {
            alert("빈칸을 확인해주세요.");
        }
    };
    const setDelete = async (e) => {
        if (validateForm()) {
            const token = localStorage.getItem("jwt");
            try {
                const response = await fetch(
                    `http://192.168.0.102:8080/api/users/business/delete`,
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
                navigate("/businessLogin"); // 수정 후 상세 페이지로 이동
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
                <p className="list" onClick={() => navigate("/businessWriteList")}>
                    <i class="fa-solid fa-file-pen"></i>&nbsp;작성한 글 목록</p>
            </div>
            <hr/>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>아이디</label>
                    <input
                        type="text"
                        name="id"
                        value={formData.userid}
                        onChange={handleChange}
                        readOnly="readOnly"/>
                </div>

                <div className="input-group">
                    <label>이름</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        readOnly/>
                </div>
                <div className="input-group">
                    <label>사업자 명</label>
                    <input
                        type="text"
                        name="ownername"
                        value={formData.ownername}
                        onChange={handleChange}
                        readOnly/>
                </div>
                <div className="input-group">
                    <label>사업자 번호</label>
                    <input
                        type="text"
                        name="ownernum"
                        value={formData.ownernum}
                        onChange={handleChange}
                        readOnly/>
                </div>
                <div className="input-group">
                    <label>사업자주소 수정</label>
                    <input
                        type="text"
                        name="ownerloc"
                        value={formData.ownerloc}
                        onChange={handleChange}/>
                </div>

                <div className="input-group">
                    <label>이메일 수정</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}/>
                </div>
                <div className="input-group">
                    <label>연락처1 수정</label>
                    <input
                        type="text"
                        name="phone1"
                        value={formData.phone1}
                        onChange={handleChange}/>
                </div>
                <div className="input-group">
                    <label>연락처2 수정</label>
                    <input
                        type="text"
                        name="phone2"
                        value={formData.phone2}
                        onChange={handleChange}/>
                </div>
                
                <div className="btn1">
                    <button type="button" className="submit-btn1" onClick={handleDelete}>탈퇴</button>
                    <button type="submit" className="submit-btn2">수정</button>
                </div>
            </form>

            {/* 비밀번호 변경 모달 */}
            <BusinessPasswordPopup
                isOpen={isPasswordPopupOpen}
                closeModal={() => setIsPasswordPopupOpen(false)}
                onPasswordChange={handlePasswordChange}/>
        </div>
    );
}

export default BusinessMyPage;
