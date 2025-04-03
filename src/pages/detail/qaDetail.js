import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faUser, faPen, faTrash } from "@fortawesome/free-solid-svg-icons"; // 수정 및 삭제 아이콘 추가
import "./detail.css";

function QADetail() {

  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 productId 파라미터 가져오기
  const [a_comments, setComments] = useState([]);  // 댓글 목록
  const [a_contents, setComment] = useState("");  // 댓글 입력 상태
  const [title, setTitle] = useState("");  // 질문 제목
  const [content, setContent] = useState("");  // 질문 내용
  const [qaDetails, setQADetails] = useState({ title: "상품 제목", content: "상품 설명", username: "작성자", createdAt: "작성일" }); // Q&A 데이터
  const [isBookmarked, setIsBookmarked] = useState(false); // 찜 상태
  const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글 ID
  const [editedComment, setEditedComment] = useState(""); // 수정된 댓글 내용
  const commentInputRef = useRef(null); // 댓글 수정 입력창에 포커스 주기 위한 ref

  const admin = localStorage.getItem("userName"); // 관리자 정보

  // 댓글 수정 함수
  const handleEditComment = (id, content) => {
    setEditingCommentId(id);  // 수정할 댓글 ID 설정
    setEditedComment(content); // 수정할 때 기존 댓글 내용으로 설정
    setEditedComment(""); // 수정 후 인풋 초기화
  };

  // 댓글 수정 시 포커스를 자동으로 적용하기 위해 useEffect 사용
  useEffect(() => {
    if (editingCommentId !== null) {
      // 댓글 수정 모드일 때만 포커스를 주도록 설정
      setTimeout(() => {
        if (commentInputRef.current) {
          commentInputRef.current.focus();
        }
      }, 0);
    }
  }, [editingCommentId]); // editingCommentId가 변경될 때마다 포커스 처리

  // 댓글 수정 저장 함수
  const handleUpdateComment = async (id) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`/api/answer/update/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ a_contents: editedComment }),
      });

      if (!response.ok) throw new Error("댓글 수정 실패");

      setEditingCommentId(null);
      setEditedComment(""); // 수정 후 인풋 초기화
      fetchAnswerSelecte();
      alert("댓글이 성공적으로 수정되었습니다."); // 수정 성공 시 알림
    } catch (error) {
      console.error("댓글 수정 오류:", error);
      alert("댓글 수정에 실패했습니다: " + error.message); // 수정 실패 시 알림
    }
  };

  // 댓글 삭제 저장 함수
  const handleDeleteComment = async (id) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`/api/answer/delete/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json", 
                },
      });
      if (!response.ok) throw new Error("댓글 삭제 실패");

      fetchAnswerSelecte();
      alert("댓글이 삭제되었습니다."); // 삭제 성공 시 알림
      window.location.reload(); // 화면 새로고침용
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
      alert("댓글 삭제에 실패했습니다: " + error.message); // 삭제 실패 시 알림
    }
  };

  // 댓글 등록 함수
  const handleCommentSubmit = async (e) => {
    if (admin === "관리자") {
      e.preventDefault();
      const token = localStorage.getItem("jwt"); // JWT 토큰 가져오기

      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      if (a_contents.trim() === "") return; // 댓글이 비어있으면 등록하지 않음

      // 답변이 이미 하나 달려있으면 댓글을 달 수 없도록 처리
      if (a_comments.length > 0) {
        alert("답변은 하나만 달 수 있습니다.");
        return;
      }

      const formDataToSend = {
        questionId: id,
        a_contents: a_contents,
      };

      try {
        const response = await fetch("/api/answer/create", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`, // JWT 토큰 포함
            "Content-Type": "application/json", // ✅ JSON 데이터 전송
          },
          body: JSON.stringify(formDataToSend), // ✅ JSON 문자열로 변환하여 전송
        });

        if (!response.ok) {
          throw new Error("등록에 실패했습니다.");
        }

        alert("답변이 성공적으로 등록되었습니다."); // 등록 성공 시 알림
        fetchAnswerSelecte();
        setComment(""); // 입력창 초기화
      } catch (error) {
        alert("답변 등록에 실패했습니다: " + error.message); // 등록 실패 시 알림
      }
    } else {
      alert("답변은 관리자만 입력가능 합니다.");
    }
  };

  // 목록 버튼 클릭 시 이동하는 함수
  const handleGoToList = () => {
    navigate("/QABoardList"); // "/QABoardList" 페이지로 이동
  };

  // API에서 상품 상세 데이터 가져오기
  const fetchAnswerSelecte = async () => {
    try {
      const response = await fetch(`/api/answer/byQuestion/${id}`); // 예시 API URL
      if (!response.ok) {
        throw new Error("데이터 조회에 실패했습니다.");
      }

      const data = await response.json();
      console.log(data);
      if (data) {
        const newComment = {
          id: data.id, // 고유 ID 생성 (현재 시간)
          author: "관리자", // 댓글 작성자
          content: data.a_contents, // 댓글 내용
          date: new Date(data.createdAt).toLocaleDateString(), // 작성 날짜
        };
        setComments([newComment]); // 댓글 목록에 추가
      }
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    }
  };

  // 마운트 시 상품 데이터 및 댓글 데이터 가져오기
  useEffect(() => {
    const fetchQADetails = async () => {
      try {
        const response = await fetch(`/api/question/questionDetail/${id}`); // 예시 API URL
        if (!response.ok) {
          throw new Error("데이터 조회에 실패했습니다.");
        }

        const data = await response.json();
        if (data) {
          setQADetails({
            title: data.title || " 제목",
            content: data.content || "설명",
            username: data.writerName || "작성자", // 작성자 데이터 추가
            createdAt: data.createdAt || "작성일", // 작성일 데이터 추가
          });
        }
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    fetchQADetails();
    fetchAnswerSelecte();
  }, [id]);

  return (
    <div className="detail-container">
      <div className="detail-content">
        <h2 className="detail-title">Q & A</h2>
        <hr />
        
        <div className="detail-author-date">
          <span className="author">
            <FontAwesomeIcon icon={faUser} /> &nbsp;
            {qaDetails.username}&nbsp;
          </span>
          <span className="created-date">
            작성일: {new Date(qaDetails.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="detail-box">
          <div className="detail-row">
            <div className="detail-label">제목</div>
            <input 
              type="text" 
              className="detail-text" 
              name="title" 
              id="title" 
              disabled={true} 
              value={qaDetails.title} 
            />
          </div>
          <div className="detail-row content-row">
            <div className="detail-label">질문</div>
            <textarea 
              className="detail-text large" 
              name="content" 
              id="content" 
              disabled={true} 
              value={qaDetails.content} 
            />
          </div>
        </div>

        {/* 댓글 목록 */}
        <h3 className="detail-comment-list-title2">답변</h3>
        <div className="detail-comment-table2">
          {a_comments.map((c) => (
            <div key={c.id} className="detail-comment-card2">
              <div className="detail-comment-author-date2">
                <FontAwesomeIcon icon={faUser} />
                <span>{c.author}</span> | <span>{c.date}</span>
              </div>
              <div className="detail-comment-content2">
                {editingCommentId === c.id ? (
                  <div>
                    <input
                      ref={commentInputRef} // ref로 포커스 주기
                      id={`edit-comment-${c.id}`}
                      type="text"
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                    />
                    <button className="save-button2" onClick={() => handleUpdateComment(c.id)}>저장</button>
                  </div>
                ) : (
                  <div>
                    {c.content}
                    <div className="detail-comment-actions">
                      <FontAwesomeIcon 
                        icon={faPen} 
                        onClick={() => handleEditComment(c.id, c.content)} 
                        className="detail-edit-icon"
                      />
                      <FontAwesomeIcon 
                        icon={faTrash} 
                        onClick={() => handleDeleteComment(c.id)} 
                        className="detail-delete-icon"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 댓글 입력 */}
        <div className="detail-comment-input-section">
          <input
            type="text"
            className="detail-comment-text-input"
            placeholder="답변을 입력해주세요."
            name="a_contents"
            id="a_contents"
            value={a_contents}
            onChange={(e) => setComment(e.target.value)}
            disabled={a_comments.length > 0} // 답변이 하나 달리면 입력창 비활성화
          />
          <button
            className="detail-submit-comment-btn"
            onClick={handleCommentSubmit}
            disabled={a_comments.length > 0} // 답변이 하나 달리면 버튼 비활성화
          >
            등록
          </button>
        </div>

        <button className="detail-button" onClick={handleGoToList}>
          목록
        </button>
      </div>
    </div>
  );
}

export default QADetail;
