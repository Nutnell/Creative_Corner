# BlogPlatform - Modern Blog Application

A full-stack blog platform built with Next.js, MongoDB, and modern web technologies. Features user authentication, blog management, commenting system, and AI chatbot integration.

![BlogPlatform Screenshot](https://via.placeholder.com/800x400/0066cc/ffffff?text=BlogPlatform)

## ✨ Features

- 🔐 **User Authentication** - Secure signup, login, and JWT-based sessions
- 📝 **Blog Management** - Create, edit, delete, and view blog posts
- 💬 **Comment System** - Interactive commenting on blog posts
- 🎨 **Modern UI** - Responsive design with dark/light theme support
- 📱 **Mobile Friendly** - Fully responsive across all devices
- 🤖 **AI Chatbot** - Integrated AI assistant (configurable)
- 🔍 **Search & Pagination** - Easy navigation through blog posts
- 👤 **User Dashboard** - Personal dashboard with analytics
- 🎯 **Real-time Updates** - Dynamic content loading

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB
- **Authentication**: JWT, bcryptjs
- **UI Components**: Radix UI, Lucide Icons
- **Styling**: Tailwind CSS, CSS Variables
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/blog-platform.git
cd blog-platform
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your actual values:

\`\`\`env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blogplatform?retryWrites=true&w=majority

# JWT Secret Key (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random

# AI API Key (optional - for chatbot functionality)
AI_API_KEY=your-ai-service-api-key

# OpenAI API Key (if using OpenAI for chatbot)
OPENAI_API_KEY=sk-your-openai-api-key-here
\`\`\`

### 4. Set Up MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Add it to your `.env.local` file

#### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/blogplatform`

### 5. Seed the Database (Optional)

Populate your database with sample data:

\`\`\`bash
npm run seed
\`\`\`

This creates:
- 2 sample users (john@example.com, jane@example.com)
- 3 sample blog posts
- Default password: `password123`

### 6. Start the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
blog-platform/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── posts/         # Blog post endpoints
│   │   └── chat/          # Chatbot endpoint
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── dashboard/         # User dashboard
│   ├── create/            # Create post page
│   ├── my-posts/          # User's posts page
│   ├── post/[id]/         # Individual post page
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── Header.js         # Navigation header
│   ├── Sidebar.js        # Navigation sidebar
│   ├── BlogCard.js       # Blog post card
│   └── Chatbot.js        # AI chatbot widget
├── contexts/             # React contexts
│   ├── AuthContext.js    # Authentication state
│   └── SidebarContext.js # Sidebar state
├── lib/                  # Utility functions
│   ├── mongodb.js        # Database connection
│   ├── auth.js           # Authentication utilities
│   └── utils.js          # General utilities
├── scripts/              # Utility scripts
│   └── seed-database.js  # Database seeding
└── public/               # Static assets
\`\`\`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `AI_API_KEY` | API key for AI service | No |
| `OPENAI_API_KEY` | OpenAI API key | No |

### Database Collections

The application uses these MongoDB collections:

- **users** - User accounts and profiles
- **posts** - Blog posts with content and metadata
- **comments** - Comments on blog posts (embedded in posts)

## 🎯 Usage

### For Users

1. **Sign Up**: Create a new account with email and password
2. **Login**: Access your account with credentials
3. **Browse Posts**: View all blog posts on the homepage
4. **Read Posts**: Click on any post to read the full content
5. **Comment**: Add comments to posts (requires login)
6. **Create Posts**: Write and publish your own blog posts
7. **Manage Posts**: Edit or delete your posts from the dashboard
8. **AI Chat**: Use the floating chatbot for assistance

### For Developers

#### Adding New Features

1. **API Routes**: Add new endpoints in `app/api/`
2. **Pages**: Create new pages in `app/`
3. **Components**: Add reusable components in `components/`
4. **Styling**: Use Tailwind CSS classes and CSS variables

#### Database Operations

\`\`\`javascript
// Example: Get all posts
const posts = await db.collection("posts").find({}).toArray()

// Example: Create a new post
const result = await db.collection("posts").insertOne({
  title: "New Post",
  content: "Post content...",
  authorId: new ObjectId(userId),
  createdAt: new Date()
})
\`\`\`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard

3. **Deploy**:
   - Vercel will automatically deploy your app
   - Your app will be live at `https://your-app.vercel.app`

### Deploy to Other Platforms

The app can also be deployed to:
- **Netlify** (with serverless functions)
- **Railway**
- **Heroku**
- **DigitalOcean App Platform**

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Creating and editing blog posts
- [ ] Commenting on posts
- [ ] Responsive design on mobile
- [ ] Dark/light theme switching
- [ ] Navigation and routing

### Running Tests

\`\`\`bash
# Add your test commands here
npm test
\`\`\`

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your `MONGODB_URI` in `.env.local`
   - Ensure MongoDB is running (if local)
   - Verify network access for MongoDB Atlas

2. **JWT Token Issues**
   - Ensure `JWT_SECRET` is set in `.env.local`
   - Clear browser localStorage if needed

3. **Build Errors**
   - Delete `.next` folder and rebuild
   - Check for missing dependencies

4. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS classes

### Getting Help

- Check the [Issues](https://github.com/yourusername/blog-platform/issues) page
- Review the [Next.js Documentation](https://nextjs.org/docs)
- Check [MongoDB Documentation](https://docs.mongodb.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m 'Add feature'`
5. Push: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [MongoDB](https://www.mongodb.com/) for the database
- [Vercel](https://vercel.com/) for hosting and deployment

## 📞 Support

If you have any questions or need help, please:

1. Check the documentation above
2. Search existing [Issues](https://github.com/yourusername/blog-platform/issues)
3. Create a new issue if needed
4. Contact: your-email@example.com

---

**Happy Blogging! 🎉**
\`\`\`

Create the .env.example file:
