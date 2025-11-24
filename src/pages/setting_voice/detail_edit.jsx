import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header.jsx";
import Button from "../../components/Button.jsx";

const AVATARS = [
  { key: "voice1", src: "/img/onboarding/Avatar.svg" },
  { key: "voice2", src: "/img/onboarding/Avatar_1.svg" },
  { key: "voice3", src: "/img/onboarding/Avatar_3.svg" },
  { key: "voice4", src: "/img/onboarding/Avatar_4.svg" },
];

const VoiceSetDetailedit = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(AVATARS[0].key);
  const [name, setName] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const togglePlay = () => setIsPlaying((P) => !P);
  const [saved, setSaved] = useState(false);
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [toast, setToast] = useState(false);
  const current = AVATARS.find((a) => a.key === selected) || AVATARS[0];

  const handleBackClick = () => {
    if (saved) {
      navigate("/mypage/voice_set/detail");
    } else {
      setOpenWarningModal(true);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setToast(true);

    setTimeout(() => setToast(false), 2000);
  };

  return (
    <Screen>
      <Header
        title="목소리1"
        showBack={true}
        onBack={handleBackClick}
      />

      <Content>
        <MainIllust src={current.src} alt="selected-avatar" />

        <SelectorRow>
          {AVATARS.map(({ key, src }) => (
            <AvatarButton
              key={key}
              onClick={() => setSelected(key)}
              $active={selected === key}
            >
              <AvatarIllust src={src} />
            </AvatarButton>
          ))}
        </SelectorRow>

        <FieldGroup>
          <FieldLabel>이름</FieldLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="사용자 이름"
          />
        </FieldGroup>

        <VoiceLabel>목소리</VoiceLabel>
        <VoiceDesc>
          녹음된 목소리가 동화에서 어떻게 적용되는지 미리 들어보세요.
        </VoiceDesc>

        <ProgressContainer>
          <ProgressBar />
          <TimeText>00:04</TimeText>
        </ProgressContainer>

        <ControlRow>
          <ControlBtn>
            <ControlIcon src="/img/setting_voice/play_3_back.svg" />
          </ControlBtn>

          <ControlBtn onClick={togglePlay}>
            <ControlIcon
              src={
                isPlaying
                  ? "/img/setting_voice/pause.svg"
                  : "/img/setting_voice/sound_play.svg"
              }
            />
          </ControlBtn>

          <ControlBtn>
            <ControlIcon src="/img/setting_voice/play_3_front.svg" />
          </ControlBtn>
        </ControlRow>

        <DeleteText onClick={() => setOpenDeleteModal(true)}>
          삭제하기
        </DeleteText>
      </Content>

      <BottomArea>
        <Button $bgColor="#342E29" $color="#FFF" onClick={handleSave}>
          저장하기
        </Button>
      </BottomArea>

      {openWarningModal && (
        <Dim onClick={() => setOpenWarningModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>수정이 완료되지 않았어요</ModalTitle>
            <ModalDesc>
              지금 나가면
              <br />수정한 내용이 반영되지 않아요
            </ModalDesc>

            <ModalBtnRow>
              <ModalBtnGray onClick={() => navigate("/mypage/voice_set/detail")}>
                나가기
              </ModalBtnGray>
              <ModalBtnYellow onClick={() => setOpenWarningModal(false)}>
                수정하기
              </ModalBtnYellow>
            </ModalBtnRow>
          </Modal>
        </Dim>
      )}

      {openDeleteModal && (
        <Dim onClick={() => setOpenDeleteModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>정말 삭제하시겠어요?</ModalTitle>
            <ModalDesc>
              한 번 삭제하면 다시 되돌릴 수 없어요.
              <br />
              그래도 삭제하시겠어요?
            </ModalDesc>

            <ModalBtnRow>
              <ModalBtnGray onClick={() => setOpenDeleteModal(false)}>
                취소
              </ModalBtnGray>
              <ModalBtnYellow onClick={() => navigate("/mypage/voice_set/main")}>
                삭제하기
              </ModalBtnYellow>
            </ModalBtnRow>
          </Modal>
        </Dim>
      )}

      {toast && <Toast>변경 사항이 저장되었어요.</Toast>}
    </Screen>
  );
};

export default VoiceSetDetailedit;

const Screen = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
`;

const Content = styled.div`
  flex: 1;
  padding: 16px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainIllust = styled.img`
  width: 144px;
  margin-top: 48px;
  margin-bottom: 24px;
`;

const SelectorRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
`;

const AvatarButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 9999px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  border: ${({ $active }) =>
    $active ? "none" : "1.5px solid #F1F1F1"};
  background: ${({ $active }) =>
    $active ? "#FFF1C4" : "#E2F5B9"};
`;

const AvatarIllust = styled.img`
  width: 46px;
  height: 46px;
`;

const FieldGroup = styled.div`
  width: 343px;
  margin-bottom: 10px;
`;

const FieldLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
  font-family: NanumSquareRound;
  margin-bottom: 8px;
  color: #3a372f;
`;

const Input = styled.input`
  width: 343px;
  height: 52px;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 0 16px;
  font-size: 16px;
  font-family: NanumSquareRound;
`;

const VoiceLabel = styled.div`
  width: 343px;
  font-size: 16px;
  font-weight: 700;
  margin-top: 12px;
  margin-bottom: 6px;
  color: #3a372f;
`;

const VoiceDesc = styled.div`
  width: 343px;
  font-size: 13px;
  color: #7a7a7a;
  margin-bottom: 15px;
`;

const ProgressContainer = styled.div`
  width: 343px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: #f7dd68;
  border-radius: 4px;
`;

const TimeText = styled.div`
  font-size: 10px;
  color: #7a7a7a;
`;

const ControlRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 28px;
  margin-top: 5px;
  margin-bottom: 40px;
`;

const ControlBtn = styled.button`
  display: flex;
  width: 56px;
  height: 56px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
`;

const ControlIcon = styled.img`
  width: 40px;
  height: 40px;
`;

const DeleteText = styled.button`
  border: none;
  background: none;
  color: #BBB;
  font-family: NanumSquareRound;
  font-size: 14px;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;

  width: 343px;
  display: flex;
  justify-content: flex-start; 
  margin-bottom: 20px;
`;

const BottomArea = styled.div`
  padding: 0 24px 20px;
  display: flex;
  justify-content: center;
`;

const Dim = styled.div`
  position: absolute;    /* fixed → absolute */
  top: 0;
  left: 0;
  width: 390px;
  height: 852px;
  background-color: rgba(0,0,0,0.4);  /* 투명도 동일하게 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;


const Modal = styled.div`
  width: 320px;
  height: 196px;
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
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 8px;
`;

const ModalDesc = styled.p`
  font-size: 14px;
  color: #7a7a7a;
  margin-bottom: 16px;
  line-height: 20px;
`;

const ModalBtnRow = styled.div`
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
  cursor: pointer;
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
  cursor: pointer;
`;


const Toast = styled.div`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  width: 358px;
  padding: 12px;
  align-items: center;
  border-radius: 12px;
  background: #FFF8E3;
  font-family: NanumSquareRound;
  font-size: 14px;
  color: #3a372f;
  z-index: 2500;
  flex-direction: column;
  align-items: flex-start;
`;
