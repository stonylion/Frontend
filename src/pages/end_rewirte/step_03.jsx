import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
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

  const [openExit, setOpenExit] = useState(false);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // 처음 로딩 시 첫 메시지
  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: questionFromVoice || "질문을 불러오고 있어요…",
        can_finalize: false,
      },
    ]);
  }, [questionFromVoice]);

  // 스크롤 맨 아래로 고정
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 메시지 전송
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    setInputValue("");

    // 유저 메시지 추가
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
      console.error("⚠️ 채팅 실패:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "오류가 발생했어요.", can_finalize: false },
      ]);
    }
  };

  // 결말 확장
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
      console.error("⚠️ 결말 확장 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // 더 대화하기
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

      const { text, chat_id: newChatId, can_finalize } = res.data;
      setChatId(newChatId);

      const isEndingPrompt =
        text?.includes("확장해도") || text?.includes("완성해도");

      const finalFlag = can_finalize || isEndingPrompt;
      setCanFinalize(finalFlag);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text, can_finalize: finalFlag },
      ]);
    } catch (err) {
      console.error("⚠️ 더 대화하기 실패:", err);
    }
  };

  return (
    <Screen>
      <Header title="채팅" showBack={false} />

      <CloseBtn onClick={() => setOpenExit(true)}>
        <img src={CLOSE_ICON} alt="닫기" />
      </CloseBtn>

      {/* 채팅 영역 */}
      <ChatContainer>
        {messages.map((msg, idx) => {
          const isBot = msg.sender === "bot";
          const isUser = msg.sender === "user";
          const isLast = idx === messages.length - 1;

          return (
            <div key={idx}>
              <MessageRow $isUser={isUser}>
                {isBot && <ProfileIcon src={PROFILE} alt="bot" />}
                <MessageBubble $isUser={isUser}>{msg.text}</MessageBubble>
              </MessageRow>

              {isBot && isLast && msg.can_finalize && (
                <BottomButtonWrapper>
                  <EndButton onClick={handleExpandEnding}>
                    결말 확장하기
                  </EndButton>
                  <EndButtonGray onClick={handleContinueChat}>
                    더 대화하기
                  </EndButtonGray>
                </BottomButtonWrapper>
              )}
            </div>
          );
        })}

        <div ref={chatEndRef} />
      </ChatContainer>

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
      {loading && (
        <LoadingDim>
          <LoadingModal>
            <DotRow>
              <Dot />
              <Dot />
              <Dot />
            </DotRow>

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

export default Endwritestep03;

const Screen = styled.div`
  position: relative;
  height: 100%;
  background: #fff;
  overflow: hidden;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
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
`;

const MessageRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  justify-content: ${({ $isUser }) => ($isUser ? "flex-end" : "flex-start")};
`;

const ProfileIcon = styled.img`
  width: 32px;
  height: 32px;
`;

const MessageBubble = styled.div`
  max-width: 260px;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 22px;
  white-space: pre-wrap;
  animation: fadeIn 0.2s ease-out;

  background: ${({ $isUser }) => ($isUser ? "#f5f5f5" : "#ffffff")};
  color: ${({ $isUser }) => ($isUser ? "#000" : "#3a372f")};
`;

const BottomButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-left: 40px;
  margin-top: 6px;
  gap: 8px;
`;

const EndButton = styled.button`
  padding: 6px 16px;
  border-radius: 99px;
  border: 1px solid #e7e7e7;
  background: #e7e7e7;
  font-size: 13px;
  cursor: pointer;
`;

const EndButtonGray = styled.button`
  padding: 6px 16px;
  border-radius: 99px;
  background: #e7e7e7;
  border: none;
  font-size: 13px;
  cursor: pointer;
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
`;

const RecordBtn = styled.button`
  background: none;
  border: none;
  margin-left: 12px;
  img {
    width: 40px;
    height: 40px;
  }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); opacity: 0.5; }
  50% { transform: translateY(-6px); opacity: 1; }
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
  width: 300px;
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  text-align: center;
`;

const DotRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  background: #ffd342;
  border-radius: 50%;
  animation: ${bounce} 1s infinite;
`;

const LoadingTitle = styled.div`
  margin-top: 14px;
  font-size: 16px;
  font-weight: 700;
`;

const LoadingDesc = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: #777;
`;

const ExitDim = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
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
