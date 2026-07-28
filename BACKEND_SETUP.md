# Busca Tours - Backend Setup Guide

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js 18+** 
- **PostgreSQL 14+** running locally or remote
- **npm** or **yarn**

### 2. Database Setup
```bash
# Create database (run in psql or pgAdmin)
CREATE DATABASE buscatours;
```

### 3. Backend Installation
```bash
cd backend
npm install
```

### 4. Environment Configuration
Copy `.env.example` to `.env` and update:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/buscatours?schema=public"
PORT=4000
NODE_ENV=development
VITE_GEMINI_API_KEY="your-gemini-api-key"  # Optional for AI features
```

### 5. Database Migration & Seed
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database (creates tables)
npm run prisma:push

# OR run migrations (for production)
npm run prisma:migrate

# Seed initial data
npm run db:seed
```

### 6. Start Development Server
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend (from root)
npm run dev
```

## 📁 Project Structure
```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Initial data
├── src/
│   ├── graphql/
│   │   ├── typeDefs/      # GraphQL schemas
│   │   └── resolvers/     # Resolver functions
│   ├── server.js          # Express + Apollo Server
│   └── utils/
├── package.json
└── .env
```

## 🔧 Available Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run start` | Start production server |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:push` | Push schema changes to DB |
| `npm run prisma:migrate` | Run migrations |
| `npm run prisma:studio` | Open Prisma Studio (GUI) |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:reset` | Reset DB and re-seed |

## 🌐 GraphQL Endpoint
- **Local:** `http://localhost:4000/graphql`
- **Health:** `http://localhost:4000/health`

## 📊 Schema Overview

### Main Models
- **User** - Platform users (admin, operators, customers)
- **Tour** - Tour packages with full details
- **Booking** - Customer bookings
- **SliderSlide** - Hero slider content

### Key Queries
```graphql
# Get all published tours
query { tours(filter: { status: PUBLISHED }) { id title price } }

# Get tour by ID
query { tour(id: "1") { title description price } }

# Get user bookings
query { userBookings(userId: "user-1") { bookingId status tour { title } } }

# Search tours
query { searchTours(query: "Machu Picchu") { title price } }
```

### Key Mutations
```graphql
# Create tour
mutation { createTour(input: { title: "New Tour", ... }) { id } }

# Create booking
mutation { createBooking(input: { tourId: "1", userId: "1", guests: 2, date: "2024-06-15" }) { bookingId } }

# Update user
mutation { updateUser(id: "1", input: { name: "New Name" }) { name } }
```

## 🔐 Authentication
Currently uses simple header-based auth:
```
Header: x-user-id: <user-id>
```
For production, implement JWT tokens.

## 🤖 AI Features (Optional)
Set `VITE_GEMINI_API_KEY` in `.env` to enable:
- Tour recommendations via chat
- AI tour generation in Admin Panel

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Verify DATABASE_URL format
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### Prisma Errors
```bash
# Regenerate client
npm run prisma:generate

# Reset database (⚠️ deletes all data)
npm run db:reset
```

### Port Already in Use
```bash
# Change PORT in .env or kill process
lsof -ti:4000 | xargs kill -9
```

## 📝 Frontend Integration
Update frontend `.env`:
```env
VITE_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
```

The `dataService.js` now uses GraphQL instead of localStorage.

## 🚀 Deployment
1. Set production `DATABASE_URL`
2. Run `npm run prisma:migrate deploy`
3. Build: `npm run build` (if applicable)
4. Start: `npm run start`

## 📚 Useful Links
- [Prisma Docs](https://www.prisma.io/docs)
- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server)
- [GraphQL Playground](http://localhost:4000/graphql) - Available in dev