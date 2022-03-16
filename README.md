## Introduction
Money Saver allows a user to manage his expense. The user can set a budget for each month, creat categories, and record their cost. Also, the user can get a real-time chart to compare his budget and actual cost.

## Development team
* **Backend Developer**: Hang
* **Backend Developer**: Joonior, Katherine

## How this repo is organized
This project is divided into two parts: the frontend and the backend. They communicate with each other using JSON, and the source code is in the [backend branch](../../tree/backend) and the [frontend branch](../../tree/frontend) respectively.
* **Backend**: accepts and processes requests from the frontend
* **Frontend**: interacts with the end user, and communicates with the backend

## 3rd party packages (Node.js dependencies)
### Backend
*   Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore: 6.0.1
*   Microsoft.AspNetCore.Identity.EntityFrameworkCore: 6.0.1
*   Microsoft.AspNetCore.Mvc.NewtonsoftJson: 6.0.1
*   Microsoft.EntityFrameworkCore.Sqlite: 6.0.1
*   Microsoft.EntityFrameworkCore.Tools: 6.0.1
*   Microsoft.VisualStudio.Web.CodeGeneration.Design: 6.0.1
*   Swashbuckle.AspNetCore: 6.2.3
### Frontend
*   antd: 4.16.9,
*   axios: 0.21.1
*   http-proxy-middleware: 2.0.1,
*   react: 17.0.2,
*   react-cookies: 0.1.1,
*   react-dom: 17.0.2,
*   react-router-dom: 5.2.0,
*   react-scripts: 5.0.0,
*   redux: 4.1.1,
*   web-vitals: 1.1.2

## How to assemble the development environment
### Backend
1. Download and install [.NET Core (6.0 or above)](https://dotnet.microsoft.com/en-us/download)
6. Execute the following commands in a CLI:
   ```
   cd /path/to/backend/
   dotnet watch run
   ```
   the *3rd party dependencies* will be automatically installed, and the **backend** application is running now
### Frontend
1. Download and install [Node.js (14.16.1 or above)](https://nodejs.org/)
2. Execute the following commands in a CLI:
   ```
   cd /path/to/frontend/
   npm install
   npm start
   ```
   the *3rd party dependencies* will be automatically installed, and the **frontend** application is running now
### Preview
1. Launch Chrome and visit the frontend: [http://localhost](http://localhost)
2. You could check out the backend API document and test the APIs through [http://localhost:8080/swagger](http://localhost:8080/swagger/)