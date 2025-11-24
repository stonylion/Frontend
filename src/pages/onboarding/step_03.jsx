import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import GlobalStyle from '../../components/GlobalStyle.jsx';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import Button from '../../components/Button.jsx';

const Onboardingsetp03 = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  // 회원가입 단계에서 저장한 username 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("username");
    if (saved) setUsername(saved);
  }, []);

  return (
    <>
      <GlobalStyle />

      <Screen>
        <Header
          title="목소리 설정"
          showBack={false}
          action={false}
        />

        <Content>
          <Illust
            src="/img/onboarding/character_main.svg"
            alt="헤드셋을 쓴 토끼 일러스트"
          />
          <Title>
            목소리 설정이
            <br />
            완료되었어요 :)
          </Title>

          <Subtitle>
            이제 아이에게 목소리를 들려줄 때 {username}님의 목소리가 함께해요.
          </Subtitle>
        </Content>

        <BottomArea>
          <Button onClick={() => navigate('/onboarding/step_04')}>
            다음
          </Button>
        </BottomArea>
      </Screen>
    </>
  );
};

export default Onboardingsetp03;

// ===== 스타일 =====
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
  gap: 16px;
  padding: 0 20px;
`;

const Illust = styled.img`
  width: 160px;
  height: auto;
  margin-top: 20px;
  margin-bottom: 8px;
  user-select: none;
  pointer-events: none;
`;

const Title = styled.h1`
  margin: 0;
  color: #3a372f;
  font-size: 24px;
  font-family: 'SOYO Maple', sans-serif;
  font-weight: 800;
  line-height: 1.5;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  margin: 6px 0 0;
  color: #8e8e8e;
  font-size: 12px;
  line-height: 1.6;
  letter-spacing: -0.01em;
`;

const BottomArea = styled.div`
  padding: 0 24px 24px;
  display: flex;
  justify-content: center;
`;
