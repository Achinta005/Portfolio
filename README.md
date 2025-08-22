# 🎨 Modern Portfolio Website

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwindcss" alt="Tailwind"/>
</div>

<div align="center">
  <h3>🚀 A sleek, modern, and fully responsive portfolio showcasing projects, skills, and professional journey</h3>
</div>

---

## ✨ Features

### 🎯 **Frontend Highlights**
- 📱 **Fully Responsive** - Mobile-first design that looks great on all devices
- 🎭 **Smooth Animations** - Powered by Framer Motion for delightful user experience  
- 🌓 **Dark Mode Toggle** - Seamless theme switching
- 🎨 **Interactive Skills Display** - Click-to-expand skill cards with detailed information
- 📝 **Dynamic Blog** - Built-in blog system with dynamic routing
- 📧 **Contact Form** - Client-side validation with server integration
- 🔐 **Admin Dashboard** - Protected admin area for content management
- 🎪 **3D Background Effects** - Optional Vanta.js integration for visual appeal
- 🔍 **SEO Optimized** - Auto-generated sitemaps and meta tags

### ⚡ **Backend Capabilities**
- 🔒 **JWT Authentication** - Secure user authentication with role-based access
- 🌐 **Google OAuth Integration** - Social login functionality
- ☁️ **Cloudinary Integration** - Seamless image upload and management
- 📊 **Project Management** - CRUD operations for portfolio projects
- 💌 **Contact Management** - Handle and store contact form submissions
- 📄 **Resume Download** - Direct PDF resume download endpoint
- 🛡️ **Security First** - CORS, bcrypt hashing, and JWT protection

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React Framework | 15 |
| **React** | UI Library | 19 |
| **Tailwind CSS** | Styling | 4 |
| **Framer Motion** | Animations | Latest |
| **React Hook Form** | Form Management | Latest |
| **Three.js** | 3D Graphics | Latest |
| **Lucide React** | Icons | Latest |

### **Backend**
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime | 18+ |
| **Express** | Web Framework | 5 |
| **MongoDB** | Database | Latest |
| **Mongoose** | ODM | Latest |
| **JWT** | Authentication | Latest |
| **Cloudinary** | Image Storage | Latest |
| **bcryptjs** | Password Hashing | Latest |

---

### 4️⃣ Visit Your Portfolio
- **Frontend**: https://www.achintahazra.shop
- **Backend**: https://portfolio-backend-3gcq.onrender.com
- **Admin Dashboard**: https://www.achintahazra.shop/admin

---

## 📁 Project Structure

### Frontend Architecture
```
frontend/
├── app/
│   ├── page.js                 # Landing page
│   ├── about/                  # About section
│   ├── projects/               # Projects showcase
│   ├── blog/                   # Blog system
│   ├── contact/                # Contact form
│   ├── admin/                  # Admin dashboard
│   └── lib/                    # Utilities
├── components/                 # Reusable components
├── public/                     # Static assets
└── middleware.js               # Route protection
```

### Backend Architecture
```
backend/
├── server.js                   # Main server file
├── config/                     # Database & service configs
├── controllers/                # Request handlers
├── middleware/                 # Auth & validation
├── models/                     # Database schemas
├── routes/                     # API endpoints
└── files/                      # Static files
```

---

## 🔗 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/google/callback` - OAuth callback

### **Projects**
- `GET /projects` - Fetch all projects
- `POST /upload` - Upload new project with image

### **Contact**
- `POST /contact` - Submit contact form
- `GET /contact_response` - Fetch contact submissions (protected)

### **Utilities**
- `GET /health` - Health check
- `GET /download/resume` - Download resume PDF

---

## 🎨 Key Components

### **Interactive Skills Display**
```jsx
<InteractiveSkillsDisplay />
```
Click-to-expand cards showcasing technical skills with detailed descriptions.

### **Projects Gallery**
```jsx
<ProjectsGrid />        // Desktop view
<ProjectGridMobile />   // Mobile optimized
```
Responsive project showcase with filtering and animations.

### **Contact Form**
```jsx
<ContactForm />
```
Validated contact form with real-time feedback and server integration.

### **Admin Dashboard**
```jsx
<AdminPanel />
```
Content management interface for projects, contacts, and documents.

---

## 🛡️ Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt
- **CORS Protection** with allowlist origins
- **Route Protection** via middleware
- **Input Validation** on all endpoints
- **Role-based Access Control** (Admin, Editor, Viewer)

---

## 🌟 Deployment

### **Frontend (Vercel)**
```bash
npm run vercel-build
```
Includes legacy peer deps handling for smooth Vercel deployment.

### **Backend (Railway/Heroku)**
```bash
npm start
```
Ensure all environment variables are configured in your hosting platform.

### **Production Checklist**
- [ ] Set strong JWT_SECRET
- [ ] Configure CORS origins for production domains
- [ ] Set up MongoDB Atlas
- [ ] Configure Cloudinary credentials
- [ ] Set up Google OAuth for production
- [ ] Enable HTTPS
- [ ] Configure domain redirects

---

## 📈 Performance Optimizations

- **Image Optimization** via Cloudinary transformations
- **Code Splitting** with Next.js dynamic imports  
- **SEO Optimization** with automated sitemap generation
- **Client-side Caching** for improved load times
- **Responsive Images** with multiple breakpoints
- **Lazy Loading** for better performance

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **MongoDB** for the database solution

---

## 📞 Support

If you have any questions or run into issues, please:
- 🐛 [Open an issue](https://github.com/Achinta005)
- 💬 [Start a discussion](https://github.com/Achinta005)
- 📧 Contact: achintahazra8515@gmail.com

---

<div align="center">
  <h3>⭐ If you like this project, please give it a star! ⭐</h3>
</div>