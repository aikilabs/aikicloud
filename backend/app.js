// Import required modules
require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { generateNonce, SiweMessage } = require("siwe");
const Session = require("express-session");
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

// SESSION
// app.use(
//     Session({
//         name: "siwe-aikicloud",
//         secret: process.env.SIWE_SECRET,
//         resave: true,
//         saveUninitialized: true,
//         cookie: { secure: false, sameSite: true },
//     })
// );

// ######################################################################################################
// ######################################################################################################
// Routes

// HOME ROUTE
app.get(
    "/",
    // upload.array("photos"),
    async (req, res) => {
        console.log({ files: req.files, body: req.body });
        res.json({ msg: "Welcome To AikiCloud" });
    }
);

// Get a random nonce
// app.get("/nonce", async function (req, res) {
//     req.session.nonce = generateNonce();
//     res.setHeader("Content-Type", "text/plain");
//     res.status(200).send(req.session.nonce);
// });

// VM ROUTES
const vmRoutes = require("./routes/vm");
// app.use("/api/vm", async function (req, res, next) {
//     // the token id is passed in the body
//     const tokenId = req.body.tokenId;
//     try {
//         if (!req.body.message) {
//             res.status(422).json({ message: "Message Not found." });
//             return;
//         }

//         let SIWEObject = new SiweMessage(req.body.message);
//         const { data: message } = await SIWEObject.verify({
//             signature: req.body.signature,
//             nonce: req.session.nonce,
//         });

//         console.log(message);

//         req.session.siwe = message;
//         req.session.cookie.expires = new Date(message.expirationTime);
//         req.session.save(() => res.status(200).send(true));
//         next();
//     } catch (e) {
//         req.session.siwe = null;
//         req.session.nonce = null;
//         console.error(e);
//         req.session.save();
//         res.status(440).json({ message: e.message });
//     }
// });
app.use("/api/vm", vmRoutes);

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
        app.listen(port, () => console.log(`Server listening on port ${port}`));
        // await webSocketHandler(wss)
    } catch (error) {
        console.log(error);
    }
};
serverApp();

module.exports = app;