import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { db } from "../App";
import { Container } from "../components/container";
import { prepare } from "../components/readctor";

const Box = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const Left = styled.div`
  width: 50%;
  height: 100%;
  border-right: 1px solid gray;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const LeftCenter = styled.div`
  width: 100%;
  height: calc(100% - 48px);
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  border: 1px solid gray;
  box-sizing: border-box;
  padding: 8px;
  transition: all 0.2s;
  cursor: pointer;
  margin-bottom: 8px;
  &:hover {
    background: #c9c9c9;
  }
`;

const Right = styled.div`
  width: 50%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
`;

const RightCenter = styled.div`
  width: 100%;
  height: calc(100% - 48px);
`;

export default function TasksList() {
  const [list, setList] = useState([]);

  const [item, setItem] = useState(null);

  const history = useHistory();

  useEffect(() => {
    db.getTasks().then(setList);
  }, []);

  return (
    <Box>
      <Left>
        <span style={{ display: "flex", alignItems: "center" }}>
          <h1>Задания |</h1>
          &nbsp;
          <input
            type="button"
            value="Добавить"
            onClick={() => history.push("/edit")}
          />
        </span>
        <LeftCenter>
          {list.map((item, idx) => (
            <Item
              key={idx}
              onDoubleClick={() => history.push(`/edit/${item.id}`)}
              onClick={() => setItem(prepare(item.body))}
            >
              {item.name}
            </Item>
          ))}
        </LeftCenter>
      </Left>
      <Right>
        <span>
          <h1>Предпросмотр</h1>
        </span>
        <RightCenter>
          {item && <Container data={item} showInvalidƒ />}
        </RightCenter>
      </Right>
    </Box>
  );
}
