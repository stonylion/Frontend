import React, { useState, useRef } from "react";
import styled from "styled-components";
import Header from "../../components/Header.jsx";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const ICON_RIGHT_HEADER = "/icons/new_right_part.svg";
const ICON_TEXT_RIGHT = "/img/ai_story/right.svg";
const ICON_RECORD = "/img/ai_story/Record.svg";
const ICON_PAUSE = "/img/onboarding/record_pause.svg";
const ICON_AGAIN = "/img/ai_story/again.svg";
const ICON_CLEAR = "/img/ai_story/clear.svg";
const ICON_DONE = "/img/ai_story/done.svg";

const Storystep02 = () => {
  const navigate = useNavigate();

  // idle | recording | select
  const [status, setStatus] = useState("idle");
  const [showQuitModal, setShowQuitModal] = useState(false);

  // STT 기반 텍스트
  const [fullDraftText, setFullDraftText] = useState("");
  const [viewDraftText, setViewDraftText] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  /** 녹음 시작 */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      recorder.start();
      console.log("🎙 녹음 시작");
    } catch (err) {
      console.error("녹음 시작 실패:", err);
    }
  };

  /** 녹음 종료 + STT API 호출 */
  const stopRecording = async () => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) return resolve();

      mediaRecorderRef.current.onstop = async () => {
        try {
          const blob = new Blob(audioChunks.current, { type: "audio/webm" });

          const formData = new FormData();
          formData.append("audio", blob, "voice.webm");

          const res = await api.post("/api/story/draft_stt/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          setFullDraftText(res.data.draft);
          setViewDraftText(res.data.draft.slice(0, 79));

          console.log("🎉 변환 완료:", res.data);
        } catch (err) {
          console.error("STT 오류:", err.response?.data || err);
        }

        resolve();
      };

      mediaRecorderRef.current.stop();
    });
  };

  /** 마이크 버튼 */
  const handleMicClick = async () => {
    if (status === "idle") {
      startRecording();
      setStatus("recording");
    } else if (status === "recording") {
      await stopRecording();
      setStatus("select");
    }
  };

  /** 다시 녹음 */
  const handleAgain = () => {
    setStatus("idle");
    setFullDraftText("");
    setViewDraftText("");
  };

  /** 다음 */
  const handleDone = () => {
    navigate("/mystory/ai_story/step04", {
      state: { text: fullDraftText },
    });
  };

  const renderArcTexts = () => {
    if ((status === "recording" || status === "select") && viewDraftText)
      return <ArcText>{viewDraftText}</ArcText>;

    if (status === "recording")
      return <ArcText>버튼을 눌러 말하기를 멈출 수 있어요.</ArcText>;

    if (status === "select")
      return <ArcText>에피소드 음성 입력이 완료되었어요.</ArcText>;

    return <ArcText>조용한 곳에서 또박또박 말씀해주세요.</ArcText>;
  };

  const statusIcon = status === "idle" ? ICON_RECORD : ICON_PAUSE;

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
        <ProgressBar $progress={20} />
      </ProgressWrapper>

      <Content>
        <MainText>
          아이에게 들려주고 싶은 이야기를
          <br />
          자유롭게 말씀해주세요.
        </MainText>

        <SubTextRow onClick={() => navigate("/mystory/ai_story/step03")}>
          <SubText>텍스트로 입력하기</SubText>
          <RightArrow src={ICON_TEXT_RIGHT} />
        </SubTextRow>
      </Content>

      <ArcArea>
        <Arc />
        <ArcTexts>{renderArcTexts()}</ArcTexts>

        {(status === "idle" || status === "recording") && (
          <MicButton onClick={handleMicClick}>
            <img src={statusIcon} width="64" />
          </MicButton>
        )}

        {status === "select" && (
          <ControlRow>
            <ControlBtn onClick={handleAgain}>
              <img src={ICON_AGAIN} width="64" />
            </ControlBtn>

            <ControlBtnDisabled>
              <div className="bg" />
              <img src={ICON_CLEAR} width="64" />
            </ControlBtnDisabled>

            <ControlBtn onClick={handleDone}>
              <img src={ICON_DONE} width="64" />
            </ControlBtn>
          </ControlRow>
        )}
      </ArcArea>

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

export default Storystep02;


const Screen = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  overflow: hidden;
`;

const ProgressWrapper = styled.div`
  width: 100%;
  height: 4px;
  background: #f2f2f2;
`;

const ProgressBar = styled.div`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background: #ffd342;
  transition: width 0.3s ease;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const MainText = styled.p`
  color: #342e29;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
`;

const SubTextRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

const SubText = styled.p`
  color: #bbb;
  font-size: 14px;
`;

const RightArrow = styled.img`
  width: 14px;
  height: 14px;
`;

const ArcArea = styled.div`
  position: relative;
  width: 390px;
  height: 330px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const Arc = styled.div`
  position: absolute;
  inset: 0;
  background: #fff8e3;
  border-top-left-radius: 90% 50%;
  border-top-right-radius: 90% 50%;
`;

const ArcTexts = styled.div`
  position: absolute;
  bottom: 176px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  text-align: center;
`;

const ArcText = styled.div`
  color: #736a64;
  font-size: 14px;
  line-height: 22px;
`;

const MicButton = styled.button`
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
`;

const ControlRow = styled.div`
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 40px;
`;

const ControlBtn = styled(MicButton)`
  cursor: pointer;
`;

const ControlBtnDisabled = styled(MicButton)`
  position: relative;
  width: 64px;
  height: 64px;
  pointer-events: none;
  cursor: default;

  .bg {
    position: absolute;
    inset: 0;
    background: #c5e384;
    border-radius: 50%;
    z-index: 1;
  }

  img {
    position: relative;
    z-index: 2;
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
  z-index: 999;
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
  justify-content: center;
  align-items: center;
`;

const ModalTitle = styled.h3`
  color: #393939;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
`;

const ModalDesc = styled.p`
  color: #7a7a7a;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
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
  background-color: #ffd342;
  border-radius: 99px;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 800;
`;
