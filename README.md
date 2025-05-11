# SSBPsychSelf

A comprehensive web application for practicing psychological tests used in Services Selection Board (SSB) interviews.

## Features

- Thematic Apperception Test (TAT)
- Word Association Test (WAT)
- Situation Reaction Test (SRT)
- Self Description Test (SDT)
- Full Psych Dosier

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd SSBPsychSelf
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start development server
```bash
npm run dev
# or
yarn dev
```

5. For production build
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run check`: Run TypeScript checks
- `npm run db:push`: Update database schema
- `npm run deploy`: Deploy to production

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT

## Support

For support, email [inikhilthhp@gmail.com](mailto:inikhilthhp@gmail.com)


=====================================================================


## Environment Configuration

The application requires the following environment setup:

- Node environment: Set `NODE_ENV` to either `development` or `production`
- Port: Default is 3000
- Upload directories: `uploads/` and `uploads/images/` for TAT images

## Project Structure

```
SSBPsychSelf/
├── client/           # Frontend React application
├── server/           # Backend Express server
├── shared/           # Shared types and utilities
├── uploads/          # User uploaded files
├── InhouseDB/        # Local JSON storage
└── dist/            # Production build output
```

## Detailed Package Structure

### Client Package (`/client`)
- `src/components/` - React components
  - `TestComponents/` - Test-specific components (TAT, WAT, SRT, SDT)
  - `ui/` - Reusable UI components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions and constants
- `src/types/` - TypeScript type definitions

### Server Package (`/server`)
- `routes/` - API route handlers
- `storage/` - Database and file storage logic
- `middleware/` - Express middlewares
- `vite.ts` - Vite development server configuration
- `index.ts` - Main server entry point

### Shared Package (`/shared`)
- `schema.ts` - Database schema definitions
- `types/` - Shared TypeScript interfaces
- `constants/` - Shared constants

### InhouseDB Package (`/InhouseDB`)
- `user_creds.json` - User credentials storage
- `wat_list.json` - Word Association Test content
- `srt_list.json` - Situation Reaction Test scenarios

### Key Dependencies
- `express` - Backend web framework
- `react` - Frontend UI library
- `vite` - Build tool and dev server
- `drizzle-orm` - Database ORM
- `multer` - File upload handling
- `wouter` - React routing
- `shadcn/ui` - UI component library
- `tailwindcss` - CSS framework

## API Structure

### Authentication Endpoints
- `POST /api/login` - User login
- `POST /api/register` - User registration

### Test Endpoints
- `GET /api/tat` - Get TAT images
- `GET /api/wat` - Get WAT words
- `GET /api/srt` - Get SRT scenarios
- `GET /api/sdt/student` - Get student SDT questions
- `GET /api/sdt/professional` - Get professional SDT questions

### Admin Endpoints
- `POST /api/upload/ppt` - Upload PPT for TAT images
- `POST /api/tat` - Add TAT content
- `POST /api/wat` - Add WAT words
- `POST /api/srt` - Add SRT scenarios
