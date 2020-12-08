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
} from "./student.styled";

const parseDate = (str) => {
  return str?.replace(/(\d{4})-(\d{2})-(\d{2})T(.*)/i, "$3.$2.$1");
};

export const Student = (props) => {
  const { item, onShowTask, onRemove } = props;

  return (
    <Box>
      <Top>
        <Groups justifyContent="space-between">
          <Label>
            <Name>
              <H6>{item.name}</H6>
            </Name>
            <Date>был онлайн: {parseDate(item.visitedOn)}</Date>
          </Label>
          <Controls>
            <Groups>
              <Button size="xs" onClick={() => onShowTask(item.id)}>
                Задания
              </Button>
              <Button
                size="xs"
                design="critical"
                onClick={() => onRemove(item.id)}
              >
                Удалить
              </Button>
            </Groups>
          </Controls>
        </Groups>
      </Top>
      <Bottom>
        <Groups>
          <Badge>класс: {item.className}</Badge>
          <Badge>пароль: {item.pwd}</Badge>
        </Groups>
      </Bottom>
    </Box>
  );
};
