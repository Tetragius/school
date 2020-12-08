import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Groups,
  Button,
  Tabs,
  FormField,
  Input,
  Textarea,
} from "vienna-ui";
import { Container } from "../components/container";
import { prepare } from "../components/redactor";
import { getTask } from "../services/EP";

export const Task = ({ task, onSave, isAdmin }) => {
  const [data, setData] = useState();
  const [tab, setTab] = useState("task");

  const [mark, setMark] = useState(task.mark);
  const [comment, setComment] = useState(task.comment);

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
    onSave(data, comment, mark);
  }, [data, onSave, comment, mark]);

  const footer = (
    <Groups justifyContent="flex-end">
      {!isAdmin ? (
        <Button disabled={task?.isFinished} design="accent" onClick={send}>
          Отправить
        </Button>
      ) : (
        <Button disabled={!mark} design="accent" onClick={send}>
          Сохранить
        </Button>
      )}
    </Groups>
  );

  return (
    <Card title={task?.name} footer={footer}>
      <Card.Subtitle>
        <Tabs value={tab} onChange={(e, value) => setTab(value)}>
          <Tabs.Tab value={"task"}>Задание</Tabs.Tab>
          <Tabs.Tab value={"comment"}>Оценка и коментарий</Tabs.Tab>
        </Tabs>
      </Card.Subtitle>
      <div style={{ width: "1024px", height: "608px" }}>
        {tab === "task" ? (
          <Container
            data={data || []}
            showInvalid={task?.isFinished}
            withSign={task?.withSign}
            onChange={handleChange}
          />
        ) : (
          <Groups design="vertical">
            <FormField style={{ width: "100%" }}>
              <FormField.Label>Оенка</FormField.Label>
              <FormField.Content>
                <Input
                  disabled={!isAdmin}
                  value={mark}
                  onChange={(e, data) => setMark(data.value)}
                />
              </FormField.Content>
            </FormField>
            <FormField style={{ width: "100%" }}>
              <FormField.Label>Коментарий</FormField.Label>
              <FormField.Content>
                <Textarea
                  disabled={!isAdmin}
                  value={comment}
                  onChange={(e, data) => setComment(data.value)}
                />
              </FormField.Content>
            </FormField>
          </Groups>
        )}
      </div>
    </Card>
  );
};

export default Task;
