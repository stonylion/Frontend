import api from '../../api/axios';
import styled, { css } from 'styled-components';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';

function Profile() {
    const navigate = useNavigate();

    const avatarMap = {
        woman: "/icons/avatar-1.svg",
        man: '/icons/avatar-2.svg',
        grand1: '/icons/avatar-3.svg',
        grand2: '/icons/avatar-4.svg',
    };

    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [seledtedAvatar, setSelectedAvatar] = useState('/icons/avatar1.svg')

    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [pwError, setPwError] = useState(false);

    const [showPw, setShowPw] = useState(false);
    const [showPwConfirm, setShowPwConfirm] = useState(false);

    const [isSaved, setIsSaved] = useState(false);

    const [showToastModal, setShowToastModal] = useState(false);
    const [showBackModal, setShowBackModal] = useState(false);

    const handleSave = async () => {
        if (password !== passwordConfirm) {
            setPwError(true);
            return;
        }

        try {
            const payload = {
                username: username,
                password: password || undefined,
                avatar_code: Object.keys(avatarMap).find(key => avatarMap[key] === seledtedAvatar)
            };

            const response = await api.put('/api/accounts/profile/update/', payload);
            console.log('프로필 수정 결과:', response.data);

            setShowToastModal(true);
            setIsSaved(true);
            setTimeout(() => setShowToastModal(false), 1000);
        } catch (error) {
            console.error('프로필 수정 실패:', error);
        }
    };

    const handleBack = () => {
        if (isSaved) {
            navigate('/mypage');
        } else {
            setShowBackModal(true);
        }
    };

    useEffect(() => {
        const fetchMypageProfile = async () => {
            try {
                const response = await api.get('api/accounts/profile/');

                console.log("프로필 데이터 조회:", response.data);

                setUserId(response.data.user_id);
                setUsername(response.data.username);
                setSelectedAvatar(avatarMap[response.data.avatar_code] || avatarMap.woman);
            } catch (e) {
                console.error("데이터 조회 실패:", e);
            }
        };

        fetchMypageProfile();
    }, []);

    const isButtonActive = 
        username.trim().length > 0 &&
        password.trim().length > 0 &&
        password === passwordConfirm;

    const avatars = Object.values(avatarMap);

    return (
        <Wrapper>
        <Header
            title="프로필 편집"
            showBack={true}
            onBack={handleBack}
        />

        <Contents>
            <AvatarContainer>
                <SelectedAvatar>
                    <img src={seledtedAvatar} />
                </SelectedAvatar>
                <AvatarList>
                    {avatars.map((src, index) => (
                        <AvatarBtn
                            key={index}
                            $isSelected={seledtedAvatar === src}
                            onClick={() => setSelectedAvatar(src)}
                            aria-pressed= {setSelectedAvatar === src}
                            aria-label={`아바타 ${index + 1}`}
                        >
                            <img src={src} />
                        </AvatarBtn>
                    ))}
                </AvatarList>
            </AvatarContainer>

            <InputContainer>
                <InputLabel>아이디</InputLabel>
                <Input
                    type='text'
                    value={username}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder='아이디 입력'
                    $filled={username !== ''}
                />
            </InputContainer>

            <InputContainer>
                <InputLabel>비밀번호</InputLabel>
                <PwWrapper>
                <Input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='비밀번호 입력'
                    $filled={password !== ''}
                    $error={pwError}
                />
                <ShowButton onClick={() => setShowPw(prev => !prev)}>
                    {showPw
                        ? <img src="/icons/noshowimg.svg" />
                        : <img src="/icons/showimg.svg" />
                    }
                </ShowButton>
                </PwWrapper>
            </InputContainer>

            <InputContainer>
                <InputLabel>비밀번호 확인</InputLabel>
                <PwWrapper>
                <Input
                    type={showPwConfirm ? 'text' : 'password'}
                    value={passwordConfirm}
                    onChange={(e) => {
                        setPasswordConfirm(e.target.value);
                        setPwError(password !== e.target.value);
                    }}
                    placeholder='비밀번호 재입력'
                    $filled={password !== ''}
                    $error={pwError}
                />
                <ShowButton onClick={() => setShowPwConfirm(prev => !prev)}>
                    {showPwConfirm
                        ? <img src="/icons/noshowimg.svg" />
                        : <img src="/icons/showimg.svg" />
                    }
                </ShowButton>
                </PwWrapper>
                {pwError && <ErrorText>비밀번호가 일치하지 않습니다.</ErrorText>}
            </InputContainer>
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
                        <CancelBtn onClick={() => navigate('/mypage')}>나가기</CancelBtn>
                        <ConfirmBtn onClick={() => setShowBackModal(false)}>수정하기</ConfirmBtn>
                    </ModalBtnContainer>
                </ModalBox>
            </ModalOverlay>
        )}
        </Wrapper>
    );
}

export default Profile;

const Wrapper = styled.div`
    width: 390px;
    height: 798px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`
const Contents = styled.div`
    width: 390px;
    flex: 1;
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

const ShowButton = styled.button`
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
`

const PwWrapper = styled.div`
    position: relative;
    width: 358px;
`;

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

const ErrorText = styled.div`
    padding: 0 16px;
    font-size: 12px;
    font-style: regular;
    font-weight: 400;
    color: #ff4242;
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