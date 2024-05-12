import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    /*
  name
  salary
  workingHospitals
  qualification
  exp
  */
  },
  { timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
