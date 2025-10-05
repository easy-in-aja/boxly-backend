# 🔧 Workspace Management - Developer Guide

## 🎯 **Quick Start for New Developers**

### 1. **First Time Setup**
```bash
# Clone dan masuk ke project
git clone <repository-url>
cd bloxly-backend

# Install semua dependencies (sekali saja)
npm install

# Verify workspace setup
npm ls --workspaces
```

### 2. **Daily Development**
```bash
# Start semua service untuk development
npm run dev

# Atau start service tertentu
npm run dev:auth
```

## 📦 **Understanding Dependencies**

### 🎯 **Why Dependencies are in Root?**

```
bloxly-backend/
├── node_modules/          # ← SEMUA dependencies di sini
│   ├── express/           # Shared by all services
│   ├── mongoose/          # Shared by all services
│   ├── jsonwebtoken/      # Shared by all services
│   └── ...
├── services/
│   ├── auth-service/
│   │   ├── src/
│   │   └── package.json   # Dependencies resolved ke root
│   └── user-service/
│       ├── src/
│       └── package.json   # Dependencies resolved ke root
```

**Keuntungan:**
- ✅ Tidak ada duplikasi dependencies
- ✅ Install lebih cepat
- ✅ Konsistensi versi
- ✅ Hemat disk space

## 🚀 **Common Commands**

### 📋 **Development Commands**

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start ALL services (recommended) |
| `npm run dev:auth` | Start auth service only |
| `npm run dev:user` | Start user service only |
| `npm run dev:post` | Start post service only |
| `npm run dev:comment` | Start comment service only |
| `npm run dev:like` | Start like service only |
| `npm run dev:community` | Start community service only |
| `npm run dev:notification` | Start notification service only |
| `npm run dev:feed` | Start feed service only |
| `npm run dev:gateway` | Start API Gateway only |

### 📋 **Dependency Management**

| Command | What it does |
|---------|--------------|
| `npm install express --workspace=auth-service` | Install express hanya untuk auth-service |
| `npm install lodash --workspaces` | Install lodash untuk SEMUA services |
| `npm update express` | Update express di semua services |
| `npm uninstall old-package --workspaces` | Remove package dari semua services |

### 📋 **Utility Commands**

| Command | What it does |
|---------|--------------|
| `npm run test` | Run tests di semua services |
| `npm run lint` | Run linting di semua services |
| `npm run build` | Build semua services |
| `npm run clean` | Clean semua node_modules |
| `npm ls --workspaces` | List semua workspaces |

## 🔍 **How to Add New Service**

### 1. **Create Service Directory**
```bash
mkdir services/new-service
cd services/new-service
```

### 2. **Create package.json**
```json
{
  "name": "@bloxly/new-service",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^5.1.0",
    "mongoose": "^8.18.2"
  }
}
```

### 3. **Update Root package.json**
```json
{
  "workspaces": [
    "api-gateway",
    "services/*",
    "shared"
  ],
  "scripts": {
    "dev:new-service": "npm run dev --workspace=new-service"
  }
}
```

### 4. **Install Dependencies**
```bash
# Install dependencies untuk service baru
npm install

# Verify service terdeteksi
npm ls --workspaces
```

## 🐛 **Troubleshooting**

### ❌ **"Missing script: dev" Error**

**Problem:** Service tidak memiliki script "dev"

**Solution:**
```bash
# 1. Check available scripts
npm run --workspace=auth-service

# 2. If no scripts, add to package.json
# 3. Reinstall dependencies
npm install
```

### ❌ **Service Cannot Require Dependencies**

**Problem:** `Cannot find module 'express'`

**Solution:**
```bash
# 1. Check if node_modules exists in root
ls -la node_modules

# 2. Reinstall if missing
rm -rf node_modules package-lock.json
npm install

# 3. Check workspace detection
npm ls --workspaces
```

### ❌ **Port Already in Use**

**Problem:** `EADDRINUSE: address already in use :::3001`

**Solution:**
```bash
# 1. Find process using port
lsof -i :3001

# 2. Kill process
kill -9 <PID>

# 3. Or change port in .env file
PORT=3006
```

### ❌ **Workspace Not Detected**

**Problem:** Service tidak muncul di `npm ls --workspaces`

**Solution:**
```bash
# 1. Check workspace configuration
cat package.json | grep workspaces

# 2. Check service has package.json
ls services/*/package.json

# 3. Verify service name format
# Should be: @bloxly/service-name
```

## 🎯 **Best Practices**

### ✅ **Do's**

1. **Always install from root:**
   ```bash
   npm install  # ✅ Correct
   cd services/auth-service && npm install  # ❌ Wrong
   ```

2. **Use workspace commands:**
   ```bash
   npm run dev:auth  # ✅ Correct
   cd services/auth-service && npm run dev  # ❌ Wrong
   ```

