import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import Button from '../../components/Button.jsx';
import api from '../../api/axios.js';

const RECORD_ICON = '/img/onboarding/sound.svg'; // 녹음하기

const CHARACTERS = [
  { key: 'dog',   src: '/img/onboarding/Avatar.svg',     code: 'voice1' },
  { key: 'bear',  src: '/img/onboarding/Avatar_1.svg',   code: 'voice2' },
  { key: 'cat',   src: '/img/onboarding/Avatar_3.svg',   code: 'voice3' },
  { key: 'alien', src: '/img/onboarding/Avatar_4.svg',   code: 'voice4' },
];

const VoiceSetStep01 = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(CHARACTERS[0].key);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  const current = CHARACTERS.find(c => c.key === selected) || CHARACTERS[0];

  // 🔥 voice_image_code 매핑
  const voiceImageCode = current.code;

  // 🔥 API 호출 포함한 Next 버튼
  const handleNext = async () => {
    if (name.trim() === '') {
      setError(true);
      return;
    }

    try {
      const response = await api.post('/api/accounts/voice/', {
        voice_name: name.trim(),
        voice_image_code: voiceImageCode
      });

      console.log("🎉 메타데이터 생성 성공:", response.data);

      const voiceId = response.data.voice_id;

      // step02로 voice_id 전달
      navigate('/mypage/voice_set/step02', {
        state: { voiceId }
      });

    } catch (e) {
      console.error("❌ 메타데이터 생성 실패:", e);
      alert("목소리 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <Screen>
      <Header
        title="목소리 등록하기"
        showBack={false}
        action={{
          icon: "/icons/new_right_part.svg",
          handler: () => setOpenModal(true),
        }}
      />

      <Content>
        <MainIllust src={current.src} alt="선택된 캐릭터" />

        <SelectorRow>
          {CHARACTERS.map(({ key, src }) => (
            <SelectButton
              key={key}
              onClick={() => setSelected(key)}
              aria-pressed={key === selected}
              $active={key === selected}
            >
              <SelectIllust src={src} alt={`${key} 캐릭터`} />
            </SelectButton>
          ))}
        </SelectorRow>

        {/* 이름 입력 */}
        <FieldGroup>
          <FieldLabel>이름</FieldLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim() !== '') setError(false);
            }}
            placeholder="이름을 입력해주세요."
            aria-label="이름 입력"
            $error={error}
            $shake={error}
          />
          {error && <ErrorText>목소리 이름을 입력해주세요.</ErrorText>}
        </FieldGroup>
      </Content>

      {openModal && (
        <Dim onClick={() => setOpenModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>등록이 완료되지 않았어요</ModalTitle>
            <ModalDesc>
              지금 나가면
              <br />저장된 내용이 모두 사라져요.
            </ModalDesc>

            <BtnRow>
              <ModalBtnGray onClick={() => navigate('/mypage/voice_set/main')}>
                나가기
              </ModalBtnGray>
              <ModalBtnYellow onClick={() => setOpenModal(false)}>
                이어서 등록
              </ModalBtnYellow>
            </BtnRow>
          </Modal>
        </Dim>
      )}

      <BottomArea>
        <Button
          bgColor="#342E29"
          color="#FFF"
          onClick={handleNext}
        >
          <BtnContent>
            <BtnIcon src={RECORD_ICON} alt="" aria-hidden="true" />
            <BtnText>녹음하기</BtnText>
          </BtnContent>
        </Button>
      </BottomArea>
    </Screen>
  );
};

export default VoiceSetStep01;

/* ---------------- Styled Components (그대로 유지) ---------------- */

// 흔들림 애니메이션
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
`;

const Screen = styled.div`
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

const SelectButton = styled.button`
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
  border: ${({ $active }) => ($active ? '2px solid #FFD342' : '2px solid transparent')};
  box-shadow: ${({ $active }) => ($active ? '0 0 0 2px rgba(255, 211, 66, 0.25) inset' : 'none')};
  transition: border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease;
  &:active { transform: scale(0.98); }
`;

const SelectIllust = styled.img`
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
  font-family: NanumSquareRound;
  color: #3a372f;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 343px;
  height: 52px;
  border-radius: 12px;
  border: 1px solid ${({ $error }) => ($error ? '#F44336' : '#eee')};
  background: #fff;
  padding: 0 16px;
  font-size: 16px;
  font-family: NanumSquareRound;
  color: #393939;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  ${({ $shake }) =>
    $shake &&
    css`
      animation: ${shake} 0.3s ease;
    `}

  &::placeholder { color: #bdbdbd; }

  &:focus {
    outline: none;
    border-color: ${({ $error }) => ($error ? '#F44336' : '#FFD342')};
    box-shadow: ${({ $error }) =>
      $error
        ? '0 0 0 3px rgba(244, 67, 54, 0.15)'
        : '0 0 0 3px rgba(255, 211, 66, 0.25)'};
  }
`;

const ErrorText = styled.div`
  color: #f44336;
  font-size: 13px;
  margin-top: 6px;
  font-family: NanumSquareRound;
`;

const BottomArea = styled.div`
  padding: 0 24px calc(env(safe-area-inset-bottom, 0) + 20px);
  display: flex;
  justify-content: center;
`;

const BtnContent = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 800;
`;

const BtnIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
  display: block;
`;

const BtnText = styled.span`
  color: #FFF;
  text-align: center;
  font-family: 'NanumSquareRound';
  font-size: 16px;
  font-weight: 800;
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
`;

const ModalDesc = styled.p`
  color: #7a7a7a;
  font-size: 14px;
  line-height: 22px;
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
