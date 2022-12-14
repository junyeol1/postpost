import styled from "styled-components";
import NavBar from "../components/navBar/navBar";
import InputInfo from "../components/InputInfo";
import SelectBoxTaxi from "../components/selectBoxTaxi";
import { useEffect, useState } from "react";
import { useBoardDataTaxi } from "../store/boardStoreTaxi";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';

function TaxiPost() {
  const [isFill, setIsFill] = useState(false);
  const [values, setValues] = useState({
    title: "",
    startDetail: '',
    arrivalDetail: '',
    date: '',
    time: '',
    maxPassenger: "",
    content: "",
  });
  const navigate = useNavigate();

  const { selectedOption, boards, setBoards } = useBoardDataTaxi();
  const onChangeValue = (e, type) => {
    if (type === 'departureTime') {
      const dateTime = new Date(e.target.value);

      const date = format(dateTime, 'yyyy-MM-dd');
      const time = format(dateTime, 'HH:mm');

      setValues((prev) => ({ ...prev, date, time }));
    } else {
      setValues((prev) => {
        return { ...prev, [type]: e.target.value };
      });
    }
  };
  // const onClickType = (e) => {
  //   if (e.target.checked) {
  //     setValues((prev) => {
  //       return { ...prev, type: e.target.id };
  //     });
  //   }
  // };
  useEffect(() => {
    const valueNames = [
      'title',
      'startDetail',
      'arrivalDetail',
      'date', 
      'time',
      'maxPassenger',
      'content',
    ];
    let isValidate = true;
    valueNames.forEach((value) => {
      if (values[value] === '') {
        console.log(values);
        isValidate = false;
      }
    });
    setIsFill(isValidate);
  }, [values]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const rawData = localStorage.getItem('currentUserId');
    const user = JSON.parse(rawData);

    try {
      const rawResponse = await fetch(
        'http://localhost:5000/api/taxiboard',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: values.title,
            writer: user.id,
            startProvince: selectedOption.departureDst,
            startCity: selectedOption.departureRegion,
            startDetail: values.startDetail,
            arrivalProvince: selectedOption.arrivalsDst,
            arrivalCity: selectedOption.arrivalsRegion,
            arrivalDetail: values.arrivalDetail,
            date: values.date,
            time: values.time,
            maxPassenger: values.maxPassenger,
            content: values.content,
          }),
        }
      );

      const data = await rawResponse.json();
      console.log(data);

      navigate('/taxi');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CarpoolPostWrapper>
      <NavBar />
      <ContentWrapper>
        <InputInfo title="??????" rows={1} handleChange={(e) => onChangeValue(e, "title")} />
        <StyledLabel>?????????</StyledLabel>
        <BoxWrapper>
          <SelectBoxTaxi type="departure" label="?????????" />
          <DetailAddress onChange={(e) => onChangeValue(e, "startDetail")} placeholder="????????????" />
        </BoxWrapper>
        <StyledLabel>?????????</StyledLabel>
        <BoxWrapper>
          <SelectBoxTaxi type="arrivals" label="?????????" />
          <DetailAddress onChange={(e) => onChangeValue(e, "arrivalDetail")} placeholder="????????????" />
        </BoxWrapper>
        <StyledLabel>?????? ??? ??????</StyledLabel>
        <Date onChange={(e) => onChangeValue(e, "departureTime")} type="datetime-local" />
        <CarInfo>
          <div>
            <StyledLabel>?????? ?????? ???</StyledLabel>
            <Input onChange={(e) => onChangeValue(e, "maxPassenger")} placeholder="ex) 4" />
          </div>
        </CarInfo>
        <InputInfo handleChange={(e) => onChangeValue(e, "content")} title="??????" rows={7} />
        <SubmitBtn disabled={!isFill} onClick={handleSubmit} value={isFill}>
          ?????? ??????
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
