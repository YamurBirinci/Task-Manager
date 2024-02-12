import React, { useEffect, useState } from 'react';
import './DetailTask.css';



export const DetailTask = ({ task, onClose }) => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [showCommentTable, setShowCommentTable] = useState(true);
  const [newComment, setNewComment] = useState('');


  const [taskDetails, setTaskDetails] = useState({
    taskId: '',
    subjectName: '',
    category: '',
    severity: '',
    responsible: '',
    comments: '',
    status: '',
    assignedBy: '',
    team: '',
    deadline: '',
    date: '',
    remaining: '',
    description: ''
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
          comments: data.comment,
          assignedBy: data.assignedBy,
          team: data.team,
          deadline: data.delivery_date ? data.delivery_date.split("T")[0] : '',
          date: data.issuance_date ? data.issuance_date.split("T")[0] : '',
          remaining: data.remaining_time,
          definition: data.definition,
        });
      })
      .catch(error => console.error("Error:", error));
      }
    }, [task]);


    const handleAddComment = (e) => {
      e.preventDefault();
      if (newComment.trim() !== "") {

        const now = new Date();
        const timestamp = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}.${now.getMinutes().toString().padStart(2, '0')}: `;
        const updatedComment = timestamp + newComment + (taskDetails.comments ? '\\n' + taskDetails.comments : '');
        
        fetch(`http://localhost:8081/tasks/${taskDetails.taskId}/comments`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comments: updatedComment,
          }),
        })
        .then(data => {
          console.log('Yorum başarıyla eklendi:', data);
          setTaskDetails(prevState => ({
            ...prevState,
            comments: updatedComment,
          }));
          setNewComment('');
          handleCloseCommentModal();
        })
        .catch((error) => {
          console.error('Yorum eklenirken bir hata oluştu:', error);
        });
      }
    };
    

  const handleBackgroundClick = (e) => {
    if (e.target.className === 'modal-background') {
      onClose();
    }
  };


  const handleOpenCommentModal = () => {
    setIsCommentModalOpen(true);
    setShowCommentTable(false); 
  };


  const handleCloseCommentModal = () => {
    setIsCommentModalOpen(false);
    setShowCommentTable(true); 
  };

  return (
    <div className="modal-background" onClick={handleBackgroundClick}>
      <div className="detail-task-table-wrapper">

        {showCommentTable && (
          <div className="detail-comment-table">
            <button type="button" className="open-comment" onClick={handleOpenCommentModal}>CREATE NEW COMMENT</button>
            <div className="detail-comment-header">COMMENT DETAILS</div>
            <div className="detail-comment-newtask">
              {taskDetails.comments ? (
                <div>
                  {taskDetails.comments.split('\\n').map((comment, index) => {
                    const parts = comment.split(/:(.+)/);
                    return (
                      <p key={index}>
                        {parts.length > 1
                          ? <><strong>{parts[0]}:</strong><span style={{ fontWeight: 'normal' }}>{parts[1]}</span></>
                          : <strong>{parts[0]}</strong>
                        }
                      </p>
                    );
                  })}
                </div>
              ) : 'No comments yet.'}
            </div>
          </div>
        )}
  
        {isCommentModalOpen && (
          <div className="comment-modal">
            <textarea
              className='create-comment-newtask'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Please enter a comment..."
            />
            <button className="submit-comment-button" type="submit" onClick={handleAddComment}>ADD COMMENT</button>
            <button className="comment-close-button" type="button" onClick={handleCloseCommentModal}>X</button>
          </div>
        )}
  
        <div className="detail-task-table">
          <div className="detail-header-newtasktable">TASK DETAILS
            <button type="button" onClick={onClose} className="close-button">X</button>
          </div>

          <div className="detailRectangle" />
          <div className="detail-subject-label">Subject</div>
          <div className="detail-subject-newtask" name="subjectName">{taskDetails.subjectName || 'No Info'}</div>

          <div className="detailRectangle" />
          <div className="detail-description-label">Definition</div>
          <div className="detail-description-newtask" name="subjectName">{taskDetails.description || 'No Info'}</div>

          <div className="detailRectangle" />
          <div className="detail-category-label">Category</div>
          <div className="detail-category-newtask">
            <label className="detail-label-radio"><input type="radio" name="category" value="Task" checked={taskDetails.category === 'Task'} /> Task</label>
            <label className="detail-label-radio"><input type="radio" name="category" value="Project" checked={taskDetails.category === 'Project'} /> Project</label>
          </div>

          <div className="detailRectangle" />
          <div className="detail-severity-label">Severity</div>
          <div className="detail-severity-newtask">
            <label className="detail-label-radio"><input type="radio" name="severity" value="Low" checked={taskDetails.severity === 'Low'} /> Low</label>
            <label className="detail-label-radio"><input type="radio" name="severity" value="Medium" checked={taskDetails.severity === 'Medium'} /> Medium</label>
            <label className="detail-label-radio"><input type="radio" name="severity" value="High" checked={taskDetails.severity === 'High'} /> High</label>
          </div>

          <div className="detailRectangle" />
          <div className="detail-responsible-label">Responsible</div>
          <div className="detail-responsible-newtask" name="responsible">{taskDetails.responsible || 'No Info'}</div>

          <div className="detailRectangle" />
          <div className="detail-assignedby-label">Assigned by</div>
          <div className="detail-assignedby-newtask" name="assignedBy">{taskDetails.assignedBy || 'No Info'}</div>

          <div className="detailRectangle" />
          <div className="detailRectangle" />
          <div className="detail-status-label">Status</div>
          <div className="detail-status-newtask" name="status">{taskDetails.status || 'No Info'}</div>
          
          <div className="detail-date-label">Delivery Date</div>
          <div className="detail-date-newtask" name="date">{taskDetails.date || 'No Info'}</div>

          <div className="detail-remaining-label">Remaining Time</div>
          <div className="detail-remaining-newtask">
            <div className="detail-remaining-time" name="remaining">
              {taskDetails.remaining < 0 ? 'Expired' : `${taskDetails.remaining} Gün`}
            </div>
          </div>

          <div className="detail-date2-label">Delivery date</div>
          <div className="detail-date2-newtask" name="deadline">{taskDetails.deadline || 'No Info'}</div>

          <div className="detail-team-newtask" name="team">{taskDetails.team || 'No Info'}</div>
                    
        </div>
      </div>
    </div>
  );
  

};

 

export default DetailTask;
