import React, { useCallback, useRef } from "react";
import styled from "styled-components";

const Fade = styled.span`
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
`;

const Window = styled.span`
  display: flex;
  background: #ffffff;
  border-radius: 32px;
  padding: 32px;
  box-sizing: border-box;
`;

export const Modal = (props) => {
  const { children, onClose } = props;
  const ref = useRef();

  const closeHandler = useCallback(
    (e) => {
      if (!ref.current.contains(e.target)) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <Fade onClick={closeHandler}>
      <Window ref={ref}>{children}</Window>
    </Fade>
  );
};
