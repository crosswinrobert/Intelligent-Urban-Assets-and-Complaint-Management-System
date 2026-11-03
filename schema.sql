-- =============================================================================
-- INTELLIGENT URBAN ASSETS AND COMPLAINT MANAGEMENT SYSTEM - DATABASE SCHEMA
-- =============================================================================

CREATE DATABASE IF NOT EXISTS complaintmanagementdb;
USE complaintmanagementdb;

-- -----------------------------------------------------------------------------
-- 1. BASE TABLES & ENTITIES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS department (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    head_of_dept VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaint_status (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    Status VARCHAR(50) NOT NULL,
    Note TEXT,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS asset (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,
    AssetType VARCHAR(100) NOT NULL,
    AssetName VARCHAR(100) NOT NULL,
    Lat DECIMAL(10,8),
    `Long` DECIMAL(11,8),
    InstallationDate DATE,
    OperationalStatus VARCHAR(50) DEFAULT 'Operational',
    HealthScore DECIMAL(5,2) CHECK (HealthScore BETWEEN 0 AND 100),
    LastMaintenanceDate DATE,
    Description TEXT,
    Embedding TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    Fname VARCHAR(50) NOT NULL,
    Lname VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(50) NOT NULL CHECK (Role IN ('Admin', 'Citizen', 'Staff')),
    Address VARCHAR(255),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES department(dept_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS user_phone (
    user_id INT NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, PhoneNumber),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS citizen (
    citizen_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    DateOfBirth DATE,
    EmergencyContact VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    Position VARCHAR(100),
    HireDate DATE,
    Salary DECIMAL(10,2) CHECK (Salary >= 0),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS complaint (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    RawDescription TEXT NOT NULL,
    Category VARCHAR(100) NOT NULL,
    Lat DECIMAL(10,8),
    `Long` DECIMAL(11,8),
    UrgencyScore DECIMAL(5,2) DEFAULT 1.00 CHECK (UrgencyScore BETWEEN 1.00 AND 5.00),
    PhotoURL VARCHAR(500),
    Embedding TEXT,
    SubmittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    ResolvedAt DATETIME NULL,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    asset_id INT NULL,
    status_id INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES asset(asset_id) ON DELETE SET NULL,
    FOREIGN KEY (status_id) REFERENCES complaint_status(status_id)
);

CREATE TABLE IF NOT EXISTS complaint_assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    staff_id INT NOT NULL,
    AssignedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CompletedAt DATETIME NULL,
    FOREIGN KEY (complaint_id) REFERENCES complaint(complaint_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- 2. SEED INITIAL DATA (SAFE RE-RUNNABLE INSERTS)
-- -----------------------------------------------------------------------------

INSERT IGNORE INTO department (dept_name, description, head_of_dept) VALUES 
('Public Works', 'Handles roads, bridges, and infrastructure', 'Dr. Aris Thorne'),
('Water & Sanitation', 'Manages municipal water supply and drainage', 'Sarah Connor');

INSERT IGNORE INTO complaint_status (status_id, Status, Note) VALUES 
(1, 'Open', 'Complaint logged and pending initial review'),
(2, 'In Progress', 'Assigned to field worker and work underway'),
(3, 'Resolved', 'Work completed and verified'),
(4, 'Rejected', 'Invalid or duplicate complaint');

INSERT IGNORE INTO asset (AssetType, AssetName, Lat, `Long`, OperationalStatus, HealthScore) VALUES 
('Water Pipe', 'Main Water Line - Block B', 12.97159870, 77.59456270, 'Operational', 85.00),
('Streetlight', 'LED Pole #402', 12.97200000, 77.59500000, 'Malfunctioning', 40.00);

INSERT IGNORE INTO user (Fname, Lname, Email, PasswordHash, Role, Address, dept_id) VALUES 
('Alice', 'Admin', 'admin@city.gov', 'hash_admin_123', 'Admin', 'City Hall', 1),
('Bob', 'Citizen', 'bob@gmail.com', 'hash_bob_123', 'Citizen', '123 Main St', NULL),
('Charlie', 'Worker', 'charlie@city.gov', 'hash_charlie_123', 'Staff', 'Municipal Depot', 1);

INSERT IGNORE INTO citizen (user_id, DateOfBirth, EmergencyContact) VALUES 
(2, '1992-05-14', '+19876543210');

INSERT IGNORE INTO staff (user_id, Position, HireDate, Salary) VALUES 
(3, 'Senior Technician', '2021-03-15', 55000.00);

INSERT IGNORE INTO complaint (RawDescription, Category, Lat, `Long`, UrgencyScore, user_id, asset_id, status_id) VALUES 
('Water leaking heavily from main line pipe near Block B entrance', 'Water Leak', 12.97159870, 77.59456270, 4.50, 2, 1, 1);

-- -----------------------------------------------------------------------------
-- 3. VIEWS
-- -----------------------------------------------------------------------------

CREATE OR REPLACE VIEW vw_department_workload AS
SELECT 
    d.dept_id,
    d.dept_name,
    COUNT(DISTINCT s.staff_id) AS total_staff,
    COUNT(DISTINCT c.complaint_id) AS total_assigned_complaints,
    SUM(CASE WHEN cs.Status = 'In Progress' THEN 1 ELSE 0 END) AS pending_complaints,
    SUM(CASE WHEN cs.Status = 'Resolved' THEN 1 ELSE 0 END) AS resolved_complaints
FROM department d
LEFT JOIN user u ON d.dept_id = u.dept_id
LEFT JOIN staff s ON u.user_id = s.user_id
LEFT JOIN complaint_assignments ca ON s.staff_id = ca.staff_id
LEFT JOIN complaint c ON ca.complaint_id = c.complaint_id
LEFT JOIN complaint_status cs ON c.status_id = cs.status_id
GROUP BY d.dept_id, d.dept_name;

-- -----------------------------------------------------------------------------
-- 4. STORED PROCEDURES & FUNCTIONS
-- -----------------------------------------------------------------------------

DELIMITER //

CREATE PROCEDURE sp_assign_worker(
    IN p_complaint_id INT,
    IN p_staff_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
    
    INSERT INTO complaint_assignments (complaint_id, staff_id, AssignedAt)
    VALUES (p_complaint_id, p_staff_id, NOW());
    
    UPDATE complaint 
    SET status_id = 2 
    WHERE complaint_id = p_complaint_id;

    COMMIT;
END //

CREATE PROCEDURE sp_resolve_complaint(
    IN p_complaint_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE complaint
    SET status_id = 3, ResolvedAt = NOW()
    WHERE complaint_id = p_complaint_id;

    UPDATE complaint_assignments
    SET CompletedAt = NOW()
    WHERE complaint_id = p_complaint_id AND CompletedAt IS NULL;

    COMMIT;
END //

CREATE FUNCTION fn_calculate_resolution_time(
    p_submitted DATETIME,
    p_resolved DATETIME
) 
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    IF p_resolved IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN ROUND(TIMESTAMPDIFF(MINUTE, p_submitted, p_resolved) / 60.0, 2);
END //

DELIMITER ;

-- -----------------------------------------------------------------------------
-- 5. TRIGGERS
-- -----------------------------------------------------------------------------

DELIMITER //

CREATE TRIGGER trg_complaint_updated_timestamp
BEFORE UPDATE ON complaint
FOR EACH ROW
BEGIN
    SET NEW.UpdatedAt = CURRENT_TIMESTAMP;
END //

DELIMITER ;

-- -----------------------------------------------------------------------------
-- 6. INDEXES
-- -----------------------------------------------------------------------------

CREATE INDEX idx_complaint_user ON complaint(user_id);
CREATE INDEX idx_complaint_status ON complaint(status_id);
CREATE INDEX idx_complaint_asset ON complaint(asset_id);
CREATE INDEX idx_user_email ON user(Email);
CREATE INDEX idx_assignment_lookup ON complaint_assignments(complaint_id, staff_id);
