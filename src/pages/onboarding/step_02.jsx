import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header.jsx";
import Button from "../../components/Button.jsx";
import api from "../../api/axios.js";

const ICON_RECORDING = "/img/onboarding/recording.svg";
const ICON_RECORD11 = "/img/onboarding/Record11.svg";
const ICON_PAUSE = "/img/onboarding/record_pause.svg";
const ICON_RESTART = "/img/onboarding/restart.svg";
const ICON_DONE = "/img/onboarding/done.svg";

const OnboardingStep02 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Step01에서 전달받은 voiceId
  const { voiceId } = location.state || {};


  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle → recording → paused
  const [audioURL, setAudioURL] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (!voiceId) {
      navigate("/onboarding/step_01");
    }
  }, [voiceId, navigate]);

  if (!voiceId) return null; // UI 막기

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("마이크 접근 오류:", err);
      alert("마이크 권한을 허용해주세요.");
    }
  };

  // 녹음 중단
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  // 녹음 버튼
  const handleMicClick = () => {
    if (status === "idle") {
      setStatus("recording");
      startRecording();
    } else if (status === "recording") {
      setStatus("paused");
      stopRecording();
    } else {
      setStatus("idle");
      setAudioURL(null);
      chunksRef.current = [];
    }
  };

  // 다시 녹음
  const restartRecording = () => {
    setStatus("recording");
    setAudioURL(null);
    chunksRef.current = [];
    startRecording();
  };

  const uploadToServer = async () => {
    if (!audioURL) {
      alert("녹음 파일이 없습니다!");
      return;
    }

    try {
      const blob = await fetch(audioURL).then((res) => res.blob());

      const formData = new FormData();
      formData.append("voice_id", voiceId);
      formData.append("reference_audio", blob, "myvoice.wav");

      const res = await api.post("/api/accounts/voice/clone/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("업로드 성공:", res.data);

      navigate("/onboarding/step_03", {
        state: {
          voiceId: res.data.voice_id,
          clonedVoiceURL: res.data.cloned_voice_url,
          referenceAudioURL: res.data.reference_audio_url,
        },
      });
    } catch (err) {
      console.error("업로드 실패:", err);
      console.log("서버 응답:", err.response?.data);
      alert("녹음 업로드 중 오류가 발생했습니다.");
    }
  };

  // 안내 메시지
  const renderArcTexts = () => {
    if (status === "recording")
      return <ArcText>10초 이상 가이드 문장을 읽어주세요.</ArcText>;

    if (status === "paused")
      return <ArcText>내가 방금 녹음한 목소리를 들어보세요.</ArcText>;

    return (
      <>
        <ArcText>조용한 곳에서 또박또박 말씀해주세요.</ArcText>
        <ArcText>반드시 가이드 문장과 동일하게 녹음해야 해요.</ArcText>
      </>
    );
  };

  const statusIcon =
    status === "idle"
      ? ICON_RECORDING
      : status === "recording"
      ? ICON_RECORD11
      : ICON_PAUSE;

  return (
    <Screen>
      <Header
        title="목소리 설정"
        showBack={true}
        onBack={() => navigate(-1)}
        action={{ text: "건너뛰기", handler: () => setOpen(true) }}
      />

      <Content>
        <GuideWrap>
          <Badge>가이드 문장</Badge>
          <Quote>
            “이게 뭐지? 작은 상자 안엔
            <br />
            반짝이는 돌이 들어 있었어요.
            <br />
            누가 여기다 두고 간 걸까?”
          </Quote>
        </GuideWrap>

        <Spacer />

        <ArcArea>
          <Arc />
          <ArcTexts>{renderArcTexts()}</ArcTexts>

          {status !== "paused" ? (
            <MicButton onClick={handleMicClick}>
              <img src={statusIcon} width="64" height="64" />
            </MicButton>
          ) : (
            <ControlRow>
              <IconBtn onClick={restartRecording}>
                <img src={ICON_RESTART} width="64" height="64" />
              </IconBtn>

              <IconBtn onClick={() => audioURL && new Audio(audioURL).play()}>
                <img src={ICON_PAUSE} width="64" height="64" />
              </IconBtn>

              <IconBtn onClick={uploadToServer}>
                <img src={ICON_DONE} width="64" height="64" />
              </IconBtn>
            </ControlRow>
          )}
        </ArcArea>
      </Content>

      {open && (
        <Dim onClick={() => setOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>목소리 설정을 건너뛰시겠습니까?</ModalTitle>
            <ModalDesc>
              지금까지 입력한 정보는 저장되지 않으며,
              <br />
              기본 음성으로 동화가 재생돼요.
            </ModalDesc>

            <BtnRow>
              <ModalBtnGray onClick={() => navigate("/onboarding/step_04")}>
                나가기
              </ModalBtnGray>
              <ModalBtnYellow onClick={() => setOpen(false)}>
                이어서 설정
              </ModalBtnYellow>
            </BtnRow>
          </Modal>
        </Dim>
      )}
    </Screen>
  );
};

export default OnboardingStep02;


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
  padding: 16px 20px 0;
`;

const GuideWrap = styled.div`
  display: flex;
  margin-top: 90px;
  width: 239px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: #ffd342;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  font-family: NanumSquareRound;
`;

const Quote = styled.p`
  margin: 0;
  text-align: center;
  color: #3a372f;
  font-size: 20px;
  font-family: NanumSquareRound;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: -0.02em;
`;

const Spacer = styled.div`
  flex: 1;
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
  width: 100%;
  max-width: 320px;
  text-align: center;
`;

const ArcText = styled.div`
  color: #736a64;
  font-size: 14px;
  font-family: NanumSquareRound;
  line-height: 22px;
`;

const MicButton = styled.button`
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  border: none;
  padding: 0;
`;

const ControlRow = styled.div`
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 60px;
`;

const IconBtn = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
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
`;

const Modal = styled.div`
  width: 320px;
  height: 196px;
  padding: 24px;
  border-radius: 16px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 22px;
  align-items: center;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 800;
`;

const ModalDesc = styled.p`
  font-size: 14px;
  color: #7a7a7a;
  text-align: center;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 12px;
`;

const ModalBtnGray = styled.button`
  width: 130px;
  height: 40px;
  background: #f1f1f1;
  border-radius: 99px;
  color: #7a7a7a;
  font-weight: 800;
`;

const ModalBtnYellow = styled.button`
  width: 130px;
  height: 40px;
  background: #ffd342;
  border-radius: 99px;
  color: #fff;
  font-weight: 800;
`;
