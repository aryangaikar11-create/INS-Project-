const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
let generatedOTP = null;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "mfa_secret_key",
    resave: false,
    saveUninitialized: true
}));

// Login verification
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin123") {
        generatedOTP = Math.floor(100000 + Math.random() * 900000);
        console.log("OTP:", generatedOTP); // Simulates SMS/Email
        req.session.auth = true;
        res.redirect("/otp.html");
    } else {
        res.send("❌ Invalid Username or Password");
    }
});

// OTP verification
app.post("/verify-otp", (req, res) => {
    const userOtp = req.body.otp;

    if (req.session.auth && userOtp == generatedOTP) {
        res.send("✅ Authentication Successful – Access Granted");
    } else {
        res.send("❌ Invalid OTP – Access Denied");
    }
});

app.listen(3000, () => {
    console.log("MFA App running at http://localhost:3000");
});