import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import Button from '../../components/Button.jsx';
import api from "../../api/axios.js";

// child_image_code 매핑 포함
const CHARACTERS = [
  { key: 'dog',  src: '/img/onboarding/Avatar.svg',    code: "child1" },
  { key: 'bear', src: '/img/onboarding/Avatar_1.svg',  code: "child2" },
  { key: 'cat',  src: '/img/onboarding/Avatar_3.svg',  code: "child3" },
  { key: 'alien',src: '/img/onboarding/Avatar_4.svg',  code: "child4" },
];

const OnboardingStep05 = () => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState(CHARACTERS[0].key);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(''); // YYYY-MM-DD 
  const [gender, setGender] = useState('');

  const [openSkip, setOpenSkip] = useState(false);
  const [openDone, setOpenDone] = useState(false);

  const current = CHARACTERS.find(c => c.key === selected) || CHARACTERS[0];

  // 생년월일 정규식 체크
  const birthValid = /^\d{4}-\d{2}-\d{2}$/.test(birthDate);

  const isValid = useMemo(() => {
    return (
      name.trim().length > 0 &&
      birthValid &&
      (gender === 'female' || gender === 'male')
    );
  }, [name, birthDate, gender]);

 
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!isValid) return;

    try {
      const childImageCode = CHARACTERS.find(c => c.key === selected)?.code || "child1";

      const res = await api.post("/api/accounts/child/", {
        name,
        birth_date: birthDate,
        gender: gender === "female" ? "F" : "M",
        child_image_code: childImageCode
      });

      console.log("아이 등록 성공:", res.data);
      setOpenDone(true);
    } catch (err) {
      console.error("아이 등록 실패:", err);
      alert("아이 등록 중 오류가 발생했습니다.");
    }
  };

  const resetForm = () => {
    setName('');
    setBirthDate('');
    setGender('');
    setSelected(CHARACTERS[0].key);
  };

  const handleBirthInput = (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 8);

    if (v.length >= 5) v = v.replace(/(\d{4})(\d{2})(\d{0,2})/, "$1-$2-$3");
    else if (v.length >= 3) v = v.replace(/(\d{4})(\d{0,2})/, "$1-$2");

    setBirthDate(v);
  };

  return (
    <Screen>
      <Header
        title="아이 정보 등록"
        showBack={true}
        onBack={() => navigate(-1)}
        action={{ text: '건너뛰기', handler: () => setOpenSkip(true) }}
      />

      <Content as="form" onSubmit={handleSubmit}>
        <MainIllust src={current.src} alt="선택된 캐릭터" />

        <SelectorRow>
          {CHARACTERS.map(({ key, src }) => (
            <SelectButton
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              aria-pressed={key === selected}
              $active={key === selected}
            >
              <SelectIllust src={src} alt={`${key} 캐릭터`} />
            </SelectButton>
          ))}
        </SelectorRow>

        {/* 이름 */}
        <FieldGroup>
          <FieldLabel>이름</FieldLabel>
          <Input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="이름을 입력해주세요."
          />
        </FieldGroup>

        {/* 생년월일 YYYY-MM-DD */}
        <FieldGroup>
          <FieldLabel>생년월일</FieldLabel>
          <Input
            value={birthDate}
            onChange={handleBirthInput}
            placeholder="0000-00-00"
            maxLength={10}
          />
        </FieldGroup>

        {/* 성별 */}
        <FieldGroup>
          <FieldLabel>성별</FieldLabel>
          <GenderRow>
            <GenderOption
              type="button"
              $active={gender === 'female'}
              onClick={() => setGender('female')}
            >
              <RadioIcon $active={gender === 'female'} />
              <span>여자</span>
            </GenderOption>

            <GenderOption
              type="button"
              $active={gender === 'male'}
              onClick={() => setGender('male')}
            >
              <RadioIcon $active={gender === 'male'} />
              <span>남자</span>
            </GenderOption>
          </GenderRow>
        </FieldGroup>
      </Content>

      <BottomArea>
        <Button
          width="343px"
          height="56px"
          $bgColor={isValid ? '#FFD342' : '#EDEDED'}
          $color={isValid ? '#ffff' : '#B9B9B9'}
          disabled={!isValid}
          onClick={handleSubmit}
        >
          등록하기
        </Button>
      </BottomArea>

      {/* 건너뛰기 모달 */}
      {openSkip && (
        <Dim onClick={() => setOpenSkip(false)}>
          <Modal role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <ModalTitle>등록을 건너뛰시겠습니까?</ModalTitle>
            <ModalDesc>지금까지 입력한 정보는 저장되지 않아요.</ModalDesc>
            <BtnRow>
              <ModalBtnGray onClick={() => { setOpenSkip(false); navigate('/home'); }}>
                건너뛰기
              </ModalBtnGray>
              <ModalBtnYellow onClick={() => setOpenSkip(false)}>
                이어서 등록
              </ModalBtnYellow>
            </BtnRow>
          </Modal>
        </Dim>
      )}

      {/* 완료 모달 */}
      {openDone && (
        <Dim onClick={() => setOpenDone(false)}>
          <Modal role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <ModalTitle>아이 정보 등록이 완료되었어요</ModalTitle>
            <ModalDesc>등록된 아이 정보로 맞춤 동화를 만들 수 있어요.</ModalDesc>
            <BtnRow>
              <CancelBtn onClick={() => { setOpenDone(false); resetForm(); }}>
                추가 등록
              </CancelBtn>
              <DeleteBtn onClick={() => navigate('/onboarding/end')}>
                확인
              </DeleteBtn>
            </BtnRow>
          </Modal>
        </Dim>
      )}
    </Screen>
  );
};

