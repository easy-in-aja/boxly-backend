# 🚀 Bloxly - Community Platform for Roblox Players 

## 📋 Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Workspace Management](#workspace-management)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Service Architecture](#service-architecture)
- [Commands Reference](#commands-reference)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

Bloxly adalah platform komunitas yang dibangun dengan **Microservices Architecture** menggunakan Express.js. Project ini menggunakan **npm workspaces** untuk mengelola multiple services dalam satu repository (monorepo) dengan fitur lengkap termasuk **Community** dan **Notification** systems.

### 🏗️ Architecture Pattern
- **Clean Architecture** - Separation of concerns yang jelas
- **Domain-Driven Design (DDD)** - Setiap service memiliki domain yang spesifik
- **Microservices** - Services yang dapat di-deploy secara independen
- **API Gateway** - Entry point untuk semua requests

### ✨ **Key Features**
- **🔐 Authentication & Authorization** - JWT-based auth dengan refresh tokens
- **👤 User Management** - Profile management, follow/unfollow system
- **📝 Content Management** - Post creation, editing, deletion
- **💬 Comment System** - Nested comments dengan replies
- **❤️ Like/Reaction System** - Like posts dan comments
- **🏘️ Community System** - Create dan join communities
- **🔔 Real-time Notifications** - Push notifications untuk semua activities
- **📰 Smart Feed** - Personalized timeline dengan algoritma cerdas
- **🔍 Search & Discovery** - Search users, posts, dan communities

### 🛠️ **Technology Stack**
- **Backend:** Node.js, Express.js
- **Database:** MongoDB dengan Mongoose ODM
- **Authentication:** JWT, bcrypt
- **Realtime:** Socket.IO
- **Architecture:** Microservices dengan Clean Architecture
- **Workspace:** npm workspaces untuk monorepo management
- **Development:** Nodemon, Concurrently
- **Security:** Helmet, CORS, express-validator

## 📁 Project Structure

```
bloxly-backend/
├── 📦 node_modules/           # Shared dependencies (di root)
├── 📄 package.json            # Root workspace manager
├── 🌐 api-gateway/            # API Gateway (entry point)
├── 🔧 services/               # Microservices
│   ├── 🔐 auth-service/       # Authentication & Authorization
│   ├── 👤 user-service/       # User profile management
│   ├── 📝 post-service/       # Content management
│   ├── 💬 comment-service/    # Comment system
│   ├── ❤️ like-service/       # Like/Reaction system
│   ├── 🏘️ community-service/  # Community management
│   ├── 🔔 notification-service/ # Real-time notifications
│   └── 📰 feed-service/       # Timeline/Feed aggregation
├── 🔄 shared/                 # Shared utilities & types
└── 📚 docs/                   # Documentation
    ├── USE-CASES-IMPROVED.md  # Detailed use cases
    └── DATABASE-ARCHITECTURE.md # Database design
```

### 🎯 Service Responsibilities

| Service | Port | Responsibility |
|---------|------|----------------|
| **API Gateway** | 3000 | Request routing, authentication, rate limiting |
| **Auth Service** | 3001 | Login, register, JWT token management |
| **User Service** | 3002 | User profiles, following system |
| **Post Service** | 3003 | Content management, post CRUD |
| **Comment Service** | 3004 | Comment CRUD operations |
| **Like Service** | 3005 | Like/reaction management |
| **Community Service** | 3006 | Community management, groups |
| **Notification Service** | 3007 | Real-time notifications |
| **Feed Service** | 3008 | Timeline aggregation, content discovery |

## 🔧 Workspace Management

### 🎯 What is Workspace Management?

Workspace management memungkinkan kita mengelola **multiple packages/services** dalam **satu repository** dengan cara yang efisien:

- ✅ **Shared Dependencies** - Dependencies yang sama tidak di-duplicate
- ✅ **Faster Development** - Install dependencies sekali untuk semua service
- ✅ **Consistent Versions** - Semua service menggunakan versi yang sama
- ✅ **Easy Management** - Update dependencies untuk semua service sekaligus

### 📦 How Dependencies Work

```
Root node_modules/          # Semua dependencies di sini
├── express/                # Shared by all services
├── mongoose/               # Shared by all services
├── jsonwebtoken/           # Shared by all services
└── ...

Each Service/
├── src/                    # Service code
└── package.json            # Dependencies resolved to root node_modules
```

## 🚀 Getting Started

### 1. **Prerequisites**
```bash
# Node.js version
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 8.0.0
```

### 2. **Installation**
```bash
# Clone repository
git clone <repository-url>
cd boxly-boiler

# Install all dependencies (for all services)
npm install

# Verify workspace setup
npm ls --workspaces
```

### 3. **Environment Setup**
```bash
# Copy environment files for each service
cp services/auth-service/.env.example services/auth-service/.env
cp services/user-service/.env.example services/user-service/.env
cp services/post-service/.env.example services/post-service/.env
cp services/comment-service/.env.example services/comment-service/.env
cp services/like-service/.env.example services/like-service/.env
cp services/community-service/.env.example services/community-service/.env
cp services/notification-service/.env.example services/notification-service/.env
cp services/feed-service/.env.example services/feed-service/.env
cp api-gateway/.env.example api-gateway/.env
```

### 4. **Database Setup**
```bash
# Start MongoDB (if using local)
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 💻 Development Workflow

### 🎯 **Running All Services**
```bash
# Development mode (all services)
npm run dev

# Production mode (all services)
npm run start
```

### 🎯 **Running Specific Service**
```bash
# Development mode
npm run dev:auth         # Auth service only
npm run dev:user         # User service only
npm run dev:post         # Post service only
npm run dev:comment      # Comment service only
npm run dev:like         # Like service only
npm run dev:community    # Community service only
npm run dev:notification # Notification service only
npm run dev:feed         # Feed service only
npm run dev:gateway      # API Gateway only

# Production mode
npm run start:auth
npm run start:user
npm run start:post
npm run start:comment
npm run start:like
npm run start:community
npm run start:notification
npm run start:feed
npm run start:gateway
```

### 🎯 **Development Commands**
```bash
# Install new dependency for specific service
npm install express-validator --workspace=auth-service

# Install dependency for all services
npm install lodash --workspaces

# Run tests for all services
npm run test

# Run linting for all services
npm run lint

# Build all services
npm run build
```

## 🏗️ Service Architecture

### 📋 **Clean Architecture Layers**

Setiap service mengikuti pola Clean Architecture:

```
src/
├── 📁 controllers/     # HTTP request handling
├── 📁 services/        # Business logic
├── 📁 repositories/    # Data access layer
├── 📁 usecases/        # Application-specific business rules
├── 📁 models/          # Data models/entities
├── 📁 middlewares/     # Cross-cutting concerns
├── 📁 routes/          # Route definitions
├── 📁 config/          # Configuration management
├── 📁 utils/           # Helper functions
└── 📄 index.js         # Service entry point
```

### 🔄 **Service Communication**

Services berkomunikasi melalui:

1. **HTTP REST API** - Synchronous communication
2. **Message Queue** - Asynchronous communication (Redis/RabbitMQ)
3. **Event-Driven** - Pub/Sub pattern

### 📊 **Data Flow Example**

```
User Request → API Gateway → Auth Service (validate token)
                ↓
            Route to specific service (User/Post/Comment/Like/Community/Notification/Feed)
                ↓
            Service processes request
                ↓
            Return response to API Gateway
                ↓
            Return response to user
```

### 🌐 **API Endpoints Overview**

| Service | Base URL | Key Endpoints |
|---------|----------|---------------|
| **Auth** | `/api/auth` | `/register`, `/login`, `/refresh`, `/logout` |
| **Users** | `/api/users` | `/:userId`, `/:userId/follow`, `/search` |
| **Posts** | `/api/posts` | `/`, `/:postId`, `/user/:userId` |
| **Comments** | `/api/comments` | `/`, `/:commentId`, `?postId=:id` |
| **Likes** | `/api/likes` | `/toggle`, `/count`, `/user/:userId` |
| **Communities** | `/api/communities` | `/`, `/:id`, `/:id/join`, `/search` |
| **Notifications** | `/api/notifications` | `/`, `/:id/read`, `/settings` |
| **Feed** | `/api/feed` | `/`, `/explore`, `/search` |

## 📚 Commands Reference

### 🎯 **Root Level Commands**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services in development mode |
| `npm run start` | Start all services in production mode |
| `npm run build` | Build all services |
| `npm run test` | Run tests for all services |
| `npm run lint` | Run linting for all services |
| `npm run clean` | Clean all node_modules |

### 🎯 **Service-Specific Commands**

| Command | Description |
|---------|-------------|
| `npm run dev:auth` | Start auth service only |
| `npm run dev:user` | Start user service only |
| `npm run dev:post` | Start post service only |
| `npm run dev:comment` | Start comment service only |
| `npm run dev:like` | Start like service only |
| `npm run dev:community` | Start community service only |
| `npm run dev:notification` | Start notification service only |
| `npm run dev:feed` | Start feed service only |
| `npm run dev:gateway` | Start API Gateway only |

### 🎯 **Dependency Management**

| Command | Description |
|---------|-------------|
| `npm install <package> --workspace=<service>` | Install package for specific service |
| `npm install <package> --workspaces` | Install package for all services |
| `npm update <package>` | Update package for all services |
| `npm uninstall <package> --workspaces` | Remove package from all services |

### 🎯 **Workspace Management**

| Command | Description |
|---------|-------------|
| `npm ls --workspaces` | List all workspaces |
| `npm run <script> --workspaces` | Run script in all workspaces |
| `npm run <script> --workspace=<service>` | Run script in specific workspace |

## 🐛 Troubleshooting

### ❌ **Common Issues**

#### 1. **"Missing script: dev" Error**
```bash
# Solution: Install dependencies first
npm install

# Then check available scripts
npm run
```

#### 2. **Service Cannot Require Dependencies**
```bash
# Check if node_modules exists in root
ls -la node_modules

# Reinstall if missing
rm -rf node_modules package-lock.json
npm install
```

#### 3. **Port Already in Use**
```bash
# Check which process is using the port
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or change port in service .env file
```

#### 4. **Workspace Not Detected**
```bash
# Check workspace configuration
cat package.json | grep workspaces

# Verify service has package.json
ls services/*/package.json
```

### 🔧 **Debug Commands**

```bash
# Check workspace status
npm ls --workspaces

# Check service dependencies
npm ls --workspace=auth-service

# Check global npm configuration
npm config list

# Check Node.js version
node --version
npm --version
```

### 🚨 **Reset Everything**

```bash
# Nuclear option - reset everything
rm -rf node_modules package-lock.json
rm -rf services/*/node_modules
rm -rf api-gateway/node_modules
rm -rf shared/node_modules

# Reinstall everything
npm install
```

## 📖 **Best Practices**

### ✅ **Do's**
- Always run `npm install` from root directory
- Use workspace-specific commands for individual services
- Keep dependencies consistent across services
- Use environment variables for configuration
- Follow Clean Architecture patterns

### ❌ **Don'ts**
- Don't install dependencies in individual service directories
- Don't modify node_modules manually
- Don't commit node_modules to git
- Don't use different versions of same dependency across services

## 🤝 **Team Collaboration**

### 👥 **Working with Multiple Developers**

1. **Always pull latest changes** before starting development
2. **Run `npm install`** after pulling changes
3. **Use consistent Node.js version** (specified in .nvmrc)
4. **Follow naming conventions** for branches and commits
5. **Test your changes** before pushing

### 🔄 **Git Workflow**

```bash
# Before starting work
git pull origin main
npm install

# After making changes
npm run test
npm run lint
git add .
git commit -m "feat: add new feature"
git push origin feature-branch
```

## 📚 **Documentation**

### 📖 **Available Documentation**
- **[USE-CASES-IMPROVED.md](docs/USE-CASES-IMPROVED.md)** - Detailed use cases untuk semua services
- **[DATABASE-ARCHITECTURE.md](docs/DATABASE-ARCHITECTURE.md)** - Database design dan schema
- **[WORKSPACE_GUIDE.md](WORKSPACE_GUIDE.md)** - Workspace management guide

### 🔧 **Quick Start Guide**
1. **Setup Environment** - Copy `.env.example` files
2. **Start Database** - Run MongoDB instance
3. **Install Dependencies** - `npm install`
4. **Start Services** - `npm run dev`
5. **Test API** - Use provided endpoints

### 🧪 **Testing**
```bash
# Run all tests
npm run test

# Run specific service tests
npm run test --workspace=auth-service

# Run with coverage
npm run test:coverage
```

## 📞 **Support**

Jika mengalami masalah:

1. **Check this guide** untuk solusi umum
2. **Check troubleshooting section** di atas
3. **Check documentation** di folder `docs/`
4. **Ask team members** di Slack/Discord
5. **Create issue** di repository jika bug

---

## 📊 **Project Status**

### ✅ **Completed**
- [x] Project structure setup
- [x] Workspace configuration
- [x] Service architecture design
- [x] Database schema design
- [x] API documentation
- [x] Use cases documentation

### 🚧 **In Progress**
- [ ] Service implementation
- [ ] Database models
- [ ] API endpoints
- [ ] Authentication system
- [ ] Testing suite

### 📋 **Planned**
- [ ] Frontend integration
- [ ] Real-time features
- [ ] Performance optimization
- [ ] Deployment configuration
- [ ] Monitoring & logging

### 🎯 **Current Version**
- **Version:** 2.0.0
- **Status:** Development Phase
- **Last Updated:** $(date)

---

**Happy Coding! 🚀**

*Last updated: $(date)*
