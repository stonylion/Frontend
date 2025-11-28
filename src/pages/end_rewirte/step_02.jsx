import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header.jsx";
import api from "../../api/axios.js";

const CHARACTER = "/img/end_rewrite/lion.svg";
const MUTE_ICON = "/img/end_rewrite/microphone.svg";
const CHAT_ICON = "/img/end_rewrite/chat.svg";
const CLOSE_ICON = "/icons/new_right_part.svg";

const Endwritestep02 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const storyId = location.state?.storyId;

  const [question, setQuestion] = useState("");
  const [chatId, setChatId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [openExit, setOpenExit] = useState(false);
  const [openEndingModal, setOpenEndingModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordStartTime = useRef(null);

  const didFetch = useRef(false);

  useEffect(() => {
    if (!storyId) {
      navigate("/rewrite_end/");
    }
  }, [storyId, navigate]);

  const loadInitialQuestion = async () => {
    try {
      setIsAnimating(true);

      const res = await api.post(
        `/api/AI/stories/${storyId}/extend-chat/stream/`,
        {
          chat_id: null,
          user_message: "",
          input_modality: "text",
        }
      );

      const { text, chat_id, can_finalize } = res.data;

      setChatId(chat_id);
      setQuestion(text || "");

      const apiFinalize = !!can_finalize;
      const textFinalize =
        text?.includes("확장해도") ||
        text?.includes("완성해도") ||
        text?.includes("확장");

      if (apiFinalize || textFinalize) {
        setOpenEndingModal(true);
      }
    } catch (err) {
      console.error("⚠️ 첫 질문 불러오기 실패:", err);
      setQuestion("질문을 불러오지 못했어. 다시 말해줄래?");
    } finally {
      setIsAnimating(false);
    }
  };

  useEffect(() => {
    if (!storyId) return;

    if (!didFetch.current) {
      didFetch.current = true;
      loadInitialQuestion();
    }
  }, [storyId]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recordStartTime.current = Date.now();

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.start(400);

      setIsRecording(true);
      setIsAnimating(true);
    } catch (err) {
      console.error("⚠️ 마이크 권한 오류:", err);
    }
  };

  const stopRecording = async (sendToServer = true) => {
    const now = Date.now();
    if (now - recordStartTime.current < 500) {
      return;
    }

    const recorder = mediaRecorderRef.current;

    if (recorder) {
      try {
        recorder.stop();
        recorder.stream.getTracks().forEach((t) => t.stop());
      } catch (err) {
        console.error("⚠️ 녹음 종료 오류:", err);
      }
    }

    mediaRecorderRef.current = null;
    setIsRecording(false);
    setIsAnimating(false);

    if (sendToServer) await sendVoiceToAI();
  };

  const sendVoiceToAI = async () => {
    if (!audioChunksRef.current.length) return;

    const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const file = new File([blob], "voice.webm", { type: "audio/webm" });

    const form = new FormData();
    form.append("audio", file);
    form.append("voice", "alloy");

    if (chatId) form.append("chat_id", chatId);

    try {
      const res = await api.post(
        `/api/AI/stories/${storyId}/extend-chat/voice/`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { text, chat_id, can_finalize } = res.data;

      setChatId(chat_id);
      setQuestion(text || "");

      const apiFinalize = !!can_finalize;
      const textFinalize =
        text?.includes("확장해도") ||
        text?.includes("완성해도") ||
        text?.includes("확장");

      if (apiFinalize || textFinalize) {
        setOpenEndingModal(true);
      }
    } catch (err) {
      console.error("⚠️ 질문 생성 실패:", err);
      setQuestion("질문을 불러오지 못했어. 다시 말해줄래?");
    } finally {
      audioChunksRef.current = [];
    }
  };

  const handleExpandEnding = async () => {
    setLoading(true);

    try {
      const res = await api.post(`/api/AI/stories/${storyId}/extend/`, {
        chat_id: chatId,
      });

      navigate("/rewrite_end/step04", {
        state: {
          storyId,
          extendedStory: res.data.extended_story,
        },
      });
    } catch (err) {
      console.error("⚠️ 결말 확장 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueVoice = () => {
    setOpenEndingModal(false);
  };

  const handleMicClick = () => {
    if (!isRecording) return startRecording();
    stopRecording(true);
  };

  const handleChatClick = () => {
    if (isRecording) stopRecording(false);

    navigate("/rewrite_end/step03", {
      state: { storyId, chatId, question },
    });
  };

  return (
    <Screen>
      <Header title="" showBack={false} />

      <CloseBtn onClick={() => setOpenExit(true)}>
        <img src={CLOSE_ICON} alt="닫기" />
      </CloseBtn>

      <Content>
        <Character src={CHARACTER} alt="character" />
        <Question>{question || "기다려줘… 질문 준비 중이야!"}</Question>
      </Content>

      <ArcArea>
        <Arc />
        <DotWrapper>
          {Array.from({ length: 5 }).map((_, i) => (
            <Dot key={i} $delay={i * 0.2} $isAnimating={isAnimating} />
          ))}
        </DotWrapper>

        <BottomIcons>
          <MicButton onClick={handleMicClick}>
            <img src={MUTE_ICON} alt="mic" />
          </MicButton>

          <IconButton onClick={handleChatClick}>
            <img src={CHAT_ICON} alt="chat" />
          </IconButton>
        </BottomIcons>
      </ArcArea>

      {openEndingModal && (
        <EndingDim onClick={() => setOpenEndingModal(false)}>
          <EndingModal onClick={(e) => e.stopPropagation()}>
            <EndingTitle>결말을 확장할까요?</EndingTitle>
            <EndingDesc>
              대화가 충분히 진행되었어요!
              <br />
              결말을 확장할까요?
            </EndingDesc>

            <EndingBtnRow>
              <EndingBtnGray onClick={handleContinueVoice}>
                더 대화하기
              </EndingBtnGray>
              <EndingBtnYellow onClick={handleExpandEnding}>
                결말 확장하기
              </EndingBtnYellow>
            </EndingBtnRow>
          </EndingModal>
        </EndingDim>
      )}

      {loading && (
        <LoadingDim>
          <LoadingModal>
            <LoadingTitle>결말을 확장하고 있어요!</LoadingTitle>
            <LoadingDesc>잠시만 기다려주세요</LoadingDesc>
          </LoadingModal>
        </LoadingDim>
      )}

      {/* 나가기 모달 */}
      {openExit && (
        <ExitDim onClick={() => setOpenExit(false)}>
          <ExitModal onClick={(e) => e.stopPropagation()}>
            <ExitTitle>앗! 그만두시겠어요?</ExitTitle>
            <ExitDesc>
              아직 대화를 완성하기엔 대화가 부족해요.
              <br />
              나가면 지금까지의 대화를 되돌릴 수 없어요.
            </ExitDesc>
            <ExitBtnRow>
              <ExitBtnGray onClick={() => navigate("/rewrite_end/")}>
                나가기
              </ExitBtnGray>
              <ExitBtnYellow onClick={() => setOpenExit(false)}>
                계속 대화하기
              </ExitBtnYellow>
            </ExitBtnRow>
          </ExitModal>
        </ExitDim>
      )}
    </Screen>
  );
};

export default Endwritestep02;


const bounce = keyframes`
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(-10px); opacity: 1; }
`;

const Screen = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  overflow: hidden;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: transparent;
  border: none;
  cursor: pointer;

  img {
    width: 28px;
    height: 28px;
  }
`;

const Content = styled.div`
  flex: 1;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Character = styled.img`
  width: 138px;
  margin-bottom: 20px;
`;

const Question = styled.p`
  color: #3a372f;
  font-family: "NanumSquareRound";
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
  padding: 0 24px;
`;

const ArcArea = styled.div`
  position: relative;
  width: 390px;
  height: 300px;
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

const DotWrapper = styled.div`
  position: absolute;
  bottom: 180px;
  display: flex;
  gap: 10px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background: #c5e384;
  border-radius: 50%;

  ${({ $isAnimating, $delay }) =>
    $isAnimating &&
    css`
      animation: ${bounce} 1.2s ease-in-out infinite;
      animation-delay: ${$delay}s;
    `}
`;

const BottomIcons = styled.div`
  position: absolute;
  width: 100%;
  bottom: 40px;
  padding: 0 70px;
  display: flex;
  justify-content: space-between;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;

  img {
    width: 64px;
    height: 64px;
  }
`;

const MicButton = styled(IconButton)`
  img {
    width: 35px;
    height: 35px;
  }
`;


const EndingDim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 390px;
  height: 852px;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const EndingModal = styled.div`
  width: 320px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 24px 16px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EndingTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  color: #000;
`;

const EndingDesc = styled.div`
  margin-top: 6px;
  font-size: 14px;
  text-align: center;
  color: #555;
  line-height: 1.4;
`;

const EndingBtnRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const EndingBtnGray = styled.button`
  width: 130px;
  height: 40px;
  border-radius: 10px;
  background: #e5e5e5;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  border: none;
`;

const EndingBtnYellow = styled.button`
  width: 130px;
  height: 40px;
  border-radius: 10px;
  background: #ffd342;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  border: none;
`;


const LoadingDim = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`;

const LoadingModal = styled.div`
  width: 260px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  text-align: center;
`;

const LoadingTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const LoadingDesc = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #777;
`;


const ExitDim = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2500;
`;

const ExitModal = styled.div`
  width: 320px;
  background: #fff;
  border-radius: 16px;
  padding: 24px 24px 28px 24px;
  text-align: center;
`;

const ExitTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

const ExitDesc = styled.div`
  margin-top: 8px;
  font-size: 14px;
  line-height: 20px;
  color: #555;
`;

const ExitBtnRow = styled.div`
  margin-top: 26px;
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ExitBtnGray = styled.button`
  width: 130px;
  height: 40px;
  background: #e7e7e7;
  border-radius: 10px;
  border: none;
  font-weight: 700;
`;

const ExitBtnYellow = styled.button`
  width: 130px;
  height: 40px;
  background: #ffd342;
  border-radius: 10px;
  border: none;
  font-weight: 700;
`;
