import React, { useState } from 'react';
import './CreateTask.css';
import MyDatePicker from './MyDatePicker.js';

 

export const CreateTask = ({ onSubmit, onClose }) => {

  const [task, setTask] = useState({
    taskID: '',
    subjectName: '',
    category: 'Task',
    severity: 'Low',
    responsible: '',
    deadline: '',
    comment: '',
    definition: ''
  });

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.deadline) {
      alert('Please enter a delivery date before creating!');
      return;
    }

    if (!task.responsible) {
      alert('Please choose a responsible before creating!');
      return;
    }

    fetch('http://localhost:8081/create_task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })

    .then(response => response.json())
    .then(data => {
      onSubmit(data);
      onClose();
    })
  }

 

  const handleBackgroundClick = (e) => {
    if (e.target.className === 'modal-background') {
      onClose();
    }
  };


  const handleDeadlineChange = (timestamp) => {
    const timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
    const localDate = new Date(timestamp - timezoneOffset);
    const formattedDate = localDate.toISOString().split('T')[0];
    setTask({ ...task, deadline: formattedDate });
  };


  return (
    <div className="modal-background" onClick={handleBackgroundClick}>
      <form className="create-task-table-wrapper" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <div className="create-task-table">

          <div className="header-newtasktable">Create New Task
            <button type="button" onClick={onClose} className="close-button">X</button>
          </div>

          <div className="rectangle" />
          <div className="subject-label">Subject</div>
          <textarea
            className="subject-newtask"
            name="subjectName"
            value={task.subjectName}
            onChange={handleChange}
            placeholder="Please enter subject title..."
          />

          <div className="rectangle" />
          <div className="description-label">Description</div>
          <textarea
            className="description-newtask"
            name="definition"
            value={task.definition}
            onChange={handleChange}
            placeholder="Please enter task details..."
          />

          <div className="rectangle" />
          <div className="category-label">Category</div>
          <div className="category-newtask">
            <label className="label-radio">
              <input
                type="radio"
                name="category"
                value="Task"
                checked={task.category === 'Task'}
                onChange={handleChange}
              /> Task
            </label>
            <label className="label-radio">
              <input
                type="radio"
                name="category"
                value="Project"
                checked={task.category === 'Project'}
                onChange={handleChange}
              /> Project
            </label>
          </div>

          <div className="rectangle" />
          <div className="severity-label">Severity</div>
          <div className="severity-newtask">
            <label className="label-radio">
              <input
                type="radio"
                name="severity"
                value="Low"
                checked={task.severity === 'Low'}
                onChange={handleChange}
              /> Low
            </label>
            <label className="label-radio">
              <input
                type="radio"
                name="severity"
                value="Medium"
                checked={task.severity === 'Medium'}
                onChange={handleChange}
              /> Medium
            </label>
            <label className="label-radio">
              <input
                type="radio"
                name="severity"
                value="High"
                checked={task.severity === 'High'}
                onChange={handleChange}
              /> High
            </label>
          </div>

          <div className="rectangle" />
          <div className="responsible-label">Responsible</div>
          <div className="responsible-select">
            <label htmlFor="responsible" className="text-wrapper-2"></label>
            <select
              name="responsible"
              value={task.responsible}
              onChange={handleChange}
              className="responsible-newtask"
            >
              <option value="">Please choose responsibly</option>
              <option value="Yağmur Fatma Birinci">Yağmur Fatma Birinci</option>
              <option value="Omer Temiz">Omer Temiz</option>
              <option value="Damla Uzun">Damla Uzun</option>
              <option value="Berat Kan">Berat Kan</option>
            </select>
          </div>

          <div className="comment-newtask">
            <textarea
              className="comment"
              name="comment"
              value={task.comment}
              onChange={handleChange}
              placeholder="Please enter comment..."
            />
          </div>
          
          <div className="date2-label">Delivery Date</div>
          <div className="date2-newtask" name="deadline">
            <MyDatePicker onChange={handleDeadlineChange} selectedDay={new Date(task.deadline).getTime()} />
          </div>
              
          <button type="submit" className="assign-button">CREATE</button>
        </div>
      </form>
    </div>
  );
};

 

export default CreateTask;
