import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header.jsx";
import BottomBar from "../../components/Bottom.jsx";
import api from "../../api/axios.js";

// 🔥 서버 voice_image_code → 실제 아바타 이미지 매핑
const voiceImageMap = {
  voice1: "/img/onboarding/Avatar_1.svg",
  voice2: "/img/onboarding/Avatar_2.svg",
  voice3: "/img/onboarding/Avatar_4.svg",
};

const actorVoices = [
  { id: 1, name: "목소리1", icon: "/img/setting_voice/avatar.svg" },
  { id: 2, name: "목소리1", icon: "/img/setting_voice/avatar.svg" },
  { id: 3, name: "목소리1", icon: "/img/setting_voice/avatar.svg" },
];

const VoiceSettingMain = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mine");

  // ⭐ 서버에서 불러온 사용자의 목소리 목록
  const [myVoiceList, setMyVoiceList] = useState([]);

  // 삭제 모달 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetId, setTargetId] = useState(null);

  /* -------------------------------------------
   🔥 1) 목소리 리스트 불러오는 API
  -------------------------------------------- */
  const loadVoiceList = async () => {
    try {
      const res = await api.get("/api/accounts/voice/list/");
      const serverVoices = res.data.voices;

      const mapped = serverVoices.map((v) => ({
        id: v.voice_id,
        name: v.name,
        icon: voiceImageMap[v.voice_image_code] || "/img/setting_voice/avatar.svg",
        clonedVoiceURL: v.cloned_voice_url,
      }));

      setMyVoiceList(mapped);
    } catch (err) {
      console.error("목소리 리스트 조회 실패:", err);
    }
  };

  // 페이지 로드시 자동 실행
  useEffect(() => {
    loadVoiceList();
  }, []);

  /* -------------------------------------------
    🔥 2) 목소리 삭제 API (DELETE)
  -------------------------------------------- */
  const deleteVoiceOnServer = async (voiceId) => {
    try {
      const res = await api.delete(`/api/accounts/voice/${voiceId}/`);
      console.log("삭제 성공:", res.data);

      // 삭제 이후 리스트 다시 새로고침
      loadVoiceList();
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("목소리 삭제 중 오류가 발생했습니다.");
    }
  };

  /* -------------------------------------------
     모달 클릭 핸들러
  -------------------------------------------- */
  const handleDeleteClick = (id) => {
    setTargetId(id);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setTargetId(null);
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = () => {
    if (targetId !== null) {
      deleteVoiceOnServer(targetId);
    }
    setTargetId(null);
    setShowDeleteModal(false);
  };

  /* -------------------------------------------
     화면 렌더링
  -------------------------------------------- */

  const handleAddClick = () => {
    navigate("/mypage/voice_set/step01");
  };

  return (
    <Container>
      <Header title="목소리 설정" showBack={true} onBack={() => navigate("/mypage")} />

      {/* 탭 */}
      <TabWrapper>
        <TabButton active={activeTab === "mine"} onClick={() => setActiveTab("mine")}>
          나의 목소리
        </TabButton>
        <TabButton active={activeTab === "actor"} onClick={() => setActiveTab("actor")}>
          성우 목소리
        </TabButton>
      </TabWrapper>

      {/* 리스트 */}
      <ListWrapper>
        {activeTab === "mine"
          ? myVoiceList.map((voice) => (
              <VoiceItem key={voice.id}>
                <LeftArea>
                  <Avatar src={voice.icon} alt="voice icon" />
                  <VoiceName>{voice.name}</VoiceName>
                </LeftArea>

                <RightArea>
                  {/* 재생 버튼 */}
                  <IconButton
                    onClick={() => voice.clonedVoiceURL && new Audio(voice.clonedVoiceURL).play()}
                  >
                    <img src="/img/setting_voice/play.svg" alt="edit" />
                  </IconButton>

                  {/* 삭제 */}
                  <IconButton onClick={() => handleDeleteClick(voice.id)}>
                    <img src="/img/setting_voice/delete.svg" alt="delete" />
                  </IconButton>
                </RightArea>
              </VoiceItem>
            ))
          : actorVoices.map((voice) => (
              <VoiceItem key={voice.id}>
                <LeftArea>
                  <Avatar src={voice.icon} alt="voice icon" />
                  <VoiceName>{voice.name}</VoiceName>
                </LeftArea>

                <RightArea>
                  <IconButton onClick={() => navigate(`/mypage/voice_set/play/step_03`)}>
                    <img src="/img/setting_voice/play.svg" alt="play" />
                  </IconButton>
                </RightArea>
              </VoiceItem>
            ))}

        {/* 등록하기 버튼 */}
        {activeTab === "mine" && (
          <AddButton onClick={handleAddClick}>
            <PlusIcon src="/img/setting_voice/plus.svg" alt="add" />
            등록하기
          </AddButton>
        )}
      </ListWrapper>

      {/* 삭제 모달 */}
      {showDeleteModal && (
        <Dim onClick={handleCloseModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>정말 삭제하시겠어요?</ModalTitle>
            <ModalDesc>
              한번 삭제하면 되돌릴 수 없어요.
              <br />
              그래도 삭제하시겠어요?
            </ModalDesc>

            <BtnRow>
              <ModalBtnGray onClick={handleCloseModal}>취소</ModalBtnGray>
              <ModalBtnYellow onClick={handleConfirmDelete}>삭제</ModalBtnYellow>
            </BtnRow>
          </Modal>
        </Dim>
      )}

      <BottomBar />
    </Container>
  );
};

export default VoiceSettingMain;

/* --------------------------------------------
   ⭐ 스타일 컴포넌트 (원본 그대로 유지)
--------------------------------------------- */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  font-family: "NanumSquareRound", sans-serif;
`;

const TabWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #e0e0e0;
  margin-top: 4px;
`;

const TabButton = styled.button`
  flex: 1;
  background: none;
  border: none;
  padding: 12px 0;
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "700" : "400")};
  color: ${(props) => (props.active ? "#000" : "#C4C4C4")};
  border-bottom: ${(props) => (props.active ? "2px solid #000" : "none")};
  cursor: pointer;
`;

const ListWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 20px 80px 20px;
`;

const VoiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
`;

const LeftArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RightArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Avatar = styled.img`
  width: 44px;
  height: 44px;
`;

const VoiceName = styled.span`
  font-size: 16px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  img {
    width: 20px;
    height: 20px;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  background: none;
  border: none;
  color: #393939;
  font-size: 16px;
  cursor: pointer;
`;

const PlusIcon = styled.img`
  width: 44px;
  height: 44px;
`;

const Dim = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 390px;
  height: 852px;
  background-color: rgba(0,0,0,0.4);
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
  margin: 6px 0 8px;
  color: #3a372f;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
`;

const ModalDesc = styled.p`
  margin: 0 0 16px;
  color: #7a7a7a;
  font-size: 14px;
  text-align: center;
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
