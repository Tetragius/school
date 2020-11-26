import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, Grid, Groups, Button, Badge } from "vienna-ui";
import { db } from "../App";
import { useAuth } from "../services/Auth";

export default function Student() {
  const [tasks, setTasks] = useState([]);
  const { id } = useAuth();

  const history = useHistory();

  useEffect(() => {
    db.getTasksForStudent(id).then(setTasks);
  }, [id]);

  return (
    <Grid.Row align="center">
      <Grid.Col size={10}>
        <Groups design="vertical">
          {tasks.map((task, idx) => (
            <Card
              title={task.name}
              footer={
                <Groups justifyContent="flex-end">
                  {!task.finished ? (
                    <Button onClick={() => history.push(`/task/${task.id}`)}>
                      Выполнить
                    </Button>
                  ) : (
                    <Button onClick={() => history.push(`/task/${task.id}`)}>
                      Просмотреть
                    </Button>
                  )}
                </Groups>
              }
              key={idx}
            >
              <Badge>{task.finished ? "выполнено" : "новое"}</Badge>
            </Card>
          ))}
        </Groups>
      </Grid.Col>
    </Grid.Row>
  );
}
