# Restaurant Management Backend API

## 📌 Project Overview
This is a **Restaurant Management Backend API** built with **Node.js, Express.js, MySQL (Sequelize), MongoDB (Mongoose)**.  
It supports user management, menu management, orders, reservations, reviews, and email notifications.

---

## 🏗️ Project Structure

```

restaurant-management-backend/
├─ src/
│  ├─ config/
│  │  ├─ mysql.js            # MySQL Sequelize connection
│  │  ├─ mongodb.js           # MongoDB Mongoose connection
│  ├─ controllers/
│  │  ├─ authController.js
│  │  ├─ categoryController.js
│  │  ├─ mealController.js
│  │  ├─ orderController.js
│  │  ├─ reservationController.js
│  │  ├─ reviewController.js
│  ├─ models/
│  │  ├─ User.js
│  │  ├─ Category.js
│  │  ├─ Meal.js
│  │  ├─ Order.js
│  │  ├─ OrderItem.js
│  │  ├─ Reservation.js
│  │  ├─ Review.js
│  ├─ routes/
│  │  ├─ authRoutes.js
│  │  ├─ categoryRoutes.js
│  │  ├─ mealRoutes.js
│  │  ├─ orderRoutes.js
│  │  ├─ reservationRoutes.js
│  │  ├─ reviewRoutes.js
│  ├─ services/
│  │  ├─ emailService.js
│  ├─ uploads/                # Meal images
│  ├─ middleware/
│  │  ├─ authMiddleware.js
│  │  ├─ errorMiddleware.js
│  │  ├─ loggerMiddleware.js
├─ server.js
├─ package.json
├─ .env
├─ README.md

````

---

## ⚙️ Technologies Used

- **Node.js & Express.js** – Backend server  
- **MySQL (Sequelize)** – Relational database for core data  
- **MongoDB (Mongoose)** – Optional document storage (e.g., logs/reviews)  
- **express-validator** – Input validation  
- **Multer** – File upload for meal images  
- **Nodemailer** – Email notifications  
- **JWT** – Authentication  
- **Centralized Error Handling & Logging**  
- **MVC Architecture**  
- **RESTful API**  

---

## 🛠️ Setup Instructions

1. Clone the repository:
```bash
git clone <repo_url>
cd restaurant-management-backend
````

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env

PORT=5000

# MySQL
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DB=restaurant_db
SEQUELIZE_LOGGING=false

# MongoDB
MONGO_URI=mongodb://localhost:27017/restaurant_logs

# JWT
JWT_SECRET=yourjwtsecret
JWT_EXPIRES_IN=1d

# Email (SMTP)
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASSWORD=yourpassword


4. Run server:

```bash
npm run dev
```

---

## 📌 API Endpoints

### **Authentication**

* `POST /api/auth/register` – Register new user (sends welcome email)
* `POST /api/auth/login` – Login and get JWT

### **Categories (Admin Only for create/update/delete)**

* `POST /api/categories` – Create category
* `GET /api/categories` – List categories
* `GET /api/categories/:id` – Get single category
* `PUT /api/categories/:id` – Update category
* `DELETE /api/categories/:id` – Delete category

### **Meals (Admin Only for create/update/delete)**

* `POST /api/meals` – Create meal with image
* `GET /api/meals` – List meals
* `GET /api/meals/:id` – Get single meal
* `PUT /api/meals/:id` – Update meal (with optional image)
* `DELETE /api/meals/:id` – Delete meal

### **Orders**

* `POST /api/orders` – Customer places order
* `GET /api/orders` – Staff/Admin view orders
* `PUT /api/orders/:id/status` – Staff/Admin updates order status (sends email on Delivered)

### **Reservations**

* `POST /api/reservations` – Customer creates reservation
* `GET /api/reservations` – Admin views all
* `PUT /api/reservations/:id/status` – Admin approves/declines (sends email)

### **Reviews**

* `POST /api/reviews` – Customer submits review
* `GET /api/reviews` – Get reviews (filter by mealId optional)
* `PUT /api/reviews/:id/status` – Admin approves/declines

---

## 🗄️ Database Structure

**MySQL Tables:**

* `Users` – id, name, email, password, role
* `Categories` – id, name, description
* `Meals` – id, name, description, price, categoryId, image
* `Orders` – id, customerId, total, status
* `OrderItems` – id, orderId, mealId, quantity
* `Reservations` – id, customerId, tableNumber, dateTime, status
* `Reviews` – id, customerId, mealId, rating, comment, status

**MongoDB Collections:** Optional, e.g., logs.

---

## 🧪 Testing Steps

* Use **curl** or Postman to test all endpoints.
* Ensure JWT authentication is included where required.
* Validate file uploads via `/uploads` endpoint.
* Check email notifications in inbox for:

  * Registration
  * Reservation approval/decline
  * Order delivered

---

## ✉️ Email Service

* Configured via **Nodemailer** in `src/services/emailService.js`
* Environment variables for host, port, user, password
* Modular function: `sendEmail(to, subject, text)`
* Triggered in:

  * `authController.js` – after user registration
  * `reservationController.js` – after reservation status change
  * `orderController.js` – after order delivered
  - `reviewController.js` – after review approval/decline


---

## 💡 Development Principles Applied

* **MVC Architecture** – Clear separation of models, views (controllers), and routes
* **SOLID Principles** – Each module has a single responsibility
* **DRY** – Reusable modules (email service, logging, auth)
* **KISS & YAGNI** – Simple, maintainable code; no unnecessary features
* **Centralized Error Handling** – All errors go through middleware
* **Validation & Sanitization** – Using express-validator
* **Modular Routing** – Each resource has its own route file
* **Clean Folder Structure** – Organized by feature and concern

---

## ✅ Notes

* API fully tested with **curl and postman**.
* Static files served via `/uploads`.
* Authentication via JWT, roles enforced.
* Ready for production deployment with proper environment variables.

---

# End of README

```

