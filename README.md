# Department Manager Frontend

A modern, responsive web application for managing department hierarchies. Built with Next.js, Apollo Client, and Tailwind CSS.

## Features

- **User Authentication**
  - Secure JWT-based authentication
  - Beautiful login form with error handling
  - Persistent session management

- **Department Management**
  - Create, read, update, and delete departments
  - Manage sub-departments with an intuitive interface
  - Beautiful modal forms for department operations
  - Responsive table view with hierarchy display
  - Real-time updates after modifications

- **Advanced UI Features**
  - Pagination with customizable items per page
  - Modern design with Tailwind CSS
  - Responsive layout for all screen sizes
  - Loading states and error handling
  - Beautiful transitions and hover effects
  - Accessible components with ARIA labels

- **Data Management**
  - GraphQL integration with Apollo Client
  - Efficient caching and state management
  - Optimistic updates for better UX
  - Error boundary implementation

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser

## API Integration

The frontend connects to a NestJS backend that provides the following GraphQL endpoints:

- **Authentication**: JWT-based login
- **Departments**: CRUD operations with pagination
- **Sub-departments**: Nested department management

## Tech Stack

- **Framework**: Next.js 15.3.1
- **State Management**: Apollo Client
- **Styling**: Tailwind CSS
- **Authentication**: JWT
- **Data Fetching**: GraphQL

## Best Practices

- Responsive design principles
- Component-based architecture
- Type-safe development with TypeScript
- Proper error handling
- Accessible UI components
- Clean code structure
- Modern React patterns

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
