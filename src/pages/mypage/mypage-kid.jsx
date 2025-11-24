import api from '../../api/axios';
import styled, { css } from 'styled-components';
import Header from '../../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';

function MypageKid() {
    const navigate = useNavigate();
    const { child_id } = useParams();

    const avatarMap = {
        child1: '/icons/avatar1.svg',
        child2: '/icons/avatar2.svg',
        child3: '/icons/avatar3.svg',
        child4: '/icons/avatar4.svg',
    };

    const [nickname, setNickname] = useState('');
    const [birth, setBirth] = useState('');
    const [seledtedAvatar, setSelectedAvatar] = useState(avatarMap.child1);
    const [seledtedGender, setSelectedGender] = useState('female');

    const [showToastModal, setShowToastModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBackModal, setShowBackModal] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = async () => {
        try {
            const formattedBirth = birth.replace(/\./g, '-');

            const payload = {
                name: nickname,
                birth_date: formattedBirth,
                gender: seledtedGender === 'female' ? 'F' : 'M',
                child_image_code: Object.keys(avatarMap).find(key => avatarMap[key] === seledtedAvatar)
            };

            const response = await api.put(`/api/accounts/child/${child_id}/`, payload);
            console.log("아이 정보 수정 성공:", response.data);

            setNickname(nickname);
            setBirth(birth);
            setSelectedGender(seledtedGender);
            setSelectedAvatar(seledtedAvatar);
            setShowToastModal(true);
            setIsSaved(true);
    
            setTimeout(() => {
                setShowToastModal(false);
            }, 1000);
        } catch (e) {
            console.error("아이 정보 등록 실패:", e);
        }
    };
    
    const handleBack = () => {
        if (isSaved) {
            navigate('/mypage-kid-detail');
        } else {
            setShowBackModal(true);
        }
    };

    const handleDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    const confirmDelete = async () => {
        try {
            const response = await api.delete(`/api/accounts/child/${child_id}/delete/`);
            console.log("아이 삭제 성공:", response.data);

            setShowDeleteModal(false);
            navigate('/mypage');
        } catch (e) {
            console.error("아이 삭제 실패:", e);
        }
    };

    const avatars = Object.values(avatarMap);

    const isButtonActive =
        (nickname ?? '').trim().length > 0 &&
        (birth ?? '').trim().length > 0;

    useEffect(() => {
        const fetchMypageKid = async () => {
            try {
                const response = await api.get(`/api/accounts/child/detail/${child_id}/`);
                console.log("아이 정보 조회:", response.data);

                setNickname(response.data.name || '');
                setBirth(response.data.birth_date?.replace(/-/g, '.') || '');
                setSelectedGender(response.data.gender === 'F' ? 'female' : 'male');
                setSelectedAvatar(avatarMap[response.data.child_image_code] || avatarMap.child1);
            } catch (e) {
                console.error("데이터 조회 실패:", e);
            }
        };
        fetchMypageKid();
    }, [child_id]);

    return (
        <Wrapper>
        <Header
            title="수정하기"
            showBack={true}
            onBack={handleBack}
        />

        <Contents>
            <AvatarContainer>
                <SelectedAvatar>
                    {seledtedAvatar && <img src={seledtedAvatar} />}
                </SelectedAvatar>
                <AvatarList>
                    {avatars.map((src, index) => (
                        <AvatarBtn
                            key={index}
                            $isSelected={seledtedAvatar === src}
                            onClick={() => setSelectedAvatar(src)}
                            aria-pressed= {seledtedAvatar === src}
                            aria-label={`아바타 ${index + 1}`}
                        >
                            <img src={src} />
                        </AvatarBtn>
                    ))}
                </AvatarList>
            </AvatarContainer>

            <InputContainer>
                <InputLabel>이름</InputLabel>
                <Input
                    type='text'
                    value={nickname || ''}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder='이름 입력'
                    $filled={nickname !== ''}
                />
            </InputContainer>

            <InputContainer>
                <InputLabel>출생연도</InputLabel>
                <Input
                    type='text'
                    value={birth || ''}
                    onChange={(e) => setBirth(e.target.value)}
                    placeholder='출생연도 입력'
                    $filled={birth !== ''}
                />
            </InputContainer>

            <GenderContainer>
                <GenderLabel>성별</GenderLabel>
                <GenderSelect>
                    <Female onClick={() => setSelectedGender('female')}>
                        {seledtedGender === 'female'
                            ? <img src='/icons/radio-filled.svg' />
                            : <img src='/icons/radio.svg' />
                        }
                        여자
                    </Female>
                    <Female onClick={() => setSelectedGender('male')}>
                        {seledtedGender === 'male'
                            ? <img src='/icons/radio-filled.svg' />
                            : <img src='/icons/radio.svg' />
                        }
                        남자
                    </Female>
                </GenderSelect>
            </GenderContainer>

            <DeleteContainer onClick={handleDeleteModal}>삭제하기</DeleteContainer>
            {showDeleteModal && (
                <ModalOverlay>
                    <ModalBox>
                        <ModalHeader>정말 삭제하시겠어요?</ModalHeader>
                        <ModalText>한 번 삭제하면 다시 되돌릴 수 없어요.<br />그래도 삭제하시겠어요?</ModalText>
                        <ModalBtnContainer>
                            <CancelBtn onClick={cancelDelete}>취소</CancelBtn>
                            <ConfirmBtn onClick={confirmDelete}>삭제</ConfirmBtn>
                        </ModalBtnContainer>
                    </ModalBox>
                </ModalOverlay>
            )}
        </Contents>

        <BtnContainer>
            <Button
                disabled={!isButtonActive}
                onClick={handleSave}
                $bgColor='#342e29'
                $color='#fff'
            >
                저장
            </Button>
        </BtnContainer>

        {showToastModal && (
            <ToastModal>변경 사항이 저장되었어요.</ToastModal>
        )}
        {showBackModal && (
            <ModalOverlay>
                <ModalBox>
                    <ModalHeader>수정이 완료되지 않았어요</ModalHeader>
                    <ModalText>지금 나가면<br />수정한 내용이 반영되지 않아요.</ModalText>
                    <ModalBtnContainer>
                        <CancelBtn onClick={() => navigate('/mypage-kid-detail')}>나가기</CancelBtn>
                        <ConfirmBtn onClick={() => setShowBackModal(false)}>수정하기</ConfirmBtn>
                    </ModalBtnContainer>
                </ModalBox>
            </ModalOverlay>
        )}
        </Wrapper>
    );
}

