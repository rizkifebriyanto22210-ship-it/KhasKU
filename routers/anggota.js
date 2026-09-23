const express = require("express");
const router = express.Router();

const Anggota = require("../models/Anggota");

const {
    requireLogin,
    requireRole
} = require("../middleware/auth");


// ========================================
// MENGAMBIL SEMUA ANGGOTA
// SEMUA USER YANG LOGIN BOLEH MELIHAT
// ========================================

router.get(
    "/",
    requireLogin,
    async (req, res) => {

        try {

            const data = await Anggota
                .find()
                .sort({ nama: 1 });

            res.json({
                data: data
            });

        } catch (error) {

            console.log(
                "Error mengambil anggota:",
                error.message
            );

            res.status(500).json({
                message:
                    "Gagal mengambil data anggota"
            });

        }

    }
);


// ========================================
// MENAMBAH ANGGOTA
// HANYA ADMIN
// ========================================

router.post(
    "/",
    requireRole("admin"),
    async (req, res) => {

        try {

            const {
                nama,
                kelas
            } = req.body;


            console.log("=== ANGGOTA BARU ===");

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
                "Kelas:",
                kelas
            );


            // Cek data wajib

            if (!nama || !kelas) {

                return res.status(400).send(`
                    <h2>Tambah anggota gagal</h2>

                    <p>
                        Nama dan kelas wajib diisi.
                    </p>

                    <a href="/anggota.html">
                        Kembali
                    </a>
                `);

            }


            // Buat data baru

            const anggota =
                new Anggota({

                    nama: nama,

                    kelas: kelas

                });


            // Simpan ke MongoDB

            await anggota.save();


            console.log(
                "Anggota berhasil disimpan"
            );


            // Kembali ke halaman anggota

            res.redirect(
                "/anggota.html"
            );


        } catch (error) {

            console.log(
                "Error anggota:",
                error.message
            );

            res.status(500).send(`
                <h2>Tambah anggota gagal</h2>

                <p>
                    Terjadi kesalahan pada server.
                </p>

                <a href="/anggota.html">
                    Kembali
                </a>
            `);

        }

    }
);


// ========================================
// MENGEDIT ANGGOTA
// HANYA ADMIN
// ========================================

router.put(
    "/:id",
    requireRole("admin"),
    async (req, res) => {

        try {

            const id =
                req.params.id;

            const {
                nama,
                kelas
            } = req.body;


            if (!nama || !kelas) {

                return res.status(400).json({
                    message:
                        "Nama dan kelas wajib diisi."
                });

            }


            const anggota =
                await Anggota.findByIdAndUpdate(
                    id,
                    {
                        nama: nama,
                        kelas: kelas
                    },
                    {
                        new: true
                    }
                );


            if (!anggota) {

                return res.status(404).json({
                    message:
                        "Anggota tidak ditemukan."
                });

            }


            console.log(
                "Anggota diedit oleh:",
                req.session.user.username
            );


            res.json({
                message:
                    "Anggota berhasil diperbarui.",
                data: anggota
            });


        } catch (error) {

            console.log(
                "Error mengedit anggota:",
                error.message
            );

            res.status(500).json({
                message:
                    "Gagal mengedit anggota."
            });

        }

    }
);


// ========================================
// MENGHAPUS ANGGOTA
// HANYA ADMIN
// ========================================

router.delete(
    "/:id",
    requireRole("admin"),
    async (req, res) => {

        try {

            const id =
                req.params.id;


            const anggota =
                await Anggota.findByIdAndDelete(
                    id
                );


            if (!anggota) {

                return res.status(404).json({
                    message:
                        "Anggota tidak ditemukan."
                });

            }


            console.log(
                "Anggota dihapus oleh:",
                req.session.user.username
            );


            res.json({
                message:
                    "Anggota berhasil dihapus."
            });


        } catch (error) {

            console.log(
                "Error menghapus anggota:",
                error.message
            );

            res.status(500).json({
                message:
                    "Gagal menghapus anggota."
            });

        }

    }
);


module.exports = router;