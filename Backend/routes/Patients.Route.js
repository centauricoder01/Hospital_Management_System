const express = require("express");
const { PatientModel } = require("../models/Patient.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { ReportModel } = require("../models/Report.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const patients = await PatientModel.find();
    res.status(200).send({ patients });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong" });
  }
});

// This register route will be used when adding a patient via patient or doctor or admin
router.post("/register", async (req, res) => {
  const { email } = req.body;
  try {
    const patient = await PatientModel.findOne({ email });
    if (patient) {
      return res.send({
        message: "Patient already exists",
        id: patient.patientID,
      });
    }
    const newPatient = new PatientModel(req.body);
    await newPatient.save();
    res.send({ id: newPatient.patientID });
  } catch (error) {
    res.send({ error });
  }
});

router.post("/login", async (req, res) => {
  const { patientID, password } = req.body;
  try {
    const patient = await PatientModel.findOne({ patientID, password });

    if (patient) {
      const token = jwt.sign({ foo: "bar" }, process.env.key, {
        expiresIn: "24h",
      });
      let email = patient.email;
      let report = await ReportModel.find({ email });
      res.send({
        message: "Login Successful.",
        user: patient,
        token: token,
        report,
      });
    } else {
      res.send({ message: "Wrong credentials, Please try again." });
    }
  } catch (error) {
    console.log({ message: "Error occurred, unable to Login." });
    console.log(error);
  }
});

// Only Admin should be able to update or delete patient
router.patch("/:patientId", async (req, res) => {
  const id = req.params.patientId;
  const payload = req.body;
  try {
    const patient = await PatientModel.findByIdAndUpdate({ _id: id }, payload);
    if (!patient) {
      res.status(404).send({ msg: `Patient with id ${id} not found` });
    }
    res.status(200).send(`Patient with id ${id} updated`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Update." });
  }
});

router.delete("/:patientId", async (req, res) => {
  const id = req.params.patientId;
  try {
    const patient = await PatientModel.findByIdAndDelete({ _id: id });
    if (!patient) {
      res.status(404).send({ msg: `Patient with id ${id} not found` });
    }
    res.status(200).send(`Patient with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Delete." });
  }
});

module.exports = router;
