# 🗄️ Database Architecture - bloxly Backend

## 🎯 **Pendekatan: Database per Service dengan MongoDB**

Setiap microservice memiliki **database terpisah** dalam **satu MongoDB instance** untuk memastikan **service independence** dan **scalability**.

### 🔧 **MongoDB Architecture Options**

#### **Option 1: Database per Service (Recommended)**
```
MongoDB Instance (localhost:27017)
├── bloxly_auth (Auth Service)
│   ├── users
│   └── refresh_tokens
├── bloxly_user (User Service)
│   ├── user_profiles
│   └── follows
├── bloxly_post (Post Service)
│   ├── posts
│   └── post_tags
└── ... (dan seterusnya)
```

#### **Option 2: Collection per Service (Alternative)**
```
MongoDB Instance (localhost:27017)
└── bloxly_app (Single Database)
    ├── auth_users
    ├── auth_refresh_tokens
    ├── user_profiles
    ├── user_follows
    ├── posts
    ├── comments
    └── ... (dan seterusnya)
```

**Rekomendasi:** Gunakan **Option 1 (Database per Service)** untuk microservices architecture yang benar.

## 📊 **Database Distribution**

| Service | Database | Collections | Port | Schema Location |
|---------|----------|-------------|------|-----------------|
| **Auth Service** | `bloxly_auth` | users, refresh_tokens | 27017 | `services/auth-service/src/models/` |
| **User Service** | `bloxly_user` | user_profiles, follows | 27017 | `services/user-service/src/models/` |
| **Post Service** | `bloxly_post` | posts, post_tags | 27017 | `services/post-service/src/models/` |
| **Comment Service** | `bloxly_comment` | comments | 27017 | `services/comment-service/src/models/` |
| **Like Service** | `bloxly_like` | likes | 27017 | `services/like-service/src/models/` |
| **Community Service** | `bloxly_community` | communities, community_members, community_rules | 27017 | `services/community-service/src/models/` |
| **Notification Service** | `bloxly_notification` | notifications, notification_settings | 27017 | `services/notification-service/src/models/` |
| **Feed Service** | `bloxly_feed` | feed_cache | 27017 | `services/feed-service/src/models/` |

**MongoDB Instance:** `mongodb://localhost:27017` (Single Instance)

## 🏗️ **Struktur Schema per Service**

### 1️⃣ **Auth Service Schema**
**Location:** `services/auth-service/src/models/`

```javascript
// User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
```

```javascript
// RefreshToken.js
const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  tokenId: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
```

### 2️⃣ **User Service Schema**
**Location:** `services/user-service/src/models/`

```javascript
// UserProfile.js
const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  fullName: { type: String, required: true },
  bio: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  coverPicture: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  isPrivate: { type: Boolean, default: false },
  followerCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  postCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
```

```javascript
// Follow.js
const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  followerId: { type: String, required: true },
  followingId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  unique: true,
  uniqueFields: ['followerId', 'followingId']
});

module.exports = mongoose.model('Follow', followSchema);
```

### 3️⃣ **Post Service Schema**
**Location:** `services/post-service/src/models/`

```javascript
// Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postId: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ type: String }],
  communityId: { type: String, default: null },
  isPublic: { type: Boolean, default: true },
  tags: [{ type: String }],
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  shareCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
```

### 4️⃣ **Comment Service Schema**
**Location:** `services/comment-service/src/models/`

```javascript
// Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commentId: { type: String, unique: true, required: true },
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  parentCommentId: { type: String, default: null },
  content: { type: String, required: true },
  likeCount: { type: Number, default: 0 },
  replyCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
```

### 5️⃣ **Like Service Schema**
**Location:** `services/like-service/src/models/`

```javascript
// Like.js
const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  likeId: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  targetType: { type: String, enum: ['post', 'comment'], required: true },
  targetId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  unique: true,
  uniqueFields: ['userId', 'targetType', 'targetId']
});

module.exports = mongoose.model('Like', likeSchema);
```

### 6️⃣ **Community Service Schema**
**Location:** `services/community-service/src/models/`

```javascript
// Community.js
const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  communityId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  ownerId: { type: String, required: true },
  isPublic: { type: Boolean, default: true },
  memberCount: { type: Number, default: 0 },
  postCount: { type: Number, default: 0 },
  rules: [{ type: String }],
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Community', communitySchema);
```

```javascript
// CommunityMember.js
const mongoose = require('mongoose');

const communityMemberSchema = new mongoose.Schema({
  communityId: { type: String, required: true },
  userId: { type: String, required: true },
  role: { type: String, enum: ['member', 'moderator', 'admin', 'owner'], default: 'member' },
  joinedAt: { type: Date, default: Date.now }
}, {
  unique: true,
  uniqueFields: ['communityId', 'userId']
});

module.exports = mongoose.model('CommunityMember', communityMemberSchema);
```

### 7️⃣ **Notification Service Schema**
**Location:** `services/notification-service/src/models/`

```javascript
// Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['like', 'comment', 'follow', 'mention', 'community_join', 'community_post', 'system'],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
```

