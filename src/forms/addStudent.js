import React, { useCallback, useState } from "react";
import { Search, Input, Button, Groups, FormField } from "vienna-ui";
import { db } from "../App";

export const AddStudentForm = (props) => {
  const { onOk } = props;

  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [suggestsClass, setSuggestsClass] = useState([]);

  const handle = useCallback((e, data) => {
    setName(data.value);
  }, []);

  const handleClassName = useCallback((e, data) => {
    setClassName({ name: data.value.name ?? data.value });
    if (!data.value.name) {
      db.getClasses(data.value).then((val) => {
        setSuggestsClass(
          val.filter((v) =>
            v.name.toLowerCase().startsWith(data.value.toLowerCase())
          )
        );
      });
    }
  }, []);

  const handleClick = useCallback(
    (e) => {
      onOk({ name, className: className.name });
    },
    [onOk, name, className]
  );

  return (
    <Groups design="vertical" style={{ width: "300px" }}>
      <FormField style={{ width: "100%" }}>
        <FormField.Label>ФИО</FormField.Label>
        <FormField.Content>
          <Input value={name} onChange={handle} />
        </FormField.Content>
      </FormField>
      <FormField style={{ width: "100%" }}>
        <FormField.Label>Класс</FormField.Label>
        <FormField.Content>
          <Search
            suggests={suggestsClass}
            value={className}
            valueToString={(item) => item.name}
            onChange={handleClassName}
            onSelect={handleClassName}
          />
        </FormField.Content>
      </FormField>
      <Button design="accent" onClick={handleClick}>
        Сохранить
      </Button>
    </Groups>
  );
};
