const express = require("express");
const router = express.Router();

const User = require("../models/User");

const {
    requireLogin,
    requireRole
} = require("../middleware/auth");


// ========================================
// LIHAT SEMUA AKUN
// HANYA ADMIN
// ========================================

router.get(
    "/",
    requireRole("admin"),
    async (req, res) => {

        try {

            const data = await User
                .find()
                .select("-password")
                .sort({ username: 1 });

            res.json({
                data: data
            });

        } catch (error) {

            console.log(
                "Error mengambil akun:",
                error.message
            );

            res.status(500).json({
                message:
                    "Gagal mengambil data akun"
            });

        }

    }
);


// ========================================
// UBAH ROLE AKUN
// HANYA ADMIN
// ========================================

router.put(
    "/:id/role",
    requireRole("admin"),
    async (req, res) => {

        try {

            const id = req.params.id;

            const {
                role
            } = req.body;


            // =========================
            // CEK ROLE
            // =========================

            if (
                role !== "anggota" &&
                role !== "bendahara"
            ) {

                return res.status(400).json({

                    message:
                        "Role tidak valid."

                });

            }


            // =========================
            // CARI USER
            // =========================

            const user =
                await User.findById(id);


            if (!user) {

                return res.status(404).json({

                    message:
                        "Akun tidak ditemukan."

                });

            }


            // =========================
            // CEGAH ADMIN MENGUBAH
            // ROLE DIRINYA SENDIRI
            // =========================

            if (
                user.username ===
                req.session.user.username
            ) {

                return res.status(400).json({

                    message:
                        "Kamu tidak dapat mengubah role akun sendiri."

                });

            }


            // =========================
            // UBAH ROLE
            // =========================

            user.role = role;

            await user.save();


            console.log(
                "Role berhasil diubah"
            );

            console.log(
                "Akun:",
                user.username
            );

            console.log(
                "Role baru:",
                user.role
            );

            console.log(
                "Diubah oleh:",
                req.session.user.username
            );


            res.json({

                message:
                    "Role berhasil diubah.",

                data: {

                    username:
                        user.username,

                    role:
                        user.role

                }

            });

        } catch (error) {

            console.log(
                "Error mengubah role:",
                error.message
            );

            res.status(500).json({

                message:
                    "Gagal mengubah role."

            });

        }

    }
);


// ========================================
// HAPUS AKUN
// HANYA ADMIN
// ========================================

router.delete(
    "/:id",
    requireRole("admin"),
    async (req, res) => {

        try {

            const id = req.params.id;


            // =========================
            // CARI USER
            // =========================

            const user =
                await User.findById(id);


            if (!user) {

                return res.status(404).json({

                    message:
                        "Akun tidak ditemukan."

                });

            }


            // =========================
            // CEGAH ADMIN MENGHAPUS
            // DIRINYA SENDIRI
            // =========================

            if (
                user.username ===
                req.session.user.username
            ) {

                return res.status(400).json({

                    message:
                        "Kamu tidak dapat menghapus akun sendiri."

                });

            }


            // =========================
            // HAPUS AKUN
            // =========================

            await User.findByIdAndDelete(id);


            console.log(
                "Akun dihapus:"
            );

            console.log(
                "Username:",
                user.username
            );

            console.log(
                "Role:",
                user.role
            );

            console.log(
                "Dihapus oleh:",
                req.session.user.username
            );


            res.json({

                message:
                    "Akun berhasil dihapus."

            });

        } catch (error) {

            console.log(
                "Error menghapus akun:",
                error.message
            );

            res.status(500).json({

                message:
                    "Gagal menghapus akun."

            });

        }

    }
);


module.exports = router;