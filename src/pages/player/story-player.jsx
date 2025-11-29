import api from '../../api/axios';
import styled from 'styled-components';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Button from '../../components/Button';

const CustomEnding = ({ navigate, handleReplay, child_id, storyTitle, vote, handleVote, sendLastPage }) => (
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
        <CustomTitle>이야기가 어땠는지 알려주세요</CustomTitle>
        <VoteContainer>
            <Good onClick={() => handleVote('good')}>
                <img src={vote === 'good' ? '/imges/Good-active.svg' : '/imges/Good.svg'} />
            </Good>
            <Bad onClick={() => handleVote('bad')}>
                <img src={vote === 'bad' ? '/imges/Bad-active.svg' : '/imges/Bad.svg'} />
            </Bad>
        </VoteContainer>
        <EndingButton
            style={{ position: 'absolute', left: '246px', top: '270px' }}
            onClick={async () => {
                await sendLastPage();
                navigate('/mylib');
            }}
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

const ClassicEnding = ({ navigate, handleReplay, storyId, storyTitle, sendLastPage }) => (
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
                navigate('/rewrite_end', {
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
            onClick={async () => {
                await sendLastPage();
                navigate('/mylib');
            }}
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

const ExtendedEnding = ({ navigate, handleReplay, sendLastPage, storyTitle }) => (
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
        <EndingButton
            style={{ position: 'absolute', left: '246px', top: '150px' }}
            onClick={async () => {
                await sendLastPage();
                navigate('/mylib');
            }}
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
    const { story_id } = useParams();

    // 🍅 Mylib에서 넘겨준 값 받기: navigate(`/story-play/${book.story.id}`, { state: { book } }); (결말 확장에서 필요)
    const book = location.state?.book;

    const storyId = book?.story?.id;
    const storyCategory = book?.story?.category || 'custom';

    const avatarMap = {
        voice1: "/icons/avatar1.svg",
        voice2: '/icons/avatar2.svg',
        voice3: '/icons/avatar3.svg',
        voice4: '/icons/avatar4.svg',
    };

    const [pages, setPages] = useState([]);
    const [voices, setVoices] = useState([]);
    const [selectedImg, setSelectedImg] = useState(0);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    const audioRef = useRef(null);
    const [step, setStep] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [typeOn, setTypeOn] = useState(false);
    const [playOn, setPlayOn] = useState(false);
    const [voiceModal, setVoiceModal] = useState(false);
    const [endingType, setEndingType] = useState(null); 
    const [showEndingOverlay, setShowEndingOverlay] = useState(false);
    const [vote, setVote] = useState(null);
    const [currentPage, setCurrentPage] = useState(null);
    const [storyTitle, setStoryTitle] = useState(null);
    const [author, setAuthor] = useState(null);
    const [category, setCategory] = useState('classic');
    const [previewAudio, setPreviewAudio] = useState(null);
    const [childId, setChildId] = useState(null);
    const isLastPage = selectedImg === pages.length - 1;
    const [ttsCache, setTtsCache] = useState({}); // key: 페이지 번호, value: tts URL
    const [isPaused, setIsPaused] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

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

    const voiceClick = async () => {
        try {
            const response = await api.get('api/accounts/voice/list');
            console.log('목소리 목록 조회 성공:', response.data);

            const formattedVoices = response.data.voices.map((v) => ({
                id: v.voice_id,
                name: v.name,
                audio: v.cloned_voice_url,
                avatar: avatarMap[v.voice_image_code],
            }))
            setVoices(formattedVoices);
            setVoiceModal(true);
        } catch (e) {
            console.error('목소리 목록 조회 실패:', e);
        }
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
        setIsAutoPlay(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };

    useEffect(() => {
        const fetchActiveChild = async () => {
            try {
                const response = await api.get('/api/accounts/children/');
                const activeChild = response.data.children.find(c => c.is_active);
                if (activeChild) setChildId(activeChild.child_id);
            } catch (err) {
                console.error('활성화 아이 조회 실패:', err);
            }
        };
        fetchActiveChild();
    }, []);

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
                        sendLastPage={sendLastPage}
                        storyTitle={storyTitle}
                        handleVote={handleVote}
                        child_id={childId}
                    />
                );
            case 'classic':
                return (
                    <ClassicEnding
                        navigate={navigate}
                        handleReplay={handleReplay}
                        storyId={storyId}
                        storyTitle={storyTitle}
                        sendLastPage={sendLastPage}
                    />
                );
            case 'extended':
                return (
                    <ExtendedEnding
                        navigate={navigate}
                        handleReplay={handleReplay}
                        sendLastPage={sendLastPage}
                        storyTitle={storyTitle}
                    />
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        const fetchStory  = async () => {
            try {
                const response = await api.get(`/api/story/${story_id}/pages`);

                const formattedPages = response.data.map((p) => ({
                    img: p.illustrations[0]?.image,
                    page: `${p.page_number}페이지`,
                    type: p.text,
                }));
                setPages(formattedPages);
                console.log('동화 데이터 조회 성공:', response.data);
            } catch (e) {
                console.error('동화 데이터 조회 실패:', e);
            }
        }
        fetchStory();
    }, [story_id]);

    useEffect(() => {
        if (category) setEndingType(category);
    }, [category]);

    useEffect(() => {
        if (pages.length > 0) {
            setCurrentPage(pages[selectedImg]);
        }
    }, [selectedImg, pages]);

    useEffect(() => {
        if (isAutoPlay && selectedVoice && currentPage) {
            playVoice(currentPage.text);
        }
    }, [currentPage]);

    useEffect(() => {
        const fetchTitle = async () => {
            try {
                const response = await api.get(`/api/story/${story_id}/`);
                console.log('동화 제목 조회 성공:', response.data);

                setStoryTitle(response.data.title);
                setAuthor(response.data.author);
                setCategory(response.data.category);
            } catch (e) {
                console.error('동화 제목 조회 실패:', e);
            }
        }
        fetchTitle();
    }, [story_id]);

    useEffect(() => {
        if (step >= 2) {
            setTypeOn(true);
        } else {
            setTypeOn(false);
        }
    }, [step]);
/*
    useEffect(() => {
        if (voices.length > 0 && !selectedVoice) {
            setSelectedVoice(voices[0]);
        }
    }, [voices]);
*/
    useEffect(() => {
    if (!isPaused && selectedVoice && currentPage) {
        playPageTTS(currentPage, selectedImg, true); // isAuto = true
    }
}, [selectedImg, currentPage, selectedVoice, isPaused]);



    const playAudio = (url) => {
        if (!url) return;
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.play().catch(err => { if (err.name !== 'AbortError') console.error(err); });
        setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setIsPlaying(false);
    };


    // case1: 오버레이 안내용
const playOverlayTTS = async () => {
    if (!selectedVoice) return;

    const payload = {
        voice_id: selectedVoice.id,
        title: storyTitle,
        author: author,
        pages: [
            {
                page: 0,
                text: ""
            }  // case1
        ]
    };

    console.log('TTS 요청 payload:', payload);

    try {
        const response = await api.post('/api/story/user/voice/tts/', payload);
        console.log('오버레이 TTS URL:', response.data.tts_audio_url);
        playAudio(response.data.tts_audio_url);
    } catch (err) {
        console.error('오버레이 TTS 실패:', err);
    }
};

// case2: 페이지별 재생용
// 페이지별 TTS
const playPageTTS = async (pageIndex) => {
    if (!selectedVoice || !pages[pageIndex]) return;

    const pageNum = pageIndex + 1;

    // 캐시 있으면 바로 재생
    if (ttsCache[pageNum]) {
        playAudio(ttsCache[pageNum]);
        return;
    }

    const payload = {
        voice_id: selectedVoice.id,
        pages: [{ page: pageNum, text: pages[pageIndex].type }]
    };

    try {
        const response = await api.post('/api/story/user/voice/tts/', payload);
        setTtsCache(prev => ({ ...prev, [pageNum]: response.data.tts_audio_url }));
        playAudio(response.data.tts_audio_url);
    } catch (err) {
        console.error('페이지 TTS 실패:', err);
    }
};

    // 오버레이 안내 step 0,1
    useEffect(() => {
        if (step < 2 && selectedVoice) {
            playOverlayTTS();
        }
    }, [step, selectedVoice]);

    // 페이지 변경 시
    useEffect(() => {
        if (step >= 2 && selectedVoice && currentPage) {
            playPageTTS(currentPage);
        }
    }, [selectedImg, selectedVoice, step, currentPage]);

    useEffect(() => {
        console.log('currentPage 변경', currentPage);
    }, [currentPage]);

    // Audio 재생 함수
        const playNewTTS = (url) => {
            if (!url) return;

            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }

            const audio = new Audio(url);
            audioRef.current = audio;
            audio.play().then(() => setIsPlaying(true));

            audio.onended = () => {
                setIsPlaying(false); // 재생 끝나도 멈춤 아이콘으로 바꾸지 않음
            };
        };

        // 페이지별 TTS 재생
        const playCurrentPageTTS = async () => {
        if (!selectedVoice || !currentPage) return;

        const payload = {
            voice_id: selectedVoice.id,
            pages: [
                {
                    page: selectedImg + 1,
                    text: currentPage.type
                }
            ]
        };

        try {
            const response = await api.post('/api/story/user/voice/tts/', payload);
            console.log('받은 TTS URL:', response.data.tts_audio_url);
            playNewTTS(response.data.tts_audio_url);
        } catch (err) {
            console.error('TTS 생성 실패:', err);
        }
    };

useEffect(() => {
    if (!selectedVoice) return;

    // step < 2: 오버레이 안내 TTS
    if (step < 2) {
        playOverlayTTS();
    } 
    // step >= 2: 페이지 TTS
    else if (currentPage) {
        playPageTTS(selectedImg);
    }
}, [selectedImg, currentPage, selectedVoice, step]);


    // 자동 재생
    useEffect(() => {
        if (isAutoPlay && selectedVoice && currentPage) {
            playCurrentPageTTS();
        }
    }, [currentPage, selectedVoice, isAutoPlay]);

    // 재생/일시정지 버튼
    const togglePlay = () => {
    if (isPlaying) {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setIsPaused(true);
        setIsPlaying(false);
    } else {
        setIsPaused(false);
        if (currentPage) playPageTTS(currentPage, selectedImg);
    }
};

    // 미리듣기
    const handlePreviewVoice = (voice) => {
        if (previewAudio) {
            previewAudio.pause();
            previewAudio.currentTime = 0;
        }
        const audio = new Audio(voice.audio);
        audio.play().catch(err => {
            if (err.name !== 'AbortError') console.error(err);
        });
        setPreviewAudio(audio);
    };

    const playTTS = async () => {
        if (!selectedVoice || !storyTitle || !author || pages.length === 0) return;

        const payload = {
            voice_id: selectedVoice.id,
            pages: pages.map((p, idx) => ({
                page: idx + 1,
                text: p.type
            }))
        };

        try {
            const response = await api.post('/api/story/user/voice/tts/', payload);

        // 이전 재생 중인 오디오 종료
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        const audio = new Audio(response.data.audio_url);
        audioRef.current = audio;
        audio.play().catch(err => {
            if (err.name !== 'AbortError') console.error(err);
        });

        setPlayOn(true);
        setIsAutoPlay(true);
    } catch (err) {
        console.error('TTS 재생 요청 실패:', err);
    }
};

// 모달 닫힐 때 미리듣기 멈추기
    useEffect(() => {
        if (!voiceModal && previewAudio) {
            previewAudio.pause();
            previewAudio.currentTime = 0;
            setPreviewAudio(null);
        }
    }, [voiceModal]);

    const handleStartVoice = () => {
        if(!selectedVoice || !currentPage) return;

        setPlayOn(true);
        setIsAutoPlay(true);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        const audio = new Audio(selectedVoice.audio);
        audioRef.current = audio;
        audio.play().catch(err => {
            if (err.name !== 'AbortError') console.error(err);
        });
    };

    const sendLastPage = async () => {
        try {
            await api.post('/api/mylibrary/last-viewed/', {
                story_id: story_id,
                page_number: selectedImg + 1,
            });
            console.log('마지막 페이지 전송 성공:');
        } catch (e) {
            console.error('마지막 페이지 전송 실패:', e);
        }
    };

    useEffect(() => {
        if (isAutoPlay && selectedVoice && currentPage) {
            playTTS();
        }
    }, [currentPage]);

    const handleVote = async (type) => {
        const reactionMap = { good: 'like', bad: 'dislike' };
        const newVote = vote === type ? null : type;
        setVote(newVote);

        try {
            const response = await api.post(`/api/story/${story_id}/reaction/`, {
                child_id: childId,
                reaction: newVote ? reactionMap[newVote] : null,
            });
            console.log('반응 저장 완료:', response.data);
        } catch (e) {
            console.error('반응 저장 실패:', e);
            setVote(null);
        }
    };

    return (
        <Wrapper onClick={handleTap}>
            {pages.length > 0 && pages[selectedImg] && (
            <StoryImg>
                <img src={pages[selectedImg].img} />

                {typeOn && (
                    <TypeContainer>
                        <Type>{maxSubtitle(pages[selectedImg].type)}</Type>
                    </TypeContainer>
                )}
            </StoryImg>
            )}
            

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
                                onClick={async () => {
                                    await sendLastPage();
                                    navigate('/mylib')
                                }}
                            />
                            <Title>{storyTitle}</Title>
                        </LeftGroup>
                        <RightButtons onClick={(e) => e.stopPropagation()}>
                            <BtnContainer onClick={() => setTypeOn(!typeOn)}>
                                <img
                                    src={typeOn ? '/icons/type-on.svg' : '/icons/type-off.svg'}
                                    width={24}
                                />
                                {typeOn ? '자막켜기' : '자막끄기'}
                            </BtnContainer>
                            <BtnContainer onClick={voiceClick}>
                                <img
                                    src='/icons/sound-white.svg'
                                    width={24}
                                    onClick={handleStartVoice}
                                />
                                읽어주기
                            </BtnContainer>
                        </RightButtons>
                    </TopBar>
                    <PlayBtn>
                        <img
                            src={playOn ? '/icons/stop.svg' : '/icons/play.svg'}
                            width={40}
                            onClick={togglePlay}
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
                                        $isSelected={selectedVoice?.id === v.id}
                                        onClick={() => setSelectedVoice(v)}
                                    >
                                        <LeftVoice $isSelected={selectedVoice?.id === v.id}>
                                            <Img $isSelected={selectedVoice?.id === v.id}>
                                                <img src={v.avatar} width={44} />
                                            </Img>
                                            {v.name}
                                        </LeftVoice>
                                        <RightVoice>
                                            <img
                                                src='/icons/preview-play.svg'
                                                width={20}
                                                onClick={() => handlePreviewVoice(v)}
                                            />
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
                            <VoiceBtn
                                onClick={() => {
                                    setVoiceModal(false);
                                    if (selectedVoice && currentPage) playTTS();
                                }}
                            >
                                확인
                            </VoiceBtn>
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

const VoiceBtn = styled.button`
    height: 40px;
    width: 272px;
    background-color: #393939;
    border-radius: 99px;
    color: white;
    font-size: 14px;
    font-weight: 800;
`

const StoryImg = styled.div`
    width: 694px;
    height: 390px;
    margin-left: 29px;

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
    bottom: 16px;
    width: 694px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
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
    font-size: 19px;
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
    margin-bottom: 6px;
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
    padding: 10px 0;
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
