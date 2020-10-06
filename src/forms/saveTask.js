import React, { useCallback, useState } from "react";
import styled from "styled-components";

const Box = styled.span``;

export const SaveTaskForm = (props) => {
  const { onOk, name } = props;

  const [_name, _setName] = useState(name);

  const handle = useCallback((e) => {
    _setName(e.target.value);
  }, []);

  const handleClick = useCallback(
    (e) => {
      onOk(_name);
    },
    [onOk, _name]
  );

  return (
    <Box>
      <label>
        <span>Нзвание: </span>
        <input value={_name} onChange={handle} />
      </label>
      <br />
      <br />
      <button style={{ float: "right" }} onClick={handleClick}>
        Ок
      </button>
    </Box>
  );
};
