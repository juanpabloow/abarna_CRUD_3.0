# Abarna Admin

## Gestión Operativa Abarna

A comprehensive operational management system built with Next.js for managing clients, headquarters, installations, agendas, and users.

## Features

- **Dashboard**: Overview of key metrics including client counts, headquarters, installations, and pending agendas
- **Client Management**: CRUD operations for clients (clientes)
- **Headquarters Management**: Manage company headquarters (sedes)
- **Installation Management**: Track and manage installations (instalaciones)
- **Agenda Management**: Schedule and track visits and appointments
- **User Management**: Administer system users
- **City Management**: Manage cities (ciudades)
- **Source Management**: Handle sources (fuentes)
- **Authentication**: Secure login and user authentication
- **Calendar View**: Visual calendar for agenda management

## Tech Stack

- **Framework**: Next.js 15.1.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Backend**: Supabase
- **Icons**: Lucide React
- **Calendar**: React Big Calendar
- **Date Handling**: date-fns

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Supabase account and project

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd abarna_CRUD_3.0
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Project Structure

```
app/
├── actions/          # Server actions for data operations
├── agendas/          # Agenda management pages
├── api/              # API routes
├── auth/             # Authentication pages
├── ciudades/         # City management
├── clientes/         # Client management
├── fuentes/          # Source management
├── instalaciones/    # Installation management
├── login/            # Login page
├── sedes/            # Headquarters management
└── usuarios/         # User management

components/
├── forms/            # Form components for CRUD operations
├── ui/               # Reusable UI components
└── ...               # Other components

lib/
├── supabase/         # Supabase client configurations
└── ...               # Utility functions
```

## Database Schema

The application uses Supabase with the following main tables:
- `clientes` - Clients
- `sedes` - Headquarters
- `instalaciones` - Installations
- `agendas` - Appointments/Visits
- `usuarios` - Users
- `ciudades` - Cities
- `fuentes` - Sources

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.</content>
<parameter name="filePath">d:\MontserratAI\Abarna\Code\abarna_CRUD_3.0\README.md