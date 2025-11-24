import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header.jsx";
import api from "../../api/axios.js";

// voice_image_code → 아바타 이미지 매핑
const AVATARS = [
  { key: "voice1", src: "/img/onboarding/Avatar.svg" },
  { key: "voice2", src: "/img/onboarding/Avatar_1.svg" },
  { key: "voice3", src: "/img/onboarding/Avatar_3.svg" },
  { key: "voice4", src: "/img/onboarding/Avatar_4.svg" },
];

const VoiceSetStep03 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const voiceId = location.state?.voiceId;

  const [selected, setSelected] = useState("voice1");
  const [name, setName] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  const current = AVATARS.find((a) => a.key === selected) || AVATARS[0];

  const formatTime = (sec) => {
    if (!sec || Number.isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // 상세 조회
  useEffect(() => {
    if (!voiceId) return;

    const loadDetail = async () => {
      try {
        const res = await api.get(`/api/accounts/voice/${voiceId}/`);
        setSelected(res.data.voice_image_code);
        setName(res.data.voice_name || "");
        setAudioURL(res.data.cloned_voice_file || "");
      } catch (err) {
        console.error("❌ 상세 조회 실패:", err);
      }
    };

    loadDetail();
  }, [voiceId]);

  // 오디오 로직
  useEffect(() => {
    if (!audioURL) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(audioURL);
    audioRef.current = audio;

    const loaded = () => setDuration(audio.duration || 0);
    const timeUpdate = () => {
      if (!audio.duration) return;
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    const ended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    };

    audio.addEventListener("loadedmetadata", loaded);
    audio.addEventListener("timeupdate", timeUpdate);
    audio.addEventListener("ended", ended);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", loaded);
      audio.removeEventListener("timeupdate", timeUpdate);
      audio.removeEventListener("ended", ended);
    };
  }, [audioURL]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <Screen>
      <Header
        title="목소리 상세"
        showBack={true}
        onBack={() => navigate(-1)}
        action={{
          icon: "/img/setting_voice/pencil.svg",
          handler: () =>
            navigate("/mypage/voice_set/detail/edit", {
              state: { voiceId },
            }),
        }}
      />

      <Content>
        <MainIllust src={current.src} alt="선택된 캐릭터" />

        {/* 클릭 불가 아바타 */}
        <SelectorRow>
          {AVATARS.map(({ key, src }) => (
            <AvatarButtonDetail
              key={key}
              $active={selected === key}
            >
              <AvatarIllust src={src} alt={key} />
            </AvatarButtonDetail>
          ))}
        </SelectorRow>

        <FieldGroup>
          <FieldLabel>이름</FieldLabel>
          <Input value={name} readOnly />
        </FieldGroup>

        <VoiceLabel>목소리 미리듣기</VoiceLabel>
        <VoiceDesc>녹음된 목소리가 동화에서 어떻게 들리는지 확인하세요.</VoiceDesc>

        <ProgressContainer>
          <ProgressBar>
            <ProgressFill style={{ width: `${progress}%` }} />
          </ProgressBar>
          <TimeText>{formatTime(currentTime)}</TimeText>
        </ProgressContainer>

        <ControlRow>
          <ControlBtn>
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

          <ControlBtn>
            <ControlIcon src="/img/setting_voice/play_3_front.svg" />
          </ControlBtn>
        </ControlRow>
      </Content>
    </Screen>
  );
};

export default VoiceSetStep03;

/* ---------------- 스타일 ---------------- */
const Screen = styled.div`
  position: relative;
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

const MainIllust = styled.img`
  width: 144px;
  margin-top: 48px;
  margin-bottom: 32px;
`;

const SelectorRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 48px;
`;

/* -------------------
   상세페이지: 클릭 불가 아바타
------------------- */
const AvatarButtonDetail = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "$active",
})`
  background: none;
  padding: 0;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  aspect-ratio: 1 / 1;

  display: flex;
  align-items: center;
  justify-content: center;

  pointer-events: none;
  cursor: default;

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
  margin-top: 6px;
`;

const FieldLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 343px;
  height: 52px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #eee;
  font-size: 16px;
`;

const VoiceLabel = styled.div`
  width: 343px;
  font-size: 16px;
  font-weight: 700;
  margin-top: 20px;
`;

const VoiceDesc = styled.div`
  width: 343px;
  font-size: 13px;
  color: #777;
  margin-bottom: 10px;
`;

const ProgressContainer = styled.div`
  width: 343px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #f5f5f5;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #ffd342;
`;

const TimeText = styled.div`
  font-size: 10px;
  color: #777;
`;

const ControlRow = styled.div`
  display: flex;
  gap: 28px;
  margin-top: 15px;
`;

const ControlBtn = styled.button`
  background: none;
  border: none;
`;

const ControlIcon = styled.img`
  width: 40px;
  height: 40px;
`;
