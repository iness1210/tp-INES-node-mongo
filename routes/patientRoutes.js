const express = require("express");
const Patient = require("../models/patient");

const router = express.Router();

// POST /api/patients
router.post("/", async (req, res, next) => {
    try {
        const patient = await Patient.create(req.body);
        res.status(201).json(patient);
    } catch (err) {
        next(err);
    }
});

// GET /api/patients
router.get("/", async (req, res, next) => {
    try {
        const filter = {};

        if (req.query.statut) {
            filter.statut = req.query.statut;
        }

        const patients = await Patient.find(filter).sort({ nom: 1 });

        res.json(patients);
    } catch (err) {
        next(err);
    }
});

// GET /api/patients/:id
router.get("/:id", async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                message: "Patient introuvable"
            });
        }

        res.json(patient);
    } catch (err) {
        next(err);
    }
});

// PUT /api/patients/:id
router.put("/:id", async (req, res, next) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!patient) {
            return res.status(404).json({
                message: "Patient introuvable"
            });
        }

        res.json(patient);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/patients/:id
router.delete("/:id", async (req, res, next) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            return res.status(404).json({
                message: "Patient introuvable"
            });
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;