import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header.jsx";
import api from "../../api/axios.js";

const PROFILE = "/img/end_rewrite/profile.svg";
const RECORD = "/img/end_rewrite/yellow_rec.svg";
const SEND = "/img/end_rewrite/send.svg";
const CLOSE_ICON = "/icons/new_right_part.svg";

const Endwritestep03 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const storyId = location.state?.storyId;
  const chatIdFromVoice = location.state?.chatId || null;
  const questionFromVoice = location.state?.question || "";

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const [chatId, setChatId] = useState(chatIdFromVoice);
  const [canFinalize, setCanFinalize] = useState(false);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // storyId 없으면 홈으로
  useEffect(() => {
    if (!storyId) navigate("/rewrite_end/");
  }, [storyId, navigate]);

  // 초기 bot 질문
  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: questionFromVoice || "질문을 불러오고 있어요…",
        can_finalize: false,
      },
    ]);
  }, [questionFromVoice]);

  // 항상 스크롤 아래로
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    setInputValue("");

    // user 메시지 push
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);

    try {
      const res = await api.post(
        `/api/AI/stories/${storyId}/extend-chat/stream/`,
        {
          chat_id: chatId || chatIdFromVoice || "",
          user_message: userMsg,
          input_modality: "text",
        }
      );

      const { text: botReply, chat_id: newChatId, can_finalize } = res.data;

      setChatId(newChatId);

      // 결말 확장 문구 자동 감지
      const isEndingPrompt =
        botReply?.includes("확장해도") ||
        botReply?.includes("완성해도") ||
        botReply?.includes("확장");

      const finalFlag = can_finalize || isEndingPrompt;
      setCanFinalize(finalFlag);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botReply,
          can_finalize: finalFlag,
        },
      ]);
    } catch (err) {
      console.error("❌ 채팅 실패:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "오류가 발생했어요.", can_finalize: false },
      ]);
    }
  };


  const handleContinueChat = async () => {
    const effectiveChatId = chatId || chatIdFromVoice;
    if (!effectiveChatId) return;

    try {
      const res = await api.post(
        `/api/AI/stories/${storyId}/extend-chat/stream/`,
        {
          chat_id: effectiveChatId,
          action: "continue",
        }
      );

      const { text: botReply, chat_id: newChatId, can_finalize } = res.data;

      setChatId(newChatId);

      // 결말 유도 문구 감지
      const isEndingPrompt =
        botReply?.includes("결말") ||
        botReply?.includes("엔딩") ||
        botReply?.includes("확장해도") ||
        botReply?.includes("완성해도") ||
        botReply?.includes("마무리") ||
        botReply?.includes("엔딩으로");

      const finalFlag = can_finalize || isEndingPrompt;
      setCanFinalize(finalFlag);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botReply,
          can_finalize: finalFlag,
        },
      ]);
    } catch (err) {
      console.error("❌ 더 대화하기 실패:", err);
    }
  };

  const handleExpandEnding = async () => {
    const effectiveChatId = chatId || chatIdFromVoice;
    if (!effectiveChatId) return;

    setLoading(true);

    try {
      const res = await api.post(`/api/AI/stories/${storyId}/extend/`, {
        chat_id: effectiveChatId,
      });

      navigate("/rewrite_end/step04", {
        state: {
          storyId,
          extendedStory: res.data.extended_story,
        },
      });
    } catch (err) {
      console.error("❌ 결말 확장 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Header title="채팅" showBack={false} />

      <CloseBtn onClick={() => setOpen(true)}>
        <img src={CLOSE_ICON} alt="닫기" />
      </CloseBtn>

      {/* 종료 모달 */}
      {open && (
        <Dim onClick={() => setOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>앗! 그만두시겠어요?</ModalTitle>
            <ModalDesc>
              아직 대화를 완성하기엔 대화가 부족해요.
              <br />
              나가면 지금까지의 대화를 되돌릴 수 없어요.
            </ModalDesc>

            <BtnRow>
              <ModalBtnGray onClick={() => navigate("/rewrite_end/")}>
                나가기
              </ModalBtnGray>

              <ModalBtnYellow onClick={() => setOpen(false)}>
                계속 대화하기
              </ModalBtnYellow>
            </BtnRow>
          </Modal>
        </Dim>
      )}

      {/* 로딩 */}
      {loading && (
        <LoadingDim>
          <LoadingBox>
            <Spinner>
              <Dot1 />
              <Dot2 />
            </Spinner>
            <LoadingText>
              결말을 확장하고 있어요!
              <br />
              잠시만 기다려주세요
            </LoadingText>
          </LoadingBox>
        </LoadingDim>
      )}

      {/* 채팅 UI */}
      <ChatContainer>
        {messages.map((msg, idx) => {
          const isLast = idx === messages.length - 1;
          const isBot = msg.sender === "bot";

          return (
            <div key={idx}>
              <MessageRow $isUser={msg.sender === "user"}>
                {isBot && <ProfileIcon src={PROFILE} alt="bot" />}
                <MessageBubble $isUser={msg.sender === "user"}>
                  {msg.text}
                </MessageBubble>
              </MessageRow>

              {isBot && isLast && msg.can_finalize && (
                <ButtonWrapper>
                  <EndButton onClick={handleExpandEnding}>
                    결말 확장하기
                  </EndButton>
                  <EndButton onClick={handleContinueChat}>
                    더 대화하기
                  </EndButton>
                </ButtonWrapper>
              )}
            </div>
          );
        })}

        <div ref={chatEndRef} />
      </ChatContainer>

      {/* 입력창 */}
      <InputBar onSubmit={handleSend}>
        <Input
          placeholder="메시지를 입력해주세요"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        <RecordBtn type="submit">
          <img src={isFocused ? SEND : RECORD} alt="send" />
        </RecordBtn>
      </InputBar>
    </Screen>
  );
};

export default Endwritestep03;

const LoadingDim = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const LoadingBox = styled.div`
  width: 280px;
  padding: 24px 20px;
  background: #ffffff;
  border-radius: 16px;
  text-align: center;
`;

const moveLeft = keyframes`
  0%, 100% { transform: translateX(-13px); }
  50% { transform: translateX(13px); }
`;

const moveRight = keyframes`
  0%, 100% { transform: translateX(13px); }
  50% { transform: translateX(-13px); }
`;

const Spinner = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  margin: 0 auto;
`;

const Dot = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
`;

const Dot1 = styled(Dot)`
  background-color: #efefef;
  animation: ${moveLeft} 1.3s ease-in-out infinite;
`;

const Dot2 = styled(Dot)`
  background-color: #ffd342;
  animation: ${moveRight} 1.3s ease-in-out infinite;
`;

const LoadingText = styled.p`
  margin-top: 12px;
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  color: #000;
`;

const Screen = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
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
    width: 20px;
    height: 20px;
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 120px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const MessageRow = styled.div`
  display: flex;
  gap: 8px;
  ${({ $isUser }) =>
    $isUser &&
    css`
      justify-content: flex-end;
    `}
`;

const ProfileIcon = styled.img`
  width: 32px;
  height: 32px;
`;

const appear = keyframes`
  0% { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const MessageBubble = styled.div`
  max-width: 260px;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 22px;
  white-space: pre-wrap;
  animation: ${appear} 0.25s ease-out both;
  ${({ $isUser }) =>
    $isUser
      ? css`
          background: #f5f5f5;
          color: #000;
        `
      : css`
          background: #ffffff;
          color: #3a372f;
        `}
`;

const InputBar = styled.form`
  position: fixed;
  bottom: 0;
  width: 390px;
  height: 80px;
  background: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 16px;
`;

const Input = styled.input`
  flex: 1;
  height: 48px;
  border-radius: 24px;
  border: none;
  padding: 0 16px;
  background: #f5f5f5;
  &:focus {
    background: #eeeeee;
  }
`;

const RecordBtn = styled.button`
  background: transparent;
  border: none;
  margin-left: 12px;
  cursor: pointer;
  img {
    width: 40px;
    height: 40px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin: 8px 0 0 40px;
`;

const EndButton = styled.button`
  display: flex;
  height: 34px;
  padding: 0 16px;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
  border: 1px solid #f1f1f1;
  background: #ffffff;
  font-size: 13px;
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
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 8px;
`;

const ModalDesc = styled.p`
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 16px;
  text-align: center;
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