```javascript
// NotificationSettings.js
const mongoose = require('mongoose');

const notificationSettingsSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  emailNotifications: { type: Boolean, default: true },
  pushNotifications: { type: Boolean, default: true },
  likeNotifications: { type: Boolean, default: true },
  commentNotifications: { type: Boolean, default: true },
  followNotifications: { type: Boolean, default: true },
  communityNotifications: { type: Boolean, default: true },
  quietHours: {
    enabled: { type: Boolean, default: false },
    start: { type: String, default: '22:00' },
    end: { type: String, default: '08:00' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NotificationSettings', notificationSettingsSchema);
```

### 8️⃣ **Feed Service Schema**
**Location:** `services/feed-service/src/models/`

```javascript
// FeedCache.js
const mongoose = require('mongoose');

const feedCacheSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  postId: { type: String, required: true },
  score: { type: Number, required: true }, // untuk sorting
  cachedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('FeedCache', feedCacheSchema);
```

## 🔧 **Database Configuration per Service**

### Environment Variables per Service

```bash
# Auth Service (.env)
DB_HOST=localhost
DB_PORT=27017
DB_NAME=bloxly_auth
DB_URL=mongodb://localhost:27017/bloxly_auth

# User Service (.env)
DB_HOST=localhost
DB_PORT=27017
DB_NAME=bloxly_user
DB_URL=mongodb://localhost:27017/bloxly_user

# Post Service (.env)
DB_HOST=localhost
DB_PORT=27017
DB_NAME=bloxly_post
DB_URL=mongodb://localhost:27017/bloxly_post

# Comment Service (.env)
DB_HOST=localhost
DB_PORT=27017
DB_NAME=bloxly_comment
DB_URL=mongodb://localhost:27017/bloxly_comment

# Like Service (.env)
DB_HOST=localhost
DB_PORT=27017
DB_NAME=bloxly_like
DB_URL=mongodb://localhost:27017/bloxly_like

# Community Service (.env)
DB_HOST=localhost
DB_PORT=27017
DB_NAME=bloxly_community
DB_URL=mongodb://localhost:27017/bloxly_community

# Notification Service (.env)
DB_HOST=localhost
DB_PORT=27017
DB_NAME=bloxly_notification
DB_URL=mongodb://localhost:27017/bloxly_notification

# Feed Service (.env)
DB_HOST=localhost
DB_PORT=27017
DB_NAME=bloxly_feed
DB_URL=mongodb://localhost:27017/bloxly_feed
```

### Database Connection per Service

```javascript
// services/auth-service/src/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Auth DB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Auth DB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## 🔄 **Data Consistency Strategies**

### 1. **Event-Driven Updates**
```javascript
// Ketika user follow/unfollow di User Service
// Kirim event ke Feed Service untuk update feed cache
const event = {
  type: 'user.followed',
  data: {
    followerId: 'user-123',
    followingId: 'user-456',
    action: 'follow'
  }
};
// Publish ke message queue
```

### 2. **Saga Pattern**
```javascript
// Untuk operasi yang membutuhkan multiple services
// Contoh: Create post dengan notification
const saga = [
  { service: 'post-service', action: 'createPost' },
  { service: 'notification-service', action: 'notifyFollowers' },
  { service: 'feed-service', action: 'updateFeedCache' }
];
```

### 3. **Eventual Consistency**
- Data akan konsisten dalam waktu tertentu
- Acceptable untuk social media apps
- User experience tetap smooth

## 🚀 **Migration & Seeding**

### Migration Scripts per Service
```javascript
// services/auth-service/src/scripts/migrate.js
const mongoose = require('mongoose');
const User = require('../models/User');

const migrate = async () => {
  // Migration logic untuk auth service
  console.log('Auth Service migration completed');
};

module.exports = migrate;
```

### Seeding Scripts per Service
```javascript
// services/auth-service/src/scripts/seed.js
const User = require('../models/User');

const seedUsers = async () => {
  const users = [
    {
      userId: 'user-1',
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: 'hashed-password'
    }
  ];
  
  await User.insertMany(users);
  console.log('Auth Service seeded');
};

module.exports = seedUsers;
```

## 📊 **Monitoring & Maintenance**

### Database Health Checks
```javascript
// Per service health check
app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ status: 'healthy', service: 'auth-service' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});
```

### Backup Strategy
- **Per-service backup** - Setiap database di-backup secara terpisah
- **Point-in-time recovery** - Dapat restore ke waktu tertentu
- **Cross-region replication** - Untuk disaster recovery

## 🎯 **Best Practices**

### ✅ **Do's**
- Gunakan database per service
- Implement proper indexing
- Use connection pooling
- Monitor database performance
- Implement proper error handling
- Use transactions untuk operasi kompleks

### ❌ **Don'ts**
- Jangan share database antar service
- Jangan hardcode connection strings
- Jangan ignore database errors
- Jangan skip backup strategy
- Jangan over-index database

---

**Kesimpulan:** Gunakan **Database per Service** approach untuk memastikan microservices architecture yang benar dan scalable! 🚀
