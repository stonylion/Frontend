import api from '../../api/axios';
import styled from 'styled-components';
import BottomBar from '../../components/Bottom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Mypage() {
    const navigate = useNavigate();

    const [kids, setKids] = useState([]);
    const [user, setUser] = useState(null);

    const avatarMap = {
        woman: "/icons/avatar-1.svg",
        man: '/icons/avatar-2.svg',
        grand1: '/icons/avatar-3.svg',
        grand2: '/icons/avatar-4.svg',
    };

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
        try {
            const response = await api.post('/api/accounts/logout/');
            console.log("로그아웃 성공:", response.data);

            setShowLogoutModal(false);
            navigate('/intro');
        } catch (e) {
            console.error("로그아웃 실패:", e);
        }
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await api.delete('/api/accounts/delete/');
            console.log("계정 삭제 성공:", response.data);

            setShowDeleteModal(false);
            navigate('/intro');
        } catch (e) {
            console.error("계정 삭제 실패:", e);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    useEffect(() => {
        const fetchMypage = async () => {
            try {
                const response = await api.get('api/accounts/mypage/');

                console.log("마이페이지 데이터 조회:", response.data);

                setUser(response.data.user);
                setKids(response.data.children);
            } catch (e) {
                console.error("데이터 조회 실패:", e);
            }
        };

        fetchMypage();
    }, []);

    return (
        <Wrapper>
        <MypageHeader>마이페이지</MypageHeader>

        <Contents>
            <UserContainer>
                <UserProfile>
                    <img src={
                        avatarMap[user?.avatar_code] || avatarMap.woman
                    }
                    />
                </UserProfile>
                <UserContent>
                    <UserName>{user?.username}</UserName>
                    <UserId>부모/보호자</UserId>
                </UserContent>
                <UserEdit onClick={() => (navigate('/mypage-profile'))}>프로필 편집</UserEdit>
            </UserContainer>

            <Banner>
                <img src='/imges/mypage-banner.svg' />
            </Banner>

            <ModifyContainer>
                <ModifyHeader>아이 정보</ModifyHeader>

                {kids.length === 0 ? (
                    <>
                        <Empty>등록한 아이 정보가 없어요</Empty>
                        <RegisterContent onClick={() => (navigate('/mypage-kid-register'))}>+ 등록하기</RegisterContent>
                    </>
                ) : (
                    <>
                        {kids.map((kid) => (
                            <ModifyContent key={kid.child_id}>
                                <Name>
                                    {kid.name}
                                    {kid.is_active && <ActiveDot />}
                                </Name>
                                <ArrowRightBtn onClick={() => navigate('/mypage-kid-detail')}>
                                    <img src='/icons/arrow-right-black.svg' width={16} />
                                </ArrowRightBtn>
                            </ModifyContent>
                        ))}
                        <RegisterContent onClick={() => (navigate('/mypage-kid-register'))}>+ 등록하기</RegisterContent>
                    </>
                )}
            </ModifyContainer>

            <ModifyContainer>
                <ModifyHeader>목소리 설정</ModifyHeader>
                <ModifyContent>
                    나의 목소리
                    <ArrowRightBtn><img src='/icons/arrow-right-black.svg' width={16}/></ArrowRightBtn>
                </ModifyContent>
                <ModifyContent>
                    성우 목소리
                    <ArrowRightBtn><img src='/icons/arrow-right-black.svg' width={16}/></ArrowRightBtn>
                </ModifyContent>
                <RegisterContent>+ 등록하기</RegisterContent>
            </ModifyContainer>

            <ModifyContainer>
                <ModifyHeader>고객 지원</ModifyHeader>
                <ModifyContent>
                    기기 및 버전 정보
                    <ArrowRightBtn onClick={() => navigate('/mypage-support/a')}>
                        <img src='/icons/arrow-right-black.svg' width={16}/>
                    </ArrowRightBtn>
                </ModifyContent>
                <ModifyContent>
                    고객센터
                    <ArrowRightBtn onClick={() => navigate('/mypage-support/b')}>
                        <img src='/icons/arrow-right-black.svg' width={16}/>
                    </ArrowRightBtn>
                </ModifyContent>
                <ModifyContent>
                    약관 및 정책
                    <ArrowRightBtn onClick={() => navigate('/mypage-support/c')}>
                        <img src='/icons/arrow-right-black.svg' width={16}/>
                        </ArrowRightBtn>
                </ModifyContent>
            </ModifyContainer>

            <ModifyContainer>
                <Logout onClick={handleLogout}>로그아웃</Logout>
                <Logout onClick={handleDelete}>계정삭제</Logout>
            </ModifyContainer>
        </Contents>

        {showLogoutModal && (
            <ModalOverlay>
                <ModalBox>
                    <ModalHeader>로그아웃 하시겠습니까?</ModalHeader>
                    <ModalText>로그아웃하면 저장된 동화를<br />해당 기기에서 볼 수 없어요.</ModalText>
                    <ModalBtnContainer>
                        <CancelBtn onClick={cancelLogout}>취소</CancelBtn>
                        <ConfirmBtn onClick={confirmLogout}>로그아웃</ConfirmBtn>
                    </ModalBtnContainer>
                </ModalBox>
            </ModalOverlay>
        )}

        {showDeleteModal && (
            <ModalOverlay>
                <ModalBox>
                    <ModalHeader>계정을 삭제하시겠습니까?</ModalHeader>
                    <ModalText>계정을 삭제하면 지금까지 만든<br />동화가 모두 없어져요.</ModalText>
                    <ModalBtnContainer>
                        <CancelBtn onClick={cancelDelete}>취소</CancelBtn>
                        <ConfirmBtn onClick={confirmDelete}>삭제</ConfirmBtn>
                    </ModalBtnContainer>
                </ModalBox>
            </ModalOverlay>
        )}

        <BottomBar />
        </Wrapper>
    );
}

