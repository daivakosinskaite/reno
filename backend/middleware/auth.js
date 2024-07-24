const jwt = require('jsonwebtoken');

// Autentifikacijos middleware
module.exports = (req, res, next) => {
    const token = req.headers['authorization']; // Tokeno gavimas iš headers
    if (!token) return res.sendStatus(401); // Jei nėra tokeno, grąžinamas 401 statusas
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // Tokeno galiojimo tikrinimas
        if (err) return res.sendStatus(401); // Jei tokenas netinkamas, grąžinamas 401 statusas
        req.user = user; // Vartotojo informacijos įrašymas į request objektą
        next(); // Perėjimas prie kito middleware arba maršruto
    });
};
