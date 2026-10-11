# writespace

A modern platform for writers to create, publish, and connect with readers worldwide.

## Tech Stack

- **Frontend**: TypeScript + React
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/writespace.git
   cd writespace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the production-ready application
- `npm run preview`: Preview the production build locally
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage report

## Features

### For Writers
- Create and publish blog posts with a rich text editor
- Manage drafts and published posts
- Track post performance with built-in analytics

### For Readers
- Browse and read published posts
- Discover latest content

### For Admins
- User management
- Dashboard with platform statistics
- Content moderation tools

## Project Structure

```
writespace/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # Generic UI components (Button, Card, etc.)
│   │   ├── auth/         # Authentication components
│   │   ├── blog/         # Blog-related components
│   │   ├── admin/        # Admin components
│   │   └── landing/      # Landing page components
│   ├── pages/            # Page components
│   ├── stores/           # Zustand stores
│   ├── services/         # API services
│   ├── constants.ts      # Application constants
│   ├── types.ts          # TypeScript types
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── .env                  # Environment variables
├── package.json          # Project dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # Project documentation
```

## Testing

Run tests with:
```bash
npm test
```

For coverage report:
```bash
npm run test:coverage
```

## Deployment

The application is configured for deployment on Vercel. To deploy:

1. Push your code to a GitHub repository
2. Import the project into Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.