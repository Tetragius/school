import React, { useCallback, useEffect, useRef } from "react";
import { Textarea } from "vienna-ui";

const getType = (str) => {
  const regexpWord = /[а-я\]}]/gim;
  const regexpNL = /\n/gim;
  const regexpWhiteSpace = / /gim;
  switch (str[0]) {
    case "[":
      return "missed";
    case "{":
      return "space";
    case String(str[0].match(regexpWord)):
      return "word";
    case String(str[0].match(regexpNL)):
      return "newline";
    case String(str[0].match(regexpWhiteSpace)):
      return "whitespace";
    default:
      return "sign";
  }
};

const getCorrectValue = (type, str) => {
  switch (type) {
    case "sign":
      return str.trim();
    case "missed":
    case "space":
      return str.substring(1, str.length - 1);
    default:
      return "";
  }
};

export const prepare = (str, withSign = true) => {
  const regexp = withSign
    ? /\[.*?\]|\{.*?\}|[,:\-;"] |[а-я]+ | |\n/gim
    : /\[.*?\]|\{.*?\}|[а-я]+ | |\n/gim;
  let old = 0;
  let tmp = regexp.exec(str);
  const tmpData = [];

  while (tmp) {
    tmpData.push(str.substring(old, tmp.index));
    const type = getType(tmp[0]);
    if (type === "word") {
      tmpData[tmpData.length - 1] += tmp[0]?.trim();
    }
    tmpData.push({
      type,
      value: "",
      maxLength: type === "missed" ? tmp[0].length - 1 : 1,
      correctValue: getCorrectValue(type, tmp[0]),
    });
    if (type === "sign" || type === "word") {
      tmpData.push(" ");
    }
    old = regexp.lastIndex;
    tmp = regexp.exec(str);
  }

  tmpData.push(str.substring(old));
  return tmpData;
};

export const Redactor = (props) => {
  const { onChange, value, withSign = true } = props;
  const ref = useRef();

  const handle = useCallback(
    (e) => {
      onChange(e.target.value, prepare(e.target.value, withSign));
    },
    [onChange, withSign]
  );

  useEffect(() => {
    onChange(ref.current?.value, prepare(ref.current?.value, withSign)); // eslint-disable-next-line
  }, [withSign]);

  const handleKey = useCallback(
    (e) => {
      if (e.ctrlKey && e.key === "q") {
        e.preventDefault();
        const selection = document.getSelection();
        e.target.setRangeText("[" + selection.toString() + "]");
        onChange(e.target.value, prepare(e.target.value, withSign));
      }
      if (e.ctrlKey && e.key === "w") {
        e.preventDefault();
        const selection = document.getSelection();
        e.target.setRangeText("{" + selection.toString() + "}");
        onChange(e.target.value, prepare(e.target.value, withSign));
      }
    },
    [onChange, withSign]
  );

  return (
    <Textarea
      ref={ref}
      style={{ minHeight: "100%", maxHeight: "100%" }}
      onKeyDown={handleKey}
      onChange={handle}
      value={value}
    />
  );
};
