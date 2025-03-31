import React, { useState, useEffect } from "react";
import "./main.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Main({ apiEndpoints }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [errors, setErrors] = useState("");
  const [message, setMessage] = useState("");

  const [data, setData] = useState({
    product: [],
    biz: [],
    question: [],
    gov:[],
    community: [],
    notice: [],
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
            "Authorization": `Bearer ${token}`, // JWT 토큰 포함
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


    // 🔹 네비게이션 함수 (최근 본 항목 저장 기능 수정)
    const handleNavigateNo = (path, item) => {
      const newItem = { id: item.no, title: item.title, path }; // 객체 형태로 저장

      // 중복 제거
      const updatedList = [newItem, ...recentlyViewed.filter((i) => i.id !== item.id)];
  
      // 상태 업데이트 및 localStorage 저장
      setRecentlyViewed(updatedList);
      localStorage.setItem("recentlyViewed", JSON.stringify(updatedList));
  
      navigate(`${path}/${newItem.id}`);
    };

    // 🔹 네비게이션 함수 (최근 본 항목 저장 기능 수정)
    const handleNavigateId = (path, item) => {
      const newItem = { id: item.id, title: item.title, path }; // 객체 형태로 저장

      // 중복 제거
      const updatedList = [newItem, ...recentlyViewed.filter((i) => i.id !== item.id)];
  
      // 상태 업데이트 및 localStorage 저장
      setRecentlyViewed(updatedList);
      localStorage.setItem("recentlyViewed", JSON.stringify(updatedList));
  
      navigate(`${path}/${newItem.id}`);
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
      ...data.product,
      ...data.biz,
      ...data.gov,
      ...data.community,
      ...data.notice,
      ...data.question,
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
                onClick={() => handleNavigateId(
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
              <div className="card-header" onClick={() => navigate('/productBoardList')}>
                상품
                <button className="expand-icon" onClick={() => navigate('/productBoardList')}>
                  +
                </button>
              </div>
              <ul>
                {data.product.map((item) => (
                  <li key={item.no} onClick={() => handleNavigateNo('/productDetail', item)}>
                    {item.p_title}
                  </li>
                ))}
              </ul>
            </div>

            {/* 비즈니스 카드 */}
            <div className="card">
              <div className="card-header"  onClick={() => navigate('/businessBoardList')}>
                비즈니스
                <button className="expand-icon" onClick={() => navigate('/businessBoardList')}>
                  +
                </button>
              </div>
              <ul>
                {data.biz.map((item) => (
                  <li key={item.no} onClick={() => handleNavigateNo('/businessDetail', item)}>
                    {item.b_title}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card wide">
              <div className="card-header"  onClick={() => navigate('/bankBoardList')}>
                금융
                <button className="expand-icon" onClick={() => navigate('/bankBoardList')}>
                  +
                </button>
              </div>
              <ul>
                {data.gov.map((item) => (
                  <li key={item.no} onClick={() => handleNavigateId('/bankDetail', item)}>
                    {item.finPrdNm}
                  </li>
                ))}
              </ul>
            </div>

            {/* 자유게시판 카드 */}
            <div className="card wide">
              <div className="card-header" onClick={() => navigate('/communityBoardList')}>
                자유게시판
                <button className="expand-icon" onClick={() => navigate('/communityBoardList')}>
                  +
                </button>
              </div>
              <ul>
                {data.community.map((item) => (
                  <li key={item.id} onClick={() => handleNavigateId('/communityDetail', item)}>
                    {item.c_title}
                  </li>
                ))}
              </ul>
            </div>

            {/* 공지 카드 */}
            <div className="card">
              <div className="card-header" onClick={() => navigate('/noticeBoardList')}>
                공지사항
                <button className="expand-icon" onClick={() => navigate('/noticeBoardList')}>
                  +
                </button>
              </div>
              <ul>
                {data.notice.map((item) => (
                  <li key={item.id} onClick={() => handleNavigateId('/noticeDetail', item)}>
                    {item.n_title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Q&A 카드 */}
            <div className="card">
              <div className="card-header" onClick={() => navigate('/QABoardList')}>
                Q&A
                <button className="expand-icon" onClick={() => navigate('/QABoardList')}>
                  +
                </button>
              </div>
              <ul>
                {data.question.map((item) => (
                  <li key={item.id} onClick={() => handleNavigateId('/QADetail', item)}>
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
