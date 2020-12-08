import React from "react";
import { Groups, Badge, Button, H6 } from "vienna-ui";
import {
  Box,
  Top,
  Label,
  Name,
  Date,
  Controls,
  Bottom,
} from "./studentTask.styled";

const parseDate = (str) => {
  return str?.replace(/(\d{4})-(\d{2})-(\d{2})T(.*)/i, "$3.$2.$1");
};

export const StudentTak = (props) => {
  const { item, onOpen } = props;

  return (
    <Box>
      <Top>
        <Groups justifyContent="space-between">
          <Label>
            <Name>
              <H6>{item.name}</H6>
            </Name>
            <Date>задано: {parseDate(item.assignOn)}</Date>
          </Label>
          <Controls>
            <Button size="xs" onClick={() => onOpen(item)}>
              {!item.isFinished ? "Выполнить" : "Просмотреть"}
            </Button>
          </Controls>
        </Groups>
      </Top>
      <Bottom>
        <Groups>
          {!item.finishedOn && <Badge>новое</Badge>}
          {item.finishedOn && (
            <Badge>выполнено: {parseDate(item?.finishedOn)}</Badge>
          )}
          {item.mark && <Badge>оценка: {item.mark}</Badge>}
          {item.comment && <Badge>коментарий</Badge>}
        </Groups>
      </Bottom>
    </Box>
  );
};
