import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

function TaxiPassengerList(props) {
  const passengerId = props.passengerId; // 동승신청자, 댓글 주인 id
  const isBoardWriter = props.userCase === 1; // userCase가 게시글 작성자인 경우 true 저장
  const boardId = useParams().id;
  const [passengerInfo, setpassengerInfo] = useState([]);

  // 게시글 권한 정보(접속한 사람id)
  const rawData = localStorage.getItem('currentUserId');
  const userId = JSON.parse(rawData).id;

  useEffect(() => {
    // 댓글 주인의 회원 정보 가져오기
    // fetch(`http://localhost:3001/account?id=${passengerId}`)
    fetch(`http://localhost:5000/api/login?id=${passengerId}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setpassengerInfo(data[0]);
        console.log("passengerinfo:", data[0]);
      });
  }, [passengerId]);

  const deleteApply = (e) => {
    e.preventDefault();
    // 동승 신청 삭제 요청
    // fetch(`http://localhost:3001/taxipassenger/${boardId + passengerId}`, {
    fetch(`http://localhost:5000/api/taxipassenger/${boardId + passengerId}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        alert("신청이 취소되었습니다.");
        window.location.reload();
      }
    });
  };

  return (
    <>
      {/* 신청 별 취소 권한 설정 해야함*/}
      {
        // 게시글 작성자 이거나, 현재 로그인 아이디와 신청자 id가 같은 경우
        // => 게시글 작성자와 신청한 사람은 삭제 버튼이 보임
        isBoardWriter || userId === passengerId ? (
          <StyledButton onClick={deleteApply}>삭제</StyledButton>
        ) : null
      }
      <InfoContainer>
        {/* 이거 ul li 태그로 했어야 했는데! */}
        id: {passengerInfo.id}
        <br />
        phoneNum: {passengerInfo["phoneNum"]}
        <br />
        name: {passengerInfo.name}
        <br />
        sex: {passengerInfo.sex}
        <br />
        major: {passengerInfo.major}
        <br />
      </InfoContainer>
    </>
  );
}

export default TaxiPassengerList;

const BasicButton = styled.button`
  background-color: orange;
  color: white;
  border: 0;
  outline: 0;
  text-decoration: none;
  cursor: pointer;
`;

const StyledButton = styled(BasicButton)`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  font-size: 15px;
  float: right;
  margin: 3px;
`;

const InfoContainer = styled.div`
  margin-left: 15%;
  text-align: left;
`;
