import styled from "styled-components";
import NavBar from "../components/navBar/navBar";
import InputInfo from "../components/InputInfo";
import SelectBoxTaxi from "../components/selectBoxTaxi";
import { useEffect, useState } from "react";
import { useBoardDataTaxi } from "../store/boardStoreTaxi";
import { useNavigate } from "react-router-dom";

function TaxiPost() {
  const [isFill, setIsFill] = useState(false);
  const [values, setValues] = useState({
    title: "",
    departures: "",
    arrivals: "",
    departureTime: "",
    totalPassengers: "",
    content: "",
    currentPassengers: 0,
  });
  const navigate = useNavigate();

  const { selectedOption, boards, setBoards } = useBoardDataTaxi();
  const onChangeValue = (e, type) => {
    if (type === "departureTime") {
      let time = e.target.value;
      const regex = /T|-/g;
      let newTime = time.replace(regex, "/");

      setValues((prev) => {
        return { ...prev, [type]: newTime.replace("-", "/") };
      });
    } else {
      setValues((prev) => {
        return { ...prev, [type]: e.target.value };
      });
    }
  };
  const onClickType = (e) => {
    if (e.target.checked) {
      setValues((prev) => {
        return { ...prev, type: e.target.id };
      });
    }
  };
  useEffect(() => {
    const valueNames = [
      "title",
      "departures",
      "arrivals",
      "departureTime",
      "totalPassengers",
      "content",
    ];
    let isValidate = true;
    valueNames.forEach((value) => {
      if (values[value] === "") {
        isValidate = false;
      }
    });
    setIsFill(isValidate);
  }, [values]);
  const handleSubmit = async (event) => {
    // 여기부분은 post 요청을 넣으면 될 거같은데 뭔지 몰라서 따로 건들이지 않을게요
    navigate("/taxi");
    const currentOption = { ...selectedOption, ...values };
    const newBoard = {
      id: boards.length,
      ...currentOption,
    };

    const fetchApi = await fetch("http://localhost:5000/api/taxi", {
      method: "POST",
      body: JSON.stringify({
        ...newBoard,
      }),
    });
    fetchApi
      .then((res) => {
        return res.json();
      })
      .then((data) => console.log(data));

    event.preventDefault();
  };
  return (
    <CarpoolPostWrapper>
      <NavBar />
      <ContentWrapper>
        <InputInfo title="제목" rows={1} handleChange={(e) => onChangeValue(e, "title")} />
        <StyledLabel>출발지</StyledLabel>
        <BoxWrapper>
          <SelectBoxTaxi type="departure" label="출발지" />
          <DetailAddress onChange={(e) => onChangeValue(e, "departures")} placeholder="상세주소" />
        </BoxWrapper>
        <StyledLabel>목적지</StyledLabel>
        <BoxWrapper>
          <SelectBoxTaxi type="arrivals" label="목적지" />
          <DetailAddress onChange={(e) => onChangeValue(e, "arrivals")} placeholder="상세주소" />
        </BoxWrapper>
        <StyledLabel>날짜 및 시간</StyledLabel>
        <Date onChange={(e) => onChangeValue(e, "departureTime")} type="datetime-local" />
        <CarInfo>
          <div>
            <StyledLabel>탑승 인원 수</StyledLabel>
            <Input onChange={(e) => onChangeValue(e, "totalPassengers")} placeholder="ex) 4" />
          </div>
        </CarInfo>
        <InputInfo handleChange={(e) => onChangeValue(e, "content")} title="내용" rows={7} />
        <SubmitBtn disabled={!isFill} onClick={handleSubmit} value={isFill}>
          작성 하기
        </SubmitBtn>
      </ContentWrapper>
    </CarpoolPostWrapper>
  );
}
const SubmitBtn = styled.button`
  margin-top: 8px;
  padding: 6px;
  width: 100%;
  text-transform: uppercase;
  outline: 0;
  background: ${({ value }) => (value ? "#FF9C2C" : "#BCBCBC")};

  border: 0;
  border-radius: 4px;
  color: #ffffff;
  -webkit-transition: all 0.3 ease;
  transition: all 0.1s ease-out;
  cursor: pointer;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 0.03em;
`;
const CarInfo = styled.div`
  display: flex;
  width: 70%;
  justify-content: space-between;
`;
const Input = styled.input`
  width: 80px;
`;

const TypeLabel = styled.label`
  margin-right: 7px;
  color: white;
`;
const TypeContainer = styled.div`
  text-align: left;
  margin-bottom: 5px;
`;
const TypeOption = styled.input`
  margin-right: 3px;
  appearance: none;
  border: max(2px, 0.1em) solid gray;
  border-radius: 50%;
  width: 1.25em;
  height: 1.25em;
  &:checked {
    border: 0.4em solid orange;
  }
  transition: border 0.5s ease-in-out;
`;

const Date = styled.input`
  margin-bottom: 5px;
`;
const DetailAddress = styled.input`
  width: 120px;
  font-size: 12px;
`;
const BoxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
`;
const StyledLabel = styled.div`
  color: white;
  margin-right: 3px;
  font-size: 13px;
`;
const ContentWrapper = styled.div`
  margin: 3px 10px;
`;
const CarpoolPostWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: rgb(54, 58, 179);
`;
export default TaxiPost;
