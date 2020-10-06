import React, { useCallback } from "react";
import styled from "styled-components";

const Textarea = styled.textarea`
  font-size: 18px;
  padding: 16px;
  height: 100%;
  width: 100%;
  resize: none;
  border: none;
  outline: none;
  box-sizing: border-box;
`;

const getType = (str) => {
  const regexp = /[а-я\]}]/gim;
  switch (str[0]) {
    case "[":
      return "missed";
    case "{":
      return "space";
    case String(str[0].match(regexp)):
      return "whitespace";
    default:
      return "sign";
  }
};

const getCorrectValue = (type, str) => {
  switch (type) {
    case "sign":
      return str;
    case "missed":
    case "space":
      return str.substring(1, str.length - 1);
    default:
      return "";
  }
};

export const prepare = (str) => {
  const regexp = /\[.*?\]|\{.*?\}|[,:\-;"]|[а-я] /gim;
  let old = 0;
  let tmp = regexp.exec(str);
  const tmpData = [];

  while (tmp) {
    tmpData.push(str.substring(old, tmp.index));
    const type = getType(tmp[0]);
    if (type === "whitespace") {
      tmpData[tmpData.length - 1] += tmp[0][0];
    }
    if (type !== "string") {
      tmpData.push({
        type,
        value: "",
        maxLength: type === "missed" ? tmp[0].length - 1 : 1,
        correctValue: getCorrectValue(type, tmp[0])
      });
      if (type === "sign" || type === "whitespace") {
        tmpData.push(" ");
      }
    }
    old = regexp.lastIndex;
    tmp = regexp.exec(str);
  }

  tmpData.push(str.substring(old));
  return tmpData;
};

export const Redactor = (props) => {
  const { onChange, value } = props;

  const handle = useCallback(
    (e) => {
      onChange(e.target.value, prepare(e.target.value));
    },
    [onChange]
  );

  const handleKey = useCallback(
    (e) => {
      if (e.ctrlKey && e.key === "q") {
        e.preventDefault();
        const selection = document.getSelection();
        e.target.setRangeText("[" + selection.toString() + "]");
        onChange(e.target.value, prepare(e.target.value));
      }
      if (e.ctrlKey && e.key === "w") {
        e.preventDefault();
        const selection = document.getSelection();
        e.target.setRangeText("{" + selection.toString() + "}");
        onChange(e.target.value, prepare(e.target.value));
      }
    },
    [onChange]
  );

  return <Textarea onKeyDown={handleKey} onChange={handle} value={value} />;
};
