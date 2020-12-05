import React, { useCallback, useState, useEffect } from "react";
import { Select, Button, Groups, FormField } from "vienna-ui";
import { getTasks } from "../services/EP";

export const AddtaskToStudentForm = (props) => {
  const { onOk } = props;
  const [list, setList] = useState([]);
  const [item, setItem] = useState([]);

  useEffect(() => {
    getTasks().then(setList);
  }, []);

  const handleClick = useCallback((e, data) => {
    setItem(data.value);
  }, []);

  const handleSave = useCallback(() => {
    onOk(item.id);
  }, [onOk, item]);

  return (
    <Groups design="vertical" style={{ width: "300px" }}>
      <FormField style={{ width: "100%" }}>
        <FormField.Label>Задание</FormField.Label>
        <FormField.Content>
          <Select
            onSelect={handleClick}
            options={list}
            value={item}
            compare={(item) => item?.id}
            valueToString={(item) => item?.name}
          />
        </FormField.Content>
      </FormField>
      <Button design="accent" onClick={handleSave}>
        Сохранить
      </Button>
    </Groups>
  );
};
