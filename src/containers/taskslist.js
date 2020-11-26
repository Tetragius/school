import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Card, Button, Groups, Grid, Drawer, Modal } from "vienna-ui";
import { db } from "../App";
import { Container } from "../components/container";
import { prepare } from "../components/redactor";
import Creator from "./creator";

export default function TasksList() {
  const [list, setList] = useState([]);

  const [showDrawer, setShowDrawer] = useState(false);
  const [item, setItem] = useState(null);

  const history = useHistory();
  const { edit } = useParams();

  useEffect(() => {
    db.getTasks().then(setList);
  }, [edit]);

  const openPreview = useCallback((item) => {
    setShowDrawer(true);
    setItem(item);
  }, []);

  const closeModal = useCallback(() => {
    history.push("/list");
  }, [history]);

  const removeHandler = useCallback((id) => {
    db.removeTask(id).then(() => db.getTasks().then(setList));
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
          {list.map((item, idx) => (
            <Card key={idx} title={item.name}>
              <Groups justifyContent="flex-end">
                <Button
                  design="accent"
                  onClick={() => history.push(`/list/edit/${item.id}`)}
                >
                  Редактировать
                </Button>
                <Button onClick={() => openPreview(item)}>Предпросмотр</Button>
                <Button
                  design="critical"
                  onClick={() => removeHandler(item.id)}
                >
                  Удалить
                </Button>
              </Groups>
            </Card>
          ))}
        </Groups>
      </Grid.Col>
      <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)}>
        {item && (
          <Drawer.Layout>
            <Drawer.Head>
              <Drawer.Title>{item?.name}</Drawer.Title>
            </Drawer.Head>
            <Drawer.Body>
              <Container data={prepare(item.body, item.withSign)} showInvalid />
            </Drawer.Body>
          </Drawer.Layout>
        )}
      </Drawer>
      <Modal isOpen={!!edit} onClose={closeModal}>
        <Creator />
      </Modal>
    </Grid.Row>
  );
}
