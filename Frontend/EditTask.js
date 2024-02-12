import React, { useEffect, useState } from 'react';
import './EditTask.css';
import MyDatePicker from './MyDatePicker';


export const EditTask = ({ task, onSubmit, onClose }) => {
  const [taskDetails, setTaskDetails] = useState({
      taskId: '',
      subjectName: '',
      category: '',
      severity: '',
      responsible: '',
      status: '',
      team: '',
      deadline: '',
      date: '',
      definition: ''
  });

  //Task detaylarını alma
  useEffect(() => {
    if (task && task.TaskId) {
      fetch(`http://localhost:8081/tasks/${task.TaskId}`)
        .then(response => response.json())
        .then(data => {
          setTaskDetails({
            taskId: data.TaskId,
            subjectName: data.subject,
            category: data.category,
            severity: data.severity,
            responsible: data.responsible,
            status: data.status,
            team: data.team,
            deadline: data.delivery_date ? convertDate(data.delivery_date.split("T")[0]) : '',
            date: data.issuance_date ? convertDate(data.issuance_date.split("T")[0]) : '',
            definition: data.definition,
            });
        })
        .catch(error => console.error("Error:", error));
    }
  }, [task]);


  const convertDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };
  

  const handleDateChange = (selectedTimestamp) => {
    const timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
    const localDate = new Date(selectedTimestamp - timezoneOffset);
    const formattedDate = localDate.toISOString().split('T')[0];
    setTaskDetails({ ...taskDetails, deadline: formattedDate });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8081/tasks/${taskDetails.taskId}`, {
    method: 'PUT', 
    headers: {
      'Content-Type': 'application/json',
    },
      body: JSON.stringify({
        subjectName: taskDetails.subjectName,
        category: taskDetails.category,
        severity: taskDetails.severity,
        responsible: taskDetails.responsible,
        status: taskDetails.status,
        deadline: taskDetails.deadline,
        definition: taskDetails.definition,
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      onSubmit(taskDetails); 
      onClose(); 
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

 
  const handleBackgroundClick = (e) => {
    if (e.target.className === 'modal-background') {
      onClose();
    }
  };


  return (
    <div className="modal-background" onClick={handleBackgroundClick}>
      <form className="edit-task-table-wrapper" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <div className="edit-task-table">
          <div className="edit-header-newtasktable">EDITING TASK
            <button type="button" onClick={onClose} className="close-button">X</button>
          </div>
          
          <div className="edit-subject-label">Subject</div>
          <textarea
            className="edit-subject-newtask"
            name="subjectName"
            value={taskDetails.subjectName}
            onChange={handleChange}
            placeholder="Please enter subject title..."
          />
  
          <div className="rectangle" />
          <div className="edit-description-label">Definition</div>
          <textarea
            className="edit-description-newtask"
            name="definition"
            value={taskDetails.definition}
            onChange={handleChange}
            placeholder="Please enter task details..."
          />
  
          <div className="editRectangle" />
          <div className="edit-category-label">Category</div>
          <div className="editRectangle" />
          <div className="edit-severity-label">Severity</div>
          <div className="editRectangle" />
          <div className="edit-responsible-label">Responsible</div>
          <div className="editRectangle" />
          <div className="editRectangle" />
          <div className="editRectangle" />
          <div className="edit-status-label">Status</div>
          <div className="edit-date2-label">Delivery Date</div>
  
          <div className="edit-status-select">
            <select
              name="status"
              value={taskDetails.status}
              onChange={handleChange}
              className="edit-status-newtask"
            >
              <option value="">Select status</option>
              <option value="Pending">Pending</option>
              <option value="Continues">Continues</option>
              <option value="Completed">Completed</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div className="edit-date2-newtask" name="deadline">
            <MyDatePicker onChange={handleDateChange} selectedDay={new Date(taskDetails.deadline).getTime()} />
          </div>
  
          <div className="edit-responsible-select">
            <select
              name="responsible"
              value={taskDetails.responsible}
              onChange={handleChange}
              className="edit-responsible-newtask"
            >
              <option value="">Please choose responsibly</option>
              <option value="Yağmur Fatma Birinci">Yağmur Fatma Birinci</option>
              <option value="Omer Temiz">Omer Temiz</option>
              <option value="Damla Uzun">Damla Uzun</option>
              <option value="Berat Kan">Berat Kan</option>
            </select>
          </div>
  
          <div className="edit-severity-newtask">
            <label className="edit-label-radio">
              <input
                type="radio"
                name="severity"
                value="Low"
                checked={taskDetails.severity === 'Low'}
                onChange={handleChange}
              /> Low
            </label>
            <label className="edit-label-radio">
              <input
                type="radio"
                name="severity"
                value="Medium"
                checked={taskDetails.severity === 'Medium'}
                onChange={handleChange}
              /> Medium
            </label>
            <label className="edit-label-radio">
              <input
                type="radio"
                name="severity"
                value="High"
                checked={taskDetails.severity === 'High'}
                onChange={handleChange}
              /> High
            </label>
          </div>
  
          <div className="edit-category-newtask">
            <label className="edit-label-radio">
              <input
                type="radio"
                name="category"
                value="Task"
                checked={taskDetails.category === 'Task'}
                onChange={handleChange}
              /> Task
            </label>
            <label className="edit-label-radio">
              <input
                type="radio"
                name="category"
                value="Project"
                checked={taskDetails.category === 'Project'}
                onChange={handleChange}
              /> Project
            </label>
          </div>
  
          <button className="edit-assign-button">CONFIRM</button>
        </div>
      </form>
    </div>
  );
};

 

export default EditTask;
