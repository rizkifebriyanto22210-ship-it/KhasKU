const requireLogin = (req, res, next) => {

    // Cek apakah user sudah login
    if (!req.session.user) {

        return res.status(401).json({
            message: "Silakan login terlebih dahulu."
        });

    }

    // User sudah login
    next();
};


// =========================
// CEK ROLE
// =========================

const requireRole = (...roles) => {

    return (req, res, next) => {

        // Cek login
        if (!req.session.user) {

            return res.status(401).json({
                message: "Silakan login terlebih dahulu."
            });

        }


        // Ambil role user
        const userRole = req.session.user.role;


        // Cek apakah role diperbolehkan
        if (!roles.includes(userRole)) {

            return res.status(403).json({
                message: "Kamu tidak memiliki izin untuk melakukan tindakan ini."
            });

        }


        // Role diperbolehkan
        next();

    };

};


module.exports = {
    requireLogin,
    requireRole
};