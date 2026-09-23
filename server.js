const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const session = require("express-session");


// =========================
// DNS GOOGLE
// =========================

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);


// =========================
// ENV
// =========================

dotenv.config();


// =========================
// APP
// =========================

const app = express();

const PORT = 3000;


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
        saveUninitialized: false
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
// KHUSUS ADMIN
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
// KONEKSI MONGODB
// =========================

mongoose.connect(
    process.env.MONGO_URI,
    {
        serverSelectionTimeoutMS: 10000
    }
)
    .then(() => {

        console.log(
            "MongoDB berhasil terhubung"
        );

    })
    .catch((error) => {

        console.log(
            "MongoDB gagal terhubung"
        );

        console.log(
            error.message
        );

    });


// =========================
// JALANKAN SERVER
// =========================

app.listen(
    PORT,
    () => {

        console.log(
            `Server berjalan di http://localhost:${PORT}`
        );

    }
);