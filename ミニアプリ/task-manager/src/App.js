import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // ローカルストレージからタスクを読み込み
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // タスクが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 新しいタスクを追加
  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toLocaleString()
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  // タスクの完了状態を切り替え
  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // タスクを削除
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // 完了済みタスクをすべて削除
  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>タスク管理アプリ</h1>
          <p>シンプルで使いやすいタスク管理ツール</p>
        </header>

        <form onSubmit={addTask} className="task-form">
          <div className="input-group">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="新しいタスクを入力してください…"
              className="task-input"
            />
            <button type="submit" className="add-button">
              追加
            </button>
          </div>
        </form>

        <div className="stats">
          <span>完了：{completedCount}/{totalCount}</span>
          {completedCount > 0 && (
            <button onClick={clearCompleted} className="clear-button">
              完了済みを削除
            </button>
          )}
        </div>

        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>📋 タスクがありません</p>
              <p>新しいタスクを追加してみましょう！</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-content">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="task-checkbox"
                    type="button"
                  >
                    <span className="material-symbols-outlined">
                      {task.completed ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                  </button>
                  <div className="task-text">
                    <span className={task.completed ? 'completed-text' : ''}>
                      {task.text}
                    </span>
                    <small className="task-date">{task.createdAt}</small>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="delete-button"
                  title="削除"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
