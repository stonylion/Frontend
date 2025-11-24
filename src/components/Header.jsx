import React from 'react';
import styled from 'styled-components';

const Header = ({
    title, //페이지 이름 ('목소리 설정')
    showBack, //뒤로가기 버튼 표시 여부
    onBack, //뒤로가기 버튼 핸들러
    action, //액션 버튼 (예: { text: '건너뛰기', handler: skipFunction })
}) => {
    return (
        <StyledHeader>
            {/* 1. 좌측 영역 (뒤로가기 버튼) */}
            <StyledLeft>
                {showBack && (
                    <StyledBackBtn onClick={onBack}>
                        <img src="/icons/Leftpart.svg" alt="뒤로가기" width="20" height="20" />
                    </StyledBackBtn>
                )}
            </StyledLeft>

            {/* 2. 중앙 영역 (페이지 제목) */}
            <StyledTitle>
                {title}
            </StyledTitle>

            {/* 3. 우측 영역 (액션 버튼) */}
            <StyledRight>
                {action && (
                    <>
                        {action.text && (
                            <StyledActionBtn onClick={action.handler}>
                                {action.text}
                            </StyledActionBtn>
                        )}
                        {action.icon && (
                            <StyledIconBtn onClick={action.handler}>
                                <img src={action.icon} alt="action icon" style={{ width: '20px', height: '20px' }} />
                            </StyledIconBtn>
                        )}
                    </>
                )}
            </StyledRight>
        </StyledHeader>
    );
};

export default Header;

const StyledHeader = styled.div`
    height: 64px;
    width: 390px;
    display: flex;
    align-items: center;
    background-color: #FFF;
    box-sizing: border-box;
    position: relative;
`

const StyledLeft = styled.div`
    position: absolute;
    left: 16px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
`

const StyledBackBtn = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
`

const StyledTitle = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    font-weight: 800;
    color: #393939;
`

const StyledRight = styled.div`
    display: flex;
    align-items: center;
    position: absolute;
    right: 16px;  
`;

const StyledActionBtn = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 800;
    color: #BBB;
`;

const StyledIconBtn = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 24px;
        height: 24px;
    }
`;