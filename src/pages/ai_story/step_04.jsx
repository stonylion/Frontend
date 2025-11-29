import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const ICON_RIGHT_HEADER = "/icons/new_right_part.svg";
const ICON_RIGHT = "/img/ai_story/right.svg";

const Storystep04 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const incomingText = location.state?.text || "";
  const source = location.state?.source || "text";

  const [text, setText] = useState(incomingText);
  const [showQuitModal, setShowQuitModal] = useState(false);

  useEffect(() => {
    if (source !== "voice") return;

    const loadDraft = async () => {
      try {
        const res = await api.get("/api/story/draft/");
        if (res.data?.draft) {
          setText(res.data.draft);
        }
      } catch (err) {
        console.log("⚠ draft 불러오기 오류:", err.response?.data || err);
      }
    };

    loadDraft();
  }, [source]);

  const handleNext = async () => {
    if (!text.trim()) return;

    try {
      await api.put("/api/story/draft/", { text });
    } catch (err) {
      console.log("⚠ draft 저장 오류:", err.response?.data || err);
    }

    navigate("/mystory/ai_story/step05", {
      state: { text },
    });
  };

  return (
    <Screen>
      <Header
        title="동화 만들기"
        showBack={true}
        onBack={() => navigate(-1)}
        action={{
          icon: ICON_RIGHT_HEADER,
          handler: () => setShowQuitModal(true),
        }}
      />

      <ProgressWrapper>
        <ProgressBar $progress={40} />
      </ProgressWrapper>

      <Content>
        <Label>에피소드</Label>
        <SubText>자유롭게 수정해 보세요.</SubText>

        <InputBox value={text} onChange={(e) => setText(e.target.value)} />

        <GuideText>최소 50자 이상 입력해주세요.</GuideText>
      </Content>

      <BottomArea>
        <VoiceText onClick={() => navigate("/mystory/ai_story/step02")}>
          음성으로 입력하기&nbsp;
          <ArrowIcon src={ICON_RIGHT} />
        </VoiceText>

        <NextButton disabled={!text.trim()} onClick={handleNext}>
          다음
        </NextButton>
      </BottomArea>

      {showQuitModal && (
        <Dim onClick={() => setShowQuitModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>앗! 그만두시겠어요?</ModalTitle>
            <ModalDesc>
              아직 동화를 완성하지 못했어요.
              <br />
              나가면 지금까지의 기록을 되돌릴 수 없어요.
            </ModalDesc>

            <ModalBtnRow>
              <ModalBtnGray onClick={() => navigate("/home")}>
                그만두기
              </ModalBtnGray>
              <ModalBtnYellow onClick={() => setShowQuitModal(false)}>
                계속 제작하기
              </ModalBtnYellow>
            </ModalBtnRow>
          </Modal>
        </Dim>
      )}
    </Screen>
  );
};

export default Storystep04;




const Screen = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
`;

const ProgressWrapper = styled.div`
  width: 100%;
  height: 4px;
  background: #f2f2f2;
`;

const ProgressBar = styled.div`
  width: ${({ $progress }) => $progress || 0}%;
  height: 100%;
  background: #ffd342;
  transition: width 0.3s ease;
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.h3`
  color: #393939;
  font-family: NanumSquareRound;
  font-size: 16px;
  font-weight: 800;
`;

const SubText = styled.p`
  color: #7a7a7a;
  font-family: NanumSquareRound;
  font-size: 12px;
  margin-bottom: 12px;
`;

const InputBox = styled.textarea`
  width: 100%;
  height: 456px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
  resize: none;

  font-family: NanumSquareRound;
  font-size: 16px;
  color: #393939;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    outline: none;
    border-color: #ffd342;
  }
`;

const GuideText = styled.div`
  padding: 0 16px;
  color: #bbb;
  font-family: NanumSquareRound;
  font-size: 12px;
  line-height: 20px;
`;

const BottomArea = styled.div`
  padding: 16px 24px calc(env(safe-area-inset-bottom, 0) + 24px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const VoiceText = styled.p`
  color: #bbb;
  font-family: NanumSquareRound;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const ArrowIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const NextButton = styled.button`
  width: 100%;
  max-width: 343px;
  height: 56px;
  border-radius: 999px;
  border: none;
  background: #ffd342;
  color: white;
  font-family: NanumSquareRound;
  font-size: 16px;
  font-weight: 800;

  &:disabled {
    opacity: 0.4;
  }
`;

const Dim = styled.div`
  position: absolute;
  inset: 0;
  width: 390px;
  height: 852px;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 320px;
  height: 196px;
  padding: 24px 24px 16px;
  background: #fff;
  border-radius: 16px;

  display: flex;
  flex-direction: column;
  gap: 22px;
  align-items: center;
`;

const ModalTitle = styled.h3`
  color: #393939;
  font-size: 20px;
  font-weight: 800;
`;

const ModalDesc = styled.p`
  color: #7a7a7a;
  font-size: 14px;
  text-align: center;
  line-height: 22px;
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
`;

const ModalBtnYellow = styled.button`
  width: 130px;
  height: 40px;
  background: #ffd342;
  border-radius: 99px;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 800;
`;
