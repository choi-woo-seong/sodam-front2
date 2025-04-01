import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../styles/WriteBoardList.css";

const PersonWriteList = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();

    const [currentPage3, setCurrentPage3] = useState(1);
    const [currentPage4, setCurrentPage4] = useState(1);
  
    const [posts, setPosts] = useState({
      questions: [],
      communities: [],
    });
    const [errors, setErrors] = useState("");
    const [message, setMessage] = useState("");
  
    const postsPerPage = 3;
  
    const getTotalPages = (category) => {
      const postsCategory = posts[category] || [];
      return Math.max(1,Math.ceil(postsCategory.length / postsPerPage));
    };
  
    const getCurrentPosts = (category, currentPage) => {
      const postsCategory = posts[category] || [];
      const indexOfLastPost = currentPage * postsPerPage;
      const indexOfFirstPost = indexOfLastPost - postsPerPage;
      return postsCategory.slice(indexOfFirstPost, indexOfLastPost);
    };
  
    const paginate = (pageNumber, setPageState, category) => {
      const totalPages = getTotalPages(category);
      setPageState(Math.max(1,Math.min(pageNumber,totalPages)));
    };
    const goToFirstPage = (setPageState) => setPageState(1);
    const goToLastPage = (setPageState, category) => setPageState(getTotalPages(category));
  
    const getPageNumbers = (currentPage, category) => {
      const pageNumbers = [];
      const pageLimit = 3;
      const totalPages = getTotalPages(category);
      let startPage = Math.max(1,Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1);
      let endPage = Math.min(startPage + pageLimit - 1,totalPages);
      
  
      if (endPage > totalPages) {
        endPage = totalPages;
      }
  
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
  
      return pageNumbers;
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("jwt");
          if (!token) {
            setMessage("로그인이 필요합니다.");
            return;
          }
  
          const response = await fetch(`${BASE_URL}/mypage/posts`, {
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
          setPosts({
            questions: result.questions,
            communities: result.communities,
          });
        } catch (error) {
          setErrors(error.message);
          console.error("상품 조회 오류:", error.message);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <div className="write-list-container">
          <h3>내가 쓴 글 목록 </h3>
          <hr></hr>
        <div className="my-link">
          <p className="my" onClick={() => navigate("/personMypage")}> 
            <i className="fas fa-user-circle clickable"></i>&nbsp;개인정보 수정
          </p>
        </div>
  
        {/* 자유게시판 */}
        <table className="write-table">
          <thead>
            <h2>자유게시판</h2>
            <tr>
              <th>번호</th>
              <th>제목</th>
            </tr>
          </thead>
          <tbody>
          {getCurrentPosts("communities", currentPage3).length > 0 ? (
            getCurrentPosts("communities", currentPage3).map((post, index) => (
              <tr key={post.id}>
                <td>{index + 1}</td>
                <td>
                  <Link to={`/communityUpdate/${post.id}`} className="post-link">
                    {post.c_title}
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">등록된 데이터가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
  
        <div className="write-pagination">
          <span onClick={() => goToFirstPage(setCurrentPage3)}>&lt;&lt;</span>
          <span onClick={() => setCurrentPage3(currentPage3 > 1 ? currentPage3 - 1 : 1)}>&lt;</span>
          {getPageNumbers(currentPage3, 'communities').map((num) => (
            <span key={num} onClick={() => paginate(num, setCurrentPage3)} className={`page-number ${currentPage3 === num ? "active" : ""}`}>{num}</span>
          ))}
          <span onClick={() => setCurrentPage3(currentPage3 < getTotalPages('communities') ? currentPage3 + 1 : getTotalPages('communities'))}>&gt;</span>
          <span onClick={() => goToLastPage(setCurrentPage3, 'communities')}>&gt;&gt;</span>
        </div>
  
        {/* Q&A */}
        <table className="write-table">
          <thead>
            <h2>Q&A</h2>
            <tr>
              <th>번호</th>
              <th>제목</th>
            </tr>
          </thead>
          <tbody>
          {getCurrentPosts("questions", currentPage4).length > 0 ? (
            getCurrentPosts("questions", currentPage4).map((post, index) => (
              <tr key={post.id}>
                <td>{index + 1}</td>
                <td>
                  <Link to={`/qaUpdate/${post.id}`} className="post-link">
                    {post.title}
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">등록된 데이터가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
        <div className="write-pagination">
          <span onClick={() => goToFirstPage(setCurrentPage4)}>&lt;&lt;</span>
          <span onClick={() => setCurrentPage4(currentPage4 > 1 ? currentPage4 - 1 : 1)}>&lt;</span>
          {getPageNumbers(currentPage4, 'questions').map((num) => (
            <span key={num} onClick={() => paginate(num, setCurrentPage4)} className={`page-number ${currentPage4 === num ? "active" : ""}`}>{num}</span>
          ))}
          <span onClick={() => setCurrentPage4(currentPage4 < getTotalPages('questions') ? currentPage4 + 1 : getTotalPages('questions'))}>&gt;</span>
          <span onClick={() => goToLastPage(setCurrentPage4, 'questions')}>&gt;&gt;</span>
        </div>
      </div>
    );
  };
  

export default PersonWriteList;

