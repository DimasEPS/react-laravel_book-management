# Book Management Dashboard - OTP Authentication System

## 🎉 Overview

This Laravel + React application provides a complete book management dashboard with OTP (One-Time Password) authentication. Users can register and login using only their email address with OTP verification, then manage their book collections.

## ✨ Features

### Authentication

-   **OTP-based Login/Register**: No passwords required
-   **Email Verification**: 6-digit OTP codes sent via email
-   **Session Management**: Secure session-based authentication
-   **Auto-logout**: Handles expired sessions gracefully

### Book Management

-   **Full CRUD Operations**: Create, Read, Update, Delete books
-   **Book Fields**: Title, Author, Description, Year
-   **Search & Filter**: Search by title, author, or description
-   **Statistics Dashboard**: View total books, search results, and unique authors
-   **Responsive Design**: Works on desktop, tablet, and mobile

### UI/UX

-   **Professional Design**: Clean, modern interface
-   **Loading States**: Skeleton loading for better user experience
-   **Form Validation**: Client-side validation with error messages
-   **Interactive Elements**: Hover effects, smooth transitions
-   **Alert System**: Success and error notifications

## 🚀 Quick Start

### Prerequisites

-   PHP 8.1+
-   Composer
-   Node.js & npm
-   Laravel 11
-   SQLite/MySQL database

### Installation Steps

1. **Install Dependencies**

    ```bash
    composer install
    npm install
    ```

2. **Environment Setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

3. **Configure Email (Important!)**
   Update your `.env` file with email settings:

    ```env
    MAIL_MAILER=smtp
    MAIL_HOST=your-smtp-host
    MAIL_PORT=587
    MAIL_USERNAME=your-email@example.com
    MAIL_PASSWORD=your-password
    MAIL_ENCRYPTION=tls
    MAIL_FROM_ADDRESS=your-email@example.com
    MAIL_FROM_NAME="${APP_NAME}"
    ```

4. **Database Setup**

    ```bash
    # Update database settings in .env if using MySQL
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=book_management
    DB_USERNAME=your_username
    DB_PASSWORD=your_password

    # Run migrations
    php artisan migrate
    ```

5. **Build Frontend Assets**

    ```bash
    npm run dev
    # or for production
    npm run build
    ```

6. **Start the Application**
    ```bash
    php artisan serve
    ```

## 📱 How to Use

### 1. Registration

1. Visit `/register`
2. Enter your name and email address
3. Click "Kirim Kode OTP"
4. Check your email for the 6-digit OTP code
5. Enter the OTP code and click "Selesai Daftar"

### 2. Login

1. Visit `/login`
2. Enter your email address
3. Click "Kirim Kode OTP"
4. Check your email for the 6-digit OTP code
5. Enter the OTP code and click "Verifikasi"

### 3. Book Management

1. After login, click "Manajemen Buku" in the navigation
2. **Add Books**: Click the "Tambah Buku" button
3. **Edit Books**: Click the edit (pencil) icon on any book card
4. **Delete Books**: Click the delete (trash) icon on any book card
5. **Search Books**: Use the search bar to find books by title, author, or description

## 🛠 API Endpoints

### Authentication

-   `POST /auth/send-otp` - Send OTP code to email
-   `POST /auth/verify-otp` - Verify OTP and authenticate user
-   `POST /logout` - Logout user

### Books (Requires Authentication)

-   `GET /api/books` - List all books
-   `POST /api/books` - Create new book
-   `GET /api/books/{id}` - Get specific book
-   `PUT /api/books/{id}` - Update book
-   `DELETE /api/books/{id}` - Delete book

## 📁 Project Structure

```
app/
├── Http/Controllers/
│   ├── Auth/OtpAuthController.php    # Web OTP authentication
│   ├── BookController.php            # Book CRUD operations
│   └── OtpController.php            # API OTP authentication
├── Models/
│   ├── Book.php                     # Book model
│   ├── Otp.php                      # OTP model
│   └── User.php                     # User model (with Sanctum)

resources/js/
├── Components/
│   ├── Auth/Login.jsx               # OTP login component
│   └── Books/                       # Book management components
├── Pages/
│   ├── Auth/
│   │   ├── Login.jsx               # Login page
│   │   └── Register.jsx            # Register page
│   ├── BookManagement.jsx          # Main book dashboard (Inertia)
│   └── BookDashboard.jsx           # Standalone dashboard
├── Services/
│   ├── api.js                      # API service for Sanctum
│   └── webApi.js                   # Web service for sessions
└── Layouts/AuthenticatedLayout.jsx # Main layout

routes/
├── web.php                         # Web routes (OTP auth)
└── api.php                         # API routes (Sanctum)
```

## 🔧 Configuration Options

### OTP Settings

-   **OTP Expiration**: 10 minutes (configurable in `OtpController.php`)
-   **OTP Length**: 6 digits
-   **Email Template**: Plain text (can be customized with Mailable classes)

### Book Fields

-   **Title**: Required, string
-   **Author**: Required, string
-   **Description**: Optional, text
-   **Year**: Optional, integer (1000 - current year)

## 🌐 Available Routes

### Web Routes (Session-based)

-   `/` - Welcome page
-   `/login` - OTP login page
-   `/register` - OTP registration page
-   `/dashboard` - User dashboard
-   `/books` - Book management dashboard
-   `/profile` - User profile management

### Standalone Routes

-   `/book-dashboard` - Standalone book dashboard (uses API authentication)

## 🚨 Troubleshooting

### Common Issues

1. **OTP Email Not Sending**

    - Check email configuration in `.env`
    - Verify SMTP credentials
    - Check spam folder

2. **Authentication Errors**

    - Clear browser cookies and localStorage
    - Check CSRF token configuration
    - Verify session configuration

3. **Book Operations Failing**
    - Ensure user is properly authenticated
    - Check API routes are accessible
    - Verify database connection

### Debug Mode

Enable debug mode in `.env` for detailed error messages:

```env
APP_DEBUG=true
```

## 🔒 Security Features

-   **CSRF Protection**: All forms include CSRF tokens
-   **Session Security**: Secure session management
-   **OTP Expiration**: Codes expire after 10 minutes
-   **Input Validation**: Server and client-side validation
-   **API Rate Limiting**: Built-in Laravel rate limiting

## 🎨 Customization

### Styling

-   Tailwind CSS for utility-first styling
-   Custom CSS in `resources/css/book-dashboard.css`
-   Component-level styling in JSX files

### Email Templates

-   Currently uses plain text emails
-   Can be upgraded to HTML emails using Laravel Mailables

### OTP Delivery

-   Currently email-only
-   Can be extended to support SMS via services like Twilio

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions:

1. Check this README file
2. Review the troubleshooting section
3. Check Laravel and React documentation
4. Open an issue on the repository

---

**Happy Book Managing! 📚**
