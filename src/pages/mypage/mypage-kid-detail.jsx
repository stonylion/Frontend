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

    const [goodStories, setGoodStories] = useState([
    {
        id: 1,
        title: "좋은 동화 1",
        runtime: "5분",
        img: "/icons/book1.svg",
        created_at: "2025-11-25"
    },
    {
        id: 2,
        title: "좋은 동화 2",
        runtime: "7분",
        img: "/icons/book2.svg",
        created_at: "2025-11-20"
    },
    {
        id: 3,
        title: "좋은 동화 1",
        runtime: "5분",
        img: "/icons/book1.svg",
        created_at: "2025-11-25"
    },
    {
        id: 4,
        title: "좋은 동화 2",
        runtime: "7분",
        img: "/icons/book2.svg",
        created_at: "2025-11-20"
    }
]);

const [badStories, setBadStories] = useState([
    {
        id: 3,
        title: "아쉬운 동화 1",
        runtime: "6분",
        img: "/icons/book3.svg",
        created_at: "2025-11-18"
    },
    {
        id: 4,
        title: "아쉬운 동화 2",
        runtime: "8분",
        img: "/icons/book4.svg",
        created_at: "2025-11-22"
    }
]);
    const [nickname, setNickname] = useState('');
    const [birth, setBirth] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(avatarMap.child1);
    const [selectedGender, setSelectedGender] = useState('female');
    const [activeGoodStoryId, setActiveGoodStoryId] = useState(null);
    const [activeBadStoryId, setActiveBadStoryId] = useState(null);
    const [deleteTarget, setDeleteTarget] =useState(null);

    const handleEdit = () => {
        navigate(`/mypage-kid/${child_id}`);
    };

    const handleGoodStoryClick = (id) => {
        setActiveGoodStoryId(activeGoodStoryId === id ? null : id);
    };

    const handleBadStoryClick = (id) => {
        setActiveBadStoryId(activeBadStoryId === id ? null : id);
    };

    const playBook = (story) => console.log('재생', story.title);
    const viewScript = async (story) => {
        /*
        try {
            const response = await api.get(`/api/story/${story.id}/script/`);
            console.log("스크립트 조회 성공:", response.data);

            navigate(`/mylib-script/${story.id}`, { state: { story }});
        } catch (e) {
            console.error("스크립트 조회 실패:", e);
        }
        */
    };
    const deleteBook = (story) => {
        setDeleteTarget(story);
        handleDelete();
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = () => {
        setShowDeleteModal(true);
    };
    const confirmDelete = async () => {
        /*
        if (!deleteTarget) return;

        try {
            const response = await api.delete(`/api/mylibrary/${deleteTarget.id}/`);
            console.log("동화 삭제 성공:", response.data);

            setMyStories(prev => prev.filter(story => story.id !== deleteTarget.id));
            setReWriteStories(prev => prev.filter(story => story.id !== deleteTarget.id));

            setShowDeleteModal(false);
            setDeleteTarget(null);
        } catch (e) {
            console.error("동화 삭제 실패:", e);
        }
        */
    };
    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    const formatDate = (createdAt) => {
        const date = new Date(createdAt);
        return (
            String(date.getFullYear()).slice(2) + '.' +
            String(date.getMonth() + 1).padStart(2, '0') + '.' +
            String(date.getDate()).padStart(2, '0')
        );
    };

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
            key={child_id}
            title={nickname}
            showBack={true}
            onBack={() => navigate('/mypage')}
            action={{ icon: '/icons/edit.svg', handler: () => handleEdit() }}
        />

        <Contents>
            <AvatarContainer>
                <SelectedAvatar>
                    {selectedAvatar && <img src={selectedAvatar} />}
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
                    readOnly
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
                    readOnly
                />
            </InputContainer>

            <GenderContainer>
                <GenderLabel>성별</GenderLabel>
                <GenderSelect>
                    <Female>
                        {selectedGender === 'female'
                            ? <img src='/icons/radio-filled.svg' />
                            : <img src='/icons/radio.svg' />
                        }
                        여자
                    </Female>
                    <Female>
                        {selectedGender === 'male'
                            ? <img src='/icons/radio-filled.svg' />
                            : <img src='/icons/radio.svg' />
                        }
                        남자
                    </Female>
                </GenderSelect>
            </GenderContainer>

            <ReportLabel style={{ marginLeft: "16px"}} >리포트</ReportLabel>

            <NEO>
                <ResultLabel>
                    <span>아이1의<br /></span>
                    <p>NEO 성격 분석 </p>
                    <span>결과예요</span>
                </ResultLabel>
                <Pentagon></Pentagon>
                <AnalysisComent>AI가 아이의 대화 내용을 분석해 산출한 참고용 결과로,<br />보다 정확한 성격 검사를 원할 시, 정식 검사를 권장드립니다.</AnalysisComent>
                <DetailLabel>
                    상세 분석
                    <img src='/icons/arrow-down.svg' width={16} />
                </DetailLabel>
                <Line></Line>
            </NEO>

            <NDW>
                <ResultLabel>
                    <span>아이1의<br /></span>
                    <p style={{ color: '#C5E384'}} >NDW 분석 </p>
                    <span>결과예요</span>
                </ResultLabel>
                <ResultCard>
                    <img src='/icons/report-card1.svg' />
                </ResultCard>
                <WordProgress>
                    <ReportLabel>고유 단어 사용률(NDW)</ReportLabel>
                    <WordProgressBar>
                        <WordProgressFill style={{ width: '58%' }}></WordProgressFill>
                    </WordProgressBar>
                    <WordCount>
                        <p>58개</p>
                        <p style={{ color: '#bbb' }}>100개</p>
                    </WordCount>
                    <WordLabel>
                        <p>고유 단어 수 (평균)</p>
                        <p style={{ color: '#bbb' }}>총 발화 단어 수 (평균)</p>
                    </WordLabel>
                </WordProgress>
                <WordTop5>
                    <ReportLabel>한 달 동안 가장 많이 사용한 단어 Top 5</ReportLabel>
                    <Circle></Circle>
                    <AnalysisComent>NDW란 고유 단어의 수로, 아이의 발화 중 중복을 제외한<br />유일한 단어의 수를 세어 어휘의 다양성을 측정하는 기준입니다.</AnalysisComent>
                </WordTop5>
                <Line style={{ marginTop: '32px'}} ></Line>
            </NDW>

            <Custom>
                <ResultLabel>
                    <span style={{ marginLeft: "16px"}} >아이가 남긴<br /></span>
                    <p style={{ color: '#72CACB', marginLeft: "16px" }} >제작 동화 </p>
                    <span>후기예요</span>
                </ResultLabel>
                <Review>
                    <ReportLabel style={{ marginLeft: "16px"}} >좋아요!</ReportLabel>
                    <ReviewLabel>아이가 아래의 동화를 읽고 즐거운 반응을 보였어요.</ReviewLabel>
                    {goodStories.length === 0 ? (
                        <Empty2><img src='/icons/empty2.svg' /></Empty2>
                    ) : (
                        <ScrollArea>
                        {goodStories.map((story) => (
                            <CreatedContainer key={story.id} onClick={() => handleGoodStoryClick(story.id)}>
                                    {activeGoodStoryId === story.id ? (
                                        <OptionCard
                                            $imgUrl={story.img}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <CloseBtn onClick={(e) => { e.stopPropagation(); setActiveGoodStoryId(null); }}>×</CloseBtn>
                                            <Option onClick={() => playBook(story)}>재생하기</Option>
                                            <Option onClick={() => viewScript(story)}>스크립트 보기</Option>
                                            <Option onClick={() => deleteBook(story)}>삭제하기</Option>
                                        </OptionCard>
                                    ) : (
                                        <>
                                            <BookWrapper>
                                                <img src={story.img} />
                                            </BookWrapper>
                                        </>
                                    )}
                                <CreatedTitle>{story.title}</CreatedTitle>
                                <CreatedMin>
                                    {story.runtime}
                                    <Separator>|</Separator>
                                    {formatDate(story.created_at)}
                                </CreatedMin>
                            </CreatedContainer>
                        ))}
                        </ScrollArea>
                    )}
                </Review>
                <Review>
                    <ReportLabel style={{ marginLeft: "16px"}} >아쉬워요ㅜ.ㅜ</ReportLabel>
                    <ReviewLabel>아이가 아래의 동화를 읽고 아쉽다는 반응을 보였어요.</ReviewLabel>
                    {badStories.length === 0 ? (
                        <Empty2><img src='/icons/empty2.svg' /></Empty2>
                    ) : (
                        <ScrollArea>
                        {badStories.map((story) => (
                            <CreatedContainer key={story.id} onClick={() => handleBadStoryClick(story.id)}>
                                    {activeBadStoryId === story.id ? (
                                        <OptionCard
                                            $imgUrl={story.img}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <CloseBtn onClick={(e) => { e.stopPropagation(); setActiveBadStoryId(null); }}>×</CloseBtn>
                                            <Option onClick={() => playBook(story)}>재생하기</Option>
                                            <Option onClick={() => viewScript(story)}>스크립트 보기</Option>
                                            <Option onClick={() => deleteBook(story)}>삭제하기</Option>
                                        </OptionCard>
                                    ) : (
                                        <>
                                            <BookWrapper>
                                                <img src={story.img} />
                                            </BookWrapper>
                                        </>
                                    )}
                                <CreatedTitle>{story.title}</CreatedTitle>
                                <CreatedMin>
                                    {story.runtime}
                                    <Separator>|</Separator>
                                    {formatDate(story.created_at)}
                                </CreatedMin>
                            </CreatedContainer>
                        ))}
                        </ScrollArea>
                    )}
                </Review>
            </Custom>
        </Contents>

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
    padding: 24px 0 64px 0;
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
    margin-left: 16px;
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
    margin-left: 16px;
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
    margin-left: 16px;
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
`

const ReportLabel = styled.div`
    height: 24px;
    width: 358px;
    color: #393939;
    font-size: 16px;
    font-weight: 800;
    display: flex;
    flex-direction: column;
    justify-content: center;
`

const NEO = styled.div`
    width: 358px;
    padding-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 64px;
    margin-left: 16px;
`

const ResultLabel = styled.div`
    width: 213px;
    height: 56px;
    color: #000;
    font-family: "SOYO Maple TTF";
    font-size: 20px;
    font-weight: 700;
    text-align: center;

    p {
        color: #ffd342;
        display: inline;
    }
`

const Pentagon = styled.div`
    width: 358px;
    height: 220px;
`

const AnalysisComent = styled.div`
    width: 358px;
    height: 40px;
    text-align: center;
    color: #bbb;
    font-size: 12px;
    font-weight: 700;
    line-height: 20px;
    text-align: center;
`

const DetailLabel = styled.div`
    width: 358px;
    height: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 700;
    margin-top: -32px;
`

const Line = styled.div`
    height: 4px;
    width: 358px;
    background-color: #f1f1f1;
    margin-top: -4px;
    border-radius: 10px;
`

const NDW = styled.div`
    width: 358px;
    padding-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    margin-left: 16px;
`

const ResultCard = styled.div`
    width: 330px;
    height: 444px;
    margin-bottom: 32px;
`

const WordProgress = styled.div`
    width: 358px;
    height: 114px;
`

const WordProgressBar = styled.div`
    width: 358px;
    height: 16px;
    border-radius: 99px;
    background-color: #f6f6f6;
    margin-top: 24px;
`

const WordProgressFill = styled.div`
    height: 100%;
    background: #D6F29C;
    border-radius: 99px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width 0.4s ease;
`

const WordCount = styled.div`
    margin-top: 8px;
    width: 358px;
    height: 22px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 700;
    color: #393939;
`

const WordLabel = styled.div`
    width: 358px;
    height: 20px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 400;
    color: #393939;
`

const WordTop5 = styled.div`
    width: 358px;
    height: 352px;
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
`

const Circle = styled.div`
    width: 358px;
    height: 240px;
`

const Custom = styled.div`
    width: 390px;
    height: 828px;
    padding-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 64px;
`

const Review = styled.div`
    width: 390px;
    height: 258px;
    display: flex;
    flex-direction: column;
`

const ReviewLabel = styled.div`
    width: 358px;
    height: 20px;
    color: #7a7a7a;
    font-size: 12px;
    font-weight: 400;
    display: flex;
    align-items: center;
    margin-left: 16px;
    margin-bottom: 12px;
`

const ScrollArea = styled.div`
    margin-left: 16px;
    height: 214px;
    overflow-x: auto;
    display: flex;
    flex-direction: row;
    gap: 14px;
    scrollbar-width: none;
    padding-right: 16px;

    &::-webkit-scrollbar {
        display: none;
    }
`

const CreatedContainer = styled.div`
    width: 110px;
    height: 202px;
`

const CreatedTitle = styled.div`
    margin-top: 6px;
    width: 110px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    align-self: stretch;
    overflow: hidden;
    color: #393939;
    text-overflow: ellipsis;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
`

const CreatedMin = styled.div`
    margin-top: 6px;
    width: 110px;
    color: #BBB;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
`

const OptionCard = styled.div`
    width: 110px;
    height: 154px;
    border-radius: 12px;
    background: linear-gradient(180deg, #393939 0%, rgba(39, 34, 31, 0.70) 100%), url(${props => props.$imgUrl}) lightgray 50% / cover no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
    position: relative;
    box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
    border: 1px solid #dedede;
`;

const Option = styled.div`
    font-size: 12px;
    margin: 6px 0;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
        transform: scale(1.05);
    }
`;

const CloseBtn = styled.div`
    position: absolute;
    top: 6px;
    right: 10px;
    font-size: 18px;
    cursor: pointer;
`;

const BookWrapper = styled.div`
    position: relative;
    width: 110px;
    height: 154px;
    border-radius: 12px;
    border: 0.5px solid #DEDEDE;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    background: white;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const Separator = styled.span`
    color: #DeDeDe;
    margin: 0 4px;
`;

const Empty2 = styled.div`
    width: 358px;
    height: 202px;
    margin-left: 16px;
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