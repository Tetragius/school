import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Card, Button, Groups, Grid, Modal } from "vienna-ui";
import { Task } from "../components/task";
import Creator from "./creator";
import { getTasks, removeTask } from "../services/EP";

export default function TasksList() {
  const [list, setList] = useState([]);

  const history = useHistory();
  const { edit } = useParams();

  useEffect(() => {
    getTasks().then(setList);
  }, [edit]);

  const closeModal = useCallback(() => {
    history.push("/list");
  }, [history]);

  const removeHandler = useCallback((id) => {
    removeTask(id).then(() => getTasks().then(setList));
  }, []);

  return (
    <Grid.Row align="center">
      <Grid.Col size={10}>
        <Groups design="vertical" style={{ padding: "16px" }}>
          <Card>
            <Groups justifyContent="flex-end">
              <Button
                design="accent"
                onClick={() => history.push("/list/edit")}
              >
                Добавить
              </Button>
            </Groups>
          </Card>
          {list.map((item) => (
            <Task
              key={item.id}
              item={item}
              onEdit={(id) => history.push(`/list/edit/${id}`)}
              onRemove={removeHandler}
            />
          ))}
        </Groups>
      </Grid.Col>
      <Modal isOpen={!!edit} onClose={closeModal}>
        <Creator />
      </Modal>
    </Grid.Row>
  );
}
