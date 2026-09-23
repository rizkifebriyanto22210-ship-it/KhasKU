const express = require("express");
const router = express.Router();

const User = require("../models/User");


// ========================================
// TEST ROUTER
// ========================================

router.get("/test", (req, res) => {

    res.send("Router auth berhasil");

});


// ========================================
// LOGIN
// ========================================

router.post("/", async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;


        console.log("");
        console.log("=== LOGIN ===");
        console.log("Username:", username);


        // =========================
        // CEK INPUT
        // =========================

        if (!username || !password) {

            return res.status(400).send(`
                <h2>Login gagal</h2>

                <p>
                    Username dan password wajib diisi.
                </p>

                <a href="/">
                    Kembali ke login
                </a>
            `);

        }


        // =========================
        // CARI USER
        // =========================

        const user = await User.findOne({
            username: username
        });


        if (!user) {

            console.log("User tidak ditemukan");

            return res.status(401).send(`
                <h2>Login gagal</h2>

                <p>
                    Username atau password salah.
                </p>

                <a href="/">
                    Kembali
                </a>
            `);

        }


        // =========================
        // CEK PASSWORD
        // =========================

        if (user.password !== password) {

            console.log("Password salah");

            return res.status(401).send(`
                <h2>Login gagal</h2>

                <p>
                    Username atau password salah.
                </p>

                <a href="/">
                    Kembali
                </a>
            `);

        }


        // =========================
        // DEBUG DATA USER
        // =========================

        console.log("");
        console.log("DATA USER DARI MONGODB:");
        console.log(user.toObject());

        console.log(
            "Role dari MongoDB:",
            user.role
        );


        // =========================
        // AMBIL ROLE
        // =========================

        const role = user.role || "anggota";


        console.log(
            "Role yang digunakan:",
            role
        );


        // =========================
        // SIMPAN SESSION
        // =========================

        req.session.user = {

            username: user.username,

            role: role

        };


        // =========================
        // DEBUG SESSION
        // =========================

        console.log("");
        console.log("SESSION BERHASIL DIBUAT:");
        console.log(req.session.user);


        console.log("");
        console.log(
            "Login berhasil:",
            user.username
        );

        console.log(
            "Role:",
            role
        );

        console.log("");


        // =========================
        // MASUK DASHBOARD
        // =========================

        res.redirect(
            "/dashboard.html"
        );


    } catch (error) {

        console.log(
            "Error login:",
            error.message
        );


        res.status(500).send(`
            <h2>Terjadi kesalahan</h2>

            <p>
                Server mengalami masalah.
            </p>

            <a href="/">
                Kembali
            </a>
        `);

    }

});


// ========================================
// CEK USER YANG SEDANG LOGIN
// ========================================

router.get("/me", (req, res) => {

    console.log("");
    console.log("=== CEK SESSION ===");
    console.log(
        "Session user:",
        req.session.user
    );


    // Belum login
    if (!req.session.user) {

        return res.status(401).json({

            message:
                "Belum login"

        });

    }


    // Sudah login
    res.json({

        loggedIn: true,

        username:
            req.session.user.username,

        role:
            req.session.user.role

    });

});


// ========================================
// LOGOUT
// ========================================

router.post("/logout", (req, res) => {

    console.log("");
    console.log("=== LOGOUT ===");


    if (req.session.user) {

        console.log(
            "User:",
            req.session.user.username
        );

        console.log(
            "Role:",
            req.session.user.role
        );

    }


    req.session.destroy((error) => {

        if (error) {

            console.log(
                "Logout gagal:",
                error.message
            );

            return res.status(500).json({

                message:
                    "Logout gagal"

            });

        }


        console.log(
            "Logout berhasil"
        );


        res.json({

            message:
                "Logout berhasil"

        });

    });

});


// ========================================
// REGISTER
// ========================================

router.post("/register", async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;


        console.log("");
        console.log("=== REGISTER ===");
        console.log("Username:", username);


        // =========================
        // CEK INPUT
        // =========================

        if (!username || !password) {

            return res.status(400).send(`
                <h2>Registrasi gagal</h2>

                <p>
                    Username dan password wajib diisi.
                </p>

                <a href="/">
                    Kembali
                </a>
            `);

        }


        // =========================
        // CEK USERNAME
        // =========================

        const userExist = await User.findOne({
            username: username
        });


        if (userExist) {

            console.log(
                "Username sudah digunakan"
            );

            return res.status(400).send(`
                <h2>Registrasi gagal</h2>

                <p>
                    Username sudah digunakan.
                </p>

                <a href="/">
                    Kembali
                </a>
            `);

        }


        // =========================
        // BUAT USER BARU
        // =========================
        // Semua pendaftar otomatis
        // menjadi ANGGOTA

        const user = new User({

            username:
                username,

            password:
                password,

            role:
                "anggota"

        });


        // =========================
        // SIMPAN USER
        // =========================

        await user.save();


        console.log(
            "User berhasil didaftarkan:",
            username
        );

        console.log(
            "Role:",
            user.role
        );

        console.log("");


        res.send(`
            <h2>Registrasi berhasil!</h2>

            <p>
                Akun berhasil dibuat.
            </p>

            <p>
                Role:
                <strong>Anggota</strong>
            </p>

            <a href="/">
                Login sekarang
            </a>
        `);


    } catch (error) {

        console.log(
            "Error register:",
            error.message
        );


        res.status(500).send(`
            <h2>Registrasi gagal</h2>

            <p>
                Terjadi kesalahan pada server.
            </p>

            <a href="/">
                Kembali
            </a>
        `);

    }

});


module.exports = router;