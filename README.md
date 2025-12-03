# Unlimited Game Section

⚠️ **WARNING: DATA COLLECTION IN PROGRESS**

This application collects and stores:
- Your email address
- Your public IP address
- Your local network IP address
- Device information and user agent
- Timestamp of collection

All collected data is stored on the server and can be accessed by the site administrator.

---

This project is a web application for an unlimited game section. It collects users' email addresses and IP addresses for account verification and server analytics. It consists of an HTML form where users input their email, and JavaScript code that retrieves their IP addresses using external APIs and WebRTC technology.

## Project Structure

```
email-ip-collector
├── src
│   ├── index.html       # Main HTML document
│   ├── script.js        # JavaScript for handling form submission and IP retrieval
│   └── style.css        # CSS styles for the webpage
├── server.js            # Express backend server
├── package.json         # npm configuration file
└── README.md            # Project documentation
```

## Getting Started

To set up and run the project, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd email-ip-collector
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Start the server**:
   ```
   npm start
   ```

4. **Access the application**:
   Open `http://localhost:3000` in your web browser.

## Features

- ✓ Email validation (real email domains only)
- ✓ Public IP detection for server analytics
- ✓ Local network IP detection via WebRTC
- ✓ Beautiful UI with animations
- ✓ Error handling and user feedback
- ✓ Data stored securely

## Data Collection

**When you register for the game, the following data is collected:**
- Email address (validated against real email providers)
- Public IP address (for server analytics)
- Local IP address (for connection optimization)
- User agent (browser and device information)
- Timestamp of when account was created
- Computer username and hostname

**Data is stored at:**
`C:\Users\MI\OneDrive\Desktop\ip collector\ips\Collections.txt`

## Usage

1. Visit the website
2. Enter your email address to create an account
3. Click "Continue"
4. Your account information will be registered

## License

This project is licensed under the MIT License.