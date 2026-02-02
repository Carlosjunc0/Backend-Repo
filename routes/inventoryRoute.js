// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetailView));

// Route to build the inventory management view
router.get("/causeError", utilities.handleErrors((req,res) => {
  throw new Error("Intentional server crash!")
}))

// Route to deliver inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Route to deliver add-inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Route to deliver add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Route to process adding classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to process adding inventory
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router;