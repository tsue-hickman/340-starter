const express = require("express");
const router = new express.Router();
const invCont = require("../controllers/invController");
const utilities = require("../utilities/");

router.get("/", utilities.handleErrors(invCont.buildManagement));
router.get("/type/:classification_id", utilities.handleErrors(invCont.buildByClassification));
router.get("/detail/:inv_id", utilities.handleErrors(invCont.buildByInvId));
router.get("/add-classification", utilities.handleErrors(invCont.buildAddClassification));
router.post("/add-classification", invCont.addClassification);
router.get("/add-inventory", utilities.handleErrors(invCont.buildAddInventory));
router.post("/add-inventory", invCont.addInventory);
router.get("/edit/:inv_id", utilities.handleErrors(invCont.buildEditInventory));
router.post("/update/", invCont.updateInventory);
router.get("/delete/:inv_id", utilities.handleErrors(invCont.buildDeleteInventory));
router.post("/delete/", invCont.deleteInventory);

module.exports = router;