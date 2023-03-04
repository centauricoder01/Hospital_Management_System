const express = require("express");
const { AmbulanceModel } = require("../models/Ambulance.model");

const router = express.Router();

router.get("/", async (req, res) => {
  let query = req.query;
  try {
    const ambulances = await AmbulanceModel.find(query);
    res.status(200).send(ambulances);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong" });
  }
});

router.post("/add", async (req, res) => {
  const payload = req.body;
  try {
    const ambulance = new AmbulanceModel(payload);
    await ambulance.save();
  } catch (error) {
    res.send(error);
  }
  res.send("Ambulance Added Successfully");
});

router.patch("/:ambulanceId", async (req, res) => {
  const id = req.params.ambulanceId;
  const payload = req.body;
  try {
    const ambulance = await AmbulanceModel.findByIdAndUpdate(
      { _id: id },
      payload
    );
    if (!ambulance) {
      res.status(404).send({ msg: `Ambulance with id ${id} not found` });
    }
    res.status(200).send(`Ambulance with id ${id} updated`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Update." });
  }
});

router.delete("/:ambulanceId", async (req, res) => {
  const id = req.params.ambulanceId;
  try {
    const ambulance = await AmbulanceModel.findByIdAndDelete({ _id: id });
    if (!ambulance) {
      res.status(404).send({ msg: `Ambulance with id ${id} not found` });
    }
    res.status(200).send(`Ambulance with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Delete." });
  }
});

module.exports = router;
