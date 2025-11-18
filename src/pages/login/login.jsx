import api from '../../api/axios';
import Header from '../../components/Header';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../../components/Button';

function Login() {
    const navigate = useNavigate();

    const [idError, setIdError] = useState(false);
    const [pwError, setPwError] = useState(false);

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    const [showPw, setShowPw] = useState(false);

    const isButtonActive = id.trim().length > 0 && pw.trim().length > 0;

    const handleLogin = async () => {
        try {
            const response = await api.post('/api/accounts/login/', {
                username: id,
                password: pw
            });

            console.log('로그인 성공:', response.data);

            localStorage.setItem('access_token', response.data.token.access_token);
            localStorage.setItem('refresh', response.data.token.access_token);

            navigate('/home');
        } catch (error) {
            console.error('로그인 실패:', error);

            if (error.response?.status === 401) {
                setIdError(true);
                setPwError(true);
            }
        }
    };

    return (
        <>
        <Header
            title="로그인"
            showBack={true}
            onBack={() => navigate('/intro')}
        />

        <Contents>
            <Logo><img src="/icons/logo.svg" /></Logo>

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
                        ? <img src="/icons/noshowimg.svg" />
                        : <img src="/icons/showimg.svg" />
                    }
                </ShowButton>
                </PwWrapper>
                {pwError && <ErrorText>아이디 또는 비밀번호가 일치하지 않습니다.</ErrorText>}
            </InputContainer>

            <ButtonContainer>
                <Button
                    disabled={!isButtonActive}
                    onClick={handleLogin}
                >
                    로그인
                </Button>
            </ButtonContainer>
        </Contents>
        </>
    );
}

export default Login;

const Contents = styled.div`
    width: 393px;
    height: 732px;
    padding: 32px 16px;
    display: flex;
    gap: 32px;
    flex-direction: column;
`

const Logo = styled.div`
    width: 358px;
    height: 168px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const InputContainer = styled.div`
    height: 104px;
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

const ErrorText = styled.div`
    padding: 0 16px;
    font-size: 12px;
    font-style: regular;
    font-weight: 400;
    color: #ff4242;
`

const ButtonContainer = styled.div`
    width: 393px;
    height: 56px;
`

const PwWrapper = styled.div`
    position: relative;
    width: 358px;
`;