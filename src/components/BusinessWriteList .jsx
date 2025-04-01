import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../styles/WriteBoardList.css";

const BusinessWriteList = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();
  
  // 페이지 상태를 객체로 관리
  const [currentPage, setCurrentPage] = useState({
    products: 1,
    bizList: 1,
    communities: 1,
    questions: 1
  });

  const [posts, setPosts] = useState({
    products: [],
    bizList: [],
    communities: [],
    questions: []
  });

  const [errors, setErrors] = useState("");
  const [message, setMessage] = useState("");
  const postsPerPage = 3;

  // 총 페이지 수 계산
  const getTotalPages = (category) => {
    const total = posts[category]?.length || 0;
    return Math.max(1, Math.ceil(total / postsPerPage));
  };

  // 현재 페이지의 게시글 가져오기
  const getCurrentPosts = (category) => {
    const indexOfLastPost = currentPage[category] * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return posts[category]?.slice(indexOfFirstPost, indexOfLastPost) || [];
  };

  // 페이지네이션 함수
  const paginate = (category, pageNumber) => {
    setCurrentPage((prev) => ({ ...prev, [category]: pageNumber }));
  };

  const goToFirstPage = (category) => paginate(category, 1);
  const goToLastPage = (category) => paginate(category, getTotalPages(category));

  const getPageNumbers = (category) => {
    const totalPages = getTotalPages(category);
    const pageLimit = 3;
    let startPage = Math.floor((currentPage[category] - 1) / pageLimit) * pageLimit + 1;
    let endPage = Math.min(startPage + pageLimit - 1, totalPages);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
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

        if (!response.ok) throw new Error("데이터를 불러오는 데 실패했습니다.");

        const result = await response.json();
        setPosts(result);
      } catch (error) {
        setErrors(error.message);
      }
    };

    fetchData();
  }, []);

  // 테이블 렌더링 함수
  const renderTable = (category, title, keyField, nameField, linkPath) => (
    <div>
      <h2>{title}</h2>
      <table className="write-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
          </tr>
        </thead>
        <tbody>
          {getCurrentPosts(category).length > 0 ? (
            getCurrentPosts(category).map((post, index) => (
              <tr key={post[keyField]}>
                <td>{index + 1}</td>
                <td>
                  <Link to={`${linkPath}/${post[keyField]}`} className="post-link">
                    {post[nameField]}
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
      {renderPagination(category)}
    </div>
  );

  // 페이지네이션 렌더링 함수
  const renderPagination = (category) => (
    <div className="write-pagination">
      <span onClick={() => goToFirstPage(category)}>&lt;&lt;</span>
      <span onClick={() => paginate(category, Math.max(1, currentPage[category] - 1))}>&lt;</span>
      {getPageNumbers(category).map((num) => (
        <span key={num} onClick={() => paginate(category, num)} className={`page-number ${currentPage[category] === num ? "active" : ""}`}>
          {num}
        </span>
      ))}
      <span onClick={() => paginate(category, Math.min(getTotalPages(category), currentPage[category] + 1))}>&gt;</span>
      <span onClick={() => goToLastPage(category)}>&gt;&gt;</span>
    </div>
  );

  return (
    <div className="write-list-container">
      <h3>내가 쓴 글 목록</h3>
      <hr />
      <div className="my-link">
        <p className="my" onClick={() => navigate("/businessMypage")}>
          <i className="fas fa-user-circle clickable"></i>&nbsp;개인정보 수정
        </p>
      </div>

      {renderTable("products", "상품", "no", "p_title", "/productUpdate")}
      {renderTable("bizList", "비즈니스", "no", "b_title", "/businessUpdate")}
      {renderTable("communities", "자유게시판", "id", "c_title", "/communityUpdate")}
      {renderTable("questions", "Q&A", "id", "title", "/qaUpdate")}
    </div>
  );
};

export default BusinessWriteList;
