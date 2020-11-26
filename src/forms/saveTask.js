import React, { useCallback, useState } from "react";
import { Input, Button, Groups, FormField, Spinner } from "vienna-ui";

export const SaveTaskForm = (props) => {
  const { onOk, name } = props;

  const [_name, _setName] = useState(name);

  const handle = useCallback((e) => {
    _setName(e.target.value);
  }, []);

  const handleClick = useCallback(
    (e) => {
      onOk(_name);
    },
    [onOk, _name]
  );

  return (
    <Groups design="vertical" style={{ width: "300px" }}>
      <FormField style={{ width: "100%" }}>
        <FormField.Label>Нзвание</FormField.Label>
        <FormField.Content>
          <Input value={_name} onChange={handle} />
        </FormField.Content>
      </FormField>
      <Button design="accent" onClick={handleClick}>
        Сохранить
      </Button>
    </Groups>
  );
};
