import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header.jsx";

const CHARACTER = "/img/end_rewrite/lion.svg";
const MUTE_ICON = "/img/end_rewrite/mute.svg";
const CHAT_ICON = "/img/end_rewrite/chat.svg";
const CLOSE_ICON = "/icons/new_right_part.svg";

const Endwritestep02 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const storyId = location.state?.storyId;

  useEffect(() => {
    console.log("🔥 step02 도착");
    console.log("🟡 location.state =", location.state);
    console.log("🟡 전달받은 storyId =", storyId);

    if (!storyId) {
      console.error("⚠️ storyId 없음! step01 → step02 전달 문제");
    }
  }, [storyId]);

  // 말풍선 점프 애니메이션
  const [isAnimating, setIsAnimating] = useState(true);

  // 나가기 모달
  const [open, setOpen] = useState(false);

  // STT 관련
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("access_token 없음, STT 연결 불가");
      return;
    }

    const wsUrl = `ws://3.34.58.51/ws/story/record/?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("🟢 STT WebSocket 연결 성공:", wsUrl);
      startRecording();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.message) console.log("WS message:", data.message);

        if (data.status) {
          console.log("WS status:", data.status);
          if (data.status === "🛑 녹음완료") setIsRecording(false);
        }

        if (data.type === "transcription" && data.text) {
          console.log("📄 STT 텍스트:", data.text);
          setTranscript((prev) => (prev ? `${prev} ${data.text}` : data.text));
        }

        if (data.error || data.error_message) {
          console.error("WS error:", data.error || data.error_message);
        }
      } catch (e) {
        console.log("WS raw message:", event.data);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ STT WebSocket 에러:", err);
    };

    ws.onclose = () => {
      console.log("🔴 STT WebSocket 닫힘");
      stopRecording(false);
    };

    return () => {
      stopRecording(false);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        const ws = wsRef.current;
        if (e.data && e.data.size > 0 && ws && ws.readyState === WebSocket.OPEN) {
          ws.send(e.data);
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      console.log("🎙️ 마이크 녹음 시작");

    } catch (err) {
      console.error("마이크 권한 오류 또는 MediaRecorder 에러:", err);
    }
  };

  const stopRecording = (sendStopCommand = false) => {
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder) {
      try {
        mediaRecorder.stream.getTracks().forEach((t) => t.stop());
        mediaRecorder.stop();
      } catch (e) {
        console.error("MediaRecorder stop 에러:", e);
      }
      mediaRecorderRef.current = null;
    }

    setIsRecording(false);

    if (
      sendStopCommand &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      wsRef.current.send(JSON.stringify({ command: "stop" }));
    }
  };

  const handleMuteClick = () => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket이 아직 열려있지 않습니다.");
      return;
    }

    if (isAnimating) {
      ws.send(JSON.stringify({ command: "pause" }));
      setIsAnimating(false);
      console.log("🟡 STT 일시정지");
    } else {
      ws.send(JSON.stringify({ command: "resume" }));
      setIsAnimating(true);
      console.log("🟢 STT 재개");
    }
  };

  const handleChatClick = () => {
    stopRecording(true);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    navigate("/rewrite_end/step03", {
      state: {
        storyId,       
        draftText: transcript,
      },
    });
  };

  const handleExit = () => {
    stopRecording(true);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    navigate("/rewrite_end/");
  };

  return (
    <Screen>
      <Header title="" showBack={false} />

      <CloseBtn onClick={() => setOpen(true)}>
        <img src={CLOSE_ICON} alt="닫기" />
      </CloseBtn>

      <Content>
        <Character src={CHARACTER} alt="사자" />
        <Question>
          신데렐라 동화에서
          <br />
          가장 좋아했던 캐릭터가 뭐야?
        </Question>
      </Content>

      <ArcArea>
        <Arc />

        <DotWrapper>
          {Array.from({ length: 5 }).map((_, i) => (
            <Dot key={i} $delay={i * 0.2} $isAnimating={isAnimating} />
          ))}
        </DotWrapper>

        <BottomIcons>
          <IconButton onClick={handleMuteClick}>
            <img src={MUTE_ICON} alt="음소거" />
          </IconButton>

          <IconButton onClick={handleChatClick}>
            <img src={CHAT_ICON} alt="채팅" />
          </IconButton>
        </BottomIcons>
      </ArcArea>

      {open && (
        <Dim onClick={() => setOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>앗! 그만두시겠어요?</ModalTitle>
            <ModalDesc>
              아직 대화를 완성하기엔 대화가 조금 부족해요.
              <br />
              그만하면 지금까지의 대화를 되돌릴 수 없어요.
            </ModalDesc>

            <BtnRow>
              <ModalBtnGray onClick={handleExit}>나가기</ModalBtnGray>
              <ModalBtnYellow onClick={() => setOpen(false)}>
                계속 대화하기
              </ModalBtnYellow>
            </BtnRow>
          </Modal>
        </Dim>
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
    display: block;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  text-align: center;
`;

const Character = styled.img`
  width: 138px;
  margin-bottom: 20px;
  user-select: none;
  pointer-events: none;
`;

const Question = styled.p`
  color: #3a372f;
  font-family: "NanumSquareRound";
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
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
  bottom: 40px;
  width: 100%;
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
  color: #3a372f;
  font-size: 20px;
  font-weight: 800;
  margin: 6px 0 8px;
`;

const ModalDesc = styled.p`
  color: #7a7a7a;
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 16px;
`;

const BtnRow = styled.div`
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
