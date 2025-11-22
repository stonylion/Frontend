import api from '../../api/axios';
import styled from 'styled-components';
import BottomBar from '../../components/Bottom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Mylib() {
    const navigate = useNavigate();

    const [activeBookId, setActiveBookId] = useState(null);
    const [filter, setFilter] = useState('전체');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [books, setBooks] = useState([]);
    const [sortType, setSortType] = useState('recentView');
    const [open, setOpen] = useState(false);

    const handleCardClick = (id) => {
      setActiveBookId(id === activeBookId ? null : id);
    };

    const viewScript = (book) => {
      navigate(`/mylib-script/${book.id}`, { state: { book } });
    };

    const deleteBook = (book) => {
      console.log('삭제', book.title);
      handleDelete();
    };

        const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setShowDeleteModal(false);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    useEffect(() => {
      const fetchBooks = async () => {
        try {
          let endpoint =
            sortType === 'recentView'
              ? '/api/mylibrary/recentread/'
              : '/api/mylibrary/recentgenerated/';
          
          if (filter != '전체') {
            const category =
              filter === '제작' ? 'custom' :
              filter === '명작' ? 'classic' :
                'expand';
            endpoint += `?category=${category}`;
          }

          const response = await api.get(endpoint);

          const mapped = response.data.results.map(item => ({
            id: item.story.id,
            title: item.story.title,
            min: item.story.runtime,
            bookmark:
              item.story.category === 'custom'
                ? '제작'
                : item.story.category === 'classic'
                ? '명작'
                : '확장',
            viewedAt: item.last_viewed_time
              ? item.last_viewed_time.slice(2, 10).replace(/-/g, '.')
              : '',
            createdAt: item.story.created_at
              ? item.story.created_at.slice(2, 10).replace(/-/g, '.')
              : '',
            img: '/icons/book.svg',
            progress: item.last_viewed_page
              ? Math.floor((item.last_viewed_page / 10) * 100)
              : 0
          }));

          setBooks(mapped);
        } catch (e) {
          console.error('내 서재 불러오기 실패:', e);
        }
      };

      fetchBooks();
    }, [filter, sortType]);

    const createMylibraryRecord = async (storyId) => {
  try {
    const response = await api.get(`/api/story/${storyId}/pages/`);
    console.log('기록 생성 완료:', response.data);
  } catch (e) {
    console.error('기록 생성 실패:', e);
  }
};

