import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/BoardList.css";

const BusinessBoardList = () => {
   const [data, setData] = useState([]);
    const [errors, setErrors] = useState("");
    const [message, setMessage] = useState("");
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("jwt");
  
          if (!token) {
            setMessage("로그인이 필요합니다.");
            return;
          }
  
          const response = await fetch("http://192.168.0.102:8080/api/biz/searchAll", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
  
          if (!response.ok) {
            throw new Error("상품 조회에 실패했습니다.");
          }
  
          const result = await response.json();
          setData(result);
        } catch (error) {
          setErrors(error.message);
          console.error("상품 조회 오류:", error.message);
        }
      };
  
      fetchData();
    }, []);
  
    useEffect(() => {
      console.log("🔍 데이터 상태 변화:", data);
    }, [data]);


  // 현재 페이지를 관리하는 state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // 한 페이지에 표시할 게시글 수

  // 페이지네이션에 따라 보여줄 게시글 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(data.length / postsPerPage);

  // 페이지 번호 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 첫 번째, 마지막 페이지로 이동
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  // 페이지 번호 범위 설정 (최대 5개 페이지 번호만 표시)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const pageLimit = 5; // 보여줄 페이지 번호의 최대 개수

    let startPage = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1;
    let endPage = startPage + pageLimit - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };


  return (
    <div className="board-list-container">
      <h2 className="board-title">비지니스 목록</h2>
      <hr />
      <table className="board-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>등록날짜</th>
          </tr>
        </thead>
        <tbody>
             {currentPosts && currentPosts.length > 0 ? (
                 currentPosts.map((post, index) => (
                   <tr key={post.no}>
                     <td>{post.no}</td>
                     <td>
                       <Link to={`/businessDetail/${post.no}`} className="post-link">
                         {post.b_title}
                       </Link>
                     </td>
                     <td>{post.username}</td>
                     <td>{new Date(post.createdDate).toLocaleDateString()}</td>
                   </tr>
                 ))
               ) : (
                 <tr>
                   <td colSpan="4">등록된 상품이 없습니다.</td>
                 </tr>
               )}
        </tbody>
      </table>

      <div className="pagination">
      <span
          onClick={goToFirstPage}
          style={{ cursor: "pointer", margin: "0 5px" }}
        >
          &lt;&lt;
        </span>
        <span
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          style={{ cursor: "pointer", margin: "0 5px" }}
        >
          &lt;
        </span>

        {/* 페이지 번호 버튼들 */}
        {getPageNumbers().map((num) => (
          <span
            key={num }
            className={`page-number ${currentPage === num  ? "active" : ""}`}
            onClick={() => paginate(num )}
            style={{ cursor: "pointer", margin: "0 5px" }}
          >
            {num}
          </span>
        ))}

        <span
          onClick={() =>
            setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)
          }
          style={{ cursor: "pointer", margin: "0 5px" }}
        >
          &gt;
        </span>
        <span
          onClick={goToLastPage}
          style={{ cursor: "pointer", margin: "0 5px" }}
        >
          &gt;&gt;
        </span>
      </div>
         
     <Link to="/businessRegister">
             <button className="list-btn">글 작성</button>
           </Link>
    </div>
  );
};

export default BusinessBoardList;
