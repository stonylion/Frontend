import styled from 'styled-components';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Button from '../../components/Button';

const CustomEnding = ({ navigate, handleReplay, vote, setVote }) => (
    <EndingOverlay>
        <TopBar>
            <LeftGroup onClick={(e) => e.stopPropagation()}>
                <img
                    src='/icons/Leftpart-white.svg'
                    onClick={() => navigate('/mylib')}
                />
                <Title>동화 제목을 입력해주세요</Title>
            </LeftGroup>
        </TopBar>
        <CustomTitle>이야기가 어땠는지 알려주세요</CustomTitle>
        <VoteContainer>
            <Good onClick={() => setVote('good')}>
                <img src={vote === 'good' ? '/imges/Good-active.svg' : '/imges/Good.svg'} />
            </Good>
            <Bad onClick={() => setVote('bad')}>
                <img src={vote === 'bad' ? '/imges/Bad-active.svg' : '/imges/Bad.svg'} />
            </Bad>
        </VoteContainer>
        <EndingButton
            style={{ position: 'absolute', left: '246px', top: '270px' }}
            onClick={() => navigate('/mylib')}
        >
            나가기
        </EndingButton>
        <ReturnButton
            style={{ position: 'absolute', left: '328px', bottom: '33px' }}
            onClick={handleReplay}
        >
            <img src='/icons/returnbtn.svg' />
            다시보기
        </ReturnButton>
    </EndingOverlay>
);

const ClassicEnding = ({ navigate, handleReplay, storyId, storyTitle }) => (
    <EndingOverlay>
        <TopBar>
            <LeftGroup onClick={(e) => e.stopPropagation()}>
                <img
                    src='/icons/Leftpart-white.svg'
                    onClick={() => navigate('/mylib')}
                />
                <Title>{storyTitle}</Title>
            </LeftGroup>
        </TopBar>

        {/* 🍅 결말 확장하기 버튼: endwrite로 이동 + storyId, storyTitle 전달 */}
        <ExtendButton
            style={{
                position: 'absolute',
                left: '246px',
                top: '150px',
                backgroundColor: '#FFD342'
            }}
            onClick={() =>
                navigate('/rewrite_end/main', {
                    state: {
                        storyId,
                        storyTitle
                    }
                })
            }
        >
            결말 확장하기
        </ExtendButton>

        <EndingButton
            style={{ position: 'absolute', left: '246px', top: '206px' }}
            onClick={() => navigate('/mylib')}
        >
            나가기
        </EndingButton>

        <ReturnButton
            style={{ position: 'absolute', left: '328px', bottom: '97px' }}
            onClick={handleReplay}
        >
            <img src='/icons/returnbtn.svg' />
            다시보기
        </ReturnButton>
    </EndingOverlay>
);

const ExtendedEnding = ({ navigate, handleReplay }) => (
    <EndingOverlay>
        <TopBar>
            <LeftGroup onClick={(e) => e.stopPropagation()}>
                <img
                    src='/icons/Leftpart-white.svg'
                    onClick={() => navigate('/mylib')}
                />
                <Title>동화 제목을 입력해주세요</Title>
            </LeftGroup>
        </TopBar>
        <EndingButton
            style={{ position: 'absolute', left: '246px', top: '150px' }}
            onClick={() => navigate('/mylib')}
        >
            나가기
        </EndingButton>
        <ReturnButton
            style={{ position: 'absolute', left: '328px', bottom: '153px' }}
            onClick={handleReplay}
        >
            <img src='/icons/returnbtn.svg' />
            다시보기
        </ReturnButton>
    </EndingOverlay>
);

