import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/BoardList.css";

const BookMarkBoardList = () => {
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

        const response = await fetch("http://192.168.0.102:8080/api/products/searchAll", {
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
          {currentPosts && currentPosts.length > 0 ? (
                      currentPosts.map((post, index) => (
                        <tr key={post.no}>
                          <td>{post.no}</td>
                          <td>
                            <Link to={`/bookMarkBoardList/${post.no}`} className="post-link">
                              {post.title}
                            </Link>
                          </td>
                          <td>{post.username}</td>
                          <td>{new Date(post.createdAt).toLocaleDateString()}</td>
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
