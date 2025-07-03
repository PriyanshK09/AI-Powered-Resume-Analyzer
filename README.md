# 🤖 ResuMate - AI-Powered Resume Optimization Platform

<div align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge" alt="Development Status" />
  <img src="https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</div>

<div align="center">
  <h3>🚀 Transform your career with AI-optimized resumes</h3>
  <p>Generate, analyze, and score your resume with advanced AI. Get personalized suggestions and ATS-friendly templates that get you noticed by top employers.</p>
</div>

---

## 🌟 Features

### ✨ **Current Features (Frontend)**
- 🎨 **Modern Landing Page** - Beautiful, responsive design with dark/light mode
- 📱 **Mobile-First Design** - Optimized for all devices and screen sizes
- 🎯 **Interactive UI Components** - Smooth animations and hover effects
- 🔄 **Theme Switching** - Seamless dark/light mode toggle
- 📊 **Resume Scoring Preview** - Visual score display with progress indicators
- 📋 **Template Showcase** - ATS-friendly template previews
- 💬 **Testimonials Section** - User success stories and feedback
- 💰 **Pricing Plans** - Clear pricing structure with feature comparison

### 🚧 **Planned Features (In Development)**
- 🤖 **AI Resume Analysis** - Advanced content and structure analysis
- 📄 **Resume Builder** - Drag-and-drop resume creation tool
- 🎯 **ATS Optimization** - Real-time ATS compatibility checking
- 📊 **Smart Scoring System** - Comprehensive resume scoring algorithm
- 🔍 **Keyword Optimization** - Industry-specific keyword suggestions
- 📝 **Content Suggestions** - AI-powered writing recommendations
- 📧 **Cover Letter Generator** - Matching cover letter creation
- 💼 **Job Matching** - Resume-to-job compatibility analysis

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15.2.4 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Radix UI + Custom Components
- **Icons**: Lucide React
- **Animations**: Tailwind CSS Animate
- **Forms**: React Hook Form + Zod Validation

### **Backend** (Planned)
- **Framework**: Node.js / Python (TBD)
- **Database**: PostgreSQL / MongoDB (TBD)
- **AI/ML**: OpenAI API / Custom ML Models
- **Authentication**: NextAuth.js
- **File Storage**: AWS S3 / Cloudinary
- **API**: RESTful / GraphQL (TBD)

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18.0.0 or higher
- npm, yarn, or pnpm package manager
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/PriyanshK09/AI-Powered-Resume-Analyzer.git
   cd AI-Powered-Resume-Analyzer/resumate-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### **Build for Production**
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
resumate-frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and animations
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main landing page
├── components/            # Reusable components
│   ├── ui/               # Base UI components (Radix UI)
│   └── landing/          # Landing page sections
│       ├── Header.tsx    # Navigation header
│       ├── HeroSection.tsx
│       ├── HowItWorksSection.tsx
│       ├── AIPreviewSection.tsx
│       ├── ResumeScoringSection.tsx
│       ├── TemplatesSection.tsx
│       ├── TestimonialsSection.tsx
│       ├── PricingSection.tsx
│       └── Footer.tsx
├── lib/                   # Utility functions
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

---

## 🎨 Design System

### **Colors**
- **Primary**: Violet (600-700)
- **Secondary**: Purple (600-700)
- **Accent**: Pink (500-600)
- **Success**: Green (500)
- **Warning**: Amber (500)

### **Typography**
- **Display Font**: Plus Jakarta Sans
- **Body Font**: Inter
- **Responsive sizing**: 4xl-8xl for headings

### **Components**
- **Consistent spacing**: 4, 6, 8, 12, 16, 20px
- **Border radius**: 8-24px for modern look
- **Shadows**: Subtle gradients with color-matched shadows
- **Animations**: Smooth 300-500ms transitions

---

## 🧪 Development Status

### **✅ Completed**
- [x] Landing page design and layout
- [x] Responsive design implementation
- [x] Dark/light mode functionality
- [x] Component architecture setup
- [x] TypeScript configuration
- [x] Modern animations and interactions
- [x] SEO optimization (meta tags, OpenGraph)

### **🚧 In Progress**
- [ ] Backend API development
- [ ] AI integration for resume analysis
- [ ] User authentication system
- [ ] Resume builder interface
- [ ] Database schema design

### **📋 Planned**
- [ ] File upload functionality
- [ ] Resume templates system
- [ ] Scoring algorithm implementation
- [ ] ATS compatibility checker
- [ ] Payment integration
- [ ] User dashboard
- [ ] Admin panel
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

We're currently in early development and not accepting external contributions yet. However, feel free to:

- 🐛 **Report bugs** via Issues
- 💡 **Suggest features** via Issues
- ⭐ **Star the repository** to show support

### **Development Guidelines**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain component modularity
- Write descriptive commit messages
- Test on multiple devices/browsers

---

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 🌐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ResuMate

# API Configuration (When ready)
# NEXT_PUBLIC_API_URL=
# API_SECRET_KEY=

# Database (When ready)
# DATABASE_URL=

# AI Services (When ready)
# OPENAI_API_KEY=
# ANTHROPIC_API_KEY=
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **Lucide React** for beautiful icons
- **Next.js** for the powerful React framework
- **Vercel** for deployment platform

---

## 📞 Contact

**Project Maintainer**: [PriyanshK09](https://github.com/PriyanshK09)
**Repository**: [AI-Powered-Resume-Analyzer](https://github.com/PriyanshK09/AI-Powered-Resume-Analyzer)

---

<div align="center">
  <p><strong>⚡ Made with Next.js, TypeScript, and lots of ☕</strong></p>
  <p><em>🚀 Transforming careers, one resume at a time</em></p>
</div>