const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ===============================
// LOGIN
// ===============================

router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            username: username
        });

        if (!user) {
            return res.send("Username atau password salah");
        }

        if (user.password !== password) {
            return res.send("Username atau password salah");
        }

        const role = user.role || "anggota";

        req.session.user = {
            username: user.username,
            role: role
        };

        return res.redirect("/dashboard.html");

    } catch (error) {
        console.log("Error login:", error.message);
        res.status(500).send("Terjadi masalah, server mengalami masalah");
    }
});

// ===============================
// CEK SESSION
// ===============================

router.get("/me", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            message: "Belum login"
        });
    }

    res.json(req.session.user);
});

// ===============================
// LOGOUT
// ===============================

router.post("/logout", (req, res) => {
    req.session.destroy((error) => {

        if (error) {
            return res.status(500).json({
                message: "Gagal logout"
            });
        }

        res.json({
            message: "Logout berhasil"
        });
    });
});

// ===============================
// REGISTER
// ===============================

router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Cek username
        const existing = await User.findOne({
            username: username
        });

        if (existing) {
            return res.send("Username sudah digunakan");
        }

        // Buat user baru
        const user = new User({
            username: username,
            password: password,
            role: "anggota"
        });

        await user.save();

        // Setelah register → login
        res.redirect("/login");

    } catch (error) {
        console.log("Error register:", error.message);
        res.status(500).send("Gagal register");
    }
});

module.exports = router;