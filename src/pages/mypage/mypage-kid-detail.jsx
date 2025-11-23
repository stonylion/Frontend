import api from '../../api/axios';
import styled, { css } from 'styled-components';
import Header from '../../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function MypageKidDetail() {
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

    const handleEdit = () => {
        navigate(`/mypage-kid/:child_id`);
    };

    useEffect(() => {
        const fetchMypageKid = async () => {
            try {
                const response = await api.get(`/api/accounts/child/detail/${child_id}/`);
                console.log("아이 정보 조회:", response.data);

                setNickname(response.data.name || '');
                setBirth(response.data.birth_date || '');
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
            title="아이1"
            showBack={true}
            onBack={() => navigate('/mypage')}
            action={{ icon: '/icons/edit.svg', handler: () => handleEdit() }}
        />

        <Contents>
            <AvatarContainer>
                <SelectedAvatar>
                    {seledtedAvatar && <img src={seledtedAvatar} />}
                </SelectedAvatar>
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
        </Contents>
        </Wrapper>
    );
}

export default MypageKidDetail;

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
    height: 168px;
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