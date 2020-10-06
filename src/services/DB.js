export class DB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.openRequest = indexedDB.open("school", 3);
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
  }

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
}
