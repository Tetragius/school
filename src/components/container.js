import React, { useCallback } from "react";
import styled from "styled-components";
import { Pure } from "./pure";
import { Space } from "./space";
import { Missed } from "./missed";
import { Sign } from "./sign";

const Box = styled.div`
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding: 16px;
`;

export const Container = (props) => {
  const { data, showInvalid, onChange } = props;

  const update = useCallback(
    (value, idx) => {
      onChange(value, idx);
    },
    [onChange]
  );

  const build = useCallback(() => {
    return data.map((data, idx) => {
      if (typeof data === "string") {
        return <Pure key={idx}>{data}</Pure>;
      }
      const { type, value, correctValue, maxLength } = data;
      if (type === "missed") {
        return (
          <Missed
            key={idx}
            onChange={update}
            id={idx}
            maxLength={maxLength}
            invalid={showInvalid && value !== correctValue}
            value={value}
          />
        );
      }
      if (type === "whitespace") {
        return unescape("%u00a0");
      }
      if (type === "newline") {
        return <br key={idx} />;
      }
      if (type === "sign" || type === "word") {
        return (
          <Sign
            key={idx}
            onChange={update}
            id={idx}
            maxLength={maxLength}
            invalid={showInvalid && value !== correctValue}
            value={value}
          />
        );
      }
      if (type === "space") {
        return (
          <Space
            key={idx}
            onChange={update}
            id={idx}
            maxLength={maxLength}
            invalid={showInvalid && value !== correctValue}
            value={value}
          />
        );
      }
    });
  }, [data, update, showInvalid]);

  return <Box>{build()}</Box>;
};
