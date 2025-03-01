# Job Management System 🧑‍💼💼

A job management system built with Express, Mongoose, Socket.IO, GraphQL, and several other tools to enhance security, performance, and user experience. This platform allows companies to post job openings, manage job applications, and communicate with applicants. Users can apply for jobs, and HR or company owners can review applications in real-time. The system also includes company management features, authentication, email notifications, and enhanced security and performance using CORS, Helmet, Rate-Limiting, and ExcelJS.

## Features 🎯

### Company Management 🏢
- **Add Company**: Admins can add new companies to the system.  
- **Update Company**: Admins can update company details.  
- **Delete Company**: Admins can delete companies from the system.

### Job Management 💼
- **Add Job**: Only company owners or HR can add new job listings.  
- **Update Job**: Only company owners can update existing jobs.  
- **Delete Job**: Only company HR related to the job's company can delete the job.  
- **Get Jobs**: Fetch all jobs or specific jobs with filters (e.g., working time, job location, seniority level).  
- **Filter Jobs**: Filter jobs based on various criteria with pagination and sorting.  
- **Job Applications**: HR or company owners can view applications for a specific job.

### User Applications 📝
- **Apply to Job**: Users with the "User" role can apply for jobs. HR is notified via a socket event.  
- **Accept/Reject Applicant**: HR can accept or reject applicants. Acceptance/rejection emails are sent to the applicant to notify them of the outcome.

### Real-Time Messaging 💬
- **Chat API**: Real-time communication between HR/company owners and users using Socket.IO. HR or company owners can initiate chats with users, who can reply in real time.  
- **Chat History**: Fetch chat history with a specific user.

### Authentication & GraphQL Dashboard 🔐
- **JWT Authentication**: Secure authentication with JWT tokens.  
- **Google Authentication**: Users can authenticate using Google OAuth.  
- **GraphQL Dashboard**: An admin panel using GraphQL to manage user authentication, companies, and jobs.

### Security & Performance Enhancements 🛡️⚡
- **CORS (Cross-Origin Resource Sharing)**: Configured to enable cross-origin requests.  
- **Helmet**: Helps secure the application by setting HTTP headers.  
- **Rate-Limiting**: Protects the API from excessive requests to prevent abuse and DDoS attacks.  
- **ExcelJS**: For generating and downloading Excel reports of job applications.  
- **Bcrypt & CryptoJS**: For password hashing (Bcrypt) and encryption (CryptoJS).  
- **Joi**: Data validation for inputs and API requests.  
- **OTP Generation**: One-Time Password generation for user verification using NanoID.

### File Uploads 📁
- **Cloudinary Integration**: For secure file storage and handling file uploads.  
- **Multer**: For handling multipart form-data, especially for file uploads.

### Task Scheduling ⏰
- **Node-Cron**: Scheduling tasks such as data cleanup.

## Technologies Used 🔧
- **Node.js**  
- **Express.js**  
- **Mongoose (MongoDB ORM)**  
- **Socket.IO**  
- **GraphQL** for the authentication dashboard  
- **JWT (JSON Web Tokens)** for authentication  
- **Google Auth** for OAuth authentication  
- **Nodemailer** for email notifications  
- **CORS** for cross-origin resource sharing  
- **Helmet** for securing HTTP headers  
- **Rate-Limit** to protect against too many requests  
- **ExcelJS** for generating Excel reports  
- **Bcrypt** for password hashing  
- **CryptoJS** for encryption  
- **Joi** for data validation  
- **Cloudinary** for file storage and uploads  
- **Multer** for handling file uploads  
- **NanoID** for OTP generation  
- **Node-Cron** for scheduling tasks
