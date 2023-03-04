const express = require("express");
const { BedModel } = require("../models/Bed.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const beds = await BedModel.find().populate([
      {
        path: "patientID",
        populate: {
          path: "docID",
        },
      },
      {
        path: "patientID",
        populate: {
          path: "nurseID",
        },
      },
    ]);
    res.status(200).send(beds);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong" });
  }
});

router.post("/single", async (req, res) => {
  const { bedNumber, roomNumber } = req.body;
  try {
    const bed = await BedModel.find({ bedNumber, roomNumber });
    if (bed.length === 0) {
      return res.send({ message: "Bed not found" });
    }
    if (bed[0].occupied === "available") {
      return res.send({ message: "Available", id: bed[0]._id });
    }
    return res.send({ message: "Occupied" });
  } catch (error) {
    res.send({ message: "No Bed", error });
  }
});

router.post("/add", async (req, res) => {
  const { bedNumber, roomNumber } = req.body;

  try {
    const bed = await BedModel.find({ bedNumber, roomNumber });
    if (bed.length > 0) {
      return res.send({ message: "Bed already present" });
    } else {
      const bed = new BedModel(req.body);
      await bed.save();
      return res.send({ message: "Bed added successfully", bed });
    }
  } catch (error) {
    res.send("Something went wrong, unable to add Bed.");
    console.log(error);
  }
});

router.patch("/:bedId", async (req, res) => {
  const id = req.params.bedId;
  const payload = req.body;
  try {
    const bed = await BedModel.findByIdAndUpdate({ _id: id }, payload);
    if (!bed) {
      return res.status(404).send({ msg: `Bed with id ${id} not found` });
    }
    return res.status(200).send(`Bed with id ${id} updated`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
  }
});

router.put("/discharge", async (req, res) => {
  const { _id } = req.body;
  try {
    const bed = BedModel.findById(_id);
    if (!bed) {
      return res.status(404).send({ message: `Bed not found` });
    }
    await BedModel.findByIdAndUpdate({ _id }, req.body);
    await BedModel.updateOne({ _id }, { $unset: { patientID: 1 } });
    const updatedBed = await BedModel.findById(_id);
    return res.status(200).send({ message: "Bed updated", bed: updatedBed });
  } catch (error) {
    res.send({ message: error });
  }

  // res.send({ message: "Successful" });
});

router.delete("/:bedId", async (req, res) => {
  const id = req.params.bedId;
  try {
    const bed = await BedModel.findByIdAndDelete({ _id: id });
    if (!bed) {
      res.status(404).send({ msg: `Bed with id ${id} not found` });
    }
    res.status(200).send(`Bed with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Delete." });
  }
});

module.exports = router;
