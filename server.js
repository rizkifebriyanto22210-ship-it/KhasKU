const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");

// Load .env
dotenv.config();

// ===============================
// DNS MONGODB ATLAS
// ===============================

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]);

const app = express();

// Vercel menggunakan PORT dari environment
const PORT = process.env.PORT || 3000;

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Vercel berada di belakang proxy
app.set("trust proxy", 1);

// ===============================
// SESSION
// ===============================

app.use(
    session({
        secret: process.env.SESSION_SECRET || "khasKU-rahasia",

        resave: false,

        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,

            collectionName: "sessions",

            ttl: 24 * 60 * 60
        }),

        cookie: {
            maxAge: 24 * 60 * 60 * 1000,

            httpOnly: true,

            secure: process.env.NODE_ENV === "production",

            sameSite: "lax"
        }
    })
);

// ===============================
// FILE FRONTEND
// ===============================

app.use(express.static("public"));

// ===============================
// HALAMAN UTAMA
// ===============================

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// ===============================
// ROUTES API
// ===============================

app.use("/api/auth", require("./routers/auth"));
app.use("/api/pemasukan", require("./routers/pemasukan"));
app.use("/api/pengeluaran", require("./routers/pengeluaran"));
app.use("/api/riwayat", require("./routers/riwayat"));
app.use("/api/anggota", require("./routers/anggota"));
app.use("/api/akun", require("./routers/akun"));
app.use("/api/iuran", require("./routers/iuran"));

// ===============================
// MONGODB
// ===============================

mongoose
    .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000
    })
    .then(() => {
        console.log("MongoDB berhasil terhubung");
    })
    .catch((error) => {
        console.log("MongoDB gagal terhubung");
        console.log(error.message);
    });

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});