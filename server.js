const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");

dotenv.config();

// ===============================
// DNS MONGODB ATLAS
// ===============================

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]);

const app = express();

const PORT = process.env.PORT || 3000;

// ===============================
// MONGODB CONNECTION
// ===============================

let mongoPromise = null;

async function connectMongoDB() {

    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!mongoPromise) {

        mongoPromise = mongoose.connect(
            process.env.MONGO_URI,
            {
                serverSelectionTimeoutMS: 10000,
                family: 4
            }
        );
    }

    try {

        await mongoPromise;

        console.log("MongoDB berhasil terhubung");

    } catch (error) {

        mongoPromise = null;

        console.log("MongoDB gagal terhubung");
        console.log(error.message);

        throw error;
    }
}

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.set("trust proxy", 1);

// ===============================
// PASTIKAN DATABASE TERHUBUNG
// ===============================

app.use(async (req, res, next) => {

    try {

        await connectMongoDB();

        next();

    } catch (error) {

        console.log(
            "Database belum siap:",
            error.message
        );

        res.status(500).send(
            "Database belum dapat terhubung. Silakan coba lagi."
        );
    }
});

// ===============================
// SESSION
// ===============================

app.use(
    session({

        secret:
            process.env.SESSION_SECRET ||
            "khasKU-rahasia",

        resave: false,

        saveUninitialized: false,

        store: MongoStore.create({

            mongoUrl:
                process.env.MONGO_URI,

            collectionName:
                "sessions",

            ttl:
                24 * 60 * 60

        }),

        cookie: {

            maxAge:
                24 * 60 * 60 * 1000,

            httpOnly: true,

            secure:
                process.env.NODE_ENV === "production",

            sameSite: "lax"
        }
    })
);

// ===============================
// HALAMAN UTAMA
// ===============================

// Halaman pertama = REGISTER
app.get("/", (req, res) => {

    res.sendFile(
        __dirname +
        "/public/register.html"
    );
});

// ===============================
// HALAMAN LOGIN
// ===============================

app.get("/login", (req, res) => {

    res.sendFile(
        __dirname +
        "/public/index.html"
    );
});

// ===============================
// FILE FRONTEND
// ===============================

// Diletakkan setelah route "/" dan "/login"
app.use(
    express.static("public")
);

// ===============================
// ROUTES API
// ===============================

app.use(
    "/api/auth",
    require("./routers/auth")
);

app.use(
    "/api/pemasukan",
    require("./routers/pemasukan")
);

app.use(
    "/api/pengeluaran",
    require("./routers/pengeluaran")
);

app.use(
    "/api/riwayat",
    require("./routers/riwayat")
);

app.use(
    "/api/anggota",
    require("./routers/anggota")
);

app.use(
    "/api/akun",
    require("./routers/akun")
);

app.use(
    "/api/iuran",
    require("./routers/iuran")
);

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `Server berjalan di http://localhost:${PORT}`
    );

});