3. **Keep dependencies consistent:**
   ```bash
   # Use same version across services
   npm install express@5.1.0 --workspaces
   ```

4. **Use environment variables:**
   ```bash
   # Each service should have .env file
   services/auth-service/.env
   services/user-service/.env
   services/post-service/.env
   services/comment-service/.env
   services/like-service/.env
   services/community-service/.env
   services/notification-service/.env
   services/feed-service/.env
   api-gateway/.env
   ```

5. **Database per service:**
   ```bash
   # Each service has its own database
   DB_URL=mongodb://localhost:27017/bloxly_auth      # Auth Service
   DB_URL=mongodb://localhost:27017/bloxly_user      # User Service
   DB_URL=mongodb://localhost:27017/bloxly_post      # Post Service
   DB_URL=mongodb://localhost:27017/bloxly_comment   # Comment Service
   DB_URL=mongodb://localhost:27017/bloxly_like      # Like Service
   DB_URL=mongodb://localhost:27017/bloxly_community # Community Service
   DB_URL=mongodb://localhost:27017/bloxly_notification # Notification Service
   DB_URL=mongodb://localhost:27017/bloxly_feed      # Feed Service
   ```

### ❌ **Don'ts**

1. **Don't install in service directories:**
   ```bash
   cd services/auth-service
   npm install express  # ❌ Wrong
   ```

2. **Don't modify node_modules:**
   ```bash
   # Never edit files in node_modules
   ```

3. **Don't commit node_modules:**
   ```bash
   # Add to .gitignore
   node_modules/
   ```

4. **Don't use different versions:**
   ```bash
   # Don't use express@4 in one service and express@5 in another
   ```

## 🔄 **Development Workflow**

### 📋 **Daily Workflow**

```bash
# 1. Start your day
git pull origin main
npm install

# 2. Start development
npm run dev

# 3. Make changes to specific service
# Edit files in services/auth-service/src/

# 4. Test changes
npm run test --workspace=auth-service

# 5. Commit changes
git add .
git commit -m "feat: add new feature to auth service"
git push origin feature-branch
```

### 📋 **Adding New Dependencies**

```bash
# For specific service
npm install new-package --workspace=auth-service

# For all services
npm install new-package --workspaces

# For development only
npm install --save-dev new-package --workspace=auth-service
```

### 📋 **Updating Dependencies**

```bash
# Update specific package
npm update express

# Update all packages
npm update

# Check outdated packages
npm outdated
```

## 🌐 **Service Ports & URLs**

### 📋 **Service Ports**

| Service | Port | Database | Base URL |
|---------|------|----------|----------|
| **API Gateway** | 3000 | - | `http://localhost:3000` |
| **Auth Service** | 3001 | `bloxly_auth` | `http://localhost:3001` |
| **User Service** | 3002 | `bloxly_user` | `http://localhost:3002` |
| **Post Service** | 3003 | `bloxly_post` | `http://localhost:3003` |
| **Comment Service** | 3004 | `bloxly_comment` | `http://localhost:3004` |
| **Like Service** | 3005 | `bloxly_like` | `http://localhost:3005` |
| **Community Service** | 3006 | `bloxly_community` | `http://localhost:3006` |
| **Notification Service** | 3007 | `bloxly_notification` | `http://localhost:3007` |
| **Feed Service** | 3008 | `bloxly_feed` | `http://localhost:3008` |

### 📋 **Environment Variables per Service**

```bash
# Auth Service (.env)
PORT=3001
DB_URL=mongodb://localhost:27017/bloxly_auth
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# User Service (.env)
PORT=3002
DB_URL=mongodb://localhost:27017/bloxly_user
AUTH_SERVICE_URL=http://localhost:3001

# Post Service (.env)
PORT=3003
DB_URL=mongodb://localhost:27017/bloxly_post
USER_SERVICE_URL=http://localhost:3002
COMMUNITY_SERVICE_URL=http://localhost:3006

# Comment Service (.env)
PORT=3004
DB_URL=mongodb://localhost:27017/bloxly_comment
POST_SERVICE_URL=http://localhost:3003
USER_SERVICE_URL=http://localhost:3002

# Like Service (.env)
PORT=3005
DB_URL=mongodb://localhost:27017/bloxly_like
POST_SERVICE_URL=http://localhost:3003
COMMENT_SERVICE_URL=http://localhost:3004

# Community Service (.env)
PORT=3006
DB_URL=mongodb://localhost:27017/bloxly_community
USER_SERVICE_URL=http://localhost:3002
POST_SERVICE_URL=http://localhost:3003

# Notification Service (.env)
PORT=3007
DB_URL=mongodb://localhost:27017/bloxly_notification
USER_SERVICE_URL=http://localhost:3002
POST_SERVICE_URL=http://localhost:3003

# Feed Service (.env)
PORT=3008
DB_URL=mongodb://localhost:27017/bloxly_feed
POST_SERVICE_URL=http://localhost:3003
USER_SERVICE_URL=http://localhost:3002
COMMENT_SERVICE_URL=http://localhost:3004
LIKE_SERVICE_URL=http://localhost:3005
COMMUNITY_SERVICE_URL=http://localhost:3006

# API Gateway (.env)
PORT=3000
AUTH_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3002
POST_SERVICE_URL=http://localhost:3003
COMMENT_SERVICE_URL=http://localhost:3004
LIKE_SERVICE_URL=http://localhost:3005
COMMUNITY_SERVICE_URL=http://localhost:3006
NOTIFICATION_SERVICE_URL=http://localhost:3007
FEED_SERVICE_URL=http://localhost:3008
```

