const mongoose = require("mongoose");

const anggotaSchema = new mongoose.Schema({

    nama: {
        type: String,
        required: true
    },

    kelas: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model(
    "Anggota",
    anggotaSchema
);