# Urban Pulse
### Intelligent Urban Assets and Complaint Management System

A database-driven urban infrastructure management platform that connects citizens, municipal administrators and field staff through centralized complaint reporting, asset monitoring, task assignment and intelligent complaint similarity detection.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Objectives](#2-objectives)
3. [Key Features](#3-key-features)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Database Architecture](#6-database-architecture)
7. [Installation and Setup](#7-installation-and-setup)
8. [Environment Configuration](#8-environment-configuration)
9. [Running the Application](#9-running-the-application)
10. [Application Usage Guide](#10-application-usage-guide)
11. [Intelligent Complaint Similarity Search](#11-intelligent-complaint-similarity-search)
12. [Database Features](#12-database-features)
13. [Testing and Verification](#13-testing-and-verification)
14. [Troubleshooting](#14-troubleshooting)
15. [Project Structure](#15-project-structure)
16. [Academic Context](#16-academic-context)

---

# 1. Project Overview

Urban infrastructure issues such as damaged roads, malfunctioning streetlights, water pipeline leaks, blocked drainage systems and waste management problems require an organized reporting and resolution process.

Traditional complaint management methods can result in scattered records, delayed communication, inefficient task allocation and difficulties identifying duplicate complaints.

**Urban Pulse** addresses these challenges through a centralized web-based platform that enables citizens to report infrastructure-related problems, administrators to manage complaints and assign work, and municipal staff to handle assigned tasks.

The system combines a relational database with a vector database to support both structured data management and semantic similarity search.

MySQL maintains structured information about users, departments, assets, complaints and assignments. ChromaDB stores vector embeddings generated from complaint descriptions, allowing the application to identify potentially similar complaints even when different words are used to describe the same issue.

# 2. Objectives

- Centralize urban infrastructure asset information.
- Allow citizens to register and track infrastructure complaints.
- Enable administrators to manage complaints and assign them to appropriate staff members.
- Support department-based complaint management.
- Allow staff members to view assigned tasks and update complaint progress.
- Maintain complaint status and resolution records.
- Identify potentially duplicate or related complaints using semantic similarity search.
- Improve transparency, accountability and efficiency in urban service management.

# 3. Key Features

### Citizen Module
- Citizen account registration and login.
- Submit infrastructure-related complaints.
- Provide complaint descriptions, categories and location information.
- Track submitted complaints and their current status.

### Administrator Module
- Centralized complaint management.
- Monitor complaint statistics and progress.
- Manage users, departments and urban assets.
- Assign complaints to appropriate staff members.
- Monitor assignments and complaint resolution.

### Staff Module
- Staff account login.
- View assigned complaints.
- Access complaint details.
- Update complaint progress and resolution status.

### Urban Asset Management
- Maintain records of infrastructure assets.
- Store asset categories, names and geographical coordinates.
- Track operational status and health scores.
- Maintain maintenance-related information.

### Intelligent Complaint Search
- Generate embeddings from complaint descriptions.
- Store embeddings in ChromaDB.
- Perform semantic similarity searches.
- Identify potentially related or duplicate complaints.

### Database Management
- Relational database with primary and foreign key constraints.
- Stored procedures for complaint assignment and resolution.
- Function for calculating complaint resolution time.
- Trigger for automatic timestamp maintenance.
- Database view for department workload information.

# 4. Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js 16 |
| Application Backend | Next.js API Routes |
| Programming Language | JavaScript / TypeScript |
| Styling | Tailwind CSS |
| Relational Database | MySQL 8.0 |
| Vector Database | ChromaDB |
| Embedding Library | @xenova/transformers |
| Embedding Model | Xenova/all-MiniLM-L6-v2 |
| Vector Dimension | 384 |
| Vector Similarity Metric | Cosine |
| Development Environment | Windows and Kali Linux |
| Virtualization | Oracle VirtualBox |
| Version Control | Git and GitHub |

# 5. System Architecture

Urban Pulse uses a hybrid database architecture consisting of a relational database and a vector database.

### 5.1 Application Layer

The Next.js application provides the user interface and application API routes.

It supports role-based workflows for citizens, administrators and municipal staff.

### 5.2 Relational Database Layer

MySQL stores structured application data, including:

- User accounts and roles.
- Department information.
- Staff and citizen details.
- Urban infrastructure assets.
- Complaint records.
- Complaint assignments.
- Complaint statuses.

### 5.3 Vector Database Layer

ChromaDB stores vector representations of complaint descriptions.

The application uses the `Xenova/all-MiniLM-L6-v2` model to generate 384-dimensional embeddings.

These embeddings are used to retrieve semantically similar complaints.

### 5.4 Architecture Overview

```text
             CITIZEN / ADMIN / STAFF
                       |
                       v
              NEXT.JS APPLICATION
                 Frontend + API
                       |
             +---------+---------+
             |                   |
             v                   v
        MYSQL DATABASE       EMBEDDING MODEL
             |              all-MiniLM-L6-v2
             |                   |
             |                   v
             |               CHROMADB
             |                   |
             +---------+---------+
                       |
                       v
              URBAN PULSE SYSTEM
```

MySQL handles structured records and relationships, while ChromaDB supports semantic retrieval of complaint descriptions.

# 6. Database Architecture

Urban Pulse uses MySQL as its primary relational database.

**Database name:** `complaintmanagementdb`

The database consists of nine tables.

| No. | Table | Purpose |
|---:|---|---|
| 1 | `department` | Stores municipal department information |
| 2 | `user` | Stores common user information and login details |
| 3 | `user_phone` | Stores phone numbers associated with users |
| 4 | `citizen` | Stores additional citizen information |
| 5 | `staff` | Stores municipal staff information |
| 6 | `asset` | Stores urban infrastructure asset information |
| 7 | `complaint` | Stores citizen complaints and related information |
| 8 | `complaint_status` | Maintains complaint status information |
| 9 | `complaint_assignments` | Records complaint-to-staff assignments |

### 6.1 Entity Relationships

The database uses primary keys and foreign keys to maintain referential integrity.

Important relationships include:

- A department can be associated with multiple users.
- A user can have multiple phone numbers.
- A user can have an associated citizen or staff record.
- A user can submit multiple complaints.
- An asset can be associated with multiple complaints.
- Each complaint references a complaint status.
- A complaint can have multiple assignment records.
- A staff member can be assigned multiple complaints.

### 6.2 Complaint Statuses

| Status ID | Status |
|---:|---|
| 1 | Open |
| 2 | In Progress |
| 3 | Resolved |
| 4 | Rejected |

# 7. Installation and Setup

This section describes the development environment and the steps required to run Urban Pulse.

## 7.1 Prerequisites

Install the following software before proceeding.

| Software | Purpose |
|---|---|
| Node.js and npm | Run the Next.js application |
| Git | Clone the project repository |
| MySQL Server 8.0 | Relational database |
| MySQL Workbench | Database administration |
| Oracle VirtualBox | Run the Kali Linux virtual machine |
| Kali Linux | Host the ChromaDB server |
| Python | Support the ChromaDB environment |

Also ensure that the project repository is accessible.

## 7.2 Clone the Repository

Open a terminal or PowerShell window.

```bash
git clone https://github.com/crosswinrobert/Intelligent-Urban-Assets-and-Complaint-Management-System.git
```

Navigate into the project directory:

```bash
cd Intelligent-Urban-Assets-and-Complaint-Management-System
```

## 7.3 Install Application Dependencies

Install the Node.js dependencies:

```bash
npm install
```

This installs the packages declared in the project's `package.json`.

## 7.4 MySQL Database Setup

Ensure that MySQL Server 8.0 is installed and running.

Open MySQL Workbench or the MySQL command-line client.

Create the database if it does not already exist:

```sql
CREATE DATABASE complaintmanagementdb;
```

Select the database:

```sql
USE complaintmanagementdb;
```

Create the required nine tables and database objects using the SQL scripts supplied with the project.

If a database backup is supplied, it can be imported through MySQL Workbench or the MySQL command-line client.

Verify the database:

```sql
SHOW TABLES;
```

The database should contain the following tables:

```text
department
user
user_phone
citizen
staff
asset
complaint
complaint_status
complaint_assignments
```

Verify an individual table:

```sql
DESC complaint;
```

**Important:** The application requires the correct database schema, foreign key relationships, sample records and database routines. Use the project's actual SQL scripts or database backup rather than creating an incomplete schema manually.

# 8. Environment Configuration

The application requires configuration values to connect to its services.

1. Locate the project's `.env.example` file, if supplied.
2. Create a local `.env` file using the provided template.
3. Fill in the required values for the MySQL connection and other application services.
4. Configure the ChromaDB endpoint according to the application's existing configuration.

Use the actual variable names defined in the project source code.

Do not commit `.env` files, database passwords, API keys or other secrets to GitHub.

A safe `.gitignore` should exclude local environment files and other sensitive development data.

# 9. Running the Application

Urban Pulse uses MySQL and ChromaDB alongside the Next.js application.

Start the database services before launching the application.

## 9.1 Start MySQL

Ensure that the MySQL server is running.

Verify that the `complaintmanagementdb` database is accessible.

## 9.2 Start ChromaDB in Kali Linux

ChromaDB runs inside a Kali Linux virtual machine.

The project uses a dedicated virtual environment and persistent storage directory.

Open the Kali Linux terminal.

Activate the existing virtual environment:

```bash
source ~/chromadb-server/venv/bin/activate
```

Start the ChromaDB server:

```bash
chroma run --host 0.0.0.0 --port 8000 --path ~/chromadb-server/data
```

The server listens on port `8000`.

Keep the terminal open while using the application.

### Verify ChromaDB

Open another Kali Linux terminal and execute:

```bash
curl http://127.0.0.1:8000/api/v2/heartbeat
```

A successful response confirms that the ChromaDB server is responding.

## 9.3 VirtualBox NAT Port Forwarding

Since ChromaDB runs inside Kali Linux while the Next.js application runs on Windows, VirtualBox NAT port forwarding is used to allow communication between the host and guest systems.

Configure the following port-forwarding rule in the VirtualBox network settings.

| Setting | Value |
|---|---|
| Protocol | TCP |
| Host IP | 127.0.0.1 |
| Host Port | 8000 |
| Guest IP | Blank, unless required by the VM configuration |
| Guest Port | 8000 |

The Windows host accesses ChromaDB through:

```text
http://127.0.0.1:8000
```

Verify connectivity from Windows PowerShell:

```powershell
curl.exe http://127.0.0.1:8000/api/v2/heartbeat
```

If a response is received, the host-to-guest connection is working.

## 9.4 Start the Next.js Application

Open a Windows PowerShell terminal.

Navigate to the project directory:

```powershell
cd C:\Users\cross\Projects\Intelligent-Urban-Assets-and-Complaint-Management-System
```

Start the development server:

```powershell
npm run dev
```

Open the application in a browser:

```text
http://localhost:3000
```

The application should now be accessible.

### Startup Order

For a complete development session, use this order:

1. Start the MySQL server.
2. Start the Kali Linux virtual machine.
3. Activate the ChromaDB virtual environment.
4. Start the ChromaDB server.
5. Verify ChromaDB connectivity from Windows.
6. Start the Next.js development server.
7. Open Urban Pulse in the browser.

# 10. Application Usage Guide

Urban Pulse supports three primary user roles.

## 10.1 Citizen Workflow

1. Open the Urban Pulse application.
2. Log in using citizen credentials or register a new account if registration is enabled.
3. Navigate to the complaint submission section.
4. Enter the complaint description.
5. Select the relevant complaint category.
6. Provide location information.
7. Enter urgency information and upload a photograph if supported by the form.
8. Submit the complaint.
9. Navigate to the complaint tracking section.
10. Monitor the complaint status.

A submitted complaint is stored in the MySQL `complaint` table.

## 10.2 Administrator Workflow

1. Log in using administrator credentials.
2. Open the administrator dashboard.
3. Navigate to complaint management.
4. View complaints submitted by citizens.
5. Inspect complaint details, categories, urgency and location.
6. Select a complaint for assignment.
7. Choose an appropriate staff member.
8. Confirm the assignment.
9. Monitor the complaint status and assignment progress.

The assignment is recorded in the `complaint_assignments` table.

The complaint status is updated to In Progress when the assignment procedure is executed successfully.

## 10.3 Staff Workflow

1. Log in using staff credentials.
2. Open the staff dashboard.
3. Navigate to assigned complaints.
4. View the complaints assigned to the staff member.
5. Open a complaint to inspect its details.
6. Perform the required maintenance activity.
7. Update the complaint status through the available workflow.
8. Complete the assigned task.

The complaint and assignment records are maintained in MySQL.

## 10.4 Complaint Resolution

The system includes a stored procedure for resolving complaints.

When executed successfully, it:

- Changes the complaint status to Resolved.
- Records the resolution timestamp.
- Updates the completion timestamp of associated incomplete assignments.

The corresponding database procedure is `sp_resolve_complaint`.

# 11. Intelligent Complaint Similarity Search

Urban Pulse integrates semantic similarity search to identify complaints that may describe the same or related infrastructure issue.

Traditional keyword matching can fail when two citizens describe the same issue using different words.

For example:

**Complaint A:**

"A large pothole has developed near Sector 4 junction."

**Complaint B:**

"Vehicles are struggling to pass because of a large hole in the road."

Although the wording differs, both complaints describe a similar road damage problem.

## 11.1 Embedding Generation

The application uses:

```text
Xenova/all-MiniLM-L6-v2
```

The model converts complaint descriptions into numerical vector representations.

Each embedding contains 384 dimensions.

The embedding generation process uses mean pooling and normalization.

## 11.2 ChromaDB Integration

The generated embeddings are stored in the ChromaDB collection:

```text
urban_complaints
```

The collection uses cosine similarity for vector retrieval.

## 11.3 Similarity Search Workflow

```text
       COMPLAINT DESCRIPTION
                 |
                 v
          EMBEDDING MODEL
                 |
                 v
       384-D VECTOR EMBEDDING
                 |
                 v
             CHROMADB
                 |
                 v
        COSINE SIMILARITY
                 |
                 v
       RELATED COMPLAINTS
```

The application can retrieve previously submitted complaints with similar semantic meanings.

Similarity scores indicate how closely two vector representations match. They should not be interpreted as probabilities that complaints are duplicates.

# 12. Database Features

Urban Pulse demonstrates advanced SQL and database programming concepts.

## 12.1 Stored Procedures

### `sp_assign_worker`

Assigns a complaint to a staff member.

Operations:

- Inserts a record into `complaint_assignments`.
- Updates the complaint status to In Progress.
- Uses a transaction to maintain consistency.

### `sp_resolve_complaint`

Resolves a complaint.

Operations:

- Updates the complaint status to Resolved.
- Sets the resolution timestamp.
- Updates incomplete assignment completion timestamps.
- Uses transaction handling and an exception handler.

## 12.2 Stored Function

### `fn_calculate_resolution_time`

Calculates the time taken to resolve a complaint.

The function:

- Accepts submission and resolution timestamps.
- Calculates the difference in minutes.
- Converts the duration into hours.
- Returns the result rounded to two decimal places.
- Returns `NULL` when the complaint has not been resolved.

## 12.3 Trigger

### `trg_complaint_updated_timestamp`

A `BEFORE UPDATE` trigger associated with the `complaint` table.

It automatically updates the `UpdatedAt` column using:

```sql
SET NEW.UpdatedAt = CURRENT_TIMESTAMP;
```

This maintains the last-modified timestamp whenever a complaint record is updated.

## 12.4 Database View

The project also includes:

```text
vw_department_workload
```

This view supports the retrieval of department workload information.

# 13. Testing and Verification

The following areas can be tested to verify the application.

| Test Area | Verification |
|---|---|
| Authentication | Verify citizen, administrator and staff login |
| Complaint Submission | Submit a new complaint |
| Complaint Tracking | Verify the complaint status |
| Staff Assignment | Assign a complaint to a staff member |
| Assignment Records | Verify records in `complaint_assignments` |
| Complaint Resolution | Verify the resolved status and timestamps |
| Database Trigger | Update a complaint and verify `UpdatedAt` |
| Stored Function | Calculate resolution time |
| Semantic Search | Search using descriptions similar to existing complaints |
| Vector Database | Verify stored embeddings and collection records |

### Useful MySQL Verification Queries

**View complaints:**

```sql
SELECT
    complaint_id,
    Category,
    UrgencyScore,
    SubmittedAt,
    ResolvedAt,
    user_id,
    asset_id,
    status_id
FROM complaint;
```

**View assignments:**

```sql
SELECT *
FROM complaint_assignments;
```

**View complaint statuses:**

```sql
SELECT
    c.complaint_id,
    c.Category,
    cs.Status,
    c.SubmittedAt,
    c.ResolvedAt
FROM complaint c
JOIN complaint_status cs
    ON c.status_id = cs.status_id;
```

**View departments:**

```sql
SELECT *
FROM department;
```

# 14. Troubleshooting

## 14.1 MySQL Connection Error

**Possible causes:**
- MySQL Server is not running.
- Incorrect database credentials.
- Incorrect database name.
- Incorrect connection configuration.

**Resolution:**
- Verify that MySQL Server is running.
- Confirm the database exists.
- Check the application's environment configuration.
- Verify the connection settings.

## 14.2 ChromaDB Connection Error

**Possible causes:**
- ChromaDB server is not running.
- Kali Linux virtual machine is powered off.
- Port forwarding is incorrectly configured.
- Port 8000 is already in use.

**Resolution:**

Activate the environment:

```bash
source ~/chromadb-server/venv/bin/activate
```

Start ChromaDB:

```bash
chroma run --host 0.0.0.0 --port 8000 --path ~/chromadb-server/data
```

Verify:

```bash
curl http://127.0.0.1:8000/api/v2/heartbeat
```

## 14.3 Port Already in Use

If port 8000 is occupied, identify the process using it.

```bash
sudo ss -ltnp | grep 8000
```

Stop the conflicting process only after confirming that it is safe to do so.

## 14.4 Application Does Not Start

Verify that dependencies are installed:

```bash
npm install
```

Start the development server again:

```bash
npm run dev
```

Inspect the terminal output for application errors.

## 14.5 Semantic Search Does Not Return Results

Check the following:

- ChromaDB server is running.
- The `urban_complaints` collection exists.
- Complaint embeddings have been generated.
- The embedding model is available.
- The application is connecting to the correct ChromaDB endpoint.

# 15. Project Structure

The repository contains the Next.js application, database integration, intelligent search functionality and supporting project resources.

To inspect the current repository structure, use:

```bash
tree -I 'node_modules|.next|.git'
```

The exact folder structure may vary as development progresses.

# 16. Academic Context

**Project Title:** Intelligent Urban Assets and Complaint Management System

**Project Name:** Urban Pulse

**Domain:** Urban Infrastructure Management

**Course:** Database Management Systems

**Database Paradigms:** Relational Database and Vector Database

The project demonstrates the practical application of:

- Relational database design.
- Entity–Relationship modelling.
- ER-to-relational mapping.
- SQL DDL and DML operations.
- Aggregate and nested queries.
- Correlated subqueries.
- Stored procedures and functions.
- Database triggers.
- Transaction management.
- Foreign key constraints and referential integrity.
- Vector embeddings and semantic similarity search.

---

## Repository

GitHub: https://github.com/crosswinrobert/Intelligent-Urban-Assets-and-Complaint-Management-System

## Project Status

The project includes the MySQL relational database, Next.js application, ChromaDB integration and semantic complaint similarity functionality.

Further improvements and testing can extend the platform's capabilities.

---

**Urban Pulse — Making Urban Infrastructure Management Smarter.**
