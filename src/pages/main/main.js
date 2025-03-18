import React, { useState, useEffect } from "react";
import "./main.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Main({ apiEndpoints }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
 
  const [data, setData] = useState({
    products: [
      { id: 1, title: "가짜 상품 1" },
      { id: 2, title: "가짜 상품 2" },
      { id: 3, title: "가짜 상품 3" },
    ],
    businesses: [
      { id: 1, title: "가짜 비즈니스 1" },
      { id: 2, title: "가짜 비즈니스 2" },
      { id: 3, title: "가짜 비즈니스 3" },
    ],
    financialServices: [
      { id: 1, title: "가짜 금융 서비스 1" },
      { id: 2, title: "가짜 금융 서비스 2" },
      { id: 3, title: "가짜 금융 서비스 3" },
    ],
    freeBoard: [
      { id: 1, title: "가짜 게시글 1" },
      { id: 2, title: "가짜 게시글 2" },
      { id: 3, title: "가짜 게시글 3" },
    ],
    notices: [
      { id: 1, title: "가짜 공지사항 1" },
      { id: 2, title: "가짜 공지사항 2" },
      { id: 3, title: "가짜 공지사항 3" },
    ],
    qaList: [
      { id: 1, title: "가짜 질문 1" },
      { id: 2, title: "가짜 질문 2" },
      { id: 3, title: "가짜 질문 3" },
    ],
  });
  const [recentlyViewed, setRecentlyViewed] = useState([]); // 최근 본 아이템 목록
  const navigate = useNavigate();


  // 검색어 처리 함수
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      alert("검색어를 입력해주세요!");
      return;
    }
    console.log("검색어 : ", searchTerm);
  };

    // 🔹 네비게이션 함수 (최근 본 항목 저장 기능 수정)
    const handleNavigate = (path, item) => {
      const newItem = { id: item.id, title: item.title, path }; // 객체 형태로 저장
  
      // 중복 제거
      const updatedList = [newItem, ...recentlyViewed.filter((i) => i.id !== item.id)];
  
      // 상태 업데이트 및 localStorage 저장
      setRecentlyViewed(updatedList);
      localStorage.setItem("recentlyViewed", JSON.stringify(updatedList));
  
      navigate(`${path}/${item.id}`);
    };
  
    // 🔹 페이지가 로드될 때 localStorage에서 최근 본 항목 불러오기
useEffect(() => {
  const storedViewed = localStorage.getItem("recentlyViewed");
  if (storedViewed) {
    setRecentlyViewed(JSON.parse(storedViewed));
  }
}, []);

  // 추천 항목 처리 함수
  const getSuggestions = () => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const allItems = [
      ...data.products,
      ...data.businesses,
      ...data.financialServices,
      ...data.freeBoard,
      ...data.notices,
      ...data.qaList,
    ];

    const filteredSuggestions = allItems.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
  };

 
  // 클릭 외부 처리 (추천 리스트 닫기)
  const handleClickOutside = (e) => {
    const searchContainer = document.querySelector(".search-container");
    if (!searchContainer.contains(e.target)) {
      setSuggestions([]); // 추천 리스트 숨김
    }
  };

  // 컴포넌트 마운트 시 이벤트 리스너 추가
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // 검색어에 맞는 추천 항목 처리
  useEffect(() => {
    getSuggestions();
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
      

      {/* 검색어 추천 리스트 */}
      {searchTerm && suggestions.length > 0 && (
        <div className="suggestions-list">
          <ul>
            {suggestions.map((item) => (
              <li
                key={item.id}
                onClick={() => handleNavigate(
                  item.title.includes("상품")
                    ? "/productDetail"
                    : item.title.includes("비즈니스")
                    ? "/businessDetail"
                    : item.title.includes("금융")
                    ? "/bankDetail"
                    : item.title.includes("게시글")
                    ? "/communityDetail"
                    : item.title.includes("Q&A")
                    ? "/QADetail"
                    : "/noticeDetail", item
                )}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      

      {/* 최근 등록 항목들 */}
      <div className="content-container">
        <div className="recent-items">
          <h3 className="recent-title">최근 등록</h3>
          <div className="recent-cards">
            {/* 상품 카드 */}
            <div className="card">
              <div className="card-header">
                상품
                <button className="expand-icon" onClick={() => navigate('/productBoardList')}>
                  +
                </button>
              </div>
              <ul>
                {data.products.map((item) => (
                  <li key={item.id} onClick={() => handleNavigate('/productDetail', item)}>
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* 비즈니스 카드 */}
            <div className="card">
              <div className="card-header">
                비즈니스
                <button className="expand-icon" onClick={() => navigate('/businessBoardList')}>
                  +
                </button>
              </div>
              <ul>
                {data.businesses.map((item) => (
                  <li key={item.id} onClick={() => handleNavigate('/businessDetail', item)}>
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* 금융 카드 */}
            <div className="card wide">
              <div className="card-header">
                금융
                <button className="expand-icon" onClick={() => navigate('/bankBoardList')}>
                  +
                </button>
              </div>
              <ul>
                {data.financialServices.map((item) => (
                  <li key={item.id} onClick={() => handleNavigate('/bankDetail', item)}>
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* 자유게시판 카드 */}
            <div className="card wide">
              <div className="card-header">
                자유게시판
                <button className="expand-icon" onClick={() => navigate('/communityBoardList')}>
                  +
                </button>
              </div>
              <ul>
                {data.freeBoard.map((item) => (
                  <li key={item.id} onClick={() => handleNavigate('/communityDetail', item)}>
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* 공지 카드 */}
            <div className="card">
              <div className="card-header">
                공지
                <button className="expand-icon" onClick={() => navigate('/noticeBoardList')}>
                  +
                </button>
              </div>
              <ul>
                {data.notices.map((item) => (
                  <li key={item.id} onClick={() => handleNavigate('/noticeDetail', item)}>
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Q&A 카드 */}
            <div className="card">
              <div className="card-header">
                Q&A
                <button className="expand-icon" onClick={() => navigate('/QABoardList')}>
                  +
                </button>
              </div>
              <ul>
                {data.qaList.map((item) => (
                  <li key={item.id} onClick={() => handleNavigate('/QADetail', item)}>
                    {item.title}
                  </li>
                ))}
              </ul>
      

    </div>
          
            
          </div>
        </div>
      </div>
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
