import React, { useCallback, useState } from "react";
import styled from "styled-components";

const Box = styled.div`
  position: relative;
  width: auto;
  padding: 0;
  margin: 0;
  display: inline-block;
  min-width: 2px;
  height: 18px;

  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 18px;
    background-color: ${({ focused }) =>
      (!focused && "rgb(25 118 210 / 0.1)") || "rgb(25 118 210 / 0.4)"};
    background-color: ${({ invalid }) => invalid && "rgb(210 118 25 / 0.5)"};
  }

  &:after {
    content: "<?>";
    position: absolute;
    width: 100%;
    min-width: 24px;
    height: 18px;
    bottom: 12px;
    ${({ value }) => (value && "left: calc(50% - 11px)") || "left: -10px"};
    font-weight: bold;
    font-size: 12px;
    color: #1976d2;
    cursor: pointer;
  }
`;

const Input = styled.input`
  left: 0;
  position: absolute;
  bottom: 0;
  outline: none;
  border: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  width: 100%;
  font-size: 16px;
  height: 16px;
`;

export const Space = (props) => {
  const { id, onChange, value, maxLength, invalid } = props;

  const [focused, setFocused] = useState(false);

  const handle = useCallback(
    (e) => {
      onChange(e.target.value, id);
    },
    [onChange, id]
  );

  const handleClick = useCallback(
    (e) => {
      onChange(value ? "" : " ", id);
    },
    [value, id, onChange]
  );

  const focus = useCallback((e) => {
    setFocused(true);
  }, []);

  const blur = useCallback((e) => {
    setFocused(false);
  }, []);

  return (
    <Box
      value={value}
      focused={focused}
      invalid={invalid}
      onClick={handleClick}
    >
      {value ? "_" : ""}
      <Input
        spellCheck={false}
        onChange={handle}
        onFocus={focus}
        onBlur={blur}
        maxLength={maxLength}
        value={value}
      />
    </Box>
  );
};
