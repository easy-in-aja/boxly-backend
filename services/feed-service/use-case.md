# Feed Service – Use Case

Feed Service berfungsi untuk menyajikan timeline / feed user dengan menggabungkan data dari berbagai service (post, user, like, comment).

## 1. UC1 – Lihat Timeline / Feed

**Aktor:** User

**Deskripsi:** User ingin melihat daftar postingan dari user yang di-follow, termasuk info author, jumlah like, dan komentar terbaru.

**Langkah:**

1. User request `GET /feed?limit=20&offset=0`
2. Feed Service memanggil:
   - `post-service` → daftar post dari followings
   - `user-service` → info author tiap post
   - `like-service` → jumlah like tiap post
   - `comment-service` → komentar terbaru tiap post
3. Feed Service menggabungkan semua data → kirim response ke user

**Hasil:** User melihat feed up-to-date dengan post terbaru, like count, dan komentar

## 2. UC2 – Lihat Detail Post di Feed

**Aktor:** User

**Deskripsi:** User ingin melihat detail satu post lengkap dengan komentar dan like.

**Langkah:**

1. User request `GET /feed/:postId`
2. Feed Service memanggil:
   - `post-service` → detail post
   - `user-service` → info author
   - `like-service` → jumlah like
   - `comment-service` → list komentar lengkap
3. Gabungkan data → kirim ke user

**Hasil:** User melihat post detail termasuk semua komentar yang tersedia

## 3. UC3 – Infinite Scroll / Pagination

**Aktor:** User

**Deskripsi:** User scroll feed, sistem mengambil batch berikutnya agar feed terasa seamless

**Langkah:**

1. User request `GET /feed?cursor=<lastPostId>&limit=20`
2. Feed Service memanggil service lain untuk mengambil post berikutnya
3. Gabungkan data post, like, comment → kirim ke user

**Hasil:** Feed user berlanjut tanpa reload seluruh data

## 4. UC4 – Explore / Recommended Feed (opsional MVP)

**Aktor:** User

**Deskripsi:** User ingin menemukan post populer atau rekomendasi dari user yang belum di-follow

**Langkah:**

1. User request `GET /feed/explore`
2. Feed Service memanggil `post-service` → ambil post trending / popular
3. Gabungkan data like, comment, author → kirim ke user

**Hasil:** User mendapatkan rekomendasi konten baru

## 📋 Ringkasan

| Use Case | Endpoint | Data yang Diambil |
|----------|----------|-------------------|
| Lihat Timeline | `/feed` | post-service, user-service, like-service, comment-service |
| Lihat Detail Post | `/feed/:postId` | post-service, user-service, like-service, comment-service |
| Pagination / Infinite Scroll | `/feed?cursor=&limit=` | post-service, user-service, like-service, comment-service |
| Explore / Recommendation | `/feed/explore` | post-service, user-service, like-service, comment-service |