export default MypageKid;

const Wrapper = styled.div`
    width: 390px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`
const Contents = styled.div`
    width: 390px;
    height: 708px;
    padding: 24px 16px 64px 16px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    overflow-y: auto;
    scrollbar-width: none;
`

const AvatarContainer = styled.div`
    width: 358px;
    height: 256px;
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: center;
    justify-content: center;
`

const SelectedAvatar = styled.div`
    width: 120px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #f1f1f1;
    border-radius: 99px;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }
`

const AvatarList = styled.div`
    width: 358px;
    height: 56px;
    display: flex;
    flex-direction: row;
    gap: 24px;
    align-items: center;
    justify-content: center;
`

const AvatarBtn = styled.button`
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: ${({ $isSelected}) => ( $isSelected ? '2px solid #fff1c4' : '2px solid transparent')};
    background: none;
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        border: ${({ $isSelected}) => ( $isSelected ? '2px solid transparent' : '2px solid #f1f1f1')};
    }
`

const InputContainer = styled.div`
    height: 86px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const InputLabel = styled.div`
    color: #393939;
    font-size: 16px;
    font-style: normal;
    font-weight: 800;
`;

const Input = styled.input`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
    color: #DEDEDE;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    width: 358px;
    height: 54px;
    padding: 0 16px;
    border-radius: 8px;
    border: 1px solid #DEDEDE;
    background: #FFF;
    outline: none;

    ${({ $filled }) =>
        $filled &&
        css`
        border-color: #FFD342;
        color: #393939;
    `}

    &:focus {
        border-color: ${({ $error }) => ($error ? '#FF4242' : '#FFD342')};
        color: #393939;
    }

    ${({ $error }) =>
        $error &&
        css`
        border-color: #FF4242;
    `}

    &::placeholder {
        color: #dedede;
    }
`;

const BtnContainer = styled.div`
    width: 390px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const GenderContainer = styled.div`
    width: 358px;
    height: 60px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`

const GenderLabel = styled.div`
    width: 358px;
    height: 24px;
    font-size: 16px;
    font-weight: 800;
`

const GenderSelect = styled.div`
    width: 358px;
    height: 24px;
    display: flex;
    flex-direction: row;
    gap: 12px;
`

const Female = styled.div`
    width: 62px;
    height: 24px;
    display: flex;
    flex-direction: row;
    gap: 8px;
    color: #393939;
    font-size: 16px;
    font-weight: 800;
    align-items: center;
    cursor: pointer;
`

const ToastModal = styled.div`
    height: 46px;
    width: 358px;
    padding: 12px;
    background-color: #fff8e3;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    font-style: normal;
    display: flex;
    align-items: center;
    position: absolute;
    top: 16px;
`

const DeleteContainer = styled.div`
    width: 358px;
    height: 22px;
    display: flex;
    align-items: center;
    color: #bbb;
    font-size: 14px;
    font-weight: 700;
    font-style: normal;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 4px;
`

const ModalOverlay = styled.div`
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
`

const ModalBox = styled.div`
    width: 320px;
    height: 196px;
    padding: 24px 24px 16px 24px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 22px;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    background-color: #fff;
`

const ModalHeader = styled.div`
    color: #393939;
    font-size: 20px;
    font-weight: 800;
    text-align: center;
`

const ModalText = styled.div`
    color: #7a7a7a;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    line-height: 22px;
`

const ModalBtnContainer = styled.div`
    display: flex;
    gap: 12px;
`

const CancelBtn = styled.button`
    width: 130px;
    height: 40px;
    background-color: #f1f1f1;
    border-radius: 99px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7a7a7a;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
`

const ConfirmBtn = styled.button`
    width: 130px;
    height: 40px;
    background-color: #ffd342;
    border-radius: 99px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
`