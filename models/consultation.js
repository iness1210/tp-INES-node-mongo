const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Patient"
    },

    date: {
        type: Date,
        required: true
    },

    motif: {
        type: String,
        required: true
    },

    traitement: {
        type: String
    },

    medecin: {
        type: String,
        required: true
    },

    notes: {
        type: String
    },

    statut: {
        type: String,
        enum: ["En attente", "Terminée"],
        default: "En attente"
    }

}, {
    timestamps: true
});

consultationSchema.set("toJSON", {
    versionKey: false,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
});

module.exports = mongoose.model("Consultation", consultationSchema);