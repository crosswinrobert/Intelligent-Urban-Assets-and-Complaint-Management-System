# Intelligent Urban Assets and Complaint Management System

An intelligent database-driven platform for managing urban infrastructure assets and citizen complaints. The system aims to improve transparency, accountability, and efficiency in urban service management through structured data management and vector-based semantic search.

## Project Overview

Urban infrastructure issues such as damaged roads, malfunctioning streetlights, water pipeline leaks, and drainage problems require an organized reporting and resolution process.

This project proposes a centralized platform where citizens can report infrastructure-related complaints, authorities can assign complaints to appropriate workers and departments, and administrators can monitor and approve resolutions.

The system combines a relational database with a vector database to support structured data management and intelligent complaint similarity detection.

## Objectives

- Centralize urban infrastructure asset information.
- Allow citizens to register and track complaints.
- Enable departments to assign complaints to responsible workers.
- Track complaint status and resolution progress.
- Allow administrators to review and approve resolutions.
- Identify potentially duplicate or similar complaints using vector similarity search.
- Improve transparency and accountability in complaint management.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js |
| Styling | Tailwind CSS |
| Backend | Python FastAPI (proposed) |
| Relational Database | MySQL 8.0 |
| Vector Database | ChromaDB |
| Embedding Model | Sentence Transformers (planned) |
| Version Control | Git and GitHub |

## Database Architecture

The project uses two database paradigms.

### 1. Relational Database — MySQL

MySQL manages structured and relational information, including:

- Citizens
- Departments
- Workers
- Urban assets
- Complaints
- Complaint-to-asset relationships
- Complaint-to-worker assignments
- Complaint status audit records
- Resolutions

### 2. Vector Database — ChromaDB

ChromaDB is intended to store vector embeddings generated from complaint descriptions.

Planned capabilities:

- Semantic search across complaint descriptions.
- Similar complaint identification.
- Potential duplicate complaint detection.
- Retrieval of historically related complaints.

## Core Modules

1. **Citizen Module** – Complaint registration and complaint tracking.
2. **Asset Management Module** – Management of urban infrastructure assets.
3. **Department Management Module** – Organization of departments and responsibilities.
4. **Worker Management Module** – Worker information and department assignments.
5. **Complaint Management Module** – Complaint assignment and status tracking.
6. **Resolution Management Module** – Resolution submission and administrative approval.
7. **Intelligent Search Module** – Vector-based similarity search for complaints.
8. **Admin Dashboard** – Monitoring and management of the overall system.

## Team Responsibilities

| Member | Primary Responsibility |
|---|---|
| Member 1 | Complete frontend development |
| Member 2 | SQL database development and backend |
| Both Members | Vector database implementation and integration |

Both members will participate in testing, integration, documentation, and final project evaluation.

## Project Structure

```text
Intelligent-Urban-Assets-and-Complaint-Management-System/
│
├── frontend/
├── backend/
│
├── database/
│   ├── mysql/
│   └── vector_db/
│
├── documentation/
│
├── README.md
├── .gitignore
└── .env.example
```

## Project Status

**Currently in development.**

The existing MySQL database and initial sample data have been prepared. Frontend development, backend implementation, vector database integration, and testing are planned development activities.

## Academic Context

This project is developed as part of a Database Management Systems (DBMS) course. It demonstrates the practical application of relational database design, SQL operations, advanced database concepts, and vector database technology.

---

**Project:** Intelligent Urban Assets and Complaint Management System  
**Domain:** Urban Infrastructure Management  
**Database Paradigms:** SQL + Vector Database
