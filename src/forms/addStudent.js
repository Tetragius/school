import React, { useCallback, useState } from "react";
import styled from "styled-components";

const Box = styled.span``;

export const AddStudentForm = (props) => {
  const { onOk } = props;

  const [name, setName] = useState("");

  const handle = useCallback((e) => {
    setName(e.target.value);
  }, []);

  const handleClick = useCallback(
    (e) => {
      onOk(name);
    },
    [onOk, name]
  );

  return (
    <Box>
      <label>
        <span>ФИО: </span>
        <input value={name} onChange={handle} />
      </label>
      <br />
      <br />
      <button style={{ float: "right" }} onClick={handleClick}>
        Сохранить
      </button>
    </Box>
  );
};
