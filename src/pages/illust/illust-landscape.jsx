import api from '../../api/axios';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Button from '../../components/Button';
import LoadingModal from '../../components/Loading';

function IllustLandscape() {
    const navigate = useNavigate();
    const { story_id } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [selectedImg, SetSelectedImg] = useState(null);
    const [images, setImages] = useState([]);
    const [activeImgClick, setActiveImgClick] = useState(null);

    const handleImgClick = (id) => {
        setActiveImgClick(activeImgClick === id ? null : id);
    };

    const handleLoading = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 5000));
            setIsLoading(false);
            navigate(`/story-play/${story_id}`);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const response = await api.get(`/api/story/${story_id}/pages/`);
                const fetchedImages = response.data;
                setImages(fetchedImages);
                if (fetchedImages.length > 0)
                    SetSelectedImg(fetchedImages[0]);
                console.log('페이지별 텍스트 및 삽화 조회 성공:', response.data);
            } catch (e) {
                console.error('페이지별 텍스트 및 삽화 조회 실패:', e);
            }
        }
        fetchPageData();
    }, [story_id]);

    const redraw = async (img) => {
        try {
            const response = await api.post('/api/AI/illustration/regenerate/',
                {
                    story_id: story_id,
                    page: img.page_number
                }
            );
        } catch (e) {
            console.error('다시 그리기 실패:', e);
        }
    };

    const download = async (img) => {
        try {
            const page_number = img.page_number;
            const response = await api.get(`/api/story/illustration/download/${story_id}/${page_number}`);
            const downloadUrl = response.data.download_url;

            const link = document.createElement(`a`);
            link.href = downloadUrl;
            link.download = `story_${story_id}_page_${page_number}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error('삽화 다운로드 실패:',e);
        }
    };

    const handleVoice = async () => {
        try {
            const response = await api.get('/api/story/voice/tts/');
            console.log("tts 재생 성공:", response.data);
        } catch (e) {
            console.error('tts 재생 실패:', e);
        }
    };

    return (
        <Wrapper>
        <Contents1>
            <SelectedImg onClick={() => handleImgClick(selectedImg?.id)}>
                {selectedImg?.illustrations?.length > 0 && <img src={selectedImg.illustrations[0]} />}
                {selectedImg && activeImgClick === selectedImg.id && (
                    <OptionCard
                        $imgUrl={selectedImg.illustrations[0]}
                        onClick={e => e.stopPropagation()}
                    >
                        <CloseBtn onClick={(e) => { e.stopPropagation(); setActiveImgClick(null); }}>×</CloseBtn>
                        <Option onClick={() => redraw(selectedImg)}>다시 그리기</Option>
                        <Option onClick={() => download(selectedImg)}>삽화 다운로드</Option>
                    </OptionCard>
                )}
            </SelectedImg>
            <ImgList>
                {images.map((img) => (
                    <ImgItem
                        key={img.id}
                        onClick={() => SetSelectedImg(img)}
                        $selected={selectedImg?.id === img.id}
                    >
                        <img src={img.illustrations[0]} />
                    </ImgItem>
                ))}
            </ImgList>
        </Contents1>
        <Contents2>
            <PageLabel>{selectedImg?.page_number}</PageLabel>
            <PageContent>
                <ContentContainer>{selectedImg?.text}</ContentContainer>
                <img
                    style={{ cursor: 'pointer' }}
                    src='/icons/sound.svg'
                    onClick={handleVoice}
                />
            </PageContent>
            <BtnContainer>
                <Button
                    $width='260px'
                    height='48px'
                    onClick={handleLoading}
                >
                    완성하기
                </Button>
            </BtnContainer>
        </Contents2>
        {isLoading &&
            <LoadingModal
                text={<>동화를 완성하고 있어요!<br />조금만 기다려주세요</>} 
            />
        }
        </Wrapper>
    );
}

export default IllustLandscape;

const Wrapper = styled.div`
    width: 798px;
    height: 390px;
    display: flex;
    flex-direction: row;
`
const Contents1 = styled.div`
    height: 390px;
    width: 506px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`

const Contents2 = styled.div`
    width: 292px;
    height: 390px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const SelectedImg = styled.div`
    width: 474px;
    height: 266px;
    border-radius: 8px;
    border: 0.5px solid #bbb;
    cursor: pointer;
    position: relative;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const ImgList = styled.div`
    width: 474px;
    height: 80px;
    display: flex;
    flex-direction: row;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
`

const ImgItem = styled.div`
    flex-shrink: 0;
    height: 80px;
    width: 120px;
    border-radius: 12px;
    border: 2px solid ${({ $selected }) => ($selected ? '#ffd342' : 'transparent')};
    overflow: hidden;
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const PageLabel = styled.div`
    width: 260px;
    height: 24px;
    color: #393939;
    font-size: 16px;
    font-weight: 800;
    display: flex;
    align-items: center;
    font-style: normal;
`

const PageContent = styled.div`
    width: 260px;
    height: 242px;
    padding: 12px 16px;
    align-items: flex-start;
    border-radius: 8px;
    border: 1px solid #dedede;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
`

const BtnContainer = styled.div`
    width: 260px;
    height: 76px;
    display: flex;
    align-items: flex-end;
`

const ContentContainer = styled.div`
    width: 228px;
    height: 192px;
    color: #7a7a7a;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    font-style: normal;
    overflow-y: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
`

const OptionCard = styled.div`
    width: 474px;
    height: 266px;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 8px;
    border: 0.5px solid #bbb;
    background: linear-gradient(180deg, #393939 0%, rgba(39, 34, 31, 0.70) 100%), url(${props => props.$imgUrl}) lightgray 50% / cover no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    color: white;
    font-weight: 800;
    box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
`

const Option = styled.div`
    font-size: 14px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
        transform: scale(1.05);
    }
`

const CloseBtn = styled.div`
    position: absolute;
    top: 6px;
    right: 10px;
    font-size: 18px;
    cursor: pointer;
`