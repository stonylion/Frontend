import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header.jsx";
import Button from "../../components/Button.jsx";
import api from "../../api/axios.js";

// ----------------------------
// 아바타 매핑 (detail과 동일)
// ----------------------------
const AVATARS = [
  { key: "voice1", src: "/img/onboarding/Avatar.svg" },
  { key: "voice2", src: "/img/onboarding/Avatar_1.svg" },
  { key: "voice3", src: "/img/onboarding/Avatar_3.svg" },
  { key: "voice4", src: "/img/onboarding/Avatar_4.svg" },
];

const VoiceSetDetailedit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const voiceId = location.state?.voiceId;

  const [selected, setSelected] = useState("voice1");
  const [name, setName] = useState("");

  // ==== 오디오 관련 ====
  const [audioURL, setAudioURL] = useState("");
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // ==== 모달, 저장처리 ====
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [toast, setToast] = useState(false);

  const current = AVATARS.find((a) => a.key === selected) || AVATARS[0];

  const formatTime = (sec) => {
    if (!sec || Number.isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // ===========================
  // 📍 DETAIL 데이터 불러오기
  // ===========================
  useEffect(() => {
    if (!voiceId) return;

    const loadData = async () => {
      try {
        const res = await api.get(`/api/accounts/voice/${voiceId}/`);
        console.log("📌 [EDIT 상세 응답]:", res.data);

        setSelected(res.data.voice_image_code);
        setName(res.data.voice_name);
        setAudioURL(res.data.cloned_voice_file || "");
      } catch (err) {
        console.error("❌ EDIT 상세 조회 실패:", err);
      }
    };

    loadData();
  }, [voiceId]);

  // ===========================
  // 🎧 오디오 세팅 + progress
  // ===========================
  useEffect(() => {
    if (!audioURL) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(audioURL);
    audioRef.current = audio;

    const loaded = () => setDuration(audio.duration || 0);
    const update = () => {
      if (!audio.duration) return;
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    const ended = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", loaded);
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("ended", ended);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", loaded);
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("ended", ended);
    };
  }, [audioURL]);

  // ▶️ / ⏸ Play Toggle
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  //  ⏪ 뒤로 3초
  const back3 = () => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, a.currentTime - 3);
  };

  // ⏩ 앞으로 3초
  const forward3 = () => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.min(a.duration, a.currentTime + 3);
  };

  // ===========================
  // 💾 PATCH 저장
  // ===========================
  const handleSave = async () => {
    try {
      await api.patch(`/api/accounts/voice/${voiceId}/`, {
        voice_name: name,
        voice_image_code: selected,
      });

      setToast(true);

      setTimeout(() => {
        navigate("/mypage/voice_set/main");
      }, 1500);
    } catch (err) {
      console.error("❌ 수정 실패:", err);
    }
  };

  // ===========================
  // ❌ 삭제 처리
  // ===========================
  const deleteVoice = async () => {
    try {
      await api.delete(`/api/accounts/voice/${voiceId}/`);
      navigate("/mypage/voice_set/main");
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
    }
  };

  const handleBackClick = () => {
    setOpenWarningModal(true);
  };

  return (
    <Screen>
      <Header title="목소리 수정" showBack={true} onBack={handleBackClick} />

      <Content>
        {/* 메인 아바타 */}
        <MainIllust src={current.src} alt="avatar" />

        {/* 아바타 선택 */}
        <SelectorRow>
          {AVATARS.map(({ key, src }) => (
            <AvatarButton
              key={key}
              onClick={() => setSelected(key)}
              $active={selected === key}
            >
              <AvatarIllust src={src} />
            </AvatarButton>
          ))}
        </SelectorRow>

        {/* 이름 입력 */}
        <FieldGroup>
          <FieldLabel>이름</FieldLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="사용자 이름"
          />
        </FieldGroup>

        {/* 목소리 미리듣기 */}
        <VoiceLabel>목소리 미리듣기</VoiceLabel>
        <VoiceDesc>녹음된 목소리가 동화에 어떻게 적용되는지 미리 들어보세요.</VoiceDesc>

        <ProgressContainer>
          <ProgressBar>
            <ProgressFill style={{ width: `${progress}%` }} />
          </ProgressBar>
          <TimeText>{formatTime(currentTime)}</TimeText>
        </ProgressContainer>

        <ControlRow>
          <ControlBtn onClick={back3}>
            <ControlIcon src="/img/setting_voice/play_3_back.svg" />
          </ControlBtn>

          <ControlBtn onClick={togglePlay}>
            <ControlIcon
              src={
                isPlaying
                  ? "/img/setting_voice/pause.svg"
                  : "/img/setting_voice/sound_play.svg"
              }
            />
          </ControlBtn>

          <ControlBtn onClick={forward3}>
            <ControlIcon src="/img/setting_voice/play_3_front.svg" />
          </ControlBtn>
        </ControlRow>

        {/* 삭제하기 (왼쪽 정렬 + 아래쪽) */}
        <DeleteText onClick={() => setOpenDeleteModal(true)}>
          삭제하기
        </DeleteText>
      </Content>

      {/* 저장 버튼 */}
      <BottomArea>
        <Button $bgColor="#342E29" $color="#FFF" onClick={handleSave}>
          저장하기
        </Button>
      </BottomArea>

      {/* 수정 경고 모달 */}
      {openWarningModal && (
        <Dim onClick={() => setOpenWarningModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>수정이 완료되지 않았어요</ModalTitle>
            <ModalDesc>
              지금 나가면
              <br />
              수정한 내용이 반영되지 않아요
            </ModalDesc>

            <ModalBtnRow>
              <ModalBtnGray onClick={() => navigate("/mypage/voice_set/detail")}>
                나가기
              </ModalBtnGray>
              <ModalBtnYellow onClick={() => setOpenWarningModal(false)}>
                수정하기
              </ModalBtnYellow>
            </ModalBtnRow>
          </Modal>
        </Dim>
      )}

      {/* 삭제 모달 */}
      {openDeleteModal && (
        <Dim onClick={() => setOpenDeleteModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>정말 삭제하시겠어요?</ModalTitle>
            <ModalDesc>
              한 번 삭제하면 되돌릴 수 없어요.
              <br />
              그래도 삭제하시겠어요?
            </ModalDesc>

            <ModalBtnRow>
              <ModalBtnGray onClick={() => setOpenDeleteModal(false)}>취소</ModalBtnGray>
              <ModalBtnYellow onClick={deleteVoice}>삭제하기</ModalBtnYellow>
            </ModalBtnRow>
          </Modal>
        </Dim>
      )}

      {toast && <Toast>변경 사항이 저장되었어요.</Toast>}
    </Screen>
  );
};

export default VoiceSetDetailedit;

/* ---------------- 스타일 ---------------- */

const Screen = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  padding: 16px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainIllust = styled.img`
  width: 144px;
  margin-top: 48px;
  margin-bottom: 24px;
`;

const SelectorRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
`;

const AvatarButton = styled.button`
  width: 62px;
  height: 62px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;

  border: ${({ $active }) =>
    $active ? "2px solid #FFD342" : "2px solid transparent"};
  box-shadow: ${({ $active }) =>
    $active ? "0 0 0 2px rgba(255, 211, 66, 0.25) inset" : "none"};
`;

const AvatarIllust = styled.img`
  width: 56px;
  height: 56px;
`;

const FieldGroup = styled.div`
  width: 343px;
  margin-bottom: 10px;
`;

const FieldLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #3a372f;
`;

const Input = styled.input`
  width: 343px;
  height: 52px;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 0 16px;
  font-size: 16px;
`;

const VoiceLabel = styled.div`
  width: 343px;
  font-size: 16px;
  font-weight: 700;
  margin-top: 12px;
  margin-bottom: 6px;
  color: #3a372f;
`;

const VoiceDesc = styled.div`
  width: 343px;
  font-size: 13px;
  color: #7a7a7a;
  margin-bottom: 15px;
`;

const ProgressContainer = styled.div`
  width: 343px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #f7dd68;
  transition: width 0.1s linear;
`;

const TimeText = styled.div`
  font-size: 10px;
  color: #7a7a7a;
`;

const ControlRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 28px;
  margin-top: 5px;
  margin-bottom: 40px;
`;

const ControlBtn = styled.button`
  width: 56px;
  height: 56px;
  padding: 10px;
  background: none;
  border: none;
`;

const ControlIcon = styled.img`
  width: 40px;
  height: 40px;
`;

const DeleteText = styled.button`
  background: none;
  border: none;
  color: #bbb;
  font-size: 14px;
  font-weight: 700;
  text-decoration: underline;
  font-family: NanumSquareRound;
  cursor: pointer;
  width: 343px;
  display: flex;
  justify-content: flex-start;
  margin-top: 10px; 
  margin-bottom: 20px;
`;

const BottomArea = styled.div`
  padding: 0 24px 20px;
  display: flex;
  justify-content: center;
`;

const Dim = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 390px;
  height: 852px;
  background: rgba(0,0,0,0.4);
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
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 8px;
`;

const ModalDesc = styled.p`
  font-size: 14px;
  color: #7a7a7a;
  text-align: center;
  line-height: 20px;
  margin-bottom: 16px;
`;

const ModalBtnRow = styled.div`
  display: flex;
  gap: 12px;
`;

const ModalBtnGray = styled.button`
  width: 130px;
  height: 40px;
  background: #f1f1f1;
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
  color: #fff;
  font-size: 14px;
  font-weight: 800;
`;

const Toast = styled.div`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 358px;
  padding: 12px;
  border-radius: 12px;
  background: #fff8e3;
  font-size: 14px;
  color: #3a372f;
  z-index: 2500;
`;

