import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from 'react-router-dom'; // Navigate 제거
import styled from 'styled-components';
import GlobalStyle from './components/GlobalStyle.jsx';

//공통 컴포넌트
import Button from './components/Button.jsx';
import Header from './components/Header.jsx';
import BottomBar from './components/Bottom.jsx';

//공통 컴포넌트 확인용
import OnboardingIntro from './pages/onboarding/main.jsx'; //온보딩 첫 화면
import OnboardingStep01 from './pages/onboarding/step_01.jsx'; // 온보딩 두번째
import OnboardingStep02 from './pages/onboarding/step_02.jsx'; // 온보딩 세번째
import OnboardingStep03 from './pages/onboarding/step_03.jsx'; // 온보딩 네번째
import OnboardingStep04 from './pages/onboarding/step_04.jsx'; // 온보딩 다섯번째
import OnboardingStep05 from './pages/onboarding/step_05.jsx'; // 온보딩 여섯번째
import Onboardingend from './pages/onboarding/end.jsx'; // 온보딩 끝
import VoiceSettingMain from './pages/setting_voice/main.jsx'; //목소리 세팅 기본화면
import VoiceSetStep01 from './pages/setting_voice/step_01.jsx'; //목소리 세팅 녹음버튼만
import VoiceSetStep02 from './pages/setting_voice/step_02.jsx'; //목소리 세팅 녹음 프로세스ing
import VoiceSetStep03 from './pages/setting_voice/step_03.jsx'; //목소리 세팅 목소리 등록
import VoiceSetDetail from './pages/setting_voice/detail.jsx'; //목소리별 디테일
import VoiceSetDetailedit from './pages/setting_voice/detail_edit.jsx'; //목소리 수정

import Signup from './pages/signup/signup.jsx'; // 회원가입
import SignupAgree from './pages/signup/signup-agree.jsx'; // 약관 설명 페이지
import Login from './pages/login/login.jsx'; // 로그인 페이지
import Intro from './pages/intro/intro.jsx'; // 인트로 페이지
import Splash from './pages/intro/splash.jsx'; // 로고 띄우는 페이지
import Home from './pages/home/home.jsx'; // 홈 페이지
import Mylib from './pages/mylib/mylib.jsx'; // 내 서재 페이지
import Script from './pages/mylib/mylib-script.jsx'; // 내 서재와 연결되는 스크립트 페이지
import Mypage from './pages/mypage/mypage.jsx'; // 마이 페이지
import Profile from './pages/mypage/mypage-profile.jsx'; //프로필 편집 페이지
import MypageKidDetail from './pages/mypage/mypage-kid-detail.jsx'; // 아이 정보 상세 페이지
import MypageKid from './pages/mypage/mypage-kid.jsx'; // 아이 정보 수정 페이지
import KidRegister from './pages/mypage/mypage-kid-register.jsx'; // 아이 정보 등록 페이지
import MypageSupport from './pages/mypage/mypage-support.jsx'; // 고객 지원 페이지
import IllustPortrait from './pages/illust/illust-portrait.jsx'; // 삽화 스타일 설정 페이지
import IllustLandscape from './pages/illust/illust-landscape.jsx'; //삽화 페이지 별 내용 생성 페이지
import StoryPlay from './pages/illust/story-play.jsx'; // 동화 생성 후 재생 및 종료 페이지
import Endwritemain from './pages/end_rewirte/main.jsx' //결말 확장
import Endwritestep01 from './pages/end_rewirte/step_01.jsx' //결말 확장 로딩
import Endwritestep02 from './pages/end_rewirte/step_02.jsx' //결말 확장 음성
import Endwritestep03 from './pages/end_rewirte/step_03.jsx' //결말 확장 채팅
import Endwritestep04 from './pages/end_rewirte/step_04.jsx' //결말 확장 완성
import StoryPlayer from './pages/player/story-player.jsx'; // 동화 재생하기 페이지

import Storystep01 from './pages/ai_story/step_01.jsx' //AI 스토리 생성
import Storystep02 from './pages/ai_story/step_02.jsx' //AI 스토리 생성 음성
import Storystep03 from './pages/ai_story/step_03.jsx' //AI 스토리 생성 텍스트
import Storystep04 from './pages/ai_story/step_04.jsx' //AI 스토리 생성 수정하기
import Storystep05 from './pages/ai_story/step_05.jsx' //AI 스토리 생성 교훈 선택
import Storystep06 from './pages/ai_story/step_06.jsx' //AI 스토리 생성 로딩
import Storystep07 from './pages/ai_story/step_07.jsx' //AI 스토리 생성 최종