## 🎯 **Service Communication**

### 📋 **How Services Talk to Each Other**

```javascript
// In auth-service
const axios = require('axios');

// Call user-service
const userData = await axios.get('http://user-service:3002/api/users/profile');

// Call post-service
const postData = await axios.get('http://post-service:3003/api/posts/user/123');

// Call feed-service
const feedData = await axios.get('http://feed-service:3008/api/feed');
```

### 📋 **Service Communication Patterns**

#### **Synchronous Communication (HTTP)**
```javascript
// Direct service-to-service calls
const userService = axios.create({
  baseURL: process.env.USER_SERVICE_URL || 'http://user-service:3002'
});

const postService = axios.create({
  baseURL: process.env.POST_SERVICE_URL || 'http://post-service:3003'
});

const communityService = axios.create({
  baseURL: process.env.COMMUNITY_SERVICE_URL || 'http://community-service:3006'
});
```

#### **Asynchronous Communication (Events)**
```javascript
// Event-driven communication
const EventEmitter = require('events');
const eventBus = new EventEmitter();

// Publish event
eventBus.emit('user.followed', {
  followerId: 'user-123',
  followingId: 'user-456',
  timestamp: new Date()
});

// Listen for events
eventBus.on('user.followed', (data) => {
  // Update feed cache
  // Send notification
  // Update statistics
});
```

### 📋 **API Gateway Routing**

```javascript
// In api-gateway
app.use('/api/auth', authRoutes);           // Routes to auth-service:3001
app.use('/api/users', userRoutes);         // Routes to user-service:3002
app.use('/api/posts', postRoutes);         // Routes to post-service:3003
app.use('/api/comments', commentRoutes);   // Routes to comment-service:3004
app.use('/api/likes', likeRoutes);         // Routes to like-service:3005
app.use('/api/communities', communityRoutes); // Routes to community-service:3006
app.use('/api/notifications', notificationRoutes); // Routes to notification-service:3007
app.use('/api/feed', feedRoutes);          // Routes to feed-service:3008
```

## 🧪 **Testing & Debugging**

### 📋 **Testing Commands**

```bash
# Run all tests
npm run test

# Run tests for specific service
npm run test --workspace=auth-service
npm run test --workspace=user-service
npm run test --workspace=post-service
npm run test --workspace=comment-service
npm run test --workspace=like-service
npm run test --workspace=community-service
npm run test --workspace=notification-service
npm run test --workspace=feed-service

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch --workspace=auth-service
```

### 📋 **Debugging Commands**

```bash
# Check service health
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # User Service
curl http://localhost:3003/health  # Post Service
curl http://localhost:3004/health  # Comment Service
curl http://localhost:3005/health  # Like Service
curl http://localhost:3006/health  # Community Service
curl http://localhost:3007/health  # Notification Service
curl http://localhost:3008/health  # Feed Service

# Check service logs
npm run logs --workspace=auth-service
npm run logs --workspace=user-service

# Debug specific service
npm run dev:auth -- --inspect
```

### 📋 **Common Debugging Scenarios**

#### **Service Not Starting**
```bash
# Check if port is available
lsof -i :3001

# Check service logs
npm run dev:auth

# Check dependencies
npm ls --workspace=auth-service
```

#### **Database Connection Issues**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check database connection
mongo --eval "db.adminCommand('ismaster')"

# Check service database
mongo bloxly_auth --eval "db.stats()"
```

#### **Service Communication Issues**
```bash
# Test service endpoints
curl http://localhost:3001/api/auth/health
curl http://localhost:3002/api/users/health

# Check service URLs in .env files
cat services/auth-service/.env | grep SERVICE_URL
```

## 🎉 **Summary**

Workspace management memungkinkan kita:

1. ✅ **Manage multiple services** dalam satu repository
2. ✅ **Share dependencies** tanpa duplikasi
3. ✅ **Develop faster** dengan commands yang efisien
4. ✅ **Maintain consistency** across services
5. ✅ **Deploy independently** setiap service
6. ✅ **Test and debug** dengan mudah
7. ✅ **Monitor service health** secara real-time

**Remember:** Always work from root directory and use workspace commands! 🚀
