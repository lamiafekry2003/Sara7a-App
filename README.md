# Sara7a-App
This is the backend of a **Sara7a App** application.   It provides APIs for user authentication, authorization, and anonymous message management.Built with **Node.js**, **Express**,**MongoDB**, the backend handles secure user data, token-based authentication,message storage ,and deployment on AWS with PM2 and Nginx.

----------------------------------------------
## Features

- **Authentication**
  - Register (email & Google)
  - Login
  - Change password
  - Forgot password + reset
  - Email confirmation
  - Token refresh
  - Role-based access (user & admin)
  - Validation on all requests
- **User**
  - View profile
  - Update profile
  - Freeze/unfreeze account (by user or admin)
  - Delete account
  - Upload profile & cover images (stored in Cloud, backend saves `public_id` & `secure_url`)
  - Share profile
- **Messages**
  - Send message (anonymous or authenticated)
  - View messages
- **Others**
  - Logs stored in `/logs`
  - Deployed on AWS EC2
  - Using **PM2** to keep server always running
  - **Nginx** for reverse proxy
  - MongoDB Atlas + Compass for monitoring
  - API tested via Postman

--------------------------------------------------------

## 🚀 Installation & Run

Follow these steps to run the project locally:

```bash
# 1. Clone the repository
git clone https://github.com/lamiafekry2003/Sara7a-App.git

# 2. Navigate to the project directory
cd Sara7a-App

# 3. Install dependencies
npm install

# 4. Create a .env file in the root directory and add your environment variables

# 5. Run the development server
npm run dev
```
--------------------------------------------------------------

## 🚀 Deployment

-Deployed on **AWS EC2** instance

-Process management with **PM2**

-Reverse proxy with **Nginx**

-Database hosted on **MongoDB Atlas**

----------------------------------------------------------------

## 📬 Postman Collection
All endpoints are documented and tested in Postman.  

[![Run in Postman](https://run.pstmn.io/button.svg)](./postman/Sara7a%20App.postman_collection.json)

-------------------------------------------------------------------


