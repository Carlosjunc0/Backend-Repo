const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ************************
 *  Build inventory by classificationId view
 * ************************ */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ************************
 *  Build inventory detail view
 * ************************ */
invCont.buildDetailView = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const vehicleData = await invModel.getInventoryById(inv_id);

  if (!vehicleData) {
    const error = new Error("Vehicle not found.");
    error.status = 404;
    throw error;
  }

  const vehicleHTML = await utilities.buildDetailHTML(vehicleData);
  let nav = await utilities.getNav();

  res.render("./inventory/detail", {
    title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
    nav,
    vehicleHTML,
  });
};

/* *************************************
 * Build inventory management view
 * ************************************* */
invCont.buildManagementView = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  });
};

/* *************************************
 * Build add-classification view
 * ************************************* */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* *************************************
 * Build add-inventory view
 * ************************************* */
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
  });
};

/* *************************************
 * Process add-inventory
 * ************************************* */
invCont.addInventory = async function (req, res) {
  let {
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_miles,
    inv_color,
    inv_image,
    inv_thumbnail,
    inv_description,
    classification_id,
  } = req.body;

  let nav = await utilities.getNav();

  const result = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_miles,
    inv_color,
    inv_image,
    inv_thumbnail,
    inv_description,
    classification_id,
  );

  if (result.rowCount) {
    req.flash("notice", "Inventory item added successfully.");
    return res.redirect("/inv/");
  } else {
    req.flash("notice", "Failed to add inventory item.");
    let classificationList =
      await utilities.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      ...req.body,
    });
  }
};

/* *************************************
 * Process add-classification
 * ************************************* */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const nav = await utilities.getNav()

  const result = await invModel.addClassification(classification_name)

  if (result.rowCount) {
    req.flash("notice", "Classification added successfully.")
    return res.redirect("/inv")
  } else {
    req.flash("notice", "Failed to add classification.")
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name,
    })
  }
}

module.exports = invCont;
