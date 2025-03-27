import React, { useState } from "react";

function PasswordPopup() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 유효성 검사
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("모든 필드를 입력해주세요.");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        // 부모 창에 비밀번호 변경 데이터 전달
        window.opener.postMessage({ n_password: newPassword }, window.location.origin);
        alert("비밀번호가 변경되었습니다.");
        window.close();
    };

    return (
        <div style={styles.popupContainer}>
            <h3 style={styles.title}>비밀번호 변경</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="현재 비밀번호"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="새 비밀번호"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="새 비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                />
                <div style={styles.buttonContainer}>
                    <button type="submit" style={styles.button}>변경</button>
                    <button type="button" onClick={() => window.close()} style={styles.button}>취소</button>
                </div>
            </form>
        </div>
    );
}

const styles = {
    popupContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        width: "100%",
        height: "100%",
    },
    title: {
        marginBottom: "15px",
    },
    input: {
        width: "90%",
        padding: "8px",
        margin: "5px 0",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    buttonContainer: {
        marginTop: "10px",
        display: "flex",
        gap: "10px",
    },
    button: {
        padding: "8px 12px",
        cursor: "pointer",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
    }
};

export default PasswordPopup;
