import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import styled, { css } from 'styled-components';
import Button from '../../components/Button';

function Signup() {
    const navigate = useNavigate();

    {/* 에러 상태 */}
    const [idError, setIdError] = useState(false);
    const [pwError, setPwError] = useState(false);
    const [pwConfirmError, setPwConfirmError] = useState(false);

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [pwConfirm, setPwConfirm] = useState('');

    const [showPw, setShowPw] = useState(false);
    const [showPwConfirm, setShowPwConfirm] = useState(false);

    const [termsService, setTermsService] = useState(false);
    const [termsPrivacy, setTermsPrivacy] = useState(false);
    const [termsOptional, setTermsOptional] = useState(false);
    const [termsAll, setTermsAll] = useState(false);

    {/* 전체 동의 */}
    const handleAllCheck = () => {
        const newState = !termsAll;
        setTermsAll(newState);
        setTermsService(newState);
        setTermsPrivacy(newState);
        setTermsOptional(newState);
    };

    const handleSignup = async () => {
        try {
            const response = await api.post('/api/accounts/signup/', {
                username: id,
                password: pw
            });

            const token = response.data.token;

            console.log('회원가입 성공:', response.data);

            localStorage.setItem('access_token', token.access_token);
            localStorage.setItem('refresh', token.refresh);
            localStorage.setItem("username", id);


            navigate('/onboarding');
        } catch (error) {
            console.error('회원가입 실패:', error.response.data);

            if (error.response?.status === 400) {
                setIdError(true);
            }
        }
    };

    useEffect(() => {
        if (pwConfirm && pw !== pwConfirm) {
            setPwConfirmError(true);
        } else {
            setPwConfirmError(false);
        }
    }, [pw, pwConfirm]);

    useEffect(() => {
        if (termsService && termsPrivacy && termsOptional) {
            setTermsAll(true);
        } else {
            setTermsAll(false);
        }
    }, [termsService, termsPrivacy, termsOptional]);

    const isButtonActive = id && pw && pwConfirm && termsService && termsPrivacy && !pwConfirmError;

    return(
        <>
        <Header
            title="회원가입"
            showBack={true}
            onBack={() => navigate('/intro')}
        />
        <Contents>
            <InputContainer>
                <InputLabel>아이디</InputLabel>
                <Input
                    value={id}
                    onChange={e => setId(e.target.value)}
                    placeholder='아이디 입력'
                    $filled={id !== ''}
                    $error={idError}
                />
            </InputContainer>

            <InputContainer>
                <InputLabel>비밀번호</InputLabel>
                <PwWrapper>
                <Input
                    type={showPw ? 'text' : 'password'}
                    value={pw}
                    onChange={e => setPw(e.target.value)}
                    placeholder='비밀번호 입력'
                    $filled={pw !== ''}
                    $error={pwError}
                />
                <ShowButton onClick={() => setShowPw(prev => !prev)}>
                    {showPw 
                        ? <img src="/icons/showimg.svg" />
                        : <img src="/icons/noshowimg.svg" />
                    }
                </ShowButton>
                </PwWrapper>
            </InputContainer>

            <InputContainer>
                <InputLabel>비밀번호 확인</InputLabel>
                <PwWrapper>
                <Input
                    type={showPwConfirm ? 'text' : 'password'}
                    value={pwConfirm}
                    onChange={e => setPwConfirm(e.target.value)}
                    placeholder='비밀번호 재입력'
                    $filled={pwConfirm !== ''}
                    $error={pwConfirmError}
                />
                <ShowButton onClick={() => setShowPwConfirm(prev => !prev)}>
                    {showPwConfirm
                        ? <img src="/icons/showimg.svg" />
                        : <img src="/icons/noshowimg.svg" />
                    }
                </ShowButton>
                </PwWrapper>
                {pwConfirmError && <ErrorText>비밀번호가 일치하지 않습니다.</ErrorText>}
            </InputContainer>

            <CheckContainer>
                <CheckLabel>
                <input
                    type="checkbox"
                    checked={termsAll}
                    onChange={handleAllCheck}
                    />
                <CustomBox />
                전체 동의(선택 정보 포함)
                </CheckLabel>
            </CheckContainer>

            <Line></Line>

            <CheckContainer>
                <CheckLabel>
                <input
                    type="checkbox"
                    checked={termsService}
                    onChange={() => setTermsService(prev => !prev)}
                />
                <CustomBox />
                [필수] 서비스 이용 약관
                <img
                    src='/icons/right-part.svg'
                    onClick={() => navigate('/signup/agree/service')}
                />
                </CheckLabel>
            </CheckContainer>

            <CheckContainer>
                <CheckLabel>
                <input
                    type="checkbox"
                    checked={termsPrivacy}
                    onChange={() => setTermsPrivacy(prev => !prev)}
                />
                <CustomBox />
                [필수] 개인정보 수집 및 이용 동의
                <img
                    src='/icons/right-part.svg'
                    onClick={() => navigate('/signup/agree/privacy')}
                />
                </CheckLabel>
            </CheckContainer>

            <CheckContainer>
                <CheckLabel>
                <input
                    type="checkbox"
                    checked={termsOptional}
                    onChange={() => setTermsOptional(prev => !prev)}
                />
                <CustomBox />
                [선택] 마케팅 및 메시지 수신 동의
                <img
                    src='/icons/right-part.svg'
                    onClick={() => navigate('/signup/agree/marketing')}
                />
                </CheckLabel>
            </CheckContainer>
        </Contents>

        <ButtonContainer>
            <Button
                disabled={!isButtonActive}
                onClick={handleSignup}
            >
                다음
            </Button>
        </ButtonContainer>
        </>
    );
}

export default Signup;

const Contents = styled.div`
    width: 393px;
    height: 708px;
    padding: 24px 16px;
`;

const InputContainer = styled.div`
    height: 136px;
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

const ErrorText = styled.div`
    padding: 0 16px;
    font-size: 12px;
    font-style: regular;
    font-weight: 400;
    color: #ff4242;
`

const CheckContainer = styled.div`
    display: flex;
    align-items: center;
    width: 358px;
    height: 54px;
    flex-direction: row;
`;

const CheckLabel = styled.label`
    display: flex;
    cursor: pointer;
    color: #393939;
    font-size: 16px;
    font-style: normal;
    gap: 12px;
    font-weight: 700;
    align-items: center;

    input {
        display: none;
    }
`;

const CustomBox = styled.span`
    position: relative;
    width: 24px;
    height: 24px;
    border: 2px solid #dedede;
    border-radius: 8px;
    background-color: #fff;

    ${CheckLabel} input:checked + & {
        background-color: #FFD342;
        border-color: #FFD342;
    }

    ${CheckLabel} input:checked + &::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -58%);
        color: white;
        font-size: 18px;
        font-weight: 700;
    }
`;


const Line = styled.div`
    background-color: #dedede;
    width: 358px;
    height: 1px;
`;

const ButtonContainer = styled.div`
    width: 390px;
    height: 80px;
    padding-left: 16px;
    display: flex;
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