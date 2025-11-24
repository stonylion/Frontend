import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header.jsx";
import Button from "../../components/Button.jsx";
import api from "../../api/axios.js";

const AVATARS = [
  { key: "dog", src: "/img/onboarding/Avatar.svg" },
  { key: "bear", src: "/img/onboarding/Avatar_1.svg" },
  { key: "cat", src: "/img/onboarding/Avatar_3.svg" },
  { key: "alien", src: "/img/onboarding/Avatar_4.svg" },
];

// voice_image_code 매핑
const IMAGE_CODE_MAP = {
  dog: "voice1",
  bear: "voice2",
  cat: "voice3",
  alien: "voice4",
};

const VoiceSetStep03 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { voiceId, userName } = location.state || {};

  const [selected, setSelected] = useState(AVATARS[0].key);
  const [name, setName] = useState(userName || "");

  const [openModal, setOpenModal] = useState(false);
  const [openCompleteModal, setOpenCompleteModal] = useState(false);

  const current = AVATARS.find((a) => a.key === selected) || AVATARS[0];

  /* 최종 저장 API (PATCH) */
  const handleSubmit = async () => {
    if (!voiceId) {
      alert("voiceId가 없습니다. 처음 단계부터 다시 진행해주세요.");
      return;
    }

    try {
      await api.patch(`/api/accounts/voice/${voiceId}/`, {
        voice_name: name.trim(),
        voice_image_code: IMAGE_CODE_MAP[selected],
      });

      console.log("😊 최종 보이스 데이터 저장 완료");

      setOpenCompleteModal(true);
    } catch (err) {
      console.error("⚠️ 보이스 저장 실패:", err);
      alert("보이스 저장 중 오류가 발생했습니다.");
    }
  };

  const handleExit = () => {
    setOpenModal(false);
    navigate("/mypage/voice_set/main");
  };

  return (
    <Screen>
      <Header
        title="목소리 등록하기"
        showBack={false}
        action={{
          icon: "/icons/new_right_part.svg",
          handler: () => setOpenModal(true),
        }}
      />

      <Content>
        <MainIllust src={current.src} alt="선택된 캐릭터" />

        {/* 캐릭터 선택 */}
        <SelectorRow>
          {AVATARS.map(({ key, src }) => (
            <SelectButton
              key={key}
              onClick={() => setSelected(key)}
              aria-pressed={key === selected}
              $active={key === selected}
            >
              <SelectIllust src={src} alt={`${key} 캐릭터`} />
            </SelectButton>
          ))}
        </SelectorRow>

        {/* 이름 입력 */}
        <FieldGroup>
          <FieldLabel>이름</FieldLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="사용자 이름"
            aria-label="이름 입력"
          />
        </FieldGroup>
      </Content>

      {/* 등록하기 버튼 */}
      <BottomArea>
        <Button bgColor="#342E29" color="#FFF" onClick={handleSubmit}>
          <BtnContent>
            <BtnText>등록하기</BtnText>
          </BtnContent>
        </Button>
      </BottomArea>

      {/* 나가기 경고 모달 */}
      {openModal && (
        <Dim onClick={() => setOpenModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>등록이 완료되지 않았어요</ModalTitle>
            <ModalDesc>
              지금 나가면
              <br />
              저장된 내용이 모두 사라져요.
            </ModalDesc>

            <BtnRow>
              <ModalBtnGray onClick={handleExit}>나가기</ModalBtnGray>
              <ModalBtnYellow onClick={() => setOpenModal(false)}>
                이어서 등록
              </ModalBtnYellow>
            </BtnRow>
          </Modal>
        </Dim>
      )}

      {/* 등록 완료 모달 */}
      {openCompleteModal && (
        <Dim onClick={() => setOpenCompleteModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>목소리가 등록되었어요</ModalTitle>
            <ModalDesc>
              이제 이 목소리로
              <br />
              동화를 들을 수 있어요.
            </ModalDesc>

            <ModalBtnSingle
              onClick={() => {
                setOpenCompleteModal(false);
                navigate("/mypage/voice_set/main");
              }}
            >
              확인
            </ModalBtnSingle>
          </Modal>
        </Dim>
      )}
    </Screen>
  );
};

export default VoiceSetStep03;

const Screen = styled.div`
  position: relative;
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
  padding: 16px 20px 0;
`;

const MainIllust = styled.img`
  width: 144px;
  height: auto;
  margin-top: 48px;
  margin-bottom: 32px;
  object-fit: contain;
  user-select: none;
`;

const SelectorRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 48px;
`;

const SelectButton = styled.button`
  background: none;
  cursor: pointer;
  padding: 0;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${({ $active }) =>
    $active ? "2px solid #FFD342" : "2px solid transparent"};
  box-shadow: ${({ $active }) =>
    $active ? "0 0 0 2px rgba(255, 211, 66, 0.25) inset" : "none"};
  transition: 120ms ease;
`;

const SelectIllust = styled.img`
  width: 56px;
  height: 56px;
  object-fit: contain;
`;

const FieldGroup = styled.div`
  width: 343px;
  margin-top: 6px;
`;

const FieldLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
  font-family: NanumSquareRound;
  color: #3a372f;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 343px;
  height: 52px;
  border-radius: 12px;
  border: 1px solid #eee;
  background: #fff;
  padding: 0 16px;
  font-size: 16px;
  font-family: NanumSquareRound;

  &:focus {
    outline: none;
    border-color: #ffd342;
    box-shadow: 0 0 0 3px rgba(255, 211, 66, 0.25);
  }
`;

const BottomArea = styled.div`
  padding: 0 24px calc(env(safe-area-inset-bottom, 0) + 20px);
  display: flex;
  justify-content: center;
`;

const BtnContent = styled.span`
  display: inline-flex;
  justify-content: center;
  font-weight: 800;
`;

const BtnText = styled.span`
  color: #fff;
  font-family: "NanumSquareRound";
  font-size: 16px;
  font-weight: 800;
`;

const Dim = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 390px;
  height: 852px;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Modal = styled.div`
  width: 320px;
  height: auto;
  padding: 24px 24px 16px 24px;
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  justify-content: center;
  align-items: center;
`;

const ModalTitle = styled.h3`
  margin: 6px 0 8px;
  color: #3a372f;
  font-size: 20px;
  font-weight: 800;
`;

const ModalDesc = styled.p`
  margin: 0 0 16px;
  color: #7a7a7a;
  font-size: 14px;
  font-family: NanumSquareRound;
  line-height: 22px;
  text-align: center;
  max-width: 272px;
`;

const BtnRow = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 12px;
`;

const ModalBtnGray = styled.button`
  width: 130px;
  height: 40px;
  background-color: #f1f1f1;
  border-radius: 99px;
  border: none;
  color: #7a7a7a;
  font-size: 14px;
  font-weight: 800;
`;

const ModalBtnYellow = styled.button`
  width: 130px;
  height: 40px;
  background-color: #ffd342;
  border-radius: 99px;
  border: none;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
`;

const ModalBtnSingle = styled.button`
  width: 272px; /* gray + gap + yellow */
  height: 40px;
  background-color: #ffd342;
  border-radius: 99px;
  border: none;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
`;
