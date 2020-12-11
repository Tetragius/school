const url = "http://tetragius.ddns.net/api";
// const url = "http://localhost:3030";

// classes

export const getClassesByName = async (name) => {
  return fetch(`${url}/classes/${name}`).then((r) => r.json());
};

// tasks

export const addTask = async (name, body, withSign) => {
  return fetch(`${url}/tasks`, {
    method: "put",
    body: JSON.stringify({ name, body, withSign }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updatetask = async (id, name, body, withSign) => {
  return fetch(`${url}/tasks`, {
    method: "post",
    body: JSON.stringify({ id, name, body, withSign }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getTasks = async () => {
  return fetch(`${url}/tasks`).then((r) => r.json());
};

export const getTask = async (id) => {
  return fetch(`${url}/tasks/${id}`).then((r) => r.json());
};

export const removeTask = async (id) => {
  return fetch(`${url}/tasks`, {
    method: "delete",
    body: JSON.stringify({ id }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// studentss

export const addStudent = async (data) => {
  return fetch(`${url}/students`, {
    method: "put",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getStudents = async () => {
  return fetch(`${url}/students`).then((r) => r.json());
};

export const getStudent = async (id) => {
  return fetch(`${url}/students/${id}`).then((r) => r.json());
};

export const removeStudent = async (id) => {
  return fetch(`${url}/students`, {
    method: "delete",
    body: JSON.stringify({ id }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const appendTaskToStudent = async (studentId, taskId) => {
  return fetch(`${url}/students/${studentId}`, {
    method: "post",
    body: JSON.stringify({ taskId }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());
};

export const updateTaskForStudent = async (
  studentId,
  taskId,
  result,
  comment,
  mark
) => {
  return fetch(`${url}/students/${studentId}`, {
    method: "post",
    body: JSON.stringify({ taskId, result, comment, mark }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());
};

export const getTasksForStudent = async (studentId) => {
  return fetch(`${url}/students/${studentId}/tasks`).then((r) => r.json());
};

// auth

export const logIn = async (login, pwd) => {
  return fetch(`${url}/login`, {
    method: "post",
    body: JSON.stringify({
      login,
      pwd,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());
};
