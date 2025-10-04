# 🚀 Arsitektur Layanan Mikro - Social Media App (Enhanced)

Dokumen ini menguraikan arsitektur layanan mikro untuk aplikasi media sosial yang lengkap, mencakup otentikasi, profil pengguna, komentar, suka (likes), feed, **community**, dan **notification**.

## 📋 Daftar Layanan
1. [Auth Service](#1️⃣-auth-service-authentication--authorization)
2. [User Service](#2️⃣-user-service-profile--social-features)
3. [Post Service](#3️⃣-post-service-content-management)
4. [Comment Service](#4️⃣-comment-service)
5. [Like Service](#5️⃣-like-service)
6. [Community Service](#6️⃣-community-service)
7. [Notification Service](#7️⃣-notification-service)
8. [Feed Service](#8️⃣-feed-service-aggregation)

---

## 1️⃣ Auth Service (Authentication & Authorization)
**Port:** 3001  
**Fokus:** Menangani proses login, logout, dan manajemen token.

### Use Cases

#### UC1 – Registrasi User
- **Aktor:** `User`
- **Deskripsi:** User membuat akun baru dengan validasi lengkap.
- **Endpoint:** `POST /auth/register`
- **Request:**
  ```json
  {
    "username": "userbaru",
    "email": "user@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "fullName": "User Baru",
    "dateOfBirth": "1990-01-01"
  }
  ```
- **Response Success (201):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "userId": "uuid-123",
      "username": "userbaru",
      "email": "user@example.com",
      "isEmailVerified": false
    }
  }
  ```
- **Response Error (400):**
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": [
      {
        "field": "email",
        "message": "Email already exists"
      }
    ]
  }
  ```

#### UC2 – Login User
- **Aktor:** `User`
- **Deskripsi:** User login untuk mendapatkan token akses (JWT).
- **Endpoint:** `POST /auth/login`
- **Request:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response Success (200):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "accessToken": "jwt-token-here",
      "refreshToken": "refresh-token-here",
      "expiresIn": 3600,
      "user": {
        "userId": "uuid-123",
        "username": "userbaru",
        "email": "user@example.com"
      }
    }
  }
  ```

#### UC3 – Refresh Token
- **Aktor:** `User`
- **Deskripsi:** Memperbarui access token menggunakan refresh token.
- **Endpoint:** `POST /auth/refresh`
- **Request:**
  ```json
  {
    "refreshToken": "refresh-token-here"
  }
  ```

#### UC4 – Logout
- **Aktor:** `User`
- **Deskripsi:** Menghapus sesi atau token.
- **Endpoint:** `POST /auth/logout`
- **Headers:** `Authorization: Bearer <access-token>`

#### UC5 – Token Validation (Middleware)
- **Aktor:** Semua request yang membutuhkan otentikasi.
- **Deskripsi:** Memastikan token valid sebelum mengakses resource yang dilindungi.
- **Headers:** `Authorization: Bearer <access-token>`

---

## 2️⃣ User Service (Profile & Social Features)
**Port:** 3002  
**Fokus:** Manajemen profil, hubungan sosial (follow/unfollow), dan data pengguna.

### Use Cases

#### UC1 – Lihat Profil
- **Aktor:** `User` / `Feed Service` / `Community Service`
- **Deskripsi:** Mengambil informasi profil pengguna.
- **Endpoint:** `GET /users/:userId`
- **Headers:** `Authorization: Bearer <access-token>` (optional)
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "userId": "uuid-123",
      "username": "userbaru",
      "email": "user@example.com",
      "fullName": "User Baru",
      "bio": "Ini adalah bio saya.",
      "profilePicture": "https://cdn.example.com/avatars/uuid-123.jpg",
      "coverPicture": "https://cdn.example.com/covers/uuid-123.jpg",
      "isVerified": false,
      "isPrivate": false,
      "followerCount": 150,
      "followingCount": 75,
      "postCount": 42,
      "joinedAt": "2024-01-01T00:00:00Z",
      "isFollowing": false, // only if authenticated
      "isFollowedBy": false // only if authenticated
    }
  }
  ```

#### UC2 – Update Profil
- **Aktor:** `User`
- **Deskripsi:** Memperbarui informasi akun.
- **Endpoint:** `PUT /users/:userId`
- **Headers:** `Authorization: Bearer <access-token>`
- **Request:**
  ```json
  {
    "username": "newusername",
    "fullName": "New Full Name",
    "bio": "Updated bio",
    "profilePicture": "https://cdn.example.com/new-avatar.jpg",
    "coverPicture": "https://cdn.example.com/new-cover.jpg",
    "isPrivate": true
  }
  ```

#### UC3 – Follow / Unfollow User
- **Aktor:** `User`
- **Deskripsi:** Menambah atau menghapus relasi "following".
- **Endpoint:** `POST /users/:userId/follow` / `DELETE /users/:userId/follow`
- **Headers:** `Authorization: Bearer <access-token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully followed user",
    "data": {
      "isFollowing": true,
      "followerCount": 151
    }
  }
  ```

#### UC4 – List Followers / Following
- **Aktor:** `User` / `Feed Service`
- **Deskripsi:** Mengambil daftar pengguna yang menjadi followers atau following.
- **Endpoint:** `GET /users/:userId/followers` / `GET /users/:userId/following`
- **Query Parameters:** `?page=1&limit=20&search=username`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "users": [
        {
          "userId": "uuid-456",
          "username": "follower1",
          "fullName": "Follower One",
          "profilePicture": "https://cdn.example.com/avatar.jpg",
          "isFollowing": false,
          "isFollowedBy": true
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 150,
        "totalPages": 8
      }
    }
  }
  ```

#### UC5 – Search Users
- **Aktor:** `User`
- **Deskripsi:** Mencari pengguna berdasarkan username atau nama.
- **Endpoint:** `GET /users/search?q=username&page=1&limit=20`

---

## 3️⃣ Post Service (Content Management)
**Port:** 3003  
**Fokus:** Mengelola semua operasi terkait postingan konten.

### Use Cases

#### UC1 – Create Post
- **Aktor:** `User`
- **Deskripsi:** User membuat postingan baru.
- **Endpoint:** `POST /posts`
- **Headers:** `Authorization: Bearer <access-token>`
- **Request:**
  ```json
  {
    "content": "Ini adalah konten postingan saya",
    "images": [
      "https://cdn.example.com/image1.jpg",
      "https://cdn.example.com/image2.jpg"
    ],
    "communityId": "uuid-community-123", // optional
    "isPublic": true,
    "tags": ["#technology", "#programming"]
  }
  ```

#### UC2 – Get Post
- **Aktor:** `User` / `Feed Service`
- **Deskripsi:** Mengambil detail postingan.
- **Endpoint:** `GET /posts/:postId`
- **Headers:** `Authorization: Bearer <access-token>` (optional)

#### UC3 – Update Post
- **Aktor:** `User` (owner only)
- **Deskripsi:** Mengedit postingan milik sendiri.
- **Endpoint:** `PUT /posts/:postId`
- **Headers:** `Authorization: Bearer <access-token>`

#### UC4 – Delete Post
- **Aktor:** `User` (owner only)
- **Deskripsi:** Menghapus postingan milik sendiri.
- **Endpoint:** `DELETE /posts/:postId`
- **Headers:** `Authorization: Bearer <access-token>`

#### UC5 – Get User Posts
- **Aktor:** `User` / `Feed Service`
- **Deskripsi:** Mengambil daftar postingan dari user tertentu.
- **Endpoint:** `GET /posts/user/:userId?page=1&limit=20`

---

## 4️⃣ Comment Service
**Port:** 3004  
**Fokus:** Mengelola semua operasi terkait komentar pada post.

### Use Cases

#### UC1 – Create Comment
- **Aktor:** `User`
- **Deskripsi:** User menambahkan komentar pada post.
- **Endpoint:** `POST /comments`
- **Headers:** `Authorization: Bearer <access-token>`
- **Request:**
  ```json
  {
    "postId": "uuid-post-123",
    "content": "Ini adalah komentar saya",
    "parentCommentId": "uuid-comment-456" // optional, for replies
  }
  ```

#### UC2 – Get Comments
- **Aktor:** `User` / `Feed Service`
- **Deskripsi:** Mengambil komentar untuk sebuah post.
- **Endpoint:** `GET /comments?postId=uuid-post-123&page=1&limit=20&sort=latest`

#### UC3 – Update Comment
- **Aktor:** `User` (owner only)
- **Deskripsi:** Mengedit komentar milik sendiri.
- **Endpoint:** `PUT /comments/:commentId`
- **Headers:** `Authorization: Bearer <access-token>`

#### UC4 – Delete Comment
- **Aktor:** `User` (owner only)
- **Deskripsi:** Menghapus komentar milik sendiri.
- **Endpoint:** `DELETE /comments/:commentId`
- **Headers:** `Authorization: Bearer <access-token>`

---

## 5️⃣ Like Service
**Port:** 3005  
**Fokus:** Mengelola operasi "suka" atau "batal suka" pada post dan komentar.

### Use Cases

#### UC1 – Toggle Like
- **Aktor:** `User`
- **Deskripsi:** Memberikan atau menarik "suka" pada post/komentar.
- **Endpoint:** `POST /likes/toggle`
- **Headers:** `Authorization: Bearer <access-token>`
- **Request:**
  ```json
  {
    "targetType": "post", // "post" or "comment"
    "targetId": "uuid-post-123"
  }
  ```

#### UC2 – Get Like Count
- **Aktor:** `User` / `Feed Service`
- **Deskripsi:** Mengambil jumlah "suka" pada post/komentar.
- **Endpoint:** `GET /likes/count?targetType=post&targetId=uuid-post-123`

#### UC3 – Get User Likes
- **Aktor:** `User`
- **Deskripsi:** Mengambil daftar post/komentar yang disukai user.
- **Endpoint:** `GET /likes/user/:userId?page=1&limit=20`

---

## 6️⃣ Community Service
**Port:** 3006  
**Fokus:** Mengelola komunitas, grup, dan fitur sosial lainnya.

### Use Cases

#### UC1 – Create Community
- **Aktor:** `User`
- **Deskripsi:** User membuat komunitas baru.
- **Endpoint:** `POST /communities`
- **Headers:** `Authorization: Bearer <access-token>`
- **Request:**
  ```json
  {
    "name": "Tech Enthusiasts",
    "description": "Komunitas untuk para penggemar teknologi",
    "category": "technology",
    "isPublic": true,
    "rules": [
      "No spam",
      "Be respectful",
      "Stay on topic"
    ],
    "tags": ["#tech", "#programming", "#innovation"]
  }
  ```

#### UC2 – Join/Leave Community
- **Aktor:** `User`
- **Deskripsi:** User bergabung atau keluar dari komunitas.
- **Endpoint:** `POST /communities/:communityId/join` / `DELETE /communities/:communityId/leave`
- **Headers:** `Authorization: Bearer <access-token>`

#### UC3 – Get Community Details
- **Aktor:** `User`
- **Deskripsi:** Mengambil detail komunitas.
- **Endpoint:** `GET /communities/:communityId`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "communityId": "uuid-community-123",
      "name": "Tech Enthusiasts",
      "description": "Komunitas untuk para penggemar teknologi",
      "category": "technology",
      "isPublic": true,
      "memberCount": 1250,
      "postCount": 342,
      "isJoined": true,
      "isModerator": false,
      "isOwner": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "owner": {
        "userId": "uuid-owner-123",
        "username": "communityowner",
        "profilePicture": "https://cdn.example.com/avatar.jpg"
      },
      "rules": ["No spam", "Be respectful", "Stay on topic"],
      "tags": ["#tech", "#programming", "#innovation"]
    }
  }
  ```

#### UC4 – Get Community Posts
- **Aktor:** `User`
- **Deskripsi:** Mengambil postingan dalam komunitas.
- **Endpoint:** `GET /communities/:communityId/posts?page=1&limit=20&sort=latest`

#### UC5 – Get Community Members
- **Aktor:** `User`
- **Deskripsi:** Mengambil daftar anggota komunitas.
- **Endpoint:** `GET /communities/:communityId/members?page=1&limit=20&role=member`

#### UC6 – Search Communities
- **Aktor:** `User`
- **Deskripsi:** Mencari komunitas berdasarkan nama atau kategori.
- **Endpoint:** `GET /communities/search?q=tech&category=technology&page=1&limit=20`

#### UC7 – Get User Communities
- **Aktor:** `User`
- **Deskripsi:** Mengambil komunitas yang diikuti user.
- **Endpoint:** `GET /communities/user/:userId?page=1&limit=20`

#### UC8 – Update Community
- **Aktor:** `User` (owner/moderator only)
- **Deskripsi:** Mengedit informasi komunitas.
- **Endpoint:** `PUT /communities/:communityId`
- **Headers:** `Authorization: Bearer <access-token>`

#### UC9 – Delete Community
- **Aktor:** `User` (owner only)
- **Deskripsi:** Menghapus komunitas.
- **Endpoint:** `DELETE /communities/:communityId`
- **Headers:** `Authorization: Bearer <access-token>`

---

## 7️⃣ Notification Service
**Port:** 3007  
**Fokus:** Mengelola notifikasi real-time dan push notifications.

### Use Cases

#### UC1 – Get User Notifications
- **Aktor:** `User`
- **Deskripsi:** Mengambil notifikasi user.
- **Endpoint:** `GET /notifications?page=1&limit=20&type=all&isRead=false`
- **Headers:** `Authorization: Bearer <access-token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "notifications": [
        {
          "notificationId": "uuid-notif-123",
          "type": "like",
          "title": "Someone liked your post",
          "message": "userbaru liked your post 'My awesome post'",
          "isRead": false,
          "createdAt": "2024-01-01T12:00:00Z",
          "data": {
            "postId": "uuid-post-123",
            "userId": "uuid-user-456",
            "username": "userbaru"
          }
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 45,
        "totalPages": 3
      },
      "unreadCount": 12
    }
  }
  ```

#### UC2 – Mark Notification as Read
- **Aktor:** `User`
- **Deskripsi:** Menandai notifikasi sebagai sudah dibaca.
- **Endpoint:** `PUT /notifications/:notificationId/read`
- **Headers:** `Authorization: Bearer <access-token>`

#### UC3 – Mark All Notifications as Read
- **Aktor:** `User`
- **Deskripsi:** Menandai semua notifikasi sebagai sudah dibaca.
- **Endpoint:** `PUT /notifications/read-all`
- **Headers:** `Authorization: Bearer <access-token>`

#### UC4 – Delete Notification
- **Aktor:** `User`
- **Deskripsi:** Menghapus notifikasi.
- **Endpoint:** `DELETE /notifications/:notificationId`
- **Headers:** `Authorization: Bearer <access-token>`

#### UC5 – Get Notification Settings
- **Aktor:** `User`
- **Deskripsi:** Mengambil pengaturan notifikasi user.
- **Endpoint:** `GET /notifications/settings`
- **Headers:** `Authorization: Bearer <access-token>`

#### UC6 – Update Notification Settings
- **Aktor:** `User`
- **Deskripsi:** Mengubah pengaturan notifikasi.
- **Endpoint:** `PUT /notifications/settings`
- **Headers:** `Authorization: Bearer <access-token>`
- **Request:**
  ```json
  {
    "emailNotifications": true,
    "pushNotifications": true,
    "likeNotifications": true,
    "commentNotifications": true,
    "followNotifications": true,
    "communityNotifications": true,
    "quietHours": {
      "enabled": true,
      "start": "22:00",
      "end": "08:00"
    }
  }
  ```

### Notification Types
- **like**: Someone liked your post/comment
- **comment**: Someone commented on your post
- **follow**: Someone followed you
- **mention**: Someone mentioned you in a post/comment
- **community_join**: Someone joined your community
- **community_post**: New post in community you follow
- **system**: System notifications

---

## 8️⃣ Feed Service (Aggregation)
**Port:** 3008  
**Fokus:** Mengagregasi data dari berbagai layanan untuk menyusun feed atau timeline pengguna.

### Use Cases

#### UC1 – Get Personal Feed
- **Aktor:** `User`
- **Deskripsi:** Menampilkan daftar postingan dari pengguna yang di-follow.
- **Endpoint:** `GET /feed?page=1&limit=20&type=personal`
- **Headers:** `Authorization: Bearer <access-token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "posts": [
        {
          "postId": "uuid-post-123",
          "content": "This is a great post!",
          "images": ["https://cdn.example.com/image.jpg"],
          "author": {
            "userId": "uuid-user-456",
            "username": "userbaru",
            "profilePicture": "https://cdn.example.com/avatar.jpg",
            "isVerified": false
          },
          "community": {
            "communityId": "uuid-community-789",
            "name": "Tech Enthusiasts",
            "isJoined": true
          },
          "stats": {
            "likeCount": 25,
            "commentCount": 8,
            "shareCount": 3
          },
          "userInteraction": {
            "isLiked": true,
            "isBookmarked": false
          },
          "createdAt": "2024-01-01T12:00:00Z",
          "updatedAt": "2024-01-01T12:00:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "hasNext": true,
        "nextCursor": "uuid-post-124"
      }
    }
  }
  ```

#### UC2 – Get Community Feed
- **Aktor:** `User`
- **Deskripsi:** Menampilkan postingan dari komunitas yang diikuti.
- **Endpoint:** `GET /feed?page=1&limit=20&type=community&communityId=uuid-community-123`

#### UC3 – Get Explore Feed
- **Aktor:** `User`
- **Deskripsi:** Menampilkan post populer atau yang direkomendasikan.
- **Endpoint:** `GET /feed/explore?page=1&limit=20&category=technology`

#### UC4 – Get Post Detail
- **Aktor:** `User`
- **Deskripsi:** Menampilkan satu post secara lengkap dengan komentar.
- **Endpoint:** `GET /feed/posts/:postId`
- **Headers:** `Authorization: Bearer <access-token>`

#### UC5 – Search Feed
- **Aktor:** `User`
- **Deskripsi:** Mencari postingan berdasarkan kata kunci.
- **Endpoint:** `GET /feed/search?q=technology&page=1&limit=20&filters=posts,users,communities`

---

## 🔄 Service Communication Patterns

### Synchronous Communication (HTTP)
- **API Gateway** → **All Services**
- **Feed Service** → **All Services** (for aggregation)
- **Notification Service** → **All Services** (for event triggers)

### Asynchronous Communication (Events)
- **Post Service** → **Notification Service** (new post created)
- **Like Service** → **Notification Service** (post liked)
- **Comment Service** → **Notification Service** (comment added)
- **User Service** → **Notification Service** (user followed)
- **Community Service** → **Notification Service** (community joined)

### Event Types
```javascript
// Post Events
POST_CREATED = "post.created"
POST_UPDATED = "post.updated"
POST_DELETED = "post.deleted"

// Like Events
POST_LIKED = "post.liked"
POST_UNLIKED = "post.unliked"
COMMENT_LIKED = "comment.liked"

// Comment Events
COMMENT_CREATED = "comment.created"
COMMENT_UPDATED = "comment.updated"
COMMENT_DELETED = "comment.deleted"

// User Events
USER_FOLLOWED = "user.followed"
USER_UNFOLLOWED = "user.unfollowed"

// Community Events
COMMUNITY_JOINED = "community.joined"
COMMUNITY_LEFT = "community.left"
COMMUNITY_POST_CREATED = "community.post.created"
```

---

## 📊 Database Schema Overview

### Auth Service
- `users` (id, username, email, password_hash, created_at, updated_at)
- `refresh_tokens` (id, user_id, token, expires_at, created_at)

### User Service
- `user_profiles` (id, user_id, full_name, bio, profile_picture, cover_picture, is_verified, is_private)
- `follows` (id, follower_id, following_id, created_at)

### Post Service
- `posts` (id, user_id, content, images, community_id, is_public, created_at, updated_at)
- `post_tags` (id, post_id, tag_name)

### Comment Service
- `comments` (id, post_id, user_id, parent_comment_id, content, created_at, updated_at)

### Like Service
- `likes` (id, user_id, target_type, target_id, created_at)

### Community Service
- `communities` (id, name, description, category, owner_id, is_public, member_count, created_at)
- `community_members` (id, community_id, user_id, role, joined_at)
- `community_rules` (id, community_id, rule_text, created_at)

### Notification Service
- `notifications` (id, user_id, type, title, message, data, is_read, created_at)
- `notification_settings` (id, user_id, email_notifications, push_notifications, like_notifications, comment_notifications, follow_notifications, community_notifications)

---

## 🚀 API Gateway Routes

```
/api/auth/*          → Auth Service (3001)
/api/users/*         → User Service (3002)
/api/posts/*         → Post Service (3003)
/api/comments/*      → Comment Service (3004)
/api/likes/*         → Like Service (3005)
/api/communities/*   → Community Service (3006)
/api/notifications/* → Notification Service (3007)
/api/feed/*          → Feed Service (3008)
```

---

## 🔐 Security & Validation

### Authentication
- JWT tokens for API access
- Refresh token rotation
- Token blacklisting on logout

### Authorization
- Role-based access control
- Resource ownership validation
- Community moderation permissions

### Validation
- Input sanitization
- Rate limiting per endpoint
- File upload restrictions
- Content moderation

### Error Handling
- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for development
- Generic error messages for production

---

## 📈 Performance Considerations

### Caching
- Redis for session storage
- CDN for static assets
- Database query caching

### Database Optimization
- Proper indexing
- Query optimization
- Connection pooling

### Scalability
- Horizontal scaling capability
- Load balancing
- Microservice independence

---

**Last Updated:** $(date)  
**Version:** 2.0.0  
**Status:** Enhanced with Community & Notification Features
