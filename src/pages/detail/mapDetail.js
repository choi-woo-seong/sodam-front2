import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./map.css";

function MapDetail() {
  const { state } = useLocation();
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        initializeMap();
      });
    } else {
      console.error("카카오 맵 SDK가 로드되지 않았습니다.");
    }

    function initializeMap() {
      const container = document.getElementById("map");
      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(37.49875699165696, 127.02667739922292),
        level: 3,
      };

      const newMap = new window.kakao.maps.Map(container, options);
      setMap(newMap);

      if (state && state.address) {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(state.address, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const lat = result[0].y;
            const lng = result[0].x;
            const coords = new window.kakao.maps.LatLng(lat, lng);

            newMap.setCenter(coords);
            if (marker) marker.setMap(null);

            const newMarker = new window.kakao.maps.Marker({ position: coords });
            newMarker.setMap(newMap);
            setMarker(newMarker);
          } else {
            alert("주소를 찾을 수 없습니다.");
          }
        });
      }
    }
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert("검색어를 입력하세요!");
      return;
    }

    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(searchTerm, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const { x, y } = data[0];
        const moveLatLon = new window.kakao.maps.LatLng(y, x);
        map.setCenter(moveLatLon);

        if (marker) marker.setMap(null);
        const newMarker = new window.kakao.maps.Marker({ position: moveLatLon });
        newMarker.setMap(map);
        setMarker(newMarker);
      } else {
        alert("검색 결과가 없습니다!");
      }
    });
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="map-detail-container">
      <div className="map-detail-content">
        <h2 className="map-detail-title">지도</h2>
        <hr />

        <div className="map-all">
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

        <div id="map" className="map" style={{ width: "100%", height: "400px", marginTop: "20px" }}></div>
      </div>
    </div>
  );
}

export default MapDetail;
