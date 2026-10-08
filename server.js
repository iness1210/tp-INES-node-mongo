require("dotenv").config({ quiet: true });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const patientRoutes = require("./routes/patientRoutes");


const app = express();

const PORT = process.env.PORT || 5001;
const MONGO_URI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cabinet";

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/patients", patientRoutes);


// Route inconnue
app.use((req, res) => {
    res.status(404).json({
        message: "Route introuvable"
    });
});

// Gestionnaire d'erreurs
app.use((err, req, res, next) => {
    console.error(err);

    // Erreur JSON mal formé
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message: "JSON invalide"
        });
    }

    // Erreur de validation Mongoose
    if (err.name === "ValidationError") {
        const erreurs = Object.values(err.errors).map((e) => ({
            champ: e.path,
            message: e.message
        }));

        return res.status(400).json({
            message: "Données invalides",
            erreurs
        });
    }

    // ID MongoDB invalide
    if (err.name === "CastError") {
        return res.status(400).json({
            message: "ID invalide"
        });
    }

    // Autre erreur
    res.status(500).json({
        message: "Erreur serveur"
    });
});

// Connexion à MongoDB
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connecté à MongoDB");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Serveur lancé sur http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Erreur MongoDB :", err.message);
        process.exit(1);
    });