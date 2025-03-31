import React, { useEffect, useState } from "react";
import "./map.css"; // 스타일 적용

function MapDetail() {
  const { kakao } = window;
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // 카카오 맵 SDK 스크립트 로딩
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=668e283937fb605b2e2fc1571979350b&libraries=services,places`;
    document.head.appendChild(script);

    script.onload = () => {
      console.log("카카오 맵 SDK 로드 성공!");  // 로딩 확인
      if (!window.kakao) {
        console.error("카카오 맵 SDK가 로드되지 않았습니다.");
        return;
      }

      const container = document.getElementById("map"); // 지도 컨테이너
      if (!container) {
        console.error("지도 컨테이너가 없습니다!");
        return;
      }

      const options = {
        center: new kakao.maps.LatLng(37.49875699165696, 127.02667739922292), // 지도 중심 위치
        level: 3,  // 지도 확대 레벨
      };

      const newMap = new kakao.maps.Map(container, options);
      setMap(newMap);

      // 기본 마커 설정
      const markerPosition = new kakao.maps.LatLng(37.49875699165696, 127.02667739922292);
      const newMarker = new kakao.maps.Marker({ position: markerPosition });
      newMarker.setMap(newMap);
      setMarker(newMarker);
    };

    // 스크립트 로딩 실패 시 오류 처리
    script.onerror = () => {
      console.error("카카오 맵 SDK 로딩에 실패했습니다.");
    };

    // 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert("검색어를 입력하세요!");
      return;
    }

    const places = new kakao.maps.services.Places();
    places.keywordSearch(searchTerm, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const { x, y } = data[0];
        const moveLatLon = new kakao.maps.LatLng(y, x);
        map.setCenter(moveLatLon);

        // 기존 마커 제거 후 새로운 마커 설정
        if (marker) marker.setMap(null);
        const newMarker = new kakao.maps.Marker({ position: moveLatLon });
        newMarker.setMap(map);
        setMarker(newMarker);
      } else {
        alert("검색 결과가 없습니다!");
      }
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  return (
    <div className="map-detail-container">
      <div className="map-detail-content">
        <h2 className="map-detail-title">지도</h2>
        <hr />
        
        <div className="map-all">
          {/* 🔍 카카오 스타일 검색 UI */}
          <div className="map-search-box">
            <input
              type="text"
              className="map-search-input"
              placeholder="예) 판교역로 235, 분당 주공, 삼평동 681"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="map-search-button" onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </button>
          </div>

          {/* 🔍 검색 가이드 메시지 */}
          <div className="map-search-guide">
            <p><strong>tip</strong></p>
            <p>아래와 같은 조합으로 검색하시면 더욱 정확한 결과가 검색됩니다.</p>
            <ul>
              <li><strong>도로명 + 건물번호</strong> 예) <span className="map-highlight">판교역로 235</span></li>
              <li><strong>지역명(동/리) + 번지</strong> 예) <span className="map-highlight">삼평동 681</span></li>
              <li><strong>지역명(동/리) + 건물명</strong> 예) <span className="map-highlight">분당 주공</span></li>
            </ul>
            <p className="map-powered">Powered by Kakao</p>
          </div>
        </div>

        {/* 🗺 지도 */}
        <div id="map" className="map" style={{ width: "100%", height: "400px", marginTop: "20px" }}></div>
      </div>
    </div>
  );
}

export default MapDetail;