// 예시: storyId가 1인 동화 기록 생성
createMylibraryRecord(1);

    return (
        <>
        <MylibHeader>내 서재</MylibHeader>

        <BadgeContainer>
          {['전체', '제작', '명작', '확장'].map((b) => (
            <BadgeBtn
              key={b}
              $active={filter === b}
              onClick={() => setFilter(b)}
            >
              {b}
            </BadgeBtn>
          ))}
        </BadgeContainer>

        <MylibContainer>
          <SortHeader>
            <BookCount>
              {books.length}개
            </BookCount>
            <SortMenu>
              <SortButton onClick={() => setOpen(!open)}>
                {sortType === 'recentView' ? '최근 시청 순' : '최근 제작 순'}
                <img src={open ? '/icons/arrow-up.svg' : '/icons/arrow-down.svg'} />
              </SortButton>
              <Dropdown open={open}>
                <li onClick={() => { setSortType('recentView'); setOpen(false); }}>최근 시청순</li>
                <li onClick={() => { setSortType('recentCreate'); setOpen(false); }}>최근 제작순</li>
              </Dropdown>
            </SortMenu>
          </SortHeader>

          {books.length === 0 ? (
            <Empty><img src='/imges/empty3.svg' /></Empty>
          ) : (
            <BookGrid>
              {books.map((book) => (
                <BookCard key={book.id} onClick={() => handleCardClick(book.id)}>
                  {activeBookId === book.id ? (
                    <OptionCard>
                      <CloseBtn onClick={(e) => { e.stopPropagation(); setActiveBookId(null); }}>×</CloseBtn>
                      <Option onClick={() => playBook(book)}>재생하기</Option>
                      <Option onClick={() => viewScript(book)}>스크립트 보기</Option>
                      <Option onClick={() => deleteBook(book)}>삭제하기</Option>
                    </OptionCard>
                  ) : (
                    <>
                    <BookWrapper>
                      <img src={book.img} alt={book.title} />
                      <ProgressContainer>
                        <ProgressFill style={{ width: `${book.progress}%` }} />
                      </ProgressContainer>
                    </BookWrapper>
                    <Badge>
                      <img
                        src={
                          book.bookmark === '명작'
                          ? '/icons/Bookmark-cream.svg'
                          : book.bookmark === '확장'
                          ? '/icons/Bookmark-yellow.svg'
                          : '/icons/Bookmark-black.svg'
                        }
                      />
                    </Badge>
                    </>
                  )}
                    <Title>{book.title}</Title>
                    <ViewMin>
                      {book.min}
                    </ViewMin>
                  </BookCard>
                ))}
              </BookGrid>
            )}
        </MylibContainer>

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

export default Mylib;

const MylibHeader = styled.div`
    width: 390px;
    height: 64px;
    display: flex;
    padding: 16px 134px 16px 16px;
    align-items: center;
    align-self: stretch;
    color: #393939;
    font-size: 24px;
    font-style: normal;
    font-weight: 800;
`

const MylibContainer = styled.div`
    width: 390px;
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    display: flex;
    align-items: stretch;
    flex-direction: column;
    padding: 0 16px;
`

const SortHeader = styled.div`
    display: flex;
    color: #7A7A7A;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    justify-content: space-between;
`;

const SortMenu = styled.div`
    position: relative;
`;

const BookCount = styled.div`
`

const SortButton = styled.button`
    display: flex;
    color: #7A7A7A;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
    gap: 4px;
    margin-bottom: 8px;
`;

const Dropdown = styled.ul`
  display: ${({open}) => (open ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  right: -3px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  list-style: none;
  border-radius: 8px;
  width: 90px;
  z-index: 10;

  li {
    padding: 12px 16px;
    font-size: 12px;
    font-weight: 700;
    color: #393939;
    cursor: pointer;
  }
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const BookCard = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  .book-img {
    width: 110px;
    height: 154px;
    flex-shrink: 0;
    border-radius: 12px;
    border: 0.5px solid #DEDEDE;
    background: lightgray 50% / cover no-repeat;
    box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.10);
  }
`;

const ViewMin = styled.div`
  display: flex;
  flex-direction: row;
  color: #BBB;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  align-items: center;
  margin-top: 8px;
`

const Title = styled.span`
  overflow: hidden;
  color: #393939;
  text-overflow: ellipsis;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  margin-top: 10px;
`;

const Badge = styled.div`
    width: 37px;
    height: 26px;
    position: absolute;
    left: 76px;
    bottom: 70px;
    padding: 0;
    margin: 0;

    img {
        width: 37px;
        height: 26px;
        object-fit: cover;
        display: block;
    }
`;

const OptionCard = styled.div`
  width: 110px;
  height: 154px;
  border-radius: 12px;
  background: url('/icons/click-card.svg') center / cover no-repeat; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  position: relative;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
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

const ProgressContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: #EDEDED;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #ff4242;
  border-radius: 99px;
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

const Empty = styled.div`
  width: 358px;
  height: 590px;
`

const BadgeContainer = styled.div`
  width: 390px;
  height: 62px;
  padding-left: 16px;
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
`

const BadgeBtn = styled.button`
  height: 34px;
  width: 58px;
  justify-content: center;
  display: flex;
  align-items: center;
  border-radius: 99px;
  border: 1px solid ${({$active}) => ($active ? '#342e29' : '#f1f1f1')};
  background-color: ${({$active}) => ($active ? '#342e29' : '#fff')};
  color: ${({$active}) => ($active ? '#fff' : '#393939')};
  font-size: 14px;
  font-weight: 800;
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