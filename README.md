# 絵の間 (Enoma) - Digital Art & Comics Gallery

A modern, multilingual digital gallery platform built with Next.js for sharing and browsing art collections and comics.

## 🌟 Features

- **Digital Gallery**: Browse and interact with art collections and comics
- **User Authentication**: Secure login/register system with password reset
- **Multilingual Support**: Japanese (日本語) and Chinese (中文) localization
- **Interactive UI**: Like, purchase, and engage with content
- **Responsive Design**: Modern glassmorphism UI with retro-futuristic styling
- **Database Integration**: PostgreSQL with Prisma ORM

## 🚀 Tech Stack

- **Framework**: Next.js 15.3.1 with TypeScript
- **Styling**: Tailwind CSS 4.0 with custom animations
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Email**: Nodemailer for password reset functionality
- **UI Components**: Radix UI, React Hook Form with Zod validation

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd enoma
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-jwt-secret"
EMAIL_USER="your-smtp-email"
EMAIL_PASS="your-smtp-password"
```

4. Set up the database:
```bash
npm run db:migrate
npm run db:generate
```

## 🛠 Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

Available scripts:
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── main/              # Main gallery page
│   └── settings/          # User settings
├── components/            # Reusable components
│   └── auth/             # Authentication components
├── contexts/              # React contexts
├── hooks/                # Custom hooks
├── i18n/                 # Internationalization
└── lib/                  # Utility libraries
```

## 🌐 Localization

The application supports:
- Japanese (ja) - Primary language
- Chinese (zh) - Secondary language

Language files are located in `src/i18n/`.

## 🔒 Authentication Features

- User registration and login
- Password reset via email
- JWT-based session management
- Secure password hashing with bcrypt
- Protected routes and API endpoints

## 📊 Database Schema

The application uses three main models:
- **User**: User accounts with authentication
- **Gallery**: Art collection items
- **Comic**: Comic/manga content

See `prisma/schema.prisma` for complete schema definition.

## 🎨 UI/UX Features

- Glassmorphism design with backdrop blur effects
- TV/CRT-style glitch animations
- Responsive grid layouts
- Interactive like/purchase buttons
- Modern tab navigation
- Loading states and error handling

## 📧 Email Setup

Email functionality is configured in `src/lib/email.ts`. Make sure to set up SMTP credentials for password reset emails. Check `EMAIL_SETUP.md` for detailed configuration.

## 🚀 Deployment

This Next.js app can be deployed on various platforms:

- **Vercel**: Recommended for seamless deployment
- **Netlify**: Alternative hosting option
- **Docker**: Containerized deployment
- **Traditional hosting**: Any Node.js hosting service

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.
