import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import { db } from "../App";

const Box = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

export const AddtaskToStudentForm = (props) => {
  const { onOk } = props;
  const [list, setList] = useState([]);

  useEffect(() => {
    db.getTasks().then(setList);
  }, []);

  const handleClick = useCallback(
    (id) => {
      onOk(id);
    },
    [onOk]
  );

  return (
    <Box>
      {list.map((item, idx) => (
        <Item key={idx} onClick={() => handleClick(item.id)}>
          {item.name}
        </Item>
      ))}
    </Box>
  );
};
