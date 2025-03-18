import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/BoardList.css";

const BookMarkBoardList = () => {
  const posts = [
    { id: 1, title: "첫 번째 게시글", author: "홍길동", date: "2025-03-11" },
    { id: 2, title: "두 번째 게시글", author: "이순신", date: "2025-03-10" },
    { id: 3, title: "세 번째 게시글", author: "김유신", date: "2025-03-09" },
    { id: 4, title: "네 번째 게시글", author: "강감찬", date: "2025-03-08" },
    { id: 5, title: "다섯 번째 게시글", author: "이순신", date: "2025-03-07" },
    { id: 6, title: "여섯 번째 게시글", author: "홍길동", date: "2025-03-06" },
    { id: 7, title: "일곱 번째 게시글", author: "이순신", date: "2025-03-05" },
    { id: 8, title: "여덟 번째 게시글", author: "김유신", date: "2025-03-04" },
    { id: 9, title: "아홉 번째 게시글", author: "강감찬", date: "2025-03-03" },
    { id: 10, title: "열 번째 게시글", author: "홍길동", date: "2025-03-02" },
  ];

  // 현재 페이지를 관리하는 state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // 한 페이지에 표시할 게시글 수

  // 페이지네이션에 따라 보여줄 게시글 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // 페이지 번호 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 첫 번째, 마지막 페이지로 이동
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);


  
  // const handleBookmark = async (e) => {
  //   e.preventDefault();
  
  //   try {
  //       const response = await fetch("http://192.168.0.102:8080/auth/bookmark", {
  //           method: "GET",
  //           headers: {
  //               "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             nUserid: formData.nUserid, // 🔥 필드명 확인 (백엔드와 동일해야 함)
  //             nPassword: formData.nPassword,
  //         }),

  //           credentials: "include",
  //           mode: 'cors', 
  //       });
  
  //       if (!response.ok) {
  //           const errorData = await response.json();
  //           throw new Error(errorData.error || "로그인 실패");
  //       }
  
  //       const data = await response.json();
  //       localStorage.setItem("jwt", data.token); // 🔥 JWT 저장
  //       localStorage.setItem("userName", data.name); // 🔥 사용자 이름 저장
  
  //       alert("로그인 성공! JWT:"+data.token + "이름:" + data.name);
  //       setToken(data.token);
  //       setUserName(data.name);
  //       setErrorMessage("");
  //       navigate("/main")
  
  //   } catch (error) {
  //       console.error("로그인 오류:", error.message);
  //       setErrorMessage(error.message);
  //   }
  // };

  return (
    <div className="board-list-container">
      <h2 className="board-title">찜 목록</h2>
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
          {currentPosts.map((post, index) => (
            <tr key={post.id}>
              <td>{indexOfFirstPost + index + 1}</td>
              <td>
                <Link to={`/productDetail`} className="post-link">
                  {post.title}
                </Link>
              </td>
              <td>{post.author}</td>
              <td>{post.date}</td>
            </tr>
          ))}
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
        {[...Array(totalPages).keys()].map((num) => (
          <span
            key={num + 1}
            className={`page-number ${currentPage === num + 1 ? "active" : ""}`}
            onClick={() => paginate(num + 1)}
            style={{ cursor: "pointer", margin: "0 5px" }}
          >
            {num + 1}
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
    </div>
  );
};

export default BookMarkBoardList;
