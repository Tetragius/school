import React from "react";
import { Groups, Button, H6 } from "vienna-ui";
import { Box, Label, Name, Date, Controls } from "./task.styled";

const parseDate = (str) => {
  return str?.replace(/(\d{4})-(\d{2})-(\d{2})T(.*)/i, "$3.$2.$1");
};

export const Task = (props) => {
  const { item, onEdit, onRemove } = props;

  return (
    <Box>
      <Groups justifyContent="space-between">
        <Label>
          <Name>
            <H6>{item.name}</H6>
          </Name>
          <Date>изменено: {parseDate(item.modifyOn || item.createOn)}</Date>
        </Label>
        <Controls>
          <Groups alignItems="center">
            <Button size="xs" design="accent" onClick={() => onEdit(item.id)}>
              Редактировать
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
    </Box>
  );
};
