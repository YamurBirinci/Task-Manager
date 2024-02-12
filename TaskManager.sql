CREATE DATABASE IF NOT EXISTS TaskManager;


use TaskManager;
CREATE TABLE IF NOT EXISTS tasks (
     TaskId INT AUTO_INCREMENT PRIMARY KEY,
     subject VARCHAR(255),
     category VARCHAR(20),
     severity VARCHAR(20),
     responsible VARCHAR(100),
     assignedBy VARCHAR(100),
     team VARCHAR(100),
     issuance_date DATE,
     delivery_date DATE,
     status VARCHAR(100),
     active INT,
     comment text,
     definition text
);


#Initial tasks:
INSERT INTO tasks (subject, definition, category, severity, responsible, assignedBy, team, issuance_date, delivery_date, status, active) VALUES
('Task manager page', 'A page design where users can track, edit and view tasks in detail.', 'Project', 'Low', 'Yağmur Fatma Birinci', 'Tuna Yılmaz', '',  '2024-01-01',  '2024-02-14', 'Continues', '1'),
('Error checking', 'Checking faulty machines', 'Task', 'Low', 'Berat Kan', 'Unal Sarraf', '',  CURDATE(),  '2024-02-15', 'C', '1'),
('SQL database optimization', 'Database optimization that causes slowdown due to abundance of data', 'Task', 'Medium', 'Yağmur Fatma Birinci', 'Tuna Yılmaz', '',  '2024-01-25', '2024-03-17', 'Pending', '1'),
('New Mobile Network Infrastructure Installation', 'Installation of new mobile network infrastructure in Üsküdar, Istanbul.', 'Project', 'Medium', 'Yağmur Fatma Birinci', 'Tuna Yılmaz', '',  '2024-02-02', '2024-09-07', 'Completed', '1'),
('Review of Quality Control Processes', 'Review of quality control processes on the production line.', 'Task', 'Medium', 'Damla Uzun', 'Unal Sarraf', 'QC',  '2024-01-21', '2024-02-03', 'Pending', '1'),
('CRM System Update', 'Updating the customer relationship management system.', 'Task', 'Low', 'Damla Uzun', 'Unal Sarraf', 'IT',  '2024-02-11', '2024-03-27', 'Pending', '1');
