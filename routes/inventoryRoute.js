const express = require("express");
const router = new express.Router();
const invCont = require("../controllers/invController");
const utilities = require("../utilities/");

router.get("/", utilities.checkLogin, utilities.handleErrors(invCont.buildManagement));
router.get("/add-classification", utilities.checkLogin, utilities.handleErrors(invCont.buildAddClassification));
router.post("/add-classification", utilities.checkLogin, invCont.addClassification);
router.get("/add-inventory", utilities.checkLogin, utilities.handleErrors(invCont.buildAddInventory));
router.post("/add-inventory", utilities.checkLogin, invCont.addInventory);
router.get("/edit/:inv_id", utilities.checkLogin, utilities.handleErrors(invCont.buildEditInventory));
router.post("/update/", utilities.checkLogin, invCont.updateInventory);
router.get("/delete/:inv_id", utilities.checkLogin, utilities.handleErrors(invCont.buildDeleteInventory));
router.post("/delete/", utilities.checkLogin, invCont.deleteInventory);
router.get("/search", utilities.checkLogin, utilities.handleErrors(invCont.buildSearch));
router.get("/add-review/:inv_id", utilities.checkLogin, utilities.handleErrors(invCont.buildAddReview));
router.post("/add-review/:inv_id", utilities.checkLogin, invCont.addReview);
router.get("/admin", utilities.checkLogin, utilities.handleErrors(invCont.buildAdmin));
router.post("/admin/update-type", utilities.checkLogin, invCont.updateAccountType);

module.exports = router;