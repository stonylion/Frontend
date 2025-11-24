import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import Button from '../../components/Button.jsx';
import api from "../../api/axios.js";


const RECORD_ICON = '/img/onboarding/sound.svg';

// voice_image_code 매핑 테이블
const IMAGE_CODE = {
  dog: 'voice1',
  bear: 'voice2',
  cat: 'voice3',
  alien: 'voice4',
};

// 캐릭터 목록
const CHARACTERS = [
  { key: 'dog', src: '/img/onboarding/Avatar.svg' },
  { key: 'bear', src: '/img/onboarding/Avatar_1.svg' },
  { key: 'cat', src: '/img/onboarding/Avatar_3.svg' },
  { key: 'alien', src: '/img/onboarding/Avatar_4.svg' },
];

const OnboardingStep01 = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(CHARACTERS[0].key);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  const current = CHARACTERS.find(c => c.key === selected) || CHARACTERS[0];


  const handleNext = async () => {
    if (name.trim() === '') {
      setError(true);
      return;
    }

    try {
      const body = {
        voice_name: name,
        voice_image_code: IMAGE_CODE[selected], // 매핑된 code
      };

      const res = await api.post('api/accounts/voice/', body);

      const voiceId = res.data.voice_id;

      // Step02로 voice 정보 전달
      navigate('/onboarding/step_02', {
        state: {
          voiceId,
          voiceName: name,
          voiceImageCode: IMAGE_CODE[selected],
        },
      });
    } catch (error) {
      console.error('목소리 정보 저장 오류:', error);
      alert('목소리 정보를 저장하는 중 문제가 발생했습니다.');
    }
  };

  return (
    <Screen>
      <Header
        title="목소리 설정"
        showBack={true}
        onBack={() => navigate(-1)}
        action={{ text: '건너뛰기', handler: () => setOpen(true) }}
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

      {/* 모달 */}
      {open && (
        <Dim onClick={() => setOpen(false)}>
          <Modal role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <ModalTitle>목소리 설정을 건너뛰시겠습니까?</ModalTitle>
            <ModalDesc>
              지금까지 입력한 정보는 저장되지 않으며,
              <br />
              기본 음성으로 동화가 재생돼요.
            </ModalDesc>

            <BtnRow>
              <ModalBtnGray onClick={() => { setOpen(false); navigate('/onboarding/step_04'); }}>
                건너뛰기
              </ModalBtnGray>
              <ModalBtnYellow onClick={() => setOpen(false)}>
                이어서 설정
              </ModalBtnYellow>
            </BtnRow>
          </Modal>
        </Dim>
      )}

      <BottomArea>
        <Button $bgColor="#342E29" color="#FFF" onClick={handleNext}>
          <BtnContent>
            <BtnIcon src={RECORD_ICON} alt="" aria-hidden="true" />
            <BtnText>녹음하기</BtnText>
          </BtnContent>
        </Button>
      </BottomArea>
    </Screen>
  );
};

export default OnboardingStep01;



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
  margin-top: 48px;
  margin-bottom: 32px;
  object-fit: contain;
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
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${({ $active }) => ($active ? '2px solid #FFD342' : '2px solid transparent')};
  box-shadow: ${({ $active }) =>
    $active ? '0 0 0 2px rgba(255, 211, 66, 0.25) inset' : 'none'};
  transition: 120ms ease;
`;

const SelectIllust = styled.img`
  width: 56px;
  height: 56px;
  object-fit: contain;
`;

const FieldGroup = styled.div`
  width: 343px;
  margin-top: 6px;
`;

const FieldLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
  font-family: NanumSquareRound;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 343px;
  height: 52px;
  border-radius: 12px;
  border: 1px solid ${({ $error }) => ($error ? '#F44336' : '#eee')};
  padding: 0 16px;
  font-size: 16px;
  transition: 0.2s;
  ${({ $shake }) =>
    $shake &&
    css`
      animation: ${shake} 0.3s ease;
    `}
`;

const ErrorText = styled.div`
  color: #f44336;
  font-size: 13px;
  margin-top: 6px;
`;

const BottomArea = styled.div`
  padding: 0 24px 20px;
  display: flex;
  justify-content: center;
`;

const BtnContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const BtnIcon = styled.img`
  width: 18px;
`;

const BtnText = styled.span`
  font-family: 'NanumSquareRound';
  font-weight: 800;
  font-size: 16px;
  color: #fff;
`;

const Dim = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 390px;
  height: 852px;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 320px;
  height: 196px;
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 22px;
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
  background: #f1f1f1;
  border-radius: 99px;
  color: #7a7a7a;
  font-weight: 800;
`;

const ModalBtnYellow = styled.button`
  width: 130px;
  height: 40px;
  background: #ffd342;
  border-radius: 99px;
  color: #fff;
  font-weight: 800;
`;

