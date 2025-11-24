import api from '../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

function Script() {
    const navigate = useNavigate();
    const { story_id } = useParams();

    const [Scripts, setScript] = useState([]);

    useEffect(() => {
        const fetchScript = async () => {
            try {
                const response = await api.get(`/api/story/${story_id}/script/`);
                console.log("스크립트 조회 성공:", response.data);

                setScript(response.data);
            } catch (e) {
                console.error("스크립트 조회 실패:", e);
            }
        };
        fetchScript();
    }, [story_id]);

    return (
        <>
        <Header
            title="스크립트 보기"
            showBack={true}
            onBack={() => navigate(-1)}
        />

        <Contents>
            {Scripts.map((Scripts, index) => (
                <ScriptBlock key={index}>
                    <PageNum>{Scripts.page_number}페이지</PageNum>
                    <ScriptContent>{Scripts.text}</ScriptContent>
                </ScriptBlock>
            ))}
        </Contents>
        </>
    );
}

export default Script;

const Contents = styled.div`
    width: 390px;
    height: 812px;
    padding: 24px 16px 64px 16px;
    overflow-y: auto;
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    gap: 32px;
`

const ScriptBlock = styled.div`
    width: 358px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const PageNum = styled.div`
    height: 24px;
    width: 358px;
    font-weight: 800;
    font-size: 16px;
`

const ScriptContent = styled.div`
    width: 358px;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
`