const express = require("express");
const router = express.Router();

const Pengeluaran = require("../models/Pengeluaran");

const {
    requireLogin,
    requireRole
} = require("../middleware/auth");


// ========================================
// LIHAT DATA PENGELUARAN
// ADMIN, BENDAHARA, ANGGOTA
// ========================================

router.get(
    "/",
    requireLogin,
    async (req, res) => {

        try {

            const data = await Pengeluaran
                .find()
                .sort({
                    tanggal: -1
                });


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
                "Error mengambil pengeluaran:",
                error.message
            );


            res.status(500).json({

                message:
                    "Gagal mengambil data pengeluaran"

            });

        }

    }
);


// ========================================
// TAMBAH PENGELUARAN
// ADMIN & BENDAHARA SAJA
// ========================================

router.post(
    "/",
    requireRole(
        "admin",
        "bendahara"
    ),

    async (req, res) => {

        try {

            const {
                nama,
                nominal,
                tanggal,
                keterangan
            } = req.body;


            console.log(
                "=== PENGELUARAN BARU ==="
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
            // VALIDASI
            // =========================

            if (
                !nama ||
                !nominal ||
                !tanggal
            ) {

                return res.status(400).send(`

                    <h2>
                        Pengeluaran gagal
                    </h2>

                    <p>
                        Nama, nominal, dan tanggal
                        wajib diisi.
                    </p>

                    <a href="/pengeluaran.html">
                        Kembali
                    </a>

                `);

            }


            // =========================
            // SIMPAN DATA
            // =========================

            const pengeluaran =
                new Pengeluaran({

                    nama:
                        nama,

                    nominal:
                        Number(nominal),

                    tanggal:
                        tanggal,

                    keterangan:
                        keterangan || ""

                });


            await pengeluaran.save();


            console.log(
                "Pengeluaran berhasil disimpan"
            );


            res.redirect(
                "/pengeluaran.html"
            );


        } catch (error) {

            console.log(
                "Error pengeluaran:",
                error.message
            );


            res.status(500).send(`

                <h2>
                    Pengeluaran gagal
                </h2>

                <p>
                    Terjadi kesalahan pada server.
                </p>

                <a href="/pengeluaran.html">
                    Kembali
                </a>

            `);

        }

    }
);


// ========================================
// HAPUS PENGELUARAN
// ADMIN & BENDAHARA SAJA
// ========================================

router.delete(
    "/:id",

    requireRole(
        "admin",
        "bendahara"
    ),

    async (req, res) => {

        try {

            const id =
                req.params.id;


            await Pengeluaran
                .findByIdAndDelete(id);


            console.log(
                "Pengeluaran dihapus oleh:",
                req.session.user.username
            );


            console.log(
                "Role:",
                req.session.user.role
            );


            res.json({

                message:
                    "Pengeluaran berhasil dihapus"

            });


        } catch (error) {

            console.log(
                "Error menghapus pengeluaran:",
                error.message
            );


            res.status(500).json({

                message:
                    "Gagal menghapus pengeluaran"

            });

        }

    }
);


module.exports = router;