# Professional Software Development Lifecycle (SDLC) Guide

## 1. Introduction
This document outlines the professional workflow we will follow to modernize MelodyHub. In a real-world enterprise environment, coding is only ~30% of the work. The rest is planning, designing, documenting, and testing. This process ensures scalability, maintainability, and alignment with business goals.

## 2. Roles & Responsibilities (The "Hats" You Will Wear)

In this project simulation, we will explicitly switch between these roles:

| Role | Focus | Key Deliverables |
|------|-------|------------------|
| **Product Manager (PM)** | *What* are we building? *Why*? (Business Value) | PRD (Product Requirements Doc), User Stories, Roadmap |
| **System Architect** | *How* will it be built? (Scalability, Tech Stack) | ADRs (Arch. Decision Records), System Diagrams, Schema Design |
| **Project Manager** | *When* will it be done? (Timeline, Risks) | Sprint Plan, Task Breakdown (Jira/Linear style) |
| **Backend Engineer** | API Logic, Database, Performance | API Spec (OpenAPI), Server Code, Migrations |
| **Frontend Engineer** | UI/UX, State Management, Interactivity | Component Design, Client Code, Responsive Layouts |
| **QA Engineer** | Quality, Bugs, Stability | Test Plans, Unit/Integration/E2E Tests |
| **DevOps Engineer** | Deployment, Infrastructure, CI/CD | Dockerfiles, CI Pipelines, Cloud Architecture |

## 3. The Modernization Workflow

We will proceed through these standard SDLC phases:

### Phase 1: Inception & Planning (PM/Project Manager)
-   **Goal**: Define the scope of "Modernization".
-   **Output**: 
    -   `02_PRD_REQUIREMENTS.md`: The "Source of Truth" for features.
    -   `03_BUSINESS_VALUE.md`: Why does this product exist? (Revenue/Engagement model).

### Phase 2: System Design (Architect)
-   **Goal**: Make high-level technical decisions before writing code.
-   **Output**:
    -   `04_ARCHITECTURE_DECISIONS.md`: Why Node? Why Mongo? Why React? (Pros/Cons).
    -   `05_SYSTEM_DESIGN.md`: Data flow, Component diagrams.

### Phase 3: Implementation (SWE - Backend/Frontend)
-   **Goal**: Write clean, testable code based on the design.
-   **Activity**: Coding (TypeScript migration, React updates).
-   **Documentation**: Inline code comments, API documentation (Swagger/Postman).

### Phase 4: Quality Assurance (QA)
-   **Goal**: Ensure nothing breaks.
-   **Activity**: Writing Jest tests (Backend) and Vitest tests (Frontend).
-   **Output**: `06_TEST_STRATEGY.md`.

### Phase 5: Deployment & Operations (DevOps)
-   **Goal**: Get it to production.
-   **Activity**: Docker, CI/CD pipelines.
-   **Output**: `07_DEPLOYMENT_GUIDE.md`.

---

## 4. Current Status
We are currently transitioning from **Phase 3 (Implementation)** back to **Phase 1 & 2** to retroactively document and validate our choices, ensuring a solid foundation for future features.
