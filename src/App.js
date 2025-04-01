import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./pages/nav/nav";
import Footer from "./pages/footer/footer";
import BusinessLogin from "./pages/login/businessLogin";
import PersonLogin from "./pages/login/personLogin";
import Signup from "./pages/Signup";
import Main from "./pages/main/main";
import PersonMyPage from "./components/PersonMyPage";
import BusinessMyPage from "./components/BusinessMyPage";
import BookMarkBoardList from "./components/BookMarkBoardList";
import BusinessRegister from "./pages/BusinessRegister";
import BusinessBoardList from "./components/BusinessBoardList";
import BankBoardList from "./components/BankBoardList";
import ProductRegister from "./pages/ProductRegister";
import ProductBoardList from "./components/ProductBoardList";
import CommunityRegister from "./pages/CommunityRegister";
import CommunityBoardList from "./components/CommunityBoardList";
import NoticeRegister from "./pages/NoticeRegister";
import NoticeBoardList from "./components/NoticeBoardList";
import PersonWriteList from "./components/PersonWriteList";
import BusinessWriteList from "./components/BusinessWriteList ";
import QARegister from "./pages/QARegister";
import QABoardList from"./components/QABoardList";
import BankDetail from "./pages/detail/bankDetail ";
import BusinessDetail from "./pages/detail/businessDetail";
import CommunityDetail from "./pages/detail/communityDetail";
import MapDetail from "./pages/detail/mapDetail";
import NoticeDatail from "./pages/detail/noticeDetail";
import ProductDetail from "./pages/detail/productDetail";
import QADetail from "./pages/detail/qaDetail";
import ProductUpdate from "./pages/update/ProductUpdate";
import BusinessUpdate from "./pages/update/BusinessUpdate";
import CommunityUpdate from "./pages/update/CommunityUpdate";
import NoticeUpdate from "./pages/update/NoticeUpdate";
import QAUpdate from "./pages/update/QAUpdate";
import BusinessPasswordPopup from "./components/BusinessPasswordPopup";
import PersonPasswordPopup from "./components/PersonPasswordPopup";
import PrivateRoute from "./components/PrivateRoute";  // PrivateRoute 임포트

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* 로그인 관련 페이지는 Nav와 Footer 제외 */}
          <Route path="/businessLogin" element={<><BusinessLogin /></>} />
          <Route path="/personLogin" element={<><PersonLogin /></>} />
          <Route path="/signup" element={<><Signup /></>} />

          <Route path="/" element={<Navigate to="/businessLogin" />} />
          
          {/* 로그인 이외의 페이지에는 Nav와 Footer 포함 */}
          <Route path="/main" element={<PrivateRoute element={<><Nav /><Main /><Footer /></>} />} />
          <Route path="/businessMypage" element={<PrivateRoute element={<><Nav /><BusinessMyPage /><Footer /></>} />} />
          <Route path="/personMypage" element={<PrivateRoute element={<><Nav /><PersonMyPage /><Footer /></>} />} />
          <Route path="/password-popup" element={<PrivateRoute element={<BusinessPasswordPopup />} />} />
          <Route path="/password-popup" element={<PrivateRoute element={<PersonPasswordPopup />} />} />
          <Route path="/businessRegister" element={<PrivateRoute element={<><Nav /><BusinessRegister /><Footer /></>} />} />
          <Route path="/productRegister" element={<PrivateRoute element={<><Nav /><ProductRegister /><Footer /></>} />} />
          <Route path="/communityRegister" element={<PrivateRoute element={<><Nav /><CommunityRegister /><Footer /></>} />} />
          <Route path="/noticeRegister" element={<PrivateRoute element={<><Nav /><NoticeRegister /><Footer /></>} />} />
          <Route path="/qaRegister" element={<PrivateRoute element={<><Nav /><QARegister /><Footer /></>} />} />
          
          <Route path="/bookMarkBoardList" element={<PrivateRoute element={<><Nav /><BookMarkBoardList /><Footer /></>} />} />
          <Route path="/productBoardList" element={<PrivateRoute element={<><Nav /><ProductBoardList /><Footer /></>} />} />
          <Route path="/businessBoardList" element={<PrivateRoute element={<><Nav /><BusinessBoardList /><Footer /></>} />} />
          <Route path="/bankBoardList" element={<PrivateRoute element={<><Nav /><BankBoardList /><Footer /></>} />} />
          <Route path="/communityBoardList" element={<PrivateRoute element={<><Nav /><CommunityBoardList /><Footer /></>} />} />
          <Route path="/QABoardList" element={<PrivateRoute element={<><Nav /><QABoardList /><Footer /></>} />} />
          <Route path="/noticeBoardList" element={<PrivateRoute element={<><Nav /><NoticeBoardList /><Footer /></>} />} />
          <Route path="/personWriteList" element={<PrivateRoute element={<><Nav /><PersonWriteList /><Footer /></>} />} />
          <Route path="/businessWriteList" element={<PrivateRoute element={<><Nav /><BusinessWriteList /><Footer /></>} />} />
          
          <Route path="/bankDetail" element={<PrivateRoute element={<><Nav /><BankDetail /><Footer /></>} />} />
          <Route path="/businessDetail" element={<PrivateRoute element={<><Nav /><BusinessDetail /><Footer /></>} />} />
          <Route path="/communityDetail" element={<PrivateRoute element={<><Nav /><CommunityDetail /><Footer /></>} />} />
          <Route path="/noticeDetail" element={<PrivateRoute element={<><Nav /><NoticeDatail /><Footer /></>} />} />
          <Route path="/productDetail" element={<PrivateRoute element={<><Nav /><ProductDetail /><Footer /></>} />} />
          <Route path="/qaDetail" element={<PrivateRoute element={<><Nav /><QADetail /><Footer /></>} />} />
          <Route path="/mapDetail" element={<PrivateRoute element={<><Nav /><MapDetail /><Footer /></>} />} />

          <Route path="/bankDetail/:id" element={<PrivateRoute element={<><Nav /><BankDetail /><Footer /></>} />} />
          <Route path="/businessDetail/:id" element={<PrivateRoute element={<><Nav /><BusinessDetail /><Footer /></>} />} />
          <Route path="/communityDetail/:id" element={<PrivateRoute element={<><Nav /><CommunityDetail /><Footer /></>} />} />
          <Route path="/noticeDetail/:id" element={<PrivateRoute element={<><Nav /><NoticeDatail /><Footer /></>} />} />
          <Route path="/productDetail/:id" element={<PrivateRoute element={<><Nav /><ProductDetail /><Footer /></>} />} />
          <Route path="/qaDetail/:id" element={<PrivateRoute element={<><Nav /><QADetail /><Footer /></>} />} />

          <Route path="/productUpdate" element={<PrivateRoute element={<><Nav /><ProductUpdate /><Footer /></>} />} />
          <Route path="/businessUpdate" element={<PrivateRoute element={<><Nav /><BusinessUpdate /><Footer /></>} />} />
          <Route path="/communityUpdate" element={<PrivateRoute element={<><Nav /><CommunityUpdate /><Footer /></>} />} />
          <Route path="/noticeUpdate" element={<PrivateRoute element={<><Nav /><NoticeUpdate /><Footer /></>} />} />
          <Route path="/qaUpdate" element={<PrivateRoute element={<><Nav /><QAUpdate /><Footer /></>} />} />

          <Route path="/productUpdate/:id" element={<PrivateRoute element={<><Nav /><ProductUpdate /><Footer /></>} />} />
          <Route path="/businessUpdate/:id" element={<PrivateRoute element={<><Nav /><BusinessUpdate /><Footer /></>} />} />
          <Route path="/communityUpdate/:id" element={<PrivateRoute element={<><Nav /><CommunityUpdate /><Footer /></>} />} />
          <Route path="/noticeUpdate/:id" element={<PrivateRoute element={<><Nav /><NoticeUpdate /><Footer /></>} />} />
          <Route path="/qaUpdate/:id" element={<PrivateRoute element={<><Nav /><QAUpdate /><Footer /></>} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
