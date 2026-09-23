const mongoose = require("mongoose");

const pengeluaranSchema = new mongoose.Schema({

    nama: {
        type: String,
        required: true
    },

    nominal: {
        type: Number,
        required: true
    },

    tanggal: {
        type: Date,
        required: true
    },

    keterangan: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Pengeluaran", pengeluaranSchema);