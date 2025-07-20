const express = require("express");
const router = new express.Router();
const invCont = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");

router.get("/", utilities.handleErrors(invCont.buildHome));
router.get("/type/:classification_id", utilities.handleErrors(invCont.buildByClassification));
router.get("/detail/:inv_id", utilities.handleErrors(invCont.buildByInvId));
router.get("/management", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invCont.buildManagement));
router.get("/add-classification", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invCont.buildAddClassification));
router.post("/add-classification", utilities.checkLogin, utilities.checkAccountType, invValidate.classificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invCont.addClassification));
router.get("/add-inventory", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invCont.buildAddInventory));
router.post("/add-inventory", utilities.checkLogin, utilities.checkAccountType, invValidate.inventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(invCont.addInventory));
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invCont.buildEditInventory));
router.post("/update/", utilities.checkLogin, utilities.checkAccountType, invValidate.inventoryRules(), invValidate.checkUpdateInventoryData, utilities.handleErrors(invCont.updateInventory));
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invCont.buildDeleteInventory));
router.post("/delete/", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invCont.deleteInventory));

module.exports = router;