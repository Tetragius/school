import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Card, Grid, Groups, Button, Badge } from "vienna-ui";
import { db } from "../App";

export default function Student() {
  const [name, setName] = useState("");
  const [tasks, setTasks] = useState([]);
  const { id } = useParams();

  const history = useHistory();

  useEffect(() => {
    db.getStudent(id).then((student) => {
      setName(student.name);
    });
    db.getTasksForStudent(id).then(setTasks);
  }, [id]);

  return (
    <Grid.Row align="center">
      <Grid.Col size={10}>
        <Groups design="vertical">
          <Card>{`${name}`}</Card>
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
