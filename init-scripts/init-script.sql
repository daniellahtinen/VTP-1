CREATE DATABASE IF NOT EXISTS mydatabase;

USE mydatabase;

-- UNUSED
CREATE TABLE IF NOT EXISTS plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

INSERT INTO plans (name, description) VALUES ('Plan 1', 'This is the first plan.');
INSERT INTO plans (name, description) VALUES ('Plan 2', 'This is the second plan.');
INSERT INTO plans (name, description) VALUES ('Plan 3', 'This is the third plan.');
--


CREATE TABLE inspection_subject (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS drafts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_id INT NOT NULL,
  CONSTRAINT fk_drafts_subjects FOREIGN KEY (subject_id) REFERENCES inspection_subject(id)
);

CREATE TABLE IF NOT EXISTS inspection_information (
  id INT AUTO_INCREMENT PRIMARY KEY,
  draft_id INT NOT NULL,
  subject_of_inspection VARCHAR(255),
  issue TEXT NOT NULL,
  risk_area TEXT NOT NULL,
  official_duration_period VARCHAR(255) NOT NULL,
  total_duration_period VARCHAR(255) NOT NULL,
  participants TEXT NOT NULL,
  responsible_inspector VARCHAR(255) NOT NULL,
  office VARCHAR(255),
  department VARCHAR(255),
  subject_contact_information TEXT NOT NULL,
  inspection_contact_person VARCHAR(255),
  FOREIGN KEY (draft_id) REFERENCES drafts(id)
);

CREATE TABLE IF NOT EXISTS target_timeframes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  draft_id INT NOT NULL,
  goal VARCHAR(255) NOT NULL,
  planned_date DATE NOT NULL,
  actual_date DATE DEFAULT NULL,
  comments VARCHAR(255) DEFAULT NULL,
  document_id INT DEFAULT NULL,
  link_text VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (draft_id) REFERENCES drafts(id)
);

CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  draft_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  handler VARCHAR(255),
  modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_documents_drafts FOREIGN KEY (draft_id) REFERENCES drafts(id)
);

CREATE TABLE IF NOT EXISTS scheduling (
  id INT AUTO_INCREMENT PRIMARY KEY,
  draft_id INT NOT NULL,
  event TEXT NOT NULL,
  person TEXT NOT NULL,
  week INT NOT NULL,
  CONSTRAINT fk_scheduling_drafts FOREIGN KEY (draft_id) REFERENCES drafts(id)
);


-- INSERTS

INSERT INTO inspection_subject (name) VALUES
  ('Norppapankki'),
  ('Finnish Financial Group'), 
  ('Aurora Bank'),
  ('Aalto Bank'),
  ('Baltic Finance'),
  ('Meridian Bank'),
  ('North Star Bank'),
  ('Ostospankki'),
  ('Polaris Bank'),
  ('Savonia Bank'),
  ('Tundra Financial');

INSERT INTO drafts (subject_id) VALUES 
  (1),
  (1),
  (1),
  (2),
  (2),
  (3),
  (3),
  (4),
  (5),
  (6),
  (7),
  (11);

INSERT INTO inspection_information (draft_id, subject_of_inspection, issue, risk_area, official_duration_period, total_duration_period, participants, responsible_inspector, office, department, subject_contact_information, inspection_contact_person) VALUES 
  (1, 'Norppapankki Financial Report', 'Missing financial data', 'Financial reporting', '2 weeks', '4 weeks', 'Audit team, Finance department', 'John Doe', 'Helsinki', 'Finance department', 'contact@norppapankki.fi', 'Jane Smith'),
  (2, 'Acme Inc. Financial Report', 'Inconsistencies in financial data', 'Financial reporting', '2 weeks', '4 weeks', 'Audit team, Finance department', 'John Doe', 'Helsinki', 'Finance department', 'contact@acmeinc.com', 'Jane Smith'),
  (3, 'XYZ Corporation IT Security Audit', 'Insufficient access controls', 'IT Security', '1 week', '2 weeks', 'IT Security team, Operations department', 'David Lee', 'Helsinki', 'Operations department', 'contact@xyzcorp.com', 'John Smith'),
  (4, 'Acme Inc. HR Audit', 'Non-compliance with HR policies', 'HR compliance', '2 weeks', '4 weeks', 'Audit team, HR department', 'Mary Johnson', 'Helsinki', 'HR department', 'contact@acmeinc.com', 'John Doe'),
  (5, 'Norppapankki Compliance Audit', 'Non-compliance with regulations', 'Regulatory compliance', '1 week', '2 weeks', 'Compliance team, Legal department', 'Emily Chen', 'Helsinki', 'Legal department', 'contact@norppapankki.fi', 'David Lee');

