const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");

// =========================
// ENV
// =========================

dotenv.config();

// =========================
// APP
// =========================

const app = express();

const PORT = process.env.PORT || 3000;

// =========================
// MIDDLEWARE
// =========================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// =========================
// SESSION
// =========================

app.use(
    session({
        secret: "khasKU-rahasia",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "lax"
        }
    })
);

// =========================
// STATIC FILE
// =========================

app.use(
    express.static("public")
);

// =========================
// HALAMAN UTAMA
// =========================

app.get("/", (req, res) => {

    res.sendFile(
        __dirname + "/public/index.html"
    );

});

// =========================
// ROUTER AUTH
// =========================

app.use(
    "/api/auth",
    require("./routers/auth")
);

// =========================
// ROUTER PEMASUKAN
// =========================

app.use(
    "/api/pemasukan",
    require("./routers/pemasukan")
);

// =========================
// ROUTER PENGELUARAN
// =========================

app.use(
    "/api/pengeluaran",
    require("./routers/pengeluaran")
);

// =========================
// ROUTER RIWAYAT
// =========================

app.use(
    "/api/riwayat",
    require("./routers/riwayat")
);

// =========================
// ROUTER ANGGOTA
// =========================

app.use(
    "/api/anggota",
    require("./routers/anggota")
);

// =========================
// ROUTER AKUN
// =========================

app.use(
    "/api/akun",
    require("./routers/akun")
);

// =========================
// ROUTER IURAN
// =========================

app.use(
    "/api/iuran",
    require("./routers/iuran")
);

// =========================
// MONGODB CONNECTION
// =========================

let mongoConnected = false;

async function connectMongoDB() {

    if (mongoConnected && mongoose.connection.readyState === 1) {
        return;
    }

    if (!process.env.MONGO_URI) {

        console.error(
            "MONGO_URI tidak ditemukan!"
        );

        throw new Error(
            "MONGO_URI belum diset"
        );
    }

    try {

        await mongoose.connect(
            process.env.MONGO_URI,
            {
                serverSelectionTimeoutMS: 10000,
                maxPoolSize: 10,
                minPoolSize: 0
            }
        );

        mongoConnected = true;

        console.log(
            "MongoDB berhasil terhubung"
        );

    } catch (error) {

        mongoConnected = false;

        console.error(
            "MongoDB gagal terhubung:"
        );

        console.error(
            error.message
        );

        throw error;
    }
}

// =========================
// PASTIKAN MONGODB TERHUBUNG
// =========================

app.use(
    async (req, res, next) => {

        try {

            await connectMongoDB();

            next();

        } catch (error) {

            console.error(
                "Database tidak tersedia:",
                error.message
            );

            res.status(500).send(`
                <h2>Database tidak tersedia</h2>

                <p>
                    KhasKU tidak dapat terhubung
                    ke MongoDB.
                </p>

                <p>
                    Silakan coba beberapa saat lagi.
                </p>
            `);
        }
    }
);

// =========================
// START SERVER
// =========================

if (require.main === module) {

    app.listen(
        PORT,
        () => {

            console.log(
                `Server berjalan di http://localhost:${PORT}`
            );

        }
    );

}

module.exports = app;