function App() {
  return (
    <Root>
      <GlobalStyle />
        <Router>
          <Routes>
            <Route path="/" element={<PageWrapper orientation="portrait"><Splash /></PageWrapper>}/>

            {/* 온보딩 페이지 */}
            <Route path="/onboarding" element={<PageWrapper orientation="portrait"><OnboardingIntro /></PageWrapper>} />
            <Route path="/onboarding/step_01" element={<PageWrapper orientation="portrait"><OnboardingStep01 /></PageWrapper>} />
            <Route path="/onboarding/step_02" element={<PageWrapper orientation="portrait"><OnboardingStep02 /></PageWrapper>} />
            <Route path="/onboarding/step_03" element={<PageWrapper orientation="portrait"><OnboardingStep03 /></PageWrapper>} />
            <Route path="/onboarding/step_04" element={<PageWrapper orientation="portrait"><OnboardingStep04 /></PageWrapper>} />
            <Route path="/onboarding/step_05" element={<PageWrapper orientation="portrait"><OnboardingStep05 /></PageWrapper>} />
            <Route path="/onboarding/end" element={<PageWrapper orientation="portrait"><Onboardingend /></PageWrapper>} />

            {/* 목소리 세팅 */}
            <Route path="/mypage/voice_set/main" element={<PageWrapper orientation="portrait"><VoiceSettingMain /></PageWrapper>} />
            <Route path="/mypage/voice_set/step01" element={<PageWrapper orientation="portrait"><VoiceSetStep01 /></PageWrapper>} />
            <Route path="/mypage/voice_set/step02" element={<PageWrapper orientation="portrait"><VoiceSetStep02 /></PageWrapper>} />
            <Route path="/mypage/voice_set/step03" element={<PageWrapper orientation="portrait"><VoiceSetStep03 /></PageWrapper>} />
            <Route path="/mypage/voice_set/detail" element={<PageWrapper orientation="portrait"><VoiceSetDetail /></PageWrapper>} />
            <Route path="/mypage/voice_set/detail/edit" element={<PageWrapper orientation="portrait"><VoiceSetDetailedit /></PageWrapper>} />

            {/* 회원가입 페이지 */}
            <Route path="/signup" element={<PageWrapper orientation="portrait"><Signup /></PageWrapper>} />
            <Route path="/signup/agree/:type" element={<PageWrapper orientation="portrait"><SignupAgree /></PageWrapper>} />

            {/* 로그인 페이지 */}
            <Route path='/login' element={<PageWrapper orientation="portrait"><Login /></PageWrapper>} />

            {/* 인트로 페이지 */}
            <Route path='/intro' element={<PageWrapper orientation="portrait"><Intro /></PageWrapper>} />
            <Route path='/splash' element={<PageWrapper orientation="portrait"><Splash /></PageWrapper>} />

            {/* 홈 페이지 */}
            <Route path="/home" element={<PageWrapper orientation="portrait"><Home /></PageWrapper>} />

            {/* 내 서재 페이지 */}
            <Route path='/mylib' element={<PageWrapper orientation="portrait"><Mylib /></PageWrapper>} />
            <Route path='/mylib-script/:story_id' element={<PageWrapper orientation="portrait"><Script /></PageWrapper>} />

            {/* 마이 페이지 */}
            <Route path='/mypage' element={<PageWrapper orientation="portrait"><Mypage /></PageWrapper>} />
            <Route path='/mypage-profile' element={<PageWrapper orientation="portrait"><Profile /></PageWrapper>} />
            <Route path='/mypage-kid/:child_id' element={<PageWrapper orientation="portrait"><MypageKid /></PageWrapper>} />
            <Route path='/mypage-kid-register' element={<PageWrapper orientation="portrait"><KidRegister /></PageWrapper>} />
            <Route path='/mypage-support/:type' element={<PageWrapper orientation="portrait"><MypageSupport /></PageWrapper>} />
            <Route path='/mypage-kid-detail' element={<PageWrapper orientation="portrait"><MypageKidDetail /></PageWrapper>} />

            {/* 삽화 생성 페이지 */}
            <Route path='/illust-portrait' element={<PageWrapper orientation="portrait"><IllustPortrait /></PageWrapper>} />
            <Route path='/illust-landscape' element={<PageWrapper orientation="landscape"><IllustLandscape /></PageWrapper>} />
            <Route path='/story-play' element={<PageWrapper orientation="landscape"><StoryPlay /></PageWrapper>} />

            {/* 결말확장 */}
            <Route path='/rewrite_end' element={<PageWrapper orientation="portrait"><Endwritemain/></PageWrapper>} />
            <Route path='/rewrite_end/step01' element={<PageWrapper orientation="portrait"><Endwritestep01/></PageWrapper>} />
            <Route path='/rewrite_end/step02' element={<PageWrapper orientation="portrait"><Endwritestep02/></PageWrapper>} />
            <Route path='/rewrite_end/step03' element={<PageWrapper orientation="portrait"><Endwritestep03/></PageWrapper>} />
            <Route path='/rewrite_end/step04' element={<PageWrapper orientation="portrait"><Endwritestep04/></PageWrapper>} />

            {/* 동화 플레이어 페이지 */}
            <Route path='/story-player' element={<PageWrapper orientation="landscape"><StoryPlayer /></PageWrapper>} />

            {/* AI 스토리 생성 */}
            <Route path='/mystory/ai_story/step01' element={<PageWrapper orientation="portrait"><Storystep01/></PageWrapper>} />
            <Route path='/mystory/ai_story/step02' element={<PageWrapper orientation="portrait"><Storystep02/></PageWrapper>} />
            <Route path='/mystory/ai_story/step03' element={<PageWrapper orientation="portrait"><Storystep03/></PageWrapper>} />
            <Route path='/mystory/ai_story/step04' element={<PageWrapper orientation="portrait"><Storystep04/></PageWrapper>} />
            <Route path='/mystory/ai_story/step05' element={<PageWrapper orientation="portrait"><Storystep05/></PageWrapper>} />
            <Route path='/mystory/ai_story/step06' element={<PageWrapper orientation="portrait"><Storystep06/></PageWrapper>} />
            <Route path='/mystory/ai_story/step07' element={<PageWrapper orientation="portrait"><Storystep07/></PageWrapper>} />
          </Routes>
        </Router>
    </Root>
  );
}

export default App;

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const PageWrapper = styled.div`
width: min(100%, ${({ orientation }) => orientation === 'landscape' ? '798px' : '390px'});
height: min(100%, ${({ orientation }) => orientation === 'landscape' ? '390px' : '798px'});

  
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  overflow: hidden;

  /* 화면 중앙 고정 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;