export default OnboardingStep05;


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
`;

const SelectorRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
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
    $active ? '0 0 0 2px rgba(255,211,66,0.25) inset' : 'none'};
  transition: border-color 120ms ease, transform 120ms ease;
  &:active { transform: scale(0.98); }
`;

const SelectIllust = styled.img`
  width: 56px;
  height: 56px;
  object-fit: contain;
`;

const FieldGroup = styled.div`
  width: 343px;
  margin-top: 24px;
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
  color: #393939;

  &::placeholder { color: #bdbdbd; }
  &:focus {
    outline: none;
    border-color: #ffd342;
    box-shadow: 0 0 0 3px rgba(255,211,66,0.25);
  }
`;

const GenderRow = styled.div`
  display: flex;
  gap: 20px;
  width: 343px;
`;

const GenderOption = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#3a372f' : '#7a7a7a')};
  font-size: 16px;
  font-weight: 600;
`;

const RadioIcon = styled.span`
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${({ $active }) => ($active ? '#FFD342' : '#D8D8D8')};
  background: #fff;
  box-shadow: ${({ $active }) =>
    $active ? '0 0 0 2px rgba(255,211,66,0.2) inset' : 'none'};
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: ${({ $active }) => ($active ? '12px' : '0')};
    height: ${({ $active }) => ($active ? '12px' : '0')};
    border-radius: 50%;
    background: #FFD342;
    transition: width 120ms ease, height 120ms ease;
  }
`;

const BottomArea = styled.div`
  padding: 0 24px calc(env(safe-area-inset-bottom, 0) + 20px);
  display: flex;
  justify-content: center;
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
  line-height: 28px;
  text-align: center;
`;

const ModalDesc = styled.p`
  margin: 0 0 16px;
  color: #7a7a7a;
  font-size: 14px;
  line-height: 22px;
  max-width: 272px;
  text-align: center;
`;

const BtnRow = styled.div`
  margin-top: 8px;
  margin-bottom: 4px;
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

const CancelBtn = styled(ModalBtnGray)``;
const DeleteBtn = styled(ModalBtnYellow)``;
