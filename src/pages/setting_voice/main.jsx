import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header.jsx";
import BottomBar from "../../components/Bottom.jsx";
import api from "../../api/axios.js";

// 서버 voice_image_code → 실제 아바타 이미지 매핑
const voiceImageMap = {
  voice1: "/img/onboarding/Avatar_1.svg", // 강아지
  voice2: "/img/onboarding/Avatar_2.svg", // 고슴도치
  voice3: "/img/onboarding/Avatar_3.svg", // 고양이
  voice4: "/img/onboarding/Avatar_4.svg", // 외계인
};

const VoiceSettingMain = () => {
  const navigate = useNavigate();

  // 서버에서 불러온 사용자의 목소리 목록
  const [myVoiceList, setMyVoiceList] = useState([]);

  // 삭제 모달 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetId, setTargetId] = useState(null);

  // API로 목소리 목록 불러오기
  const loadVoiceList = async () => {
    try {
      const res = await api.get("/api/accounts/voice/list/");
      console.log("📌 [API 응답 원본]:", res.data);

      const serverVoices = res.data.voices;
      const mapped = serverVoices.map((v) => ({
        id: v.voice_id,
        name: v.name,
        icon: voiceImageMap[v.voice_image_code] || "/img/setting_voice/avatar.svg",
        clonedVoiceURL: v.cloned_voice_url,
      }));

      console.log("📌 [UI용 매핑 목록]:", mapped);
      setMyVoiceList(mapped);
    } catch (err) {
      console.error("⚠️ 목소리 리스트 조회 실패:", err);
    }
  };

  // 페이지 최초 로드 시 실행
  useEffect(() => {
    loadVoiceList();
  }, []);

  // 삭제 API
  const deleteVoiceOnServer = async (voiceId) => {
    try {
      const res = await api.delete(`/api/accounts/voice/${voiceId}/`);
      console.log("삭제 성공:", res.data);

      // 삭제 후 리스트 다시 로딩
      loadVoiceList();
    } catch (err) {
      console.error("⚠️ 삭제 실패:", err);
      alert("목소리 삭제 중 오류가 발생했습니다.");
    }
  };

  // 삭제 버튼 클릭
  const handleDeleteClick = (id) => {
    setTargetId(id);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setTargetId(null);
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = () => {
    if (targetId !== null) deleteVoiceOnServer(targetId);
    setTargetId(null);
    setShowDeleteModal(false);
  };

  const handleAddClick = () => {
    navigate("/mypage/voice_set/step01");
  };

  return (
    <Container>
      <Header title="목소리 설정" showBack={true} onBack={() => navigate("/mypage")} />

      <TabWrapper>
        <TabButton active={true}>나의 목소리</TabButton>
      </TabWrapper>

      <ListWrapper>
        {myVoiceList.map((voice) => (
          <VoiceItem key={voice.id}>
            <LeftArea>
              <Avatar src={voice.icon} alt="voice icon" />
              <VoiceName>{voice.name}</VoiceName>
            </LeftArea>

            <RightArea>
              {/* 재생 버튼 */}
              <IconButton
                onClick={() =>
                  navigate("/mypage/voice_set/detail", {
                    state: { voiceId: voice.id },
                  })
                }
              >
                <img src="/img/setting_voice/play.svg" alt="play" />
              </IconButton>

              {/* 상세(수정) 페이지 이동 */}
              <IconButton
                onClick={() =>
                  navigate("/mypage/voice_set/detail", {
                    state: { voiceId: voice.id },
                  })
                }
              >
              </IconButton>

              {/* 삭제 */}
              <IconButton onClick={() => handleDeleteClick(voice.id)}>
                <img src="/img/setting_voice/delete.svg" alt="delete" />
              </IconButton>
            </RightArea>
          </VoiceItem>
        ))}

        {/* 등록하기 버튼 */}
        <AddButton onClick={handleAddClick}>
          <PlusIcon src="/img/setting_voice/plus.svg" alt="add" />
          등록하기
        </AddButton>
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



const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
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
  font-weight: 700;
  color: #000;
  border-bottom: 2px solid #000;
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
  font-size: 20px;
  font-weight: 800;
  text-align: center;
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
  background-color: #f1f1f1;
  border-radius: 99px;
  border: none;
  color: #7a7a7a;
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
  font-weight: 800;
  cursor: pointer;
`;
