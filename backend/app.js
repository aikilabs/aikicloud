// Import required modules
require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

// Import Express
const express = require("express");
const app = express();


// ######################################################################################################
// ######################################################################################################
// Middleware

// CORS MIDDLEWARE
// Set up cors options and middleware
const corsOptions = {
    origin: [process.env.CLIENT_ORIGIN_1],
    credentials: true,
};
app.use(cors(corsOptions));

// COOKIE PARSER MIDDLEWARE
app.use(cookieParser(process.env.COOKIE_SECRET));

// HANDLE JSON REQUESTS MIDDLEWARE
app.use(express.json());

// MORGAN SETUP
app.use(morgan("dev"));

// ######################################################################################################
// ######################################################################################################
// Routes

// HOME ROUTE
app.get(
    "/",
    // upload.array("photos"),
    (req, res) => {
        console.log({ files: req.files, body: req.body });
        res.json({ msg: "Welcome To AikiCloud" });
    }
);


// ######################################################################################################
// ######################################################################################################
// Handler Middleware

// ROUTE NOT FOUND HANDLER MIDDLEWARE
const routeNotFound = require("./middleware/routeNotFoundMiddleware");
app.use(routeNotFound);

// ERROR HANDLER MIDDLEWARE
const errorHandler = require("./middleware/errorHandlerMiddleware");
app.use(errorHandler);

// ######################################################################################################
// ######################################################################################################
// CREATE SERVER
const port = process.env.PORT || 5000;
const serverApp = async () => {
    try {
        await connectToMongodb();
        app.listen(port, () => console.log(`Server listening on port ${port}`));
        // await webSocketHandler(wss)
    } catch (error) {
        console.log(error);
    }
};
serverApp();
