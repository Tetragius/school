import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
const Box = styled.div``;

export default function Main() {
  const history = useHistory();

  return (
    <Box>
      <input
        type="button"
        value="Задания"
        onClick={() => history.push("/list")}
      />
      <input
        type="button"
        value="Класс"
        onClick={() => history.push("/students")}
      />
    </Box>
  );
}
