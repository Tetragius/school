import React from "react";
import styled from "styled-components";

const Box = styled.span`
  padding: 0;
  margin: 0;
`;

export const Pure = (props) => {
  return <Box>{props.children}</Box>;
};
