const express = require("express");
const Consultation = require("../models/consultation");
const Patient = require("../models/patient");

const router = express.Router();

// POST /api/consultations
router.post("/", async (req, res, next) => {
    try {
        // Vérifier que le patient existe
        const patientExiste = await Patient.exists({
            _id: req.body.patient
        });

        if (!patientExiste) {
            return res.status(404).json({
                message: "Patient introuvable"
            });
        }

        const consultation = await Consultation.create(req.body);

        res.status(201).json(consultation);
    } catch (err) {
        next(err);
    }
});

// GET /api/consultations
router.get("/", async (req, res, next) => {
    try {
        const filter = {};

        if (req.query.patient) {
            filter.patient = req.query.patient;
        }

        if (req.query.statut) {
            filter.statut = req.query.statut;
        }

        const consultations = await Consultation.find(filter)
            .populate("patient", "nom prenom")
            .sort({ date: -1 });

        res.json(consultations);
    } catch (err) {
        next(err);
    }
});

// GET /api/consultations/:id
router.get("/:id", async (req, res, next) => {
    try {
        const consultation = await Consultation.findById(req.params.id)
            .populate("patient", "nom prenom");

        if (!consultation) {
            return res.status(404).json({
                message: "Consultation introuvable"
            });
        }

        res.json(consultation);
    } catch (err) {
        next(err);
    }
});

// PUT /api/consultations/:id
router.put("/:id", async (req, res, next) => {
    try {
        const consultation = await Consultation.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        ).populate("patient", "nom prenom");

        if (!consultation) {
            return res.status(404).json({
                message: "Consultation introuvable"
            });
        }

        res.json(consultation);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/consultations/:id
router.delete("/:id", async (req, res, next) => {
    try {
        const consultation = await Consultation.findByIdAndDelete(
            req.params.id
        );

        if (!consultation) {
            return res.status(404).json({
                message: "Consultation introuvable"
            });
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;