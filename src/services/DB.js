export class DB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.openRequest = indexedDB.open("school", 5);
      this.openRequest.onsuccess = this.success.bind(this, resolve);
      this.openRequest.onupgradeneeded = this.upgradeneeded.bind(this);
    });
  }

  success(resolve) {
    this.db = this.openRequest.result;
    resolve();
  }

  upgradeneeded() {
    this.db = this.openRequest.result;
    if (!this.db.objectStoreNames.contains("tasks")) {
      this.db.createObjectStore("tasks", {
        keyPath: "id",
        autoIncrement: true
      });
    }
    if (!this.db.objectStoreNames.contains("students")) {
      this.db.createObjectStore("students", {
        keyPath: "id",
        autoIncrement: true
      });
    }
    if (!this.db.objectStoreNames.contains("classes")) {
      let classes = this.db.createObjectStore("classes", {
        keyPath: "id",
        autoIncrement: true
      });
      classes.createIndex("name_idx", "name");
    }
  }

  // classes

  addClass(name) {
    let transaction = this.db.transaction("classes", "readwrite");
    let classes = transaction.objectStore("classes");
    classes.add({ name });
  }

  async getClasses() {
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction("classes");
      let classes = transaction.objectStore("classes");
      let request = classes.getAll();
      request.onerror = reject;
      request.onsuccess = (e) => {
        resolve(request.result);
      };
    });
  }

  async getClassByName(name) {
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction("classes");
      let classes = transaction.objectStore("classes");
      let nameIndex = classes.index("name_idx");
      let request = nameIndex.get(name);
      request.onerror = reject;
      request.onsuccess = (e) => {
        resolve(request.result);
      };
    });
  }

  // tasks

  addTask(name, body) {
    let transaction = this.db.transaction("tasks", "readwrite");
    let tasks = transaction.objectStore("tasks");
    tasks.add({ name, body });
  }

  updatetask(id, name, body) {
    let transaction = this.db.transaction("tasks", "readwrite");
    let tasks = transaction.objectStore("tasks");
    tasks.put({ id: parseInt(id, 10), name, body });
  }

  async getTasks() {
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction("tasks");
      let tasks = transaction.objectStore("tasks");
      let request = tasks.getAll();
      request.onerror = reject;
      request.onsuccess = (e) => {
        resolve(request.result);
      };
    });
  }

  async getTask(id) {
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction("tasks");
      let tasks = transaction.objectStore("tasks");
      let request = tasks.get(parseInt(id, 10));
      request.onerror = reject;
      request.onsuccess = (e) => {
        resolve(request.result);
      };
    });
  }

  async removeTask(id) {
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction("tasks", "readwrite");
      let tasks = transaction.objectStore("tasks");
      let request = tasks.get(parseInt(id, 10));
      request.onerror = reject;
      request.onsuccess = (e) => {
        tasks.delete(parseInt(id, 10));
        resolve();
      };
    });
  }

  // students

  addStudent(data) {
    let transaction = this.db.transaction("students", "readwrite");
    let students = transaction.objectStore("students");
    students.add(data);
  }

  async getStudents() {
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction("students");
      let students = transaction.objectStore("students");
      let request = students.getAll();
      request.onerror = reject;
      request.onsuccess = (e) => {
        resolve(request.result);
      };
    });
  }

  async getStudent(id) {
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction("students");
      let students = transaction.objectStore("students");
      let request = students.get(parseInt(id, 10));
      request.onerror = reject;
      request.onsuccess = (e) => {
        resolve(request.result);
      };
    });
  }

  async removeStudent(id) {
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction("students", "readwrite");
      let students = transaction.objectStore("students");
      let request = students.get(parseInt(id, 10));
      request.onerror = reject;
      request.onsuccess = (e) => {
        students.delete(id);
        resolve();
      };
    });
  }

  appendTaskToStudent(studentId, taskId) {
    let transaction = this.db.transaction("students", "readwrite");
    let students = transaction.objectStore("students");
    let request = students.get(parseInt(studentId, 10));
    request.onsuccess = (e) => {
      const student = request.result;
      if (!student.tasks) {
        student.tasks = [];
      }
      student.tasks.push({ id: taskId, finished: false });
      students.put({ id: parseInt(studentId, 10), ...student });
    };
  }

  updateTaskForStudent(studentId, taskId, result) {
    let transaction = this.db.transaction("students", "readwrite");
    let students = transaction.objectStore("students");
    let request = students.get(parseInt(studentId, 10));
    request.onsuccess = (e) => {
      const student = request.result;
      const index = student.tasks.findIndex(
        (t) => t.id === parseInt(taskId, 10)
      );
      student.tasks[index] = {
        id: parseInt(taskId, 10),
        finished: true,
        result
      };
      students.put({ id: parseInt(studentId, 10), ...student });
    };
  }

  async getTasksForStudent(studentId) {
    return new Promise((resolve) => {
      let transaction = this.db.transaction("students", "readwrite");
      let students = transaction.objectStore("students");
      let requestStudent = students.get(parseInt(studentId, 10));
      requestStudent.onsuccess = (e) => {
        const student = requestStudent.result;
        if (!student.tasks) {
          student.tasks = [];
        }
        Promise.all(
          student.tasks.map((task) => {
            return this.getTask(task.id).then((t) => ({
              ...t,
              finished: task.finished,
              result: task.result
            }));
          })
        ).then((tasks) => {
          resolve(tasks);
        });
      };
    });
  }
}