export default Mypage;

const Wrapper = styled.div`
    position: relative;
    width: 390px;
    height: 100%;
    display: flex;
    flex-direction: column;
`

const MypageHeader = styled.div`
    width: 390px;
    height: 64px;
    padding: 16px;
    font-weight: 800;
    font-size: 24px;
`

const Contents = styled.div`
    flex: 1;
    width: 390px;
    padding: 24px 16px 64px 16px;
    display: flex;
    flex-direction: column;
    gap: 40px;
    overflow-y: auto;
    scrollbar-width: none;
`

const UserContainer = styled.div`
    width: 358px;
    height: 56px;
    display: flex;
    flex-direction: row;
    gap: 16px;
    align-items: center;
`

const UserProfile = styled.div`
    width: 56px;
    height: 56px;
    border-radius: 99px;
    border: 1.5px solid #f1f1f1;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const UserContent = styled.div`
    width: 192px;
    height: 56px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px 0;
`

const UserName = styled.div`
    width: 192px;
    height: 24px;
    font-size: 16px;
    font-weight: 800;
    display: flex;
    align-items: center;
`

const UserId = styled.div`
    width: 192px;
    height: 22px;
    font-size: 14px;
    font-weight: 700;
    color: #bbb;
    display: flex;
    align-items: center;
`

const UserEdit = styled.button`
    color: #bbb;
    font-size: 12px;
    font-weight: 700;
    width: 78px;
    height: 28px;
    border-radius: 99px;
    border: 0.5px solid #dedede;
    background-color: #fff;
    cursor: pointer;
`

const Banner = styled.div`
    width: 358px;
    height: 100px;
`

const ModifyContainer = styled.div`
    width: 358px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`

const ModifyHeader = styled.div`
    width: 358px;
    height: 20px;
    display: flex;
    align-items: flex-start;
    color: #bbb;
    font-size: 12px;
    font-weight: 700;
`

const ModifyContent = styled.div`
    width: 358px;
    height: 22px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: #393939;
    font-size: 14px;
    font-weight: 700;
    align-items: center;
`

const RegisterContent = styled.div`
    width: 358px;
    height: 22px;
    color: #bbb;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
`

const Logout = styled.div`
    width: 358px;
    height: 22px;
    color: #7a7a7a;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 4px;
`

const ArrowRightBtn = styled.div`
    width: 16px;
    height: 16px;
    cursor: pointer;
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

const Empty = styled.div`
    width: 358px;
    height: 22px;
    color: #393939;
    font-size: 14px;
    font-weight: 700;
`

const Name = styled.div`
    display: flex;
    flex-direction: row;
    height: 22px;
    align-items: center;
    gap: 4px;
`

const ActiveDot = styled.div`
    width: 6px;
    height: 6px;
    background-color: #ffd342;
    border-radius: 50%;
    display: 'flex';
    align-items: center;
`
