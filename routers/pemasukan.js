const express = require("express");
const router = express.Router();

const Pemasukan = require("../models/Pemasukan");

// Middleware hak akses
const {
    requireLogin,
    requireRole
} = require("../middleware/auth");


// ========================================
// MENGAMBIL SEMUA DATA PEMASUKAN
// ========================================
// Semua user yang sudah login boleh melihat

router.get(
    "/",
    requireLogin,
    async (req, res) => {

        try {

            const data = await Pemasukan
                .find()
                .sort({ tanggal: -1 });


            const total = data.reduce(
                (jumlah, item) =>
                    jumlah + item.nominal,
                0
            );


            res.json({

                total: total,

                data: data

            });


        } catch (error) {

            console.log(
                "Error mengambil pemasukan:",
                error.message
            );


            res.status(500).json({

                message:
                    "Gagal mengambil data pemasukan"

            });

        }

    }
);


// ========================================
// MENAMBAH PEMASUKAN
// ========================================
// Hanya ADMIN dan BENDAHARA

router.post(
    "/",
    requireRole("admin", "bendahara"),
    async (req, res) => {

        try {

            const {
                nama,
                nominal,
                tanggal,
                keterangan
            } = req.body;


            console.log(
                "=== PEMASUKAN BARU ==="
            );


            console.log(
                "User:",
                req.session.user.username
            );


            console.log(
                "Role:",
                req.session.user.role
            );


            console.log(
                "Nama:",
                nama
            );


            console.log(
                "Nominal:",
                nominal
            );


            console.log(
                "Tanggal:",
                tanggal
            );


            // =========================
            // CEK DATA
            // =========================

            if (
                !nama ||
                !nominal ||
                !tanggal
            ) {

                return res.status(400).send(`

                    <h2>Pemasukan gagal</h2>

                    <p>
                        Nama, nominal, dan tanggal
                        wajib diisi.
                    </p>

                    <a href="/pemasukan.html">
                        Kembali
                    </a>

                `);

            }


            // =========================
            // BUAT PEMASUKAN
            // =========================

            const pemasukan =
                new Pemasukan({

                    nama: nama,

                    nominal:
                        Number(nominal),

                    tanggal: tanggal,

                    keterangan:
                        keterangan || ""

                });


            // =========================
            // SIMPAN
            // =========================

            await pemasukan.save();


            console.log(
                "Pemasukan berhasil disimpan"
            );


            res.redirect(
                "/pemasukan.html"
            );


        } catch (error) {

            console.log(
                "Error pemasukan:",
                error.message
            );


            res.status(500).send(`

                <h2>Pemasukan gagal</h2>

                <p>
                    Terjadi kesalahan pada server.
                </p>

                <a href="/pemasukan.html">
                    Kembali
                </a>

            `);

        }

    }
);


// ========================================
// MENGHAPUS PEMASUKAN
// ========================================
// Hanya ADMIN dan BENDAHARA

router.delete(
    "/:id",
    requireRole("admin", "bendahara"),
    async (req, res) => {

        try {

            const id =
                req.params.id;


            await Pemasukan
                .findByIdAndDelete(id);


            console.log(
                "Pemasukan dihapus oleh:",
                req.session.user.username
            );


            console.log(
                "Role:",
                req.session.user.role
            );


            res.json({

                message:
                    "Pemasukan berhasil dihapus"

            });


        } catch (error) {

            console.log(
                "Error menghapus pemasukan:",
                error.message
            );


            res.status(500).json({

                message:
                    "Gagal menghapus pemasukan"

            });

        }

    }
);


module.exports = router;