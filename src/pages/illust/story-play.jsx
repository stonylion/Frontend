import styled from 'styled-components';
import Button from '../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';

function StoryPlay() {
    const navigate = useNavigate();
    const { story_id } = useParams();

    return (
        <Wrapper>
            <StoryImg>
                <img src='/imges/story-play.png' />
                <ImgBtn>
                    <Button
                        $width='260px'
                        $height='48px'
                        onClick={() => navigate(`/story-player/${story_id}`)}
                    >
                        바로 재생
                    </Button>
                    <Button
                        $width='260px'
                        $height='48px'
                        $bgColor='#342e29'
                        onClick={() => {navigate('/mylib', { state: { initialFilter: '제작' } })}}
                    >
                        종료하기
                    </Button>
                </ImgBtn>
            </StoryImg>
        </Wrapper>
    );
}

export default StoryPlay;

const Wrapper = styled.div`
    width: 798px;
    height: 390px;
    background-color: black;
`

const StoryImg = styled.div`
    width: 694px;
    height: 390px;
    margin-left: 29px;
    position: relative;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const ImgBtn = styled.div`
    position: absolute;
    width: 260px;
    height: 104px;
    bottom: 36px;
    left: 225px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`