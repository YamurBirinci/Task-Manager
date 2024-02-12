import React, { useEffect, useState } from 'react';
import { CreateTask } from './CreateTask';
import { EditTask } from './EditTask';
import { DetailTask } from './DetailTask';
import './TaskManager.css';

 

export const TaskManager = () => {

  const [tasks, setTasks] = useState([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  
  const fetchTasks = () => {
    fetch('http://localhost:8081/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error:', error));
  };


  useEffect(() => {
    fetchTasks();
  }, []);
 

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };


  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    fetchTasks();
  };


  const handleOpenEditModal = (task, event) => {
    event.stopPropagation();
    setCurrentTask(task);
    setEditModalOpen(true);
  };

 
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    fetchTasks();
  };
 

  const handleTaskSubmit = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
    handleCloseCreateModal();
  };


  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
  };

 
  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    handleCloseEditModal();
  };

 
  const handleDeleteTask = (taskId) => {
    fetch(`http://localhost:8081/tasks/${taskId}`, {
    method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        fetchTasks();
      }
    })
    .catch(error => console.error('Error:', error));
  };


  const renderTableData = () => {
    return tasks.map(task => {
      const {
        TaskId,
        subject,
        category,
        severity,
        responsible,
        delivery_date,
        status,
        remaining_time
      } = task;

      const formattedDeliveryDate = delivery_date ? delivery_date.split("T")[0] : '';
      const isLateAndNotCompleted = remaining_time < 0 && (status !== 'Completed' && status !== 'Suspended');
      const isTodayAndNotCompleted = remaining_time === 0 && (status !== 'Completed' && status !== 'Suspended');
      
      let statusColor = 'black';

      if (isLateAndNotCompleted) {
        statusColor = '#8F0000';
      } 
      else if (isTodayAndNotCompleted) {
        statusColor = '#FFAF36';
      }
      
      return (
        <tr key={TaskId} onClick={() => setSelectedTask(task)} style={{cursor: 'pointer'}}>
          <td>{TaskId}</td>
          <td>{subject}</td>
          <td>{category}</td>
          <td>{severity}</td>
          <td>{responsible}</td>
          <td>{formattedDeliveryDate}</td>
          <td style={{ color: statusColor }}>{status}</td>
          <td>
            <button className="edit" onClick={(e) => handleOpenEditModal(task, e)}>
              EDIT
            </button>
            <button className="delete" onClick={(e) => {e.stopPropagation(); handleDeleteTask(TaskId);}}>
              X 
            </button>
          </td>
        </tr>
      );
    });
};

 

  return (                                         
                            
    <div className="TaskManager">

      {isCreateModalOpen && <CreateTask onSubmit={handleTaskSubmit} onClose={handleCloseCreateModal} />}
      {isEditModalOpen && <EditTask task={currentTask} onSubmit={handleTaskUpdate} onClose={handleCloseEditModal} />}
      {isDetailModalOpen && <DetailTask task={selectedTask} onClose={handleCloseDetailModal} />}

      <div className="task-header">TASK MANAGER</div>
      <div className="tasks-table-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Severity</th>
              <th>Responsible</th>
              <th>Delivery Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody className="tasks-table-body" onClick={() => setIsDetailModalOpen(true)}>
          {renderTableData()}
          </tbody>
        </table>

        <button type="button" className="create-button" onClick={handleOpenCreateModal}>
          Create New Task
        </button>
      </div>
    </div>
  );
};

 

export default TaskManager;

 
