import React, { useCallback, useState } from "react";
import styled from "styled-components";

const Box = styled.div`
  position: relative;
  width: auto;
  padding: 0;
  margin: 0;
  color: transparent;
  display: inline-block;
  background-color: ${({ focused }) =>
    (!focused && "rgb(25 118 210 / 0.1)") || "rgb(25 118 210 / 0.4)"};
  background-color: ${({ invalid }) => invalid && "rgb(210 118 25 / 0.5)"};
`;
const Input = styled.input`
  left: 0;
  position: absolute;
  bottom: 0;
  outline: none;
  border: none;
  padding: 0;
  margin: 0;
  font-size: 18px;
  text-align: center;
  width: 100%;
  height: 100%;
  font-family: Arial;
  background-color: transparent;
`;

export const Missed = (props) => {
  const { onChange, id, maxLength, value, invalid } = props;
  const [focused, setFocused] = useState(false);

  const handle = useCallback(
    (e) => {
      onChange(e.target.value, id);
    },
    [onChange, id]
  );

  const focus = useCallback((e) => {
    setFocused(true);
  }, []);

  const blur = useCallback((e) => {
    setFocused(false);
  }, []);

  return (
    <Box focused={focused} invalid={invalid}>
      {value || "..."}
      <Input
        spellCheck={false}
        onChange={handle}
        onFocus={focus}
        onBlur={blur}
        maxLength={maxLength}
        placeholder="..."
        value={value}
      />
    </Box>
  );
};
