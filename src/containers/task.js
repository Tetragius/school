import React, { useEffect, useState, useCallback } from "react";
import { Card, Groups, Button } from "vienna-ui";
import { Container } from "../components/container";
import { prepare } from "../components/redactor";
import { getTask } from "../services/EP";

export const Task = ({ task, onSave }) => {
  const [data, setData] = useState();

  useEffect(() => {
    if (task) {
      if (!task.isFinished) {
        getTask(task.id).then((val) => {
          setData(prepare(val.body, val.withSign));
        });
      } else {
        setData(task.result);
      }
    }
  }, [task]);

  const handleChange = useCallback(
    (value, idx) => {
      data[idx]["value"] = value;
      setData([...data]);
    },
    [data]
  );

  const send = useCallback(() => {
    onSave(data);
  }, [data, onSave]);

  const footer = (
    <Groups justifyContent="flex-end">
      <Button disabled={task?.isFinished} design="accent" onClick={send}>
        Отправить
      </Button>
    </Groups>
  );

  return (
    <Card title={task?.name} footer={footer}>
      <div style={{ width: "1024px", height: "608px" }}>
        <Container
          data={data || []}
          showInvalid={task?.isFinished}
          onChange={handleChange}
        />
      </div>
    </Card>
  );
};

export default Task;