function StoryPlayer() {
    const navigate = useNavigate();
    const location = useLocation();

    // 🍅 Mylib에서 넘겨준 값 받기: navigate(`/story-play/${book.story.id}`, { state: { book } }); (결말 확장에서 필요)
    const book = location.state?.book;

    const storyId = book?.story?.id;
    const storyTitle = book?.story?.title || '동화 제목을 입력해주세요';
    const storyCategory = book?.story?.category || 'custom';

    const pages = [
        { img: '/imges/illust-landscape.png', page: '1페이지', type: '자막 영역입니다.자막 영역입니다.자막 영역입니다.자막 영역입니다.자막 영역입니다.자막 영역입니다.자막 영역입니다. 자막 영' },
        { img: '/imges/story-play.png', page: '2페이지', type: '자막 영역입니다.자막 영역입니다.자막 영역입니다.자막 영역입니' },
        { img: '/imges/illust-style.png', page: '3페이지', type: '자막 영역입니다.자막 영역입니다.자막 영역입니다.자막 영역입니다아아아' },
        { img: '/imges/illust-style.png', page: '4페이지', type: '자막 영역입니다.자막 영역입니다.자막 영역입니다.자막 영역입니' },
        { img: '/imges/illust-style.png', page: '5페이지', type: '자막 영역입니다.자막 영역입니다.자막 영역입니다.자막 영역입니' },
        { img: '/imges/illust-style.png', page: '6페이지', type: '자막 영역입니다.자막 영역입니다.자막 영역입니다.자막 영역입니' },
    ];

    const voices = [
        { avatar: '/icons/avatar3.svg', name: '목소리1' },
        { avatar: '/icons/avatar1.svg', name: '목소리2' },
        { avatar: '/icons/avatar5.svg', name: '성우 목소리1' },
    ];

    const [selectedImg, setSelectedImg] = useState(0);
    const [selectedVoice, setSelectedVoice] = useState(0);
    const [step, setStep] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [typeOn, setTypeOn] = useState(false);
    const [playOn, setPlayOn] = useState(false);
    const [voiceModal, setVoiceModal] = useState(false);
    const [endingType, setEndingType] = useState(null); 
    const [showEndingOverlay, setShowEndingOverlay] = useState(false);
    const [vote, setVote] = useState(null);
    const isLastPage = selectedImg === pages.length - 1;

    // 🍅 Mylib에서 온 story.category 기준으로 endingType 설정: 결말 확장에서 필요
    useEffect(() => {
        if (storyCategory) {
            setEndingType(storyCategory); // 'classic' | 'custom' | 'extended'
        }
    }, [storyCategory]);

    useEffect(() => {
        setShowEndingOverlay(false);
    }, [selectedImg]);

    // 더블탭 감지
    const lastTap = useRef(0);
    const handleTap = (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap.current;

        if (tapLength < 300 && tapLength > 0) {
            const elementWidth = e.currentTarget.offsetWidth;
            const x = e.nativeEvent.offsetX;

            if (x < elementWidth / 2) {
                handleDoubleTap('left');
            } else {
                handleDoubleTap('right');
            }
        } else {
            if (isLastPage) {
                if (!showMenu) {
                    setShowEndingOverlay(true);
                }
            }
            else if (!showMenu) {
                if (step < 2) {
                    setStep(step + 1);
                } else {
                    setShowMenu(true);
                }
            }
        }
        lastTap.current = currentTime;
    };

    const maxSubtitle = (text) => {
        if (!text) return '';
        let result = '';
        for (let i = 0; i < text.length; i += 70) {
            result += text.slice(i, i + 70) + '\n';
        }
        return result.trim();
    };

    const voiceClick = () => {
        setVoiceModal(true);
    };

    const handleDoubleTap = (direction) => {
        if (direction === 'left' && selectedImg > 0) {
            setSelectedImg(selectedImg - 1);
        }
        if (direction === 'right' && selectedImg < pages.length - 1) {
            setSelectedImg(selectedImg + 1);
        }
    };

    const handleReplay = () => {
        setSelectedImg(0);
        setStep(2);
        setShowMenu(false);
        setShowEndingOverlay(false);
        setTypeOn(false);
        setPlayOn(false);
    };

    const renderEndingOverlay = () => {
        if (!isLastPage || !showEndingOverlay) return null;

        switch (endingType) {
            case 'custom':
                return (
                    <CustomEnding
                        navigate={navigate}
                        handleReplay={handleReplay}
                        vote={vote}
                        setVote={setVote}
                    />
                );
            case 'classic':
                return (
                    <ClassicEnding
                        navigate={navigate}
                        handleReplay={handleReplay}
                        storyId={storyId}
                        storyTitle={storyTitle}
                    />
                );
            case 'extended':
                return <ExtendedEnding navigate={navigate} handleReplay={handleReplay} />;
            default:
                return null;
        }
    };

    return (
        <Wrapper onClick={handleTap}>
            <StoryImg>
                <img src={pages[selectedImg].img} />

                {typeOn && (
                    <TypeContainer>
                        <Type>{maxSubtitle(pages[selectedImg].type)}</Type>
                    </TypeContainer>
                )}
            </StoryImg>

            {!isLastPage && step < 2 && (
                <Overlay>
                    {step === 0 && (
                        <Text01>
                            <img src='/icons/backward.svg' />
                            <Text>왼쪽 더블탭은 이전 페이지로</Text>
                        </Text01>
                    )}
                    {step === 1 && (
                        <Text02>
                            <Text>오른쪽 더블탭은 다음 페이지로</Text>
                            <img src='/icons/forward.svg' />
                        </Text02>
                    )}
                </Overlay>
            )}

            {step >= 2 && showMenu && (
                <Overlay onClick={() => {
                    setShowMenu(false);
                    setVoiceModal(false);
                }}>
                    <TopBar>
                        <LeftGroup onClick={(e) => e.stopPropagation()}>
                            <img
                                src='/icons/Leftpart-white.svg'
                                onClick={() => navigate('/mylib')}
                            />
                            <Title>동화 제목을 입력해주세요</Title>
                        </LeftGroup>
                        <RightButtons onClick={(e) => e.stopPropagation()}>
                            <BtnContainer onClick={() => setTypeOn(!typeOn)}>
                                <img
                                    src={typeOn ? '/icons/type-off.svg' : '/icons/type-on.svg'}
                                    width={24}
                                />
                                {typeOn ? '자막끄기' : '자막켜기'}
                            </BtnContainer>
                            <BtnContainer onClick={voiceClick}>
                                <img src='/icons/sound-white.svg' width={24} />
                                읽어주기
                            </BtnContainer>
                        </RightButtons>
                    </TopBar>
                    <PlayBtn
                        onClick={(e) => {
                            e.stopPropagation();
                            setPlayOn(!playOn);
                        }}
                    >
                        <img
                            src={playOn ? '/icons/stop.svg' : '/icons/play.svg'}
                            width={40}
                        />
                    </PlayBtn>
                    <PageContainer onClick={(e) => e.stopPropagation()}>
                        <PageTitle>
                            전체 페이지
                            <Count>{pages.length}</Count>
                        </PageTitle>
                        <Scroll>
                            {pages.map((p, i) => (
                                <Page
                                    key={i}
                                    $isSelected={selectedImg === i}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImg(i);
                                    }}
                                >
                                    <PageImg $isSelected={selectedImg === i}>
                                        <img src={p.img} />
                                    </PageImg>
                                    <PageNum $isSelected={selectedImg === i}>{p.page}</PageNum>
                                </Page>
                            ))}
                        </Scroll>
                    </PageContainer>
                    {voiceModal && (
                        <VoiceModal onClick={(e) => e.stopPropagation()}>
                            <VoiceContainer>
                                {voices.map((v, i) => (
                                    <VoiceSelect
                                        key={i}
                                        $isSelected={selectedVoice === i}
                                        onClick={() => setSelectedVoice(i)}
                                    >
                                        <LeftVoice $isSelected={selectedVoice === i}>
                                            <Img $isSelected={selectedVoice === i}>
                                                <img src={v.avatar} width={44} />
                                            </Img>
                                            {v.name}
                                        </LeftVoice>
                                        <RightVoice>
                                            <img src='/icons/preview-play.svg' width={20} />
                                        </RightVoice>
                                    </VoiceSelect>
                                ))}
                                <VoiceSelect>
                                    <LeftVoice>
                                        <img
                                            src='/icons/voice-add.svg'
                                            width={44}
                                            onClick={() => navigate('/mypage/voice_set/step03')}
                                        />
                                        추가하기
                                    </LeftVoice>
                                </VoiceSelect>
                            </VoiceContainer>
                            <Button
                                $width="272px"
                                $height="40px"
                                $bgColor="#393939"
                                onClick={() => { setVoiceModal(false); }}
                            >
                                확인
                            </Button>
                        </VoiceModal>
                    )}
                </Overlay>
            )}
            {renderEndingOverlay()}
        </Wrapper>
    );
}

