import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button.jsx';

const Onboardingend = () => {
  const navigate = useNavigate();

  return (
    <Screen>
      {/* 중앙 콘텐츠 */}
      <Content>
        <Illust
          src="/img/onboarding/avator_group.svg"
          alt="캐릭터 집단"
        />

        {/* 가운데 문구 */}
        <CenterCopy>
          환영해요!
          <br />
          우리 가족만의
          <br />
          동화를 시작해보세요
        </CenterCopy>

        {/* 버튼 두 개 (문구 바로 아래로 이동) */}
        <ButtonsCol>
          <StyledButton
            $bgColor="#FFD342"
            $color="#FFF"
            onClick={() => navigate('/home')}
          >
            홈으로
          </StyledButton>
          <StyledButton
            className="dark"
            onClick={() => navigate('/mystory/ai_story/step01')} 
          >
            동화 만들기
          </StyledButton>
        </ButtonsCol>
      </Content>
    </Screen>
  );
};

export default Onboardingend;

//스타일 컴포넌트
const Screen = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
`;

const Content = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 20px;
  padding: 0 20px;
`;

const Illust = styled.img`
  width: 160px;
  height: auto;
  margin-top: 10px;
  margin-bottom: 8px;
  user-select: none;
  pointer-events: none;
`;

const CenterCopy = styled.h1`
  margin: 0;
  color: #342E29;
  text-align: center;
  font-family: "SOYO Maple";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 36px;
  letter-spacing: -0.02em;
`;

const ButtonsCol = styled.div`
  display: flex;
  flex-direction: column;
  width: 220px;
  gap: 10px;
  margin-top: 28px;
`;

/* 공통 버튼 스타일 오버라이드 */
const StyledButton = styled(Button)`
  display: flex;
  width: 220px;
  padding: 0 12px;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;

  &.dark {
    background-color: #342E29 !important;
    color: #FFF !important;
  }
`;
