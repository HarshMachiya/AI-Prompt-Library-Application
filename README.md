# 🚀 AI Prompt Library Application

A premium full-stack library management system for AI Image Generation Prompts.

## ✨ Features
- **Modern UI**: Glassmorphism design with a responsive layout.
- **Prompt Gallery**: List and filter prompts by complexity.
- **Real-time Counter**: Redis-backed view counter for each prompt.
- **Reactive Forms**: Secure prompt creation with instant validation.
- **Dockerized**: Entire stack orchestratable with a single command.

## 🛠 Tech Stack
- **Frontend**: Angular 14+ (Standalone components, Reactive Forms)
- **Backend**: Python (Django - using functional `JsonResponse` views)
- **Database**: PostgreSQL (Permanent storage)
- **Cache**: Redis (Source of truth for view counts)
- **DevOps**: Docker & Docker Compose

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose installed.

### Installation
1. Clone the repository.
2. Run the application:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - **Frontend**: [http://localhost:4200](http://localhost:4200)
   - **Backend API**: [http://localhost:8000/api/prompts/](http://localhost:8000/api/prompts/)

## 🏗 Architectural Decisions

### Backend: Plain Django vs DRF
As per the requirements, this project uses standard Django functional views returning `JsonResponse`. This ensures minimal overhead and demonstrates a core understanding of Django's request-response lifecycle without relying on external libraries like DRF.

### Redis for View Counts
Redis is used as the primary store for view counts to ensure high-performance increments. Each time a detail view is requested via the API, the Redis `INCR` command is called, and the resulting value is returned in the API response.

### Frontend: Angular Standalone Architecture
The application uses the latest Angular standalone component feature, which simplifies the module structure while maintaining component isolation and reusability.

### DevOps: Containerization
The `docker-compose.yml` file uses a custom `start.sh` script for the backend to ensure PostgreSQL is ready before applying migrations and starting the server. This prevents race conditions during the initial boot.

## 📸 Screenshots

