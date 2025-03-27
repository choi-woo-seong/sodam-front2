import React, { useState, useEffect } from "react";
import "./main.css";
import { useNavigate } from "react-router-dom";

function Main({ apiEndpoints }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [errors, setErrors] = useState("");
  const [message, setMessage] = useState("");

  const [data, setData] = useState({
    product: [],
    biz: [],
    question: [],
    gov: [],
    community: [],
    notice: [],
  });

  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const navigate = useNavigate();

  // 🔹 검색 기능
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      alert("검색어를 입력해주세요!");
      return;
    }
    console.log("검색어 : ", searchTerm);
  };

  // 🔹 API 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwt");

        if (!token) {
          setMessage("로그인이 필요합니다.");
          return;
        }

        const response = await fetch("http://192.168.0.102:8080/api/main/recent-posts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("데이터 조회에 실패했습니다.");
        }

        const result = await response.json();
        console.log(result);
        setData(result);
      } catch (error) {
        setErrors(error.message);
        console.error("데이터 조회 오류:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleNavigate = (path, item) => {
    const newItem = {
      id: item.id || item.no, 
      title: item.title || item.p_title || item.b_title || item.c_title || item.n_title || item.finPrdNm || item.finPrdNm, // 금융(gov) 항목에 g_title 사용
      path,
    };
  
    // 중복 제거 후 최신 3개까지만 유지
    const updatedList = [newItem, ...recentlyViewed.filter((i) => i.id !== newItem.id)].slice(0, 5);
  
    // 상태 업데이트 및 localStorage 저장
    setRecentlyViewed(updatedList);
    localStorage.setItem("recentlyViewed", JSON.stringify(updatedList));
  
    navigate(`${path}/${newItem.id}`);
  };
  
  // 🔹 페이지가 로드될 때 localStorage에서 최근 본 항목 불러오기
  useEffect(() => {
    const storedViewed = localStorage.getItem("recentlyViewed");
    setRecentlyViewed(storedViewed ? JSON.parse(storedViewed) : []);
  }, []);

  // 🔹 추천 항목 필터링
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const allItems = [...data.product, ...data.biz, ...data.gov, ...data.community, ...data.notice, ...data.question];

    const filteredSuggestions = allItems.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
  }, [searchTerm]);

  return (
    <div className="main-container">
      {/* 검색창 */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="search-button" onClick={handleSearch}>
          <i className="fas fa-search"></i>
        </button>
      </div>

      {/* 추천 검색어 */}
      {searchTerm && suggestions.length > 0 && (
        <div className="suggestions-list">
          <ul>
            {suggestions.map((item) => (
              <li key={item.id} onClick={() => handleNavigate("/detail", item)}>
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 최근 등록 항목 */}
      <div className="content-container">
        <div className="recent-items">
          <h3 className="recent-title">최근 등록</h3>
          <div className="recent-cards">
            {/* 상품 */}
            <div className="card">
              <div className="card-header" onClick={() => navigate("/productBoardList")}>
                상품 <button className="expand-icon">+</button>
              </div>
              <ul>
                {data.product.map((item) => (
                  <li key={item.no} onClick={() => handleNavigate("/productDetail", item)}>
                    {item.p_title}
                  </li>
                ))}
              </ul>
            </div>

            {/* 비즈니스 */}
            <div className="card">
              <div className="card-header" onClick={() => navigate("/businessBoardList")}>
                비즈니스 <button className="expand-icon">+</button>
              </div>
              <ul>
                {data.biz.map((item) => (
                  <li key={item.no} onClick={() => handleNavigate("/businessDetail", item)}>
                    {item.b_title}
                  </li>
                ))}
              </ul>
            </div>

            {/* 금융 */}
            <div className="card wide">
              <div className="card-header" onClick={() => navigate("/bankBoardList")}>
                금융 <button className="expand-icon">+</button>
              </div>
              <ul>
                {data.gov.map((item) => (
                  <li key={item.no} onClick={() => handleNavigate("/bankDetail", item)}>
                    {item.finPrdNm}
                  </li>
                ))}
              </ul>
            </div>

            {/* 자유게시판 */}
            <div className="card wide">
              <div className="card-header" onClick={() => navigate("/communityBoardList")}>
                자유게시판 <button className="expand-icon">+</button>
              </div>
              <ul>
                {data.community.map((item) => (
                  <li key={item.id} onClick={() => handleNavigate("/communityDetail", item)}>
                    {item.c_title}
                  </li>
                ))}
              </ul>
            </div>

            {/* 공지사항 */}
            <div className="card">
              <div className="card-header" onClick={() => navigate("/noticeBoardList")}>
                공지사항 <button className="expand-icon">+</button>
              </div>
              <ul>
                {data.notice.map((item) => (
                  <li key={item.id} onClick={() => handleNavigate("/noticeDetail", item)}>
                    {item.n_title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Q&A */}
            <div className="card">
              <div className="card-header" onClick={() => navigate('/QABoardList')}>
                Q&A
                <button className="expand-icon" onClick={() => navigate('/QABoardList')}>
                  +
                </button>
              </div>
              <ul>
                {data.question.map((item) => (
                  <li key={item.id} onClick={() => handleNavigate('/QADetail', item)}>
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 본 항목 */}
      <div className="recently-viewed">
        <h3>최근 본 항목</h3>
        <ul>
          {recentlyViewed.map((item, index) => (
            <li key={index} onClick={() => navigate(`${item.path}/${item.id}`)}>
              {item.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Main;
