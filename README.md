# Registration Application Setup Guide


This guide provides detailed step-by-step instructions to set up the Registration Application on your local machine. The application consists of a **Go backend** and a **React frontend**. Follow the instructions below to get the application running on **Linux**, **Windows**, or **macOS**.

---

## Table of Contents

*   [Prerequisites](#prerequisites)
    *   [1\. Install Git](#1-install-git)
    *   [2\. Install Go](#2-install-go)
    *   [3\. Install Node.js and npm](#3-install-nodejs-and-npm)
    *   [4\. Install PostgreSQL](#4-install-postgresql)
*   [Clone the Repository](#clone-the-repository)
*   [Backend Setup](#backend-setup)
    *   [1\. Configure Environment Variables](#1-configure-environment-variables)
    *   [2\. Initialize the Database](#2-initialize-the-database)
    *   [3\. Install Go Dependencies](#3-install-go-dependencies)
    *   [4\. Run the Backend Server](#4-run-the-backend-server)
*   [Frontend Setup](#frontend-setup)
    *   [1\. Install Node.js Dependencies](#1-install-nodejs-dependencies)
    *   [2\. Run the Frontend Application](#2-run-the-frontend-application)
*   [Testing the Application](#testing-the-application)
*   [Additional Notes](#additional-notes)
*   [Troubleshooting](#troubleshooting)
*   [License](#license)
    
---

Prerequisites
-------------

Before you begin, ensure you have the following software installed:

### 1\. Install Git

Git is required to clone the repository.

*   **Linux**: Install via package manager (e.g., `sudo apt-get install git` for Debian-based systems).
    
*   **Windows**: Download and install from [git-scm.com](https://git-scm.com/download/win).
    
*   **macOS**: Install via Homebrew (`brew install git`) or download from [git-scm.com](https://git-scm.com/download/mac).
    

### 2\. Install Go
The backend is written in Go. Install Go version **1.16** or higher.
*   **Download Link**: [golang.org/dl](https://golang.org/dl/)

#### **Installation Instructions:**
**Linux**:

  ```bash
  # Download Go (replace "1.21.1" with the latest version)
  wget https://golang.org/dl/go1.21.1.linux-amd64.tar.gz
  # Extract to /usr/local
  sudo tar -C /usr/local -xzf go1.21.1.linux-amd64.tar.gz
  # Add Go to PATH
  echo "export PATH=\$PATH:/usr/local/go/bin" >> ~/.bashrc
  source ~/.bashrc
  ```

**Windows**:

* Download the Windows installer and follow the prompts.

**macOS**:

  ```bash
  # Install using Homebrew
  brew install go
  # Or download and install manually from the official website
  ```

### 3\. Install Node.js and npm
The frontend is built with React and requires Node.js and npm.
* **Download Link**: [nodejs.org/en/download/](https://nodejs.org/en/download/package-manager)

**Installation Instructions**:

**Linux**:
  ```bash
  # Using nvm (Node Version Manager)
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
  source ~/.bashrc
  nvm install --lts

  # Verify installation
  node -v
  npm -v
  ```

**Windows**:
* Download the Windows installer and follow the prompts.

**macOS**:
  ```bash
  # Install using Homebrew
  brew install node
  # Or use nvm
  brew install nvm
  mkdir ~/.nvm
  echo "export NVM_DIR=~/.nvm" >> ~/.bash_profile
  echo "source $(brew --prefix nvm)/nvm.sh" >> ~/.bash_profile
  source ~/.bash_profile
  nvm install --lts
  # Verify installation
  node -v
  npm -v
  ```

### 4\. Install PostgreSQL
The application uses PostgreSQL as its database.
**Installation Instructions**:
**Linux**:
  ```bash
  # For Debian-based systems
  sudo apt-get update
  sudo apt-get install postgresql postgresql-contrib

  # Start PostgreSQL service
  sudo service postgresql start
  ```
**Windows**:
* Download and install from postgresql.org.
* During installation, set a password for the `postgres` user.

**macOS**:
```bash
# Install using Homebrew
brew install postgresq
# Initialize and start PostgreSQL service
brew services start postgresql
```
---

## Clone the Repository
Open your terminal (or Git Bash on Windows) and run:
```bash
git clone https://github.com/yourusername/registration-app.git
cd registration-app
```
_Replace `yourusername` with the actual GitHub username or the repository URL._

---
## Backend Setup
### 1\. Configure Environment Variables
The backend requires a `.env` file with the database connection string.

1\. **Create a `.env` file in the root of the project:**

```bash
cd registration-app
touch .env
```

2\. **Add the following content to the `.env` file**:

```env
DATABASE_URL=postgres://username:password@localhost:5432/registrationdb?sslmode=disable
```
* Replace `username` and `password` with your PostgreSQL credentials.
* Replace `registrationdb` with your desired database name.

### 2\. Initialize the Database
**Option 1: Using SQL Script**
1\. **Create the Database and User (if necessary)**:
  ```sql
  -- Connect to PostgreSQL (Linux/macOS)
  sudo -u postgres psql

  -- Or on Windows, use psql with your postgres user
  psql -U postgres

  -- In the psql shell:
  CREATE DATABASE registrationdb;
  CREATE USER yourusername WITH PASSWORD 'yourpassword';
  GRANT ALL PRIVILEGES ON DATABASE registrationdb TO yourusername;
  ```
2\. **Run the SQL Script to Create the Table**:

Create a file named init.sql with the following content:

```sql
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  date_of_birth TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
Then run:

```bash
psql -U yourusername -d registrationdb -f init.sql
```
_Replace `yourusername` with your PostgreSQL username._

**Option 2: Using a Go Script**

Alternatively, you can create a Go script to initialize the database.

1\. **Create a file named init_db.go in the backend directory**:
  ```go
  package main

  import (
    "context"
    "fmt"
    "log"
    "os"

    "github.com/jackc/pgx/v4"
  )

  func main() {
    databaseURL := os.Getenv("DATABASE_URL")
    conn, err := pgx.Connect(context.Background(), databaseURL)
    if err != nil {
      log.Fatalf("Unable to connect to database: %v\n", err)
    }
    defer conn.Close(context.Background())

    createTableSQL := `
    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      date_of_birth TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `

    _, err = conn.Exec(context.Background(), createTableSQL)
    if err != nil {
      log.Fatalf("Failed to create table: %v\n", err)
    }

    fmt.Println("Database initialized successfully.")
  }
  ```
2\. **Run the Go Script**:
  ```bash
  go run init_db.go
  ```
### 3\. Install Go Dependencies

Ensure you're in the project root directory.
  ```bash
  cd backend
  go mod init registration-app
  go mod tidy
  ```
This will initialize a new Go module and download the required dependencies.
### 4\. Run the Backend Server

Start the backend server by running:
  ```bash
  go run *.go
  ```
The server should start on port **8080**.

---
## Frontend Setup
### 1\. Install Node.js Dependencies
Navigate to the frontend directory and install the dependencies.
  ```bash
  cd frontend
  npm install
  ```
### 2\. Run the Frontend Application
Start the frontend development server:
  ```bash
  npm start
  ```
The application should open in your browser at http://localhost:3000.

---
Testing the Application
-----------------------

With both the backend and frontend servers running:

1.  Open your web browser and navigate to [http://localhost:3000](http://localhost:3000).
    
2.  **Create a New Registration:**
    
    *   Fill out the registration form.
        
    *   Submit the form.
        
    *   Ensure that validation works (e.g., leaving required fields empty shows error messages).
        
3.  **View Registrations:**
    
    *   Navigate to the "View Registrations" page.
        
    *   Verify that your registration appears in the list.
        
4.  **Edit a Registration:**
    
    *   Click on a registration to view its details.
        
    *   Click the "Edit" button to modify the registration.
        
    *   Submit the changes and verify they are saved.
        
5.  **Delete a Registration:**
    
    *   From the registration details page, click the "Delete" button.
        
    *   Confirm the deletion.
        
    *   Verify that the registration no longer appears in the list.
---
Additional Notes
----------------

*   **Environment Variables:**
    *   Ensure that the `.env` file in the backend contains the correct `DATABASE_URL`.
    *   You can set `DATABASE_URL` directly in your environment instead of using a `.env` file.
        
*   **CORS Configuration:**
    *   The backend uses the `cors.Default()` middleware to allow all origins.
    *   For production, consider configuring CORS to restrict origins.
        
*   **Backend API Endpoints:**
    *   `GET /registrations` - Retrieve all registrations.
    *   `POST /registrations` - Create a new registration.
    *   `GET /registrations/:id` - Retrieve a registration by ID.
    *   `PUT /registrations/:id` - Update a registration by ID.
    *   `DELETE /registrations/:id` - Delete a registration by ID.
        
*   **Frontend Proxy Configuration:**
    *   The frontend is configured to proxy API requests to the backend.
    *   Ensure that the backend is running on http://localhost:8080.
---        

Troubleshooting
---------------

*   **Port Conflicts:**
    *   If port `8080` or `3000` is already in use, you may need to stop the conflicting service or adjust the application to use a different port.
        
*   **Database Connection Issues:**
    *   Ensure that PostgreSQL is running.
    *   Verify the `DATABASE_URL` in your `.env` file is correct.
    *   Check that your PostgreSQL user has the necessary permissions.
        
*   **Go Module Errors:**
    *   Run `go mod tidy` to resolve module dependencies.
        
*   **CORS Errors:**
    *   If you encounter CORS errors, ensure that the backend CORS middleware is properly configured.
        
*   **Backend Crashes or Errors:**
    *   Check the terminal output where the backend is running for error messages.
    *   Ensure all required Go packages are installed.
        
*   **Frontend Build Errors:**
    *   Delete `node_modules` and run `npm install` again.
    *   Ensure that you are using a compatible Node.js and npm version.
        

License
-------

This project is licensed under the MIT License.

---

**Congratulations!** You have successfully set up the Registration Application on your local machine. If you encounter any issues or have questions, feel free to reach out or open an issue on the repository.

---