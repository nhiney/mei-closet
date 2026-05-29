# Hướng dẫn deploy Mei Closet (miễn phí, public)

Stack miễn phí:

| Phần | Dịch vụ | Free tier |
|------|---------|-----------|
| Database | MongoDB Atlas | M0 — 512MB, free vĩnh viễn |
| Backend (Express + Socket.io) | Render | Web Service free (ngủ sau 15 phút không traffic) |
| Frontend (Next.js) | Vercel | Hobby — free |
| Ảnh (tuỳ chọn) | Cloudinary | Free tier |

> ⚠️ **Render free ngủ sau 15 phút** không có request → lần truy cập đầu sau khi ngủ phải chờ ~50s "đánh thức". Đây là đánh đổi của bản free.

Thứ tự deploy: **Atlas → Render (backend) → Vercel (frontend) → nối CORS lại**.

---

## 0. Commit các sửa đổi production

Mình đã sửa vài lỗi build có sẵn (chặn deploy) và thêm `render.yaml`. Commit & push trước:

```bash
git add -A
git commit -m "chore: production deploy config (render blueprint, build fixes)"
git push
```

---

## 1. MongoDB Atlas (database)

1. Tạo tài khoản tại https://www.mongodb.com/cloud/atlas/register
2. **Create a cluster** → chọn **M0 (Free)** → region gần VN (Singapore).
3. **Database Access** → Add New Database User → đặt username + password (lưu lại).
4. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`) — vì IP của Render không cố định.
5. **Database → Connect → Drivers** → copy connection string, dạng:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/mei-closet?retryWrites=true&w=majority
   ```
   Thay `<user>`, `<password>`, và thêm `/mei-closet` (tên DB) trước dấu `?`.

Giữ chuỗi này cho bước Render.

---

## 2. Render — Backend API

### Cách A — dùng Blueprint (khuyến nghị, có sẵn `render.yaml`)

1. Tạo tài khoản https://render.com (đăng nhập bằng GitHub).
2. **New → Blueprint** → chọn repo `mei-closet`.
3. Render đọc `render.yaml` và tạo service `mei-closet-api`. `JWT_SECRET` được tự sinh; các biến `sync: false` cần điền tay:
   - `MONGODB_URI` = chuỗi Atlas ở bước 1
   - `CORS_ORIGIN` = tạm để `http://localhost:3001` (sẽ sửa ở bước 4 sau khi có URL Vercel)
   - `BACKEND_URL` = URL của chính service này (Render hiện sau khi tạo, vd `https://mei-closet-api.onrender.com`) — quay lại điền sau khi service có URL
   - Cloudinary / OpenAI / OAuth: điền nếu dùng, bỏ trống nếu không
4. **Apply** → đợi build & deploy.

### Cách B — tạo Web Service thủ công

**New → Web Service** → chọn repo, rồi cấu hình:

| Mục | Giá trị |
|-----|---------|
| Root Directory | *(để trống — repo root)* |
| Runtime | Node |
| Build Command | `npm install && npm run build -w backend` |
| Start Command | `npm run start -w backend` |
| Health Check Path | `/api/health` |
| Instance Type | Free |

Rồi thêm Environment Variables như danh sách ở Cách A.

### Kiểm tra backend

Mở `https://<tên-service>.onrender.com/api/health` → phải trả `{"status":"ok",...}`.

> Lưu ý quan trọng: trên Render **không tự set `PORT`** — Render tự inject. Code đã đọc `process.env.PORT`. ĐỪNG tự đặt `PORT` trong env Render.

---

## 3. Vercel — Frontend

1. Tạo tài khoản https://vercel.com (đăng nhập bằng GitHub).
2. **Add New → Project** → import repo `mei-closet`.
3. Cấu hình:

| Mục | Giá trị |
|-----|---------|
| Framework Preset | Next.js |
| **Root Directory** | `frontend` |
| Build/Install/Output | để mặc định |

   > Repo dùng npm workspaces. Khi Root Directory = `frontend`, Vercel tự nhận diện workspace và cài từ root để package `@mei-closet/shared` resolve được. Nếu có tuỳ chọn *"Include files outside of the Root Directory"* thì để **bật**.

4. **Environment Variables** (Production):

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | `https://<tên-service>.onrender.com/api` |
   | `NEXT_PUBLIC_SOCKET_ORIGIN` | `https://<tên-service>.onrender.com` |
   | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | *(nếu dùng upload ảnh phía client)* |
   | `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | *(nếu dùng upload ảnh phía client)* |

   > `NEXT_PUBLIC_API_URL` phải có đuôi `/api`. `NEXT_PUBLIC_SOCKET_ORIGIN` thì **không** có `/api`.

5. **Deploy** → Vercel cho URL dạng `https://mei-closet-xxxx.vercel.app`.

---

## 4. Nối CORS lại (bắt buộc)

Giờ đã có URL Vercel, quay lại **Render → Environment**:

- `CORS_ORIGIN` = `https://mei-closet-xxxx.vercel.app`
  (muốn cho cả preview deployment thì liệt kê nhiều URL, cách nhau bằng dấu phẩy, không dấu `/` cuối:
  `https://mei-closet.vercel.app,https://mei-closet-git-main-user.vercel.app`)
- `BACKEND_URL` = `https://<tên-service>.onrender.com` (nếu chưa điền)

Save → Render tự redeploy. Nếu không CORS đúng, frontend sẽ bị chặn gọi API và Socket.io.

---

## 5. Tài khoản admin

Backend tự seed admin khi khởi động (`seedAdminUser`). Tài khoản mặc định (hardcode trong `backend/src/seed/adminSeed.ts`):

- Email: `hniyen-admin@meicloset.com`
- Mật khẩu: `hniyen@meicloset`

> ⚠️ **Bảo mật:** trang đã public nên đăng nhập admin và đổi mật khẩu ngay, hoặc sửa `adminSeed.ts` để đọc từ env (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) trước khi deploy thật.

---

## 6. Tuỳ chọn: Cloudinary & Social login

- **Cloudinary** (upload ảnh sản phẩm): tạo tài khoản free, lấy `CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET` điền vào Render. Nếu upload phía client, set thêm 2 biến `NEXT_PUBLIC_CLOUDINARY_*` trên Vercel + tạo unsigned upload preset.
- **Google / Facebook OAuth**: callback URL phải trỏ về backend:
  - Google: `https://<tên-service>.onrender.com/api/auth/google/callback`
  - Facebook: `https://<tên-service>.onrender.com/api/auth/facebook/callback`
  - Điền `GOOGLE_CLIENT_ID/SECRET`, `FACEBOOK_APP_ID/SECRET` trên Render.
  - Bỏ trống thì nút social login tự ẩn/redirect về trang lỗi — site vẫn chạy bình thường với đăng nhập email.

---

## Tóm tắt biến môi trường

**Render (backend):**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<auto>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://<vercel-url>
BACKEND_URL=https://<render-url>
# tuỳ chọn: CLOUDINARY_*, OPENAI_*, GOOGLE_*, FACEBOOK_*
```

**Vercel (frontend):**
```
NEXT_PUBLIC_API_URL=https://<render-url>/api
NEXT_PUBLIC_SOCKET_ORIGIN=https://<render-url>
# tuỳ chọn: NEXT_PUBLIC_CLOUDINARY_*
```
