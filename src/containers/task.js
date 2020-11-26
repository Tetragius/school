import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { Card, Groups, Button } from "vienna-ui";
import { useParams } from "react-router-dom";
import { Container } from "../components/container";
import { prepare } from "../components/readctor";
import { db } from "../App";
import { useAuth } from "../services/Auth";

const Box = styled.div`
  padding: 16px;
`;

export default function Task() {
  const [task, setTask] = useState();
  const [data, setData] = useState();
  const [showErrors, setShowErrors] = useState(false);
  const { id } = useParams();
  const { id: userId } = useAuth();

  useEffect(() => {
    db.getTasksForStudent(userId).then((val) => {
      const task = val.find((v) => v.finished && v.id === parseInt(id, 10));
      if (task) {
        setTask(task);
        setData(task.result);
        setShowErrors(true);
      } else {
        db.getTask(id).then((task) => {
          setTask(task);
          setData(prepare(task.body, task.withSign));
        });
      }
    });
  }, [id, userId]);

  const handleChange = useCallback(
    (value, idx) => {
      data[idx]["value"] = value;
      setData([...data]);
    },
    [data]
  );

  const send = useCallback(() => {
    setShowErrors(true);
    db.updateTaskForStudent(userId, id, data);
  }, [id, data, userId]);

  return (
    <Box>
      {task && data && (
        <Groups design="vertical">
          <Card title={task.name}>
            <Card.Subtitle>
              <Groups justifyContent="flex-end">
                <Button disabled={showErrors} design="accent" onClick={send}>
                  Отправить
                </Button>
              </Groups>
            </Card.Subtitle>
          </Card>
          <Card>
            <Container
              data={data}
              showInvalid={showErrors}
              onChange={handleChange}
            />
          </Card>
        </Groups>
      )}
    </Box>
  );
}
