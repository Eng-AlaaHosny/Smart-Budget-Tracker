# Smart Budget Tracker 💰
 web application that helps you organize your spending and stay within budget by visualizing your finances through intuitive charts and analytics.

## Key Features ✨

- 📊 **Visual Spending Analysis**: Automatic calculation and visualization of your everyday spending by categories
- 🔐 **Flexible Login**: Create your own account or sign in with Google
- 📈 **Interactive Charts**: Daily spending trends and category breakdowns
- ➕ **Custom Categories**: Add unlimited spending categories beyond our defaults
- 💸 **Income/Expense Tracking**: Comprehensive financial recording system
- 📅 **Automatic Date Tracking**: All entries are saved with date information
- ⚖️ **Budget Health Check**: Instantly see if you're spending more than you earn

## Default Categories 🏷️
We include these default categories to get you started:
- Housing
- Utilities
- Groceries
- Transportation
- Entertainment
- Healthcare
- *(you can Add others here)*

## How It Works 🛠️

### 1. Login Page
- Create your personal username/password
- Or sign in quickly with your Google account

### 2. Main Dashboard
- **Daily Spending Chart**: View your daily expenditures per month
- **Category Breakdown**: Pie charts with color-coded spending categories
- **Monthly Summary**: Total income vs. expenses at a glance
- **Quick Add Buttons**:
  - Big gray button: Add new expenses
  - Small button: Record income/salary

### 3. Adding Transactions
- **Expenses**:
  - Select category from dropdown
  - Enter amount and details
  - System automatically records date
- **Income**:
  - Simple form for salary/other income
  - Contributes to your monthly total

### 4. Financial Insights
- **Spending Alerts**: Visual indicators when approaching budget limits
- **Savings Calculator**: Automatically shows monthly surplus/deficit
- **Trend Analysis**: Compare months to improve spending habits




## Installation

### Prerequisites
- Node.js v14+
- MongoDB Atlas account or local MongoDB instance
- Google OAuth credentials (if using Google login)

1. Clone the repository: git clone https://github.com/Eng-AlaaHosny/Smart-Budget-Tracker
2. Run `npm install`
3. Configure your database in `server/config/db.js`
4.Create a .env file (copy from .env.example if available)
5.Start the development server:
 Run `node server.js`
```
Smart-Budget-Tracker/
├── .gitignore                 # Git ignore rules
├── package.json               # Node.js project configuration
├── package-lock.json          # Automatic npm dependency tree
├── server.js                  # Main application entry point
├── README.md                  # Project documentation (you're editing this)
│
├── .vscode/                   # VS Code workspace settings
│   └── settings.json          # Editor configuration
│
├── server/                    # Backend server files
│   ├── config/
│   │   └── db.js              # Database connection configuration
│   │
│   ├── controller/            # Business logic
│   │   ├── chartController.js # Chart data handling
│   │   ├── crud.js            # Basic CRUD operations
│   │   ├── mainpageController.js # Main page logic
│   │   ├── mainpageCrud.js    # Main page CRUD
│   │   └── userController.js  # User authentication
│   │
│   └── routes/                # API endpoints
│       └── authRoutes.js      # Authentication routes
│
├── view/                      # Frontend templates (EJS)
│   ├── login.ejs              # Login page template
│   ├── mainpage.ejs           # Dashboard template
│   └── resetPassword.ejs      # Password reset template
│
└── style.css                  # Main stylesheet
'''

