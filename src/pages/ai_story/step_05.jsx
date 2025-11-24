import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header.jsx";
import api from "../../api/axios.js";

const ICON_RIGHT_HEADER = "/icons/new_right_part.svg";
const LIGHTNING_ICON = "/img/ai_story/flash.svg";
const ADD_ICON = "/img/ai_story/add.svg";

const Storystep05 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const storyText = location.state?.text || "";

  const [selected, setSelected] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  const [customInput, setCustomInput] = useState("");
  const [customList, setCustomList] = useState([]);

  const DEFAULT_MORALS = [
    "가족","감사","공감","나눔","노력","다양성",
    "사랑","생명","신뢰","용기","우정","정직",
    "존중","절제","책임감","희망"
  ];

  useEffect(() => {
    const fetchMorals = async () => {
      try {
        const res = await api.post("/api/story/story-morals/recommend/", {
          text: storyText
        });

        setRecommended(res.data.recommended_morals);
      } catch (err) {
        console.log("❌ 추천 교훈 API 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMorals();
  }, []);

  // 선택 토글
  const toggleValue = (v) => {
    if (selected.includes(v)) {
      setSelected(selected.filter((x) => x !== v));
    } else if (selected.length + customList.length < 3) {
      setSelected([...selected, v]);
    }
  };

  // 커스텀 입력 엔터
  const handleEnter = (e) => {
    if (e.key === "Enter" && customInput.trim()) {
      e.preventDefault();
      if (selected.length + customList.length < 3) {
        setCustomList([...customList, customInput.trim()]);
        setCustomInput("");
      }
    }
  };

  const removeCustom = (v) => {
    setCustomList(customList.filter((x) => x !== v));
  };

  const handleNext = async () => {
    try {
      // 기본 교훈 → id로 변환
      const selected_morals_ids = selected
        .map((text) => DEFAULT_MORALS.indexOf(text) + 1)
        .filter((id) => id > 0);

      await api.post("/api/story/story-morals/", {
        selected_morals: selected_morals_ids,
        custom_morals: customList
      });

      navigate("/mystory/ai_story/step06", {
        state: { text: storyText }
      });
    } catch (err) {
      console.log("❌ 교훈 저장 API 오류:", err);
    }
  };

  return (
    <Screen>
      <Header
        title="동화 만들기"
        showBack={true}
        onBack={() => navigate(-1)}
        action={{ icon: ICON_RIGHT_HEADER }}
      />

      <ProgressBarContainer>
        <ProgressBar $progress={60} />
      </ProgressBarContainer>

      <Content>
        <Title>교훈 선택 (최대 3개)</Title>

        <AIBox>
          <AIHeader>
            <LightningIcon src={LIGHTNING_ICON} />
            <AIText>AI 추천 교훈</AIText>
          </AIHeader>

          {loading ? (
            <LoadingBox>추천 교훈 생성 중...</LoadingBox>
          ) : (
            <AIList>
              {recommended.map((m) => (
                <AITag
                  key={m.key}
                  $active={selected.includes(m.name)}
                  onClick={() => toggleValue(m.name)}
                >
                  {m.name}
                </AITag>
              ))}
            </AIList>
          )}
        </AIBox>

        <TagList>
          {DEFAULT_MORALS.map((m) => (
            <Tag
              key={m}
              $active={selected.includes(m)}
              onClick={() => toggleValue(m)}
            >
              {m}
            </Tag>
          ))}
        </TagList>

        <CustomBox>
          <Label>직접 입력</Label>

          <ChipContainer>
            {customList.map((m) => (
              <CustomChip key={m}>
                {m}
                <DeleteBtn onClick={() => removeCustom(m)}>×</DeleteBtn>
              </CustomChip>
            ))}

            <InputWrap>
              <AddIcon src={ADD_ICON} />
              <CustomInput
                placeholder="직접 입력하기"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={handleEnter}
              />
            </InputWrap>
          </ChipContainer>
        </CustomBox>
      </Content>

      <BottomArea>
        <NextButton onClick={handleNext}>다음</NextButton>
      </BottomArea>
    </Screen>
  );
};

export default Storystep05;


const Screen = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 4px;
  background: #eee;
`;

const ProgressBar = styled.div`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background: #ffd342;
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 16px;
`;

const AIBox = styled.div`
  padding: 16px;
  background: #fcfbe9;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const AIHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LightningIcon = styled.img`
  width: 16px;
`;

const AIText = styled.div`
  color: #c1e776;
  font-weight: 700;
`;

const LoadingBox = styled.div`
  margin-top: 10px;
  color: #aaa;
  font-size: 14px;
`;

const AIList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const AITag = styled.button`
  padding: 8px 16px;
  border-radius: 30px;
  font-weight: 800;

  ${({ $active }) =>
    $active
      ? css`
          background: #c1e776;
          color: white;
          border: none;
        `
      : css`
          border: 1px solid #d2f29c;
          background: #f5fde9;
          color: #c1e776;
        `}
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.button`
  padding: 8px 16px;
  border-radius: 30px;
  font-weight: 700;

  ${({ $active }) =>
    $active
      ? css`
          background: #342e29;
          color: white;
          border: none;
        `
      : css`
          background: #f1f1f1;
          color: #bbb;
          border: none;
        `}
`;

const CustomBox = styled.div`
  margin-top: 20px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 6px;
`;

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CustomChip = styled.div`
  background: #342e29;
  color: white;
  padding: 0 12px;
  height: 36px;
  border-radius: 30px;
  display: flex;
  align-items: center;
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: white;
  margin-left: 6px;
  cursor: pointer;
`;

const InputWrap = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 30px;
  height: 36px;
  padding: 0 12px;
`;

const AddIcon = styled.img`
  width: 14px;
  margin-right: 6px;
`;

const CustomInput = styled.input`
  border: none;
  background: transparent;
  width: 90px;

  &:focus {
    outline: none;
  }
`;

const BottomArea = styled.div`
  padding: 24px;
`;

const NextButton = styled.button`
  width: 100%;
  height: 56px;
  border-radius: 999px;
  border: none;
  background: #ffd342;
  color: white;
  font-weight: 800;
  font-size: 16px;
`;
