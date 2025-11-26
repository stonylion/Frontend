import React, { useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios.js";

const EDIT_ICON = "/img/setting_voice/edit.svg";
const ICON_ROTATE = "/img/ai_story/rotate.svg";
const ICON_EXIT = "/icons/new_right_part.svg";

const Storystep07 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const story_id = location.state?.story_id;

  const incomingTitle = location.state?.title ||"";
  const incomingStory =
    location.state?.content ||"";

  const [title, setTitle] = useState(incomingTitle);
  const [story, setStory] = useState(incomingStory);

  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleRewrite = async () => {
  try {
    const res = await api.post("/api/story/generate/");
    const newStory = res.data;

    navigate("/mystory/ai_story/step07", {
      state: {
        title: res.data.title,
        content: res.data.content,
        story_id: res.data.id,
      },
    });
  } catch (err) {
    console.log("❌ 다시쓰기 오류:", err.response?.data || err);
    alert("AI 스토리 생성에 실패했어요!");
  }
};


  const handleExit = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <Screen>
      <Header
        title="동화 만들기"
        showBack={true}
        onBack={() => navigate(-1)}
        action={{
          icon: ICON_EXIT,
          handler: handleExit,
        }}
      />

      <ProgressWrapper>
        <ProgressBar $progress={80} />
      </ProgressWrapper>

      <Content>
        <Label>제목</Label>
        <TitleInputWrapper>
          <TitleInput
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            readOnly={!isEditing}
          />
          <EditIcon
            src={EDIT_ICON}
            alt="수정"
            onClick={() => setIsEditing((prev) => !prev)}
            $active={isEditing}
          />
        </TitleInputWrapper>

        <Label>스토리</Label>
        <StoryBox value={story} onChange={(e) => setStory(e.target.value)} />
      </Content>

      <BottomArea>
        <RewriteRow onClick={handleRewrite}>
          <RewriteText>AI 스토리 다시쓰기</RewriteText>
          <RewriteIcon src={ICON_ROTATE} alt="icon" />
        </RewriteRow>

        <NextButton onClick={() => navigate(`/illust-portrait/${story_id}`)}>
          다음
        </NextButton>
      </BottomArea>

      {showModal && (
        <Dim onClick={closeModal}>
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

              <ModalBtnYellow onClick={closeModal}>
                계속 제작하기
              </ModalBtnYellow>
            </ModalBtnRow>
          </Modal>
        </Dim>
      )}
    </Screen>
  );
};

export default Storystep07;


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
  gap: 16px;
  overflow-y: auto;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Label = styled.h3`
  font-family: NanumSquareRound;
  font-size: 16px;
  font-weight: 800;
  color: #393939;
`;

const TitleInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 40px 10px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
`;

const TitleInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-family: NanumSquareRound;
  font-size: 16px;
`;

const EditIcon = styled.img`
  position: absolute;
  right: 12px;
  width: 20px;
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
`;

const StoryBox = styled.textarea`
  width: 100%;
  height: 456px;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  resize: none;
  overflow-y: auto;
  font-family: NanumSquareRound;
  font-size: 16px;
  line-height: 24px;

  &:focus {
    border-color: #ffd342;
  }

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const BottomArea = styled.div`
  padding: 16px 24px calc(env(safe-area-inset-bottom) + 24px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const RewriteRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

const RewriteText = styled.p`
  font-family: NanumSquareRound;
  font-size: 14px;
  color: #bbb;
`;

const RewriteIcon = styled.img`
  width: 12px;
  height: 12px;
`;

const NextButton = styled.button`
  width: 100%;
  max-width: 343px;
  height: 56px;
  border-radius: 999px;
  border: none;
  background: #ffd342;
  font-family: NanumSquareRound;
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  cursor: pointer;
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
  background: #ffd342;
  border-radius: 99px;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 800;
`;
