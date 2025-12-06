# InsightFolio - User Guide

Complete guide for installing, running, and using all features of InsightFolio.

---

## Table of Contents
1. [Installation](#installation)
2. [Running the Application](#running-the-application)
3. [Getting Started](#getting-started)
4. [Feature Guide](#feature-guide)
5. [Troubleshooting](#troubleshooting)

---

## Installation

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Backend server** running on `http://127.0.0.1:5001`

### Step-by-Step Installation

#### Method 1: Using the Install Script (Recommended)
1. Open PowerShell in the project folder
2. Run the installation script:
   ```powershell
   .\install.ps1
   ```
3. Wait for all dependencies to install

#### Method 2: Manual Installation
1. Open a terminal in the project folder
2. Run:
   ```bash
   npm install
   ```
3. Wait for installation to complete

---

## Running the Application

### Start the Development Server
1. Open a terminal in the project folder
2. Run:
   ```bash
   npm start
   ```
3. The app will automatically open in your browser at `http://localhost:3000`
4. If it doesn't open automatically, navigate to `http://localhost:3000`

### Important Notes
- **Backend Required**: Make sure your backend server is running on `http://127.0.0.1:5001`
- **Port Conflicts**: If port 3000 is in use, you'll be prompted to use a different port
- **Hot Reload**: Changes to code will automatically refresh the browser

---

## Getting Started

### Creating an Account

1. **Navigate to Sign Up**
   - Open the app at `http://localhost:3000`
   - Click the **"Sign Up"** button on the landing page

2. **Fill Out Registration Form**
   - **Full Name**: Enter your full name
   - **Email**: Enter a valid email address
   - **Password**: Create a secure password
   - **Confirm Password**: Re-enter your password

3. **Submit**
   - Click **"Sign Up"**
   - You'll be automatically logged in and redirected to the Dashboard

### Logging In

1. **Navigate to Login**
   - Click **"Login"** on the landing page
   - Or visit `http://localhost:3000/login`

2. **Enter Credentials**
   - **Email**: Your registered email
   - **Password**: Your password

3. **Submit**
   - Click **"Login"**
   - You'll be redirected to the Dashboard

---

## Feature Guide

### 1. Dashboard

**Purpose**: Discover and research stocks before buying

#### Viewing Popular Stocks
1. After logging in, you'll see the Dashboard
2. **Popular Stocks** section displays 6 trending stocks
3. Each card shows:
   - Stock symbol (e.g., AAPL, MSFT)
   - Company name
   - Current price
   - Price change (green = gain, red = loss)
   - Percentage change

#### Searching for Stocks
1. **Click the Search Bar** at the top of the page
2. **Enter Search Criteria**:
   - Type a company name (e.g., "Apple")
   - Type a stock symbol (e.g., "AAPL")
   - Or leave blank to use filters only

3. **Apply Filters** (optional):
   - **Sector**: Filter by industry (e.g., Technology, Healthcare)
   - **Sub-Sector**: More specific category
   - Click **"Apply Filters"** or **"Search"**

4. **View Search Results**
   - Results appear in a modal window
   - Up to 10 stocks per page
   - Use **Previous/Next** buttons to navigate pages

#### Viewing Stock Details
1. **Click on any stock card** (from Popular Stocks or search results)
2. A **Stock Detail Modal** opens showing:
   - **Stock name and symbol**
   - **Price per share**
   - **Performance chart** (year-to-date by default)
   - **Time filter buttons**: 3D, 1W, 1M, YTD
   - **Amount held**: Shows how much of this stock you own (or $0.00 if you don't own it)
   - **Shares**: Number of shares you own (or input field to buy)

#### Viewing Performance Over Time
1. In the stock detail modal, use the **time filter buttons**:
   - **3D**: Last 3 days
   - **1W**: Last week
   - **1M**: Last month
   - **YTD**: Year to date
2. The chart updates to show the selected time period
3. **Color indicates performance**:
   - **Green**: Positive growth in selected period
   - **Red**: Negative growth in selected period

#### Buying Stocks (from Dashboard)
1. **Click on a stock** you want to buy
2. In the modal, **enter quantity** in the Shares field
3. **Total cost** updates automatically
4. Click **"Buy"** button
5. **Confirmation**: Modal closes and your portfolio updates
6. **Error Handling**: If you don't have enough balance, an error message appears

---

### 2. Portfolio

**Purpose**: View and manage your stock holdings

#### Accessing Your Portfolio
1. Click **"Portfolio"** in the top navigation bar
2. Or visit `http://localhost:3000/portfolio`

#### Understanding Portfolio Overview
The top section displays:
- **Holdings Value**: Total value of all your stocks
- **Growth Percentage**: Overall portfolio performance (green = gain, red = loss)
- **Stocks Held**: Number of different stocks you own
- **Total Shares**: Combined shares across all holdings
- **Account Balance**: Cash available for buying stocks

#### Portfolio Performance Chart
1. Shows your portfolio value over time
2. **Time Filter Buttons**:
   - **3D**: Last 3 days of performance
   - **1W**: Last week
   - **1M**: Last month
   - **YTD**: Year to date
3. Click a button to change the time range
4. Chart color changes based on performance:
   - **Green**: Portfolio gained value in selected period
   - **Red**: Portfolio lost value in selected period

#### Viewing Your Holdings
Below the chart, you'll see a table with all your stocks:
- **Symbol**: Stock ticker (e.g., AAPL)
- **Company Name**: Full company name
- **Shares**: Number of shares you own
- **Amount Held**: Total value of this holding (shares × current price)
- **Growth**: Percentage change since purchase (green = profit, red = loss)

#### Managing Individual Holdings
1. **Click on any stock** in your holdings table
2. A **Holding Detail Modal** opens showing:
   - Stock performance chart
   - Time filter buttons (3D, 1W, 1M, YTD)
   - Amount held
   - Number of shares owned
   - Current growth percentage
   - Price per share

#### Selling Stocks
1. **Click on a stock** you want to sell
2. In the modal, **enter quantity** to sell
3. **Total proceeds** displays
4. Click **"Sell"** button
5. **Confirmation**: Modal closes and portfolio updates
6. **Error Handling**: Can't sell more shares than you own

#### Buying More of a Stock You Own
1. **Click on the stock** in your holdings
2. In the modal, **enter additional quantity**
3. **Total cost** displays
4. Click **"Buy"** button
5. Your holdings and account balance update

---

### 3. Navigation

#### Top Navigation Bar
Available on all pages after login:
- **InsightFolio Logo**: Click to return to Dashboard
- **Dashboard**: Go to stock discovery page
- **Portfolio**: View your holdings
- **Logout**: Sign out of your account

---

## Troubleshooting

### Common Issues

#### "Cannot connect to server"
- **Solution**: Make sure backend server is running on `http://127.0.0.1:5001`
- Check backend console for errors

#### "Port 3000 is already in use"
- **Solution**: 
  - Option 1: Close other apps using port 3000
  - Option 2: Accept the prompt to use a different port (e.g., 3001)

#### Charts not displaying
- **Solution**:
  - Refresh the page
  - Check browser console for errors (F12)
  - Ensure backend is returning historical data

#### "Account balance insufficient"
- **Solution**: 
  - You don't have enough cash to buy the stock
  - Sell some holdings to free up cash
  - Or reduce the quantity you're trying to buy

#### Stock prices showing $0 or NaN
- **Solution**:
  - Backend may not have data for that stock
  - Try refreshing the page
  - Check backend logs

#### Holdings not appearing after purchase
- **Solution**:
  - Refresh the Portfolio page
  - Check browser console for errors
  - Verify transaction completed (check backend logs)

#### Performance chart shows only one point
- **Solution**: This is expected if backend only returns one historical data point
  - Frontend interpolates data to show a full chart
  - Contact backend team to add more historical data points

---

## Tips & Best Practices

### Smart Stock Management
1. **Diversify**: Don't put all your money in one stock
2. **Research First**: Use Dashboard to analyze stocks before buying
3. **Monitor Performance**: Check your portfolio regularly using different time filters
4. **Track Growth**: Use the YTD view to see long-term performance

### Using Time Filters Effectively
- **3D**: Quick check on recent volatility
- **1W**: Short-term trend analysis
- **1M**: Medium-term performance review
- **YTD**: Long-term investment tracking

### Account Balance Management
- Keep some cash in your account balance for opportunities
- Don't invest 100% of your balance immediately
- Monitor your total portfolio value vs account balance

---

## Keyboard Shortcuts

- **Enter/Space**: Activate clickable stock cards
- **Escape**: Close modals
- **Tab**: Navigate through form fields

---

## Additional Resources

- **Package.json**: See all installed dependencies
- **Error Messages**: Read carefully - they usually explain the issue
- **Browser Console**: Press F12 to see detailed error logs

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console errors (F12)
3. Check backend server logs
4. Contact the development team

---

**Last Updated**: December 5, 2025  
**Version**: 1.0.0
