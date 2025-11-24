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

  const [progress, setProgress] = useState(0);       // 0 ~ 100%
  const [currentTime, setCurrentTime] = useState(0); // 초
  const [duration, setDuration] = useState(0);       // 초

  const audioRef = useRef(null);

  const current = AVATARS.find((a) => a.key === selected) || AVATARS[0];

  // 시간 포맷터 (00:04 형태)
  const formatTime = (sec) => {
    if (!sec || Number.isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // =========================
  // 🔥 상세 정보 로딩 API
  // GET /api/accounts/voice/{voice_id}/
  // =========================
  useEffect(() => {
    if (!voiceId) return;

    const loadDetail = async () => {
      try {
        const res = await api.get(`/api/accounts/voice/${voiceId}/`);
        console.log("📌 [목소리 상세 응답]:", res.data);

        // API 명세 기준:
        // voice_id, voice_name, voice_image_code, cloned_voice_file, created_at
        setSelected(res.data.voice_image_code);
        setName(res.data.voice_name || "");
        setAudioURL(res.data.cloned_voice_file || "");
      } catch (err) {
        console.error("❌ 목소리 상세 조회 실패:", err);
      }
    };

    loadDetail();
  }, [voiceId]);

  // =========================
  // 🎧 오디오 객체 세팅 및 progress 연동
  // =========================
  useEffect(() => {
    if (!audioURL) return;

    // 기존 오디오 정리
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(audioURL);
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      if (!audio.duration) return;
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioURL]);

  // =========================
  // ▶️ / ⏸ 재생 토글
  // =========================
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
        {/* 메인 아바타 */}
        <MainIllust src={current.src} alt="선택된 캐릭터" />

        {/* 아바타 선택 (UI만, 서버 수정은 edit 페이지에서) */}
        <SelectorRow>
          {AVATARS.map(({ key, src }) => (
            <AvatarButton
              key={key}
              onClick={() => setSelected(key)}
              $active={selected === key}
            >
              <AvatarIllust src={src} alt={key} />
            </AvatarButton>
          ))}
        </SelectorRow>

        {/* 목소리 이름 (읽기 전용) */}
        <FieldGroup>
          <FieldLabel>이름</FieldLabel>
          <Input
            type="text"
            value={name}
            readOnly
            placeholder="목소리 이름"
          />
        </FieldGroup>

        <VoiceLabel>목소리 미리듣기</VoiceLabel>
        <VoiceDesc>
          녹음된 목소리가 동화에서 어떻게 적용되는지 미리 들어보세요.
        </VoiceDesc>

        {/* 프로그레스 바 + 시간 */}
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill style={{ width: `${progress}%` }} />
          </ProgressBar>
          <TimeText>{formatTime(currentTime)}</TimeText>
        </ProgressContainer>

        {/* 재생 컨트롤 (앞/뒤 3초는 아직 콘솔만) */}
        <ControlRow>
          <ControlBtn onClick={() => console.log("뒤로 3초")}>
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

          <ControlBtn onClick={() => console.log("앞으로 3초")}>
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
  height: auto;
  margin-top: 48px;
  margin-bottom: 32px;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
`;

const SelectorRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 48px;
`;

/* Step01과 동일한 프로필 동그라미 스타일 */
const AvatarButton = styled.button`
  background: none;
  cursor: pointer;
  padding: 0;
  width: 62px;
  height: 62px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;

  border: ${({ $active }) =>
    $active ? "2px solid #FFD342" : "2px solid transparent"};
  box-shadow: ${({ $active }) =>
    $active ? "0 0 0 2px rgba(255, 211, 66, 0.25) inset" : "none"};

  transition: border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease;

  &:active {
    transform: scale(0.98);
  }
`;

const AvatarIllust = styled.img`
  width: 56px;
  height: 56px;
  object-fit: contain;
  pointer-events: none;
`;

const FieldGroup = styled.div`
  width: 343px;
  margin-top: 6px;
`;

const FieldLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #3a372f;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 343px;
  height: 52px;
  border-radius: 12px;
  border: 1px solid #eee;
  background: #fff;
  padding: 0 16px;
  font-size: 16px;
  font-family: NanumSquareRound;
  color: #393939;
  box-sizing: border-box;

  &::placeholder {
    color: #bdbdbd;
  }

  &:focus {
    outline: none;
    border-color: #ffd342;
    box-shadow: 0 0 0 3px rgba(255, 211, 66, 0.25);
  }
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
  border-radius: 4px;
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
  display: flex;
  width: 56px;
  height: 56px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
`;

const ControlIcon = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;
