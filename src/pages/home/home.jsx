import api from '../../api/axios';
import styled from 'styled-components';
import BottomBar from '../../components/Bottom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const categoryBadge = {
        classic: '/icons/Bookmark-cream.svg',
        custom: '/icons/Bookmark-black.svg',
        extended: '/icons/Bookmark-yellow.svg',
    };

    const [kidsData, setKidsData] = useState([]);

    const [recentHistory, setRecentHistory] = useState();
    const [myStories, setMyStories] = useState([]);
    const [recommendedStories, setRecommendedStories] = useState([]);
    const [reWriteStories, setReWriteStories] = useState([]);

    const [activeMyStoryId, setActiveMyStoryId] = useState(null);
    const [activeRecommendedId, setActiveRecommendedId] = useState(null);
    const [activeReWriteStoryId, setActiveReWriteStoryId] = useState(null);

    const [selectedKid, setSelectedKid] = useState(null);
    const [open, setOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] =useState(null);

    const handleSelect = async (kid) => {
        try {
            const response = await api.put(`api/accounts/child/${kid.child_id}/activate/`);
            setSelectedKid(kid);
            setOpen(false);
            console.log("아이 활성화 변경 성공:", response.data);
        } catch (e) {
            console.error("아이 활성화 실패:", e);
        }
    };

    const handleMyStoryClick = (id) => {
        setActiveMyStoryId(activeMyStoryId === id ? null : id);
    };
    const handleRecommendedClick = (id) => {
        setActiveRecommendedId(activeRecommendedId === id ? null : id);
    };
    const handleReWriteStoryClick = (id) => {
        setActiveReWriteStoryId(activeReWriteStoryId === id? null : id);
    };

    const playBook = (story) => {
        navigate(`/story-player/${story.id}`);
    };
    const viewScript = async (story) => {
        try {
            const response = await api.get(`/api/story/${story.id}/script/`);
            console.log("스크립트 조회 성공:", response.data);

            navigate(`/mylib-script/${story.id}`, { state: { story }});
        } catch (e) {
            console.error("스크립트 조회 실패:", e);
        }
    };
    const deleteBook = (story) => {
        setDeleteTarget(story);
        handleDelete();
    };
    const reWrite = (story) => {
        navigate("/rewrite_end", {
            state: {
                storyId: story.id   //🍅 결말확장으로 이동
            }
        });
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = () => {
        setShowDeleteModal(true);
    };
    const confirmDelete = async () => {
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
    };
    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const response = await api.get('api/accounts/children/');
                console.log("response.data:", response.data);
                const children = response.data.children.map((kid, idx) => ({
                    ...kid,
                    avatar: `/icons/avatar${idx + 1}.svg`
                }));

                setKidsData(children);

                const activeKid = children.find(k => k.is_active);
                if (activeKid) {
                    setSelectedKid(activeKid);
                }
            } catch (e) {
                console.error('아이 목록 조회 실패:', e);
            }
        };

        fetchChildren();
    }, []);

    useEffect(() => {
        const fetchRecentHistory = async () => {
            try {
                const response = await api.get('/api/mylibrary/recentread/');
                console.log("최근 본 동화 조회 성공:", response.data);

                setRecentHistory(response.data);
            } catch (e) {
                console.error("최근 본 동화 조회 실패:", e);
            }
        };

        fetchRecentHistory();
    }, []);

    useEffect(() => {
        const fetchMyStories = async () => {
            try {
                const response = await api.get('/api/story/', { params: { category: 'custom' } });
                console.log("제작 동화 조회 성공:", response.data);

                setMyStories(response.data);
            } catch (e) {
                console.error("제작 동화 조회 실패:", e);
            }
        };

        fetchMyStories();
    }, []);

    const formatDate = (createdAt) => {
        const date = new Date(createdAt);
        return (
            String(date.getFullYear()).slice(2) + '.' +
            String(date.getMonth() + 1).padStart(2, '0') + '.' +
            String(date.getDate()).padStart(2, '0')
        );
    };

    useEffect(() => {
        const fetchRecommendedStories = async () => {
            try {
                const response = await api.get('/api/story/', { params: { category: 'classic' } });
                console.log("추천 명작 동화 조회 성공:", response.data);

                setRecommendedStories(response.data);
            } catch (e) {
                console.error("명작 조회 실패:", e);
            }
        };

        fetchRecommendedStories();
    }, []);

    useEffect(() => {
        const fetchReWriteStories = async () => {
            try {
                const response = await api.get('/api/story/', { params: { category: 'extended' } });
                console.log("확장 동화 조회 성공:", response.data);

                setReWriteStories(response.data);
            } catch (e) {
                console.error("확장 동화 조회 실패:", e);
            }
        };

        fetchReWriteStories();
    }, []);


    return (
        <>
        <Logo>
            <img src='/icons/logo_home.svg' />

            {selectedKid && (
                <img
                    src={selectedKid.avatar}
                    width={40}
                    onClick={() => setOpen(!open)}
                    style={{ border: "1px solid #f1f1f1", borderRadius: "99px"}}
                />
            )}

            <Dropdown open={open}>
                {kidsData.map((kid) => (
                    <DropdownItem
                        key={kid.child_id}
                        onClick={() => handleSelect(kid)}
                        $selected={selectedKid?.child_id === kid.child_id}
                    >
                        {kid.name}
                        {selectedKid.child_id === kid.child_id &&
                            <Check>
                                <img src='/icons/check-home.svg' width={15}/>
                            </Check>
                        }
                    </DropdownItem>
                ))}
            </Dropdown>
        </Logo>

        <Contents>
            <Banner>
                <img src='/icons/banner.svg' />
            </Banner>

            <StoryContent>
                <StoryLabel>
                    최근 본 히스토리
                    <img
                        src='/icons/right-part.svg'
                        width={20} height={20}
                        onClick={() => navigate('/mylib')}
                    />
                </StoryLabel>
                
                {recentHistory?.results?.length > 0 ? (
                    <StoryScroll>
                        {recentHistory?.results?.map((history) => (
                            <HistoryContainer key={history.id}>
                                <Card>
                                    <img
                                        src={history.story?.img}
                                        onClick={() => navigate(`/story-player/${history.id}`)}
                                    />
                                    <Badge>
                                        <img
                                            src={categoryBadge[history.story.category]}
                                            width={25}
                                        />
                                    </Badge>
                                </Card>
                                <TextBox>
                                    <StoryTitle>{history.story.title}</StoryTitle>
                                    <StoryTime>{history.story.runtime}</StoryTime>
                                </TextBox>
                            </HistoryContainer>
                        ))}
                    </StoryScroll>
                ) : (
                    <Empty1><img src='/icons/empty1.svg' /></Empty1>
                )}
            </StoryContent>

            <CreatedStoryContent>
                <StoryLabel>
                    부모의 이야기를 아이에게
                    <img
                        src='/icons/right-part.svg'
                        width={20} height={20}
                        onClick={() => navigate('/mylib', { state: { initialFilter: "제작" } })}
                    />
                </StoryLabel>

                {myStories.length === 0 ? (
                    <Empty2><img src='/icons/empty2.svg' /></Empty2>
                ) : (
                    <CreatedStoryScroll>
                    {myStories.map((story) => (
                        <CreatedContainer key={story.id} onClick={() => handleMyStoryClick(story.id)}>
                                {activeMyStoryId === story.id ? (
                                    <OptionCard
                                        $imgUrl={story.img}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <CloseBtn onClick={(e) => { e.stopPropagation(); setActiveMyStoryId(null); }}>×</CloseBtn>
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
                    </CreatedStoryScroll>
                )}
            </CreatedStoryContent>

            <CreatedStoryContent>
                <StoryLabel>
                    추천 명작 동화
                    <img
                        src='/icons/right-part.svg'
                        width={20} height={20}
                        onClick={() => navigate('/mylib', { state: { initialFilter: '명작' } })}
                    />
                </StoryLabel>
                <CreatedStoryScroll>
                    {recommendedStories.map((story) => (
                        <CreatedContainer key={story.id} onClick={() => handleRecommendedClick(story.id)}>
                            {activeRecommendedId === story.id ? (
                                    <OptionCard
                                        $imgUrl={story.img}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <CloseBtn onClick={(e) => { e.stopPropagation(); setActiveRecommendedId(null); }}>×</CloseBtn>
                                        <Option onClick={() => playBook(story)}>재생하기</Option>
                                        <Option onClick={() => reWrite(story)}>결말 확장하기</Option>
                                    </OptionCard>
                                ) : (
                                    <>
                                        <BookWrapper>
                                            <img src={story.img} />
                                        </BookWrapper>
                                    </>
                                )}
                            <CreatedTitle>{story.title}</CreatedTitle>
                            <CreatedMin>{story.runtime}</CreatedMin>
                        </CreatedContainer>
                    ))}
                </CreatedStoryScroll>
            </CreatedStoryContent>

            <CreatedStoryContent>
                <StoryLabel>
                    우리 아이가 다시 쓴 명작 동화
                    <img
                        src='/icons/right-part.svg'
                        width={20} height={20}
                        onClick={() => navigate('mylib', { state: { initialFilter: '확장' } })}
                    />
                </StoryLabel>

                {reWriteStories.length === 0 ? (
                    <Empty2><img src='/icons/empty3.svg' /></Empty2>
                ) : (
                    <CreatedStoryScroll>
                    {reWriteStories.map((story) => (
                        <CreatedContainer key={story.id} onClick={() => handleReWriteStoryClick(story.id)}>
                                {activeReWriteStoryId === story.id ? (
                                    <OptionCard
                                        $imgUrl={story.img}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <CloseBtn onClick={(e) => { e.stopPropagation(); setActiveReWriteStoryId(null); }}>×</CloseBtn>
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
                    </CreatedStoryScroll>
                )}
            </CreatedStoryContent>
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

        <BottomBar />
        </>
    );
}

export default Home;

const Logo = styled.div`
    width: 390px;
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    position: relative;
`

const Banner = styled.div`
    width: 390px;
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: -32px;
`

const Contents = styled.div`
    width: 390px;
    flex: 1;
    padding: 0 0 64px 0;
    display: flex;
    flex-direction: column;
    gap: 64px;
    overflow-y: auto;
    scrollbar-width: none;
`

const StoryContent = styled.div`
    height: 170px;
    width: 390px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const CreatedStoryContent = styled.div`
    height: 246px;
    width: 390px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const StoryLabel = styled.div`
    height: 28px;
    width: 390px;
    display: flex;
    justify-content: space-between;
    color: #393939;
    font-size: 20px;
    font-style: normal;
    font-weight: 800;
    padding: 0 16px;
    align-items: center;
`

const StoryScroll = styled.div`
    height: 126px;
    margin-left: 16px;
    display: flex;
    flex-direction: row;
    gap: 12px;
    overflow-x: auto;
    scrollbar-width: none;
    padding-right: 16px;

    &::-webkit-scrollbar {
        display: none;
    }
`

const CreatedStoryScroll = styled.div`
    height: 202px;
    margin-left: 16px;
    display: flex;
    flex-direction: row;
    gap: 12px;
    overflow-x: auto;
    scrollbar-width: none;
    padding-right: 16px;

    &::-webkit-scrollbar {
        display: none;
    }
`

const HistoryContainer = styled.div`
    position: relative;
`

const Card = styled.div`
    position: absolute;
    left: 14px;
    bottom: 14px;
    width: 80px;
    height: 112px;
    border-radius: 10px;
    border: 0.5px solid #DEDEDE;
    box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.10);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        overflow: hidden;
        border-radius: 10px;
    }
`;

const Badge = styled.div`
    width: 25px;
    height: 18px;
    position: absolute;
    left: 56px;
    bottom: 12px;
    padding: 0;
    margin: 0;

    img {
        width: 25px;
        height: 18px;
        object-fit: cover;
        display: block;
    }
`;

const TextBox = styled.div`
    margin-top: 30px;
    padding-left: 107px;
    padding-top: 33px;
    width: 200px;
    height: 96px;
    border-radius: 8px 20px 0 8px;
    border: 1px solid #F1F1F1;
    background: linear-gradient(0deg, #FFF) 0%, #FFF 100%, #D9D9D9;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
`;

const StoryTitle = styled.div`
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    align-self: stretch;
    color: #393939;
    text-overflow: ellipsis;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    margin-bottom: 6px;
`;

const StoryTime = styled.div`
    color: #BBB;
    font-size: 8px;
    font-style: normal;
    font-weight: 400;
`;

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

const Empty1 = styled.div`
    width: 358px;
    height: 126px;
    margin-left: 16px;
`

const Empty2 = styled.div`
    width: 358px;
    height: 202px;
    margin-left: 16px;
`
const Separator = styled.span`
    color: #DeDeDe;
    margin: 0 4px;
`;

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

const Dropdown = styled.ul`
    display: ${({open}) => (open ? 'block' : 'none')};
    position: absolute;
    top: 90%;
    right: 15px;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    list-style: none;
    border-radius: 12px;
    width: 140px;
    z-index: 10;
    overflow: hidden;
`;

const DropdownItem = styled.div`
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 800;
    color: #393939;
    cursor: pointer;
    background: ${({ $selected }) => ($selected ? "#FFFBEC" : "#fff")};
`

const Check = styled.span`
    position: absolute;
    right: 16px;
    width: 15px;
`;