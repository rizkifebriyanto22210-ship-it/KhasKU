const express = require("express");
const router = express.Router();

const Pemasukan = require("../models/Pemasukan");
const Pengeluaran = require("../models/Pengeluaran");

// ========================================
// MENGAMBIL SEMUA RIWAYAT TRANSAKSI
// ========================================

router.get("/", async (req, res) => {

    try {

        const pemasukan =
            await Pemasukan.find();

        const pengeluaran =
            await Pengeluaran.find();


        const dataPemasukan =
            pemasukan.map(item => ({

                id: item._id,

                nama: item.nama,

                nominal: item.nominal,

                tanggal: item.tanggal,

                keterangan: item.keterangan,

                jenis: "Pemasukan"

            }));


        const dataPengeluaran =
            pengeluaran.map(item => ({

                id: item._id,

                nama: item.nama,

                nominal: item.nominal,

                tanggal: item.tanggal,

                keterangan: item.keterangan,

                jenis: "Pengeluaran"

            }));


        const semuaData = [

            ...dataPemasukan,

            ...dataPengeluaran

        ];


        semuaData.sort(
            (a, b) =>
                new Date(b.tanggal) -
                new Date(a.tanggal)
        );


        res.json({

            data: semuaData

        });


    } catch (error) {

        console.log(
            "Error mengambil riwayat:",
            error.message
        );


        res.status(500).json({

            message:
                "Gagal mengambil riwayat transaksi"

        });

    }

});


module.exports = router;