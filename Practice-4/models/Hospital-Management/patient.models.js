import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["M", "F", "O"],
      required: true,
    },
    vistedHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
  },
  { timestamps: true }
);

export const Patient = mongoose.model("Patient", patientSchema);
