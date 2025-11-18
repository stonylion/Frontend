import React, { useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header.jsx";
import { useNavigate } from "react-router-dom";

const Storystep01 = () => {
  const navigate = useNavigate();


  const [length, setLength] = useState("0-3분");
  const [age, setAge] = useState("0-3세");

  return (
    <Screen>
      {/* 공통 헤더 */}
      <Header
        title="동화 만들기"
        showBack={true}
        onBack={() => navigate(-1)}
      />

      {/* 프로그레스 바 */}
      <ProgressWrapper>
        <ProgressBar $progress={10} />
      </ProgressWrapper>

      <Content>
        <Label>
          동화 분량 <Required>*</Required>
        </Label>
        <ButtonRow>
          <SelectButton
            $active={length === "0-3분"}
            onClick={() => setLength("0-3분")}
          >
            0~3분
          </SelectButton>
          <SelectButton
            $active={length === "4-7분"}
            onClick={() => setLength("4-7분")}
          >
            4~7분
          </SelectButton>
          <SelectButton
            $active={length === "7-10분"}
            onClick={() => setLength("7-10분")}
          >
            7~10분
          </SelectButton>
        </ButtonRow>

        {/* 아이 연령대 */}
        <Label>
          아이 연령대 <Required>*</Required>
        </Label>
        <ButtonRow>
          <SelectButton
            $active={age === "0-3세"}
            onClick={() => setAge("0-3세")}
          >
            0~3세
          </SelectButton>
          <SelectButton
            $active={age === "4-6세"}
            onClick={() => setAge("4-6세")}
          >
            4~6세
          </SelectButton>
          <SelectButton
            $active={age === "7-12세"}
            onClick={() => setAge("7-12세")}
          >
            7~12세
          </SelectButton>
        </ButtonRow>
      </Content>

      {/* 하단 버튼 */}
      <BottomArea>
        <NextButton onClick={() => navigate("/mystory/ai_story/step02")}>
          다음
        </NextButton>
      </BottomArea>
    </Screen>
  );
};

export default Storystep01;

//스타일 컴포넌트
const Screen = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
`;

/*프로그레스 바 */
const ProgressWrapper = styled.div`
  width: 100%;
  height: 4px;
  background: #f2f2f2;
`;

const ProgressBar = styled.div`
  width: ${({ $progress }) => $progress || 0}%;
  height: 100%;
  background: var(--color-bg-primary, #FFD342);
  transition: width 0.3s ease;
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const Label = styled.label`
  color: var(--color-text-primary, #393939);
  font-family: NanumSquareRound;
  font-size: 16px;
  font-weight: 800;
  line-height: 24px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Required = styled.span`
  color: var(--color-orange-400, #ff8041);
  font-family: NanumSquareRound;
  font-size: 16px;
  font-weight: 800;
  line-height: 24px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: -16px;
`;

const SelectButton = styled.button`
  min-width: 88px;
  height: 36px;
  border-radius: 999px;
  border: none;
  cursor: pointer;

  ${({ $active }) =>
    $active
      ? `
      background: #393939;
      color: var(--color-text-interactive-inverse, #FFF);
    `
      : `
      background: #f2f2f2;
      color: var(--color-text-tertiary, #BBB);
    `}

  font-family: NanumSquareRound;
  font-size: 14px;
  font-weight: 800;
  line-height: 22px;
  text-align: center;
`;

const BottomArea = styled.div`
  padding: 16px 24px calc(env(safe-area-inset-bottom, 0) + 24px);
  display: flex;
  justify-content: center;
`;

const NextButton = styled.button`
  width: 100%;
  max-width: 343px;
  height: 56px;
  border-radius: 999px;
  border: none;
  background: var(--color-bg-primary, #FFD342);
  color: var(--color-text-interactive-inverse, #FFF);
  font-family: NanumSquareRound;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
`;
