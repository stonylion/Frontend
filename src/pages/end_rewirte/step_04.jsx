import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios.js";

const LION = "/img/end_rewrite/lion.svg";
const STAR_Y = "/img/end_rewrite/star_yellow.svg";
const STAR_P = "/img/end_rewrite/purple_star.svg";
const STAR_O = "/img/end_rewrite/org_star.svg";
const PENCIL = "/img/end_rewrite/pencil.svg";
const PIGTAIL = "/img/end_rewrite/pigtail.svg";
const BOOK = "/img/end_rewrite/book.svg";

const MIC_BUTTON = "/img/end_rewrite/yellow_plat.svg";
const CLOSE_ICON = "/img/end_rewrite/close.svg";

const Endwritestep04 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // step03에서 전달된 데이터 받기
  const extendedStory = location.state?.extendedStory || null;
  const storyId = location.state?.storyId || null;

  const [kidName, setKidName] = useState("");

  // 활성 아이 불러오기
  useEffect(() => {
    const fetchActiveChild = async () => {
      try {
        const res = await api.get("api/accounts/children/");
        const kids = res.data.children;
        const activeKid = kids.find((k) => k.is_active);
        if (activeKid) setKidName(activeKid.name);
      } catch (e) {
        console.error("아이 정보 조회 실패:", e);
      }
    };

    fetchActiveChild();
  }, []);

  const goToPlayer = () => {
    if (!extendedStory) {
      alert("동화를 불러오는 중이에요. 잠시 후 다시 시도해주세요.");
      return;
    }

    navigate("/story-player", {
      state: {
        book: {
          story: extendedStory,
        },
      },
    });
  };

  return (
    <Screen>
      <Header title="" showBack={false} />

      <CloseBtn onClick={() => navigate(-1)}>
        <img src={CLOSE_ICON} alt="닫기" />
      </CloseBtn>

      <DecorWrapper>
        <StarYellow />
        <StarPurple />
        <StarOrange />
        <Pencil />
        <Pigtail />
        <BookDeco />
      </DecorWrapper>

      <Content>
        <Character src={LION} alt="캐릭터" />

        <TextGroup>
          <Line1>{kidName || "우리 아이"}이(가) 만든 </Line1>
          <Line2>
            <Highlight>동화의 뒷 이야기</Highlight>가
            <br />
            완성되었어!
          </Line2>
        </TextGroup>
      </Content>

      <ArcArea>
        <Arc />

        <HintText>
          버튼을 눌러 <br /> 동화를 시작해보세요.
        </HintText>

        <MicButton type="button" onClick={goToPlayer}>
          <img src={MIC_BUTTON} alt="시작하기" />
        </MicButton>
      </ArcArea>
    </Screen>
  );
};

export default Endwritestep04;


const Screen = styled.div`
  position: relative;
  width: 390px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background: #ffffff;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 18px;
  right: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 5;

  img {
    width: 20px;
    height: 20px;
  }
`;

const DecorWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const StarYellow = styled.img.attrs({ src: STAR_Y })`
  position: absolute;
  width: 20px;
  height: 100px;
  left: 119px;
  top: 70px;
`;

const StarPurple = styled.img.attrs({ src: STAR_P })`
  position: absolute;
  width: 24px;
  height: 24px;
  left: 303px;
  top: 310px;
`;

const StarOrange = styled.img.attrs({ src: STAR_O })`
  position: absolute;
  width: 24px;
  height: 24px;
  left: 51px;
  top: 450px;
`;

const Pencil = styled.img.attrs({ src: PENCIL })`
  position: absolute;
  width: 60px;
  height: 45px;
  left: 55.484px;
  top: 260px;
`;

const BookDeco = styled.img.attrs({ src: BOOK })`
  position: absolute;
  width: 80px;
  height: 70px;
  left: 290px;
  top: 430px;
  transform: rotate(-10deg);
`;

const Pigtail = styled.img.attrs({ src: PIGTAIL })`
  position: absolute;
  width: 50px;
  height: 40px;
  right: 64.803px;
  top: 130px;
  transform: rotate(350deg);
`;

const Content = styled.div`
  margin-top: 40px;
  text-align: center;
`;

const Character = styled.img`
  width: 138px;
  height: auto;
  margin-bottom: 20px;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Line1 = styled.h2`
  color: #fbf4e3;
  -webkit-text-stroke: 1px #105a6e;
  font-size: 24px;
  font-weight: 700;
  font-family: "SOYO Maple";
`;

const Line2 = styled.p`
  color: #fbf4e3;
  -webkit-text-stroke: 1px #105a6e;
  font-size: 24px;
  font-weight: 700;
  font-family: "SOYO Maple";
  line-height: 34px;
`;

const Highlight = styled.span`
  color: #72cacb;
`;

const ArcArea = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  flex-shrink: 0;
`;

const Arc = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #fff8e3;
  border-top-left-radius: 90% 50%;
  border-top-right-radius: 90% 50%;
`;

const MicButton = styled.button`
  position: absolute;
  bottom: 140px;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  border: none;

  img {
    width: 64px;
    height: 64px;
  }
`;

const HintText = styled.p`
  position: absolute;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #bbb;
  text-align: center;
  font-family: "NanumSquareRound";
  line-height: 18px;
`;
