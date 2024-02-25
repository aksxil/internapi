require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const ErrorHandler = require("./utils/ErrorHandler");
const { generatedErrors } = require("./middlewares/errors");
const { connectDatabase } = require("./models/database");

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(logger("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET
}));
app.use(fileUpload());

// Database connection
connectDatabase();

// Routes
app.use("/", require("./routes/indexRoutes"));
app.use("/resume", require("./routes/resumeRoutes"));
app.use("/employe", require("./routes/employeRoutes"));

// Error handling
app.use((req, res, next) => {
    next(new ErrorHandler(`URL is not found ${req.url}`, 404));
});
app.use(generatedErrors);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