INSERT INTO inspection_information (draft_id, subject_of_inspection, issue, risk_area, official_duration_period, total_duration_period, participants, responsible_inspector, office, department, subject_contact_information, inspection_contact_person) VALUES 
  (6, 'ABC Corporation Financial Report', 'Missing financial data', 'Financial reporting', '2 weeks', '4 weeks', 'Audit team, Finance department', 'John Doe', 'Helsinki', 'Finance department', 'contact@abccorp.com', 'Jane Smith'),
  (7, 'Norppapankki IT Security Audit', 'Weaknesses in IT infrastructure', 'IT Security', '1 week', '2 weeks', 'IT Security team, Operations department', 'David Lee', 'Helsinki', 'Operations department', 'contact@norppapankki.fi', 'John Smith'),
  (8, 'XYZ Corporation Compliance Audit', 'Non-compliance with regulations', 'Regulatory compliance', '2 weeks', '4 weeks', 'Compliance team, Legal department', 'Emily Chen', 'Helsinki', 'Legal department', 'contact@xyzcorp.com', 'David Lee'),
  (9, 'Acme Inc. HR Audit', 'Inconsistent HR policies', 'HR compliance', '1 week', '2 weeks', 'Audit team, HR department', 'Mary Johnson', 'Helsinki', 'HR department', 'contact@acmeinc.com', 'John Doe'),
  (10, 'ABC Corporation IT Security Audit', 'Outdated security systems', 'IT Security', '2 weeks', '4 weeks', 'IT Security team, Operations department', 'David Lee', 'Helsinki', 'Operations department', 'contact@abccorp.com', 'Jane Smith'),
  (11, 'Norppapankki HR Audit', 'Non-compliance with HR policies', 'HR compliance', '1 week', '2 weeks', 'Audit team, HR department', 'Mary Johnson', 'Helsinki', 'HR department', 'contact@norppapankki.fi', 'John Doe');

INSERT INTO target_timeframes (draft_id, goal, planned_date, actual_date, comments, document_id, link_text) VALUES 
  (1, 'Gather financial data', '2022-02-01', '2022-01-28', 'Received report earlier than expected', NULL, NULL),
  (1, 'Review financial data', '2022-02-05', '2022-02-08', 'Team member was sick', NULL, NULL),
  (1, 'Finalize report', '2022-02-10', '2022-02-12', 'Final review took longer than anticipated', NULL, NULL),
  (1, 'Submit report to management', '2022-02-15', '2022-02-17', 'Approval process delayed', NULL, NULL),
  (1, 'Follow up on findings', '2022-02-20', '2022-02-25', 'Meeting rescheduled due to conflicting schedules', NULL, NULL),
  (2, 'Gather financial data', '2022-03-01', '2022-02-28', 'Report received early', NULL, NULL),
  (2, 'Review financial data', '2022-03-05', '2022-03-07', 'Team member was sick', NULL, NULL),
  (2, 'Finalize report', '2022-03-10', '2022-03-14', 'Final review took longer than anticipated', NULL, NULL),
  (2, 'Submit report to management', '2022-03-15', '2022-03-14', 'Report submitted ahead of schedule', NULL, NULL),
  (2, 'Follow up on findings', '2022-03-20', NULL, 'Meeting rescheduled due to conflicting schedules', NULL, NULL),
  (3, 'Assess IT infrastructure', '2022-04-01', NULL, 'Meeting postponed', NULL, NULL),
  (4, 'Review HR policies', '2022-05-01', '2022-05-03', 'Meeting rescheduled due to conflicting schedules', NULL, NULL),
  (5, 'Assess compliance with regulations', '2022-06-01', NULL, 'Meeting postponed', NULL, NULL),
  (6, 'Gather financial data', '2022-07-01', '2022-07-05', 'Report delayed', NULL, NULL),
  (7, 'Assess IT security systems', '2022-08-01', '2022-07-31', 'Report received early', NULL, NULL),
  (8, 'Assess compliance with regulations', '2022-09-01', NULL, 'Meeting postponed', NULL, NULL),
  (9, 'Review HR policies', '2022-10-01', '2022-09-30', 'Report received early', NULL, NULL),
  (10, 'Assess IT security systems', '2022-11-01', '2022-11-02', 'Team member was sick', NULL, NULL),
  (11, 'Review HR policies', '2022-12-01', NULL, 'Meeting postponed', NULL, NULL),
  (12, 'Assess compliance with regulations', '2023-01-01', '2022-12-31', 'Report submitted ahead of schedule', NULL, NULL);

INSERT INTO documents (draft_id, title, handler, modified) VALUES
  (1, 'Financial report', 'John Doe', '2022-02-15 14:23:45'),
  (1, 'Audit findings', 'Jane Smith', '2022-02-17 10:12:34'),
  (2, 'Financial report', 'John Doe', '2022-03-15 14:23:45'),
  (2, 'Audit findings', 'Jane Smith', '2022-03-17 10:12:34'),
  (3, 'IT infrastructure report', 'Bob Johnson', '2022-04-15 09:34:56'),
  (3, 'Security analysis', 'Alice Lee', '2022-04-16 11:22:33'),
  (4, 'HR policies report', 'Susan Brown', '2022-05-15 08:12:34'),
  (4, 'Diversity and inclusion findings', 'David Garcia', '2022-05-18 13:45:22'),
  (5, 'Compliance report', 'Karen Green', '2022-06-15 15:23:45'),
  (5, 'Legal analysis', 'Mike Davis', '2022-06-18 09:43:21'),
  (6, 'Financial report', 'John Doe', '2022-07-15 14:23:45'),
  (6, 'Audit findings', 'Jane Smith', '2022-07-17 10:12:34'),
  (7, 'IT security report', 'Bob Johnson', '2022-08-15 09:34:56'),
  (7, 'Risk assessment', 'Alice Lee', '2022-08-16 11:22:33'),
  (8, 'Compliance report', 'Karen Green', '2022-09-15 15:23:45'),
  (8, 'Legal analysis', 'Mike Davis', '2022-09-18 09:43:21'),
  (9, 'HR policies report', 'Susan Brown', '2022-10-15 08:12:34'),
  (9, 'Employee feedback', 'David Garcia', '2022-10-18 13:45:22'),
  (10, 'IT security report', 'Bob Johnson', '2022-11-15 09:34:56'),
  (10, 'Penetration testing findings', 'Alice Lee', '2022-11-16 11:22:33'),
  (11, 'HR policies report', 'Susan Brown', '2022-12-15 08:12:34'),
  (11, 'Recruitment analysis', 'David Garcia', '2022-12-18 13:45:22'),
  (12, 'Compliance report', 'Karen Green', '2023-01-15 15:23:45'),
  (12, 'Legal analysis', 'Mike Davis', '2023-01-18 09:43:21');

INSERT INTO scheduling (draft_id, event, person, week) VALUES
  (1, 'Meeting with CEO', 'John Smith', 2),
  (1, 'Budget review', 'Jane Doe', 3),
  (1, 'Marketing strategy session', 'Bob Johnson', 4),
  (2, 'IT planning meeting', 'Sarah Williams', 2),
  (2, 'Product development review', 'Tom Lee', 3),
  (2, 'Sales team training', 'Karen Jones', 4),
  (3, 'Hiring interviews', 'Alex Brown', 2),
  (3, 'Performance reviews', 'Emily Davis', 3),
  (3, 'Operations review', 'Mike Wilson', 4),
  (4, 'New product launch planning', 'Chris Jackson', 2),
  (4, 'Vendor negotiations', 'Kim Lee', 3),
  (4, 'Customer outreach planning', 'David Smith', 4),
  (5, 'Strategic planning session', 'Lisa Green', 2),
  (5, 'Financial review', 'Tim Brown', 3),
  (5, 'Client meetings', 'Anna Lee', 4),
  (6, 'Team building activity', 'Sam Smith', 2),
  (6, 'Sales team meeting', 'Hannah Kim', 3),
  (6, 'Product roadmap review', 'Jessica Chen', 4),
  (7, 'Marketing campaign planning', 'Max Brown', 2),
  (7, 'Product development update', 'Lily Johnson', 3),
  (7, 'Budget review', 'Jake Davis', 4),
  (8, 'Hiring interviews', 'Sophie Wilson', 2),
  (8, 'Performance reviews', 'Nate Lee', 3),
  (8, 'Operations review', 'Emma Smith', 4),
  (9, 'New product launch planning', 'Jenny Lee', 2),
  (9, 'Vendor negotiations', 'John Kim', 3),
  (9, 'Customer outreach planning', 'Emily Smith', 4),
  (10, 'Strategic planning session', 'Harry Brown', 2),
  (10, 'Financial review', 'Lucy Lee', 3),
  (10, 'Client meetings', 'Mia Johnson', 4),
  (11, 'Team building activity', 'Andrew Chen', 2),
  (11, 'Sales team meeting', 'Rachel Kim', 3),
  (11, 'Product roadmap review', 'Oliver Davis', 4),
  (12, 'Marketing campaign planning', 'Emma Wilson', 2),
  (12, 'Product development update', 'Sophia Lee', 3),
  (12, 'Budget review', 'Noah Smith', 4);
