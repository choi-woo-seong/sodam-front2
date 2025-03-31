import React from "react";
import "../styles/modal.css";

function Modal(props) {
  // 모달 닫기
  const closeModal = (e) => {
    e.stopPropagation(); // 이걸 추가하여 모달 안의 버튼 클릭 시 외부 모달 닫기 동작을 막음
    props.closeModal();
  };

  return (
    <div className="Modal" >
      {/* 모달 바디 클릭 시 이벤트 전파 막기 */}
      <div className="modalBody" onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼 클릭 시 모달 닫기 */}
        <button id="modalCloseBtn" onClick={closeModal}>✖</button>
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