export default StoryPlayer;

const Wrapper = styled.div`
    width: 798px;
    height: 390px;
    position: relative;
    background-color: black;
    overflow: hidden;
`;

const StoryImg = styled.div`
    width: 694px;
    height: 390px;
    margin-left: 29px;
    position: relative;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        border-radius: 0;
    }
`;

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.80);
    display: flex;
    color: #fff;
    font-size: 16px;
    font-weight: 800;
    z-index: 100;
    align-items: center;
    cursor: pointer;
`;

const Text = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const Text01 = styled.div`
    position: absolute;
    left: 44px;
    display: flex;
    width: 238px;
    height: 24px;
    justify-content: space-around;
    align-items: center;
`;

const Text02 = styled.div`
    position: absolute;
    right: 90px;
    display: flex;
    width: 238px;
    height: 24px;
    justify-content: space-around;
    align-items: center;
`;

const TopBar = styled.div`
    width: 774px;
    height: 40px;
    padding: 9px 16;
    position: absolute;
    top: 16px;
    left: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const LeftGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const RightButtons = styled.div`
    display: flex;
    gap: 8px;
`;

const Title = styled.div`
    margin-left: 4px;
    height: 22px;
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    background-color: transparent;
    border: none;
    padding: 0 8px;
    display: flex;
    align-items: center;
`;

