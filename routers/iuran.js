const express = require("express");
const router = express.Router();

const Pemasukan = require("../models/Pemasukan");
const Anggota = require("../models/Anggota");


// ========================================
// STATUS IURAN
// ========================================

router.get("/status", async (req, res) => {

    try {

        // Mengambil semua anggota

        const anggota =
            await Anggota
                .find()
                .sort({ nama: 1 });


        // Mengambil semua pemasukan

        const pemasukan =
            await Pemasukan.find();


        // Membuat status setiap anggota

        const data =
            anggota.map((item) => {

                const pembayaran =
                    pemasukan.filter(
                        (uang) => {

                            const namaSama =
                                uang.nama === item.nama;

                            const keterangan =
                                String(
                                    uang.keterangan || ""
                                ).toLowerCase();

                            const adalahIuran =
                                keterangan.includes(
                                    "iuran"
                                );

                            return (
                                namaSama &&
                                adalahIuran
                            );

                        }
                    );


                // Menghitung total iuran

                const total =
                    pembayaran.reduce(
                        (jumlah, uang) => {

                            return (
                                jumlah +
                                Number(uang.nominal || 0)
                            );

                        },
                        0
                    );


                return {

                    nama: item.nama,

                    kelas: item.kelas,

                    total: total,

                    sudahBayar: total > 0

                };

            });


        // Kirim hasil

        res.json({

            data: data

        });


    } catch (error) {

        console.log(
            "Error status iuran:",
            error.message
        );


        res.status(500).json({

            message:
                "Gagal mengambil status iuran",

            error:
                error.message

        });

    }

});


// ========================================
// MENAMBAH IURAN
// ========================================

router.post("/", async (req, res) => {

    try {

        const {
            anggota,
            nominal,
            tanggal,
            keterangan
        } = req.body;


        console.log(
            "=== IURAN BARU ==="
        );


        console.log(
            "Anggota:",
            anggota
        );


        console.log(
            "Nominal:",
            nominal
        );


        console.log(
            "Tanggal:",
            tanggal
        );


        // ========================================
        // CEK DATA
        // ========================================

        if (
            !anggota ||
            !nominal ||
            !tanggal
        ) {

            return res.status(400).send(`

                <h2>Iuran gagal</h2>

                <p>
                    Anggota, nominal, dan tanggal
                    wajib diisi.
                </p>

                <a href="/iuran.html">
                    Kembali
                </a>

            `);

        }


        // ========================================
        // BUAT PEMASUKAN
        // ========================================

        const pemasukan =
            new Pemasukan({

                nama: anggota,

                nominal:
                    Number(nominal),

                tanggal: tanggal,

                keterangan:
                    keterangan ||
                    "Iuran kas kelas"

            });


        // ========================================
        // SIMPAN
        // ========================================

        await pemasukan.save();


        console.log(
            "Iuran berhasil disimpan"
        );


        // ========================================
        // KEMBALI KE IURAN
        // ========================================

        res.redirect(
            "/iuran.html"
        );


    } catch (error) {

        console.log(
            "Error iuran:",
            error.message
        );


        res.status(500).send(`

            <h2>Iuran gagal</h2>

            <p>
                Terjadi kesalahan pada server.
            </p>

            <a href="/iuran.html">
                Kembali
            </a>

        `);

    }

});


module.exports = router;