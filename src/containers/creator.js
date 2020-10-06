import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";
import { Container } from "../components/container";
import { Redactor, prepare } from "../components/readctor";
import { Modal } from "../components/modal";
import { SaveTaskForm } from "../forms/saveTask";
import { db } from "../App";

const Box = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const Left = styled.div`
  width: 50%;
  height: 100%;
  border-right: 1px solid gray;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const LeftCenter = styled.div`
  width: 100%;
  height: calc(100% - 48px - 112px);
`;

const I = styled.i`
  font-size: 12px;
  margin-top: 16px;
  * {
    font-size: 12px;
  }
`;

const Right = styled.div`
  width: 50%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
`;

const RightCenter = styled.div`
  width: 100%;
  height: calc(100% - 48px);
`;

export default function Creator() {
  const [task, setTask] = useState({ name: "Новое задание", body: "" });

  const [data, setData] = useState(prepare(task.body));
  const [showInvalid, setShowInvalid] = useState(false);

  const [showSaveDialog, setShowSaveDialog] = useState(false);

  let { id } = useParams();
  let history = useHistory();

  useEffect(() => {
    if (id) {
      db.getTask(id).then((task) => {
        setTask(task);
        setData(prepare(task.body));
      });
    }
  }, [id]);

  const handle = useCallback(
    (_value, _data) => {
      setTask({ ...task, body: _value });
      setData(_data);
    },
    [task]
  );

  const handleCheckbox = useCallback(() => {
    setShowInvalid(!showInvalid);
  }, [showInvalid]);

  const handleShowDialog = useCallback(() => {
    setShowSaveDialog(true);
  }, []);

  const handleChange = useCallback(
    (value, idx) => {
      data[idx]["value"] = value;
      setData([...data]);
    },
    [data]
  );

  const handleSave = useCallback(
    (name) => {
      if (!id) {
        db.addTask(name, task.body);
      } else {
        db.updatetask(id, name, task.body);
      }
      setShowSaveDialog(false);
      history.push("/list");
    },
    [task, id, history]
  );

  return (
    <Box>
      <Left>
        <span style={{ display: "flex", alignItems: "center" }}>
          <h1>Редактирование |</h1>
          &nbsp;
          <input
            type="button"
            value="К списку"
            onClick={() => history.push("/list")}
          />
          &nbsp;
          <input type="button" value="Сохранить" onClick={handleShowDialog} />
        </span>
        <LeftCenter>
          <Redactor onChange={handle} value={task.body} />
        </LeftCenter>
        <I>
          Выделите текст или область.
          <ul>
            <li>
              Нажмите <b>CTRL+Q</b> - пропущеные буквы
            </li>
            <li>
              Нажмите <b>CTRL+W</b> - слитно/раздельно
            </li>
          </ul>
        </I>
      </Left>
      <Right>
        <span style={{ display: "flex", alignItems: "center" }}>
          <h1>Предпросмотр |</h1>
          &nbsp;
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <input
              type="checkbox"
              value={showInvalid}
              onChange={handleCheckbox}
            />
            &nbsp;
            <span>Показать ошибки</span>
          </label>
        </span>
        <RightCenter>
          <Container
            data={data}
            showInvalid={showInvalid}
            onChange={handleChange}
          />
        </RightCenter>
      </Right>
      {showSaveDialog && (
        <Modal onClose={() => setShowSaveDialog(false)}>
          <SaveTaskForm onOk={handleSave} name={task.name} />
        </Modal>
      )}
    </Box>
  );
}