const BtnContainer = styled.div`
    width: 111px;
    height: 40px;
    display: flex;
    padding: 0 16px 0 8px;
    gap: 12px;
    color: #fff;
    font-size: 14px;
    font-weight: 800px;
    align-items: center;
`;

const PlayBtn = styled.div`
    width: 40px;
    height: 40px;
    position: absolute;
    top: 126px;
    right: 402px;
`;

const PageContainer = styled.div`
    height: 148px;
    width: 798px;
    padding-left: 16px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    position: absolute;
    bottom: 32px;
`;

const PageTitle = styled.div`
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    display: flex;
    gap: 4px;
`;

const Count = styled.div`
    color: #ffd342;
`;

const Scroll = styled.div`
    width: 784px;
    height: 118px;
    display: flex;
    gap: 16px;
    overflow-x: auto;
    scrollbar-width: none;
    padding-right: 16px;
`;

const Page = styled.div`
    width: 120px;
    height: 118px;
    padding: 7px 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const PageImg = styled.div`
    width: 120px;
    height: 80px;
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid ${({ $isSelected }) => ($isSelected ? '#ffd342' : 'transparent')};

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const PageNum = styled.div`
    width: 120px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 800;
    color: ${({ $isSelected }) => ($isSelected ? '#ffd342' : '#fff')};
`;

const TypeContainer = styled.div`
    position: absolute;
    bottom: 0px;
    width: 694px;
    height: 112px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
`;

const Type = styled.div`
    padding: 8px 16px;
    max-width: calc(694px - 32px);

    background: rgba(0,0,0,0.6);
    border-radius: 8px;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;

    color: #fff;
    font-size: 24px;
    font-weight: 800;
    line-height: 32px;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

const VoiceModal = styled.div`
    height: 326px;
    width: 320px;
    padding: 24px 24px 16px 24px;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 0 1px 0 rgba(24, 24, 27, 0.30), 0 8px 16px 0 rgba(24, 24, 27, 0.10);
    display: flex;
    flex-direction: column;
    z-index: 100;
    position: absolute;
    top: 32px;
    right: 262px;
    justify-content: space-between;
`;

const VoiceContainer = styled.div`
    width: 275px;
    overflow-y: auto;
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const VoiceSelect = styled.div`
    width: 275px;
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const LeftVoice = styled.div`
    display: flex;
    gap: 12px;
    color: ${({ $isSelected }) => ($isSelected ? '#ffd342' : '#393939')};
    font-size: 16px;
    font-weight: 700;
    align-items: center;
`;

const Img = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border:  ${({ $isSelected }) => $isSelected ? '1.5px solid #ffd342' : '1.5px solid transparent'};

    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border:  ${({ $isSelected }) => $isSelected ? '1.5px solid transparent' : '1.5px solid #f1f1f1'};
        object-fit: cover;
    }
`;

const RightVoice = styled.div`
    width: 20px;
    height: 44px;
    display: flex;
    gap: 12px;
    align-items: center;
`;

const EndingOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 200;

    & > * {
        pointer-events: auto;
    }
`;

const ExtendButton = styled.button`
    width: 260px;
    height: 48px;
    color: #fff;
    border-radius: 99px;
    font-size: 16px;
    font-weight: 800;
    border: none;
    cursor: pointer;
`;

const EndingButton = styled.button`
    width: 260px;
    height: 48px;
    color: #fff;
    border-radius: 99px;
    background-color: #342E29;
    font-size: 16px;
    font-weight: 800;
    border: none;
    cursor: pointer;
`;

const ReturnButton = styled.div`
    width: 91px;
    height: 27px;
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    display: flex;
    justify-content: center;
    gap: 12px;
    align-items: center;
    text-align: center;
    cursor: pointer;
`;

const CustomTitle = styled.div`
    width: 276px;
    height: 44px;
    padding: 8px;
    position: absolute;
    left: 238px;
    top: 44px;
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const VoteContainer = styled.div`
    width: 388px;
    height: 138px;
    display: flex;
    gap: 100px;
    position: absolute;
    left: 182px;
    top: 114px;
`;

const Good = styled.button`
    width: 144px;
    height: 134px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    border: none;
    background: none;
`;

const Bad = styled.button`
    width: 144px;
    height: 134px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    border: none;
    background: none;
`;
