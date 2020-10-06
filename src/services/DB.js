export class DB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.openRequest = indexedDB.open("school", 4);
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

  // students

  addStudent(name) {
    let transaction = this.db.transaction("students", "readwrite");
    let students = transaction.objectStore("students");
    students.add({ name });
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
        Promise.all(student.tasks.map((task) => this.getTask(task.id))).then(
          (tasks) => {
            resolve(tasks);
          }
        );
      };
    });
  }
}
