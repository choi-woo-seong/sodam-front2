import React, { useState } from "react";
import Modal from "../components/modal.js";

function PasswordPopup() {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 비밀번호 변경 API 요청
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("모든 필드를 입력해주세요.");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const token = localStorage.getItem("jwt"); // 토큰 가져오기
            const response = await fetch(`${BASE_URL}/api/users/normal/password`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            

            if (response.ok) {
                alert("비밀번호가 성공적으로 변경되었습니다.");
                setIsModalOpen(false);
            } else {
                alert("비밀번호 변경에 실패했습니다.");
            }
        } catch (error) {
            console.error("비밀번호 변경 오류:", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            {/* 비밀번호 변경 버튼을 항상 표시 */}
            <button onClick={() => setIsModalOpen(true)} className="modal-password-btn4">비밀번호 변경</button>

            {isModalOpen && (
                <Modal closeModal={() => setIsModalOpen(false)}>
                    <h3 className="popup-title">비밀번호 변경</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            placeholder="현재 비밀번호"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="popup-input"
                        />
                        <input
                            type="password"
                            placeholder="새 비밀번호"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="popup-input"
                        />
                        <input
                            type="password"
                            placeholder="새 비밀번호 확인"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="popup-input"
                        />
                        <div className="popup-button-container">
                            <button type="submit" className="popup-button submit1">변경</button>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="popup-button cancel1">취소</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}

export default PasswordPopup;
