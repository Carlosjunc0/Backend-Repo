const { body, validationResult } = require("express-validator");
const utilities = require(".");

const validate = {};

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage(
        "Classification name is required and cannot contain spaces or special characters",
      ),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      classification_name,
    });
    return;
  }
  next();
};

validate.inventoryRules = () => {
  return [
    body("inv_make").trim().isLength({min: 3}).notEmpty().withMessage("Make must be at least 3 characters."),
    body("inv_model").trim().isLength({min: 3}).notEmpty().withMessage("Model must be at least 3 characters."),
    body("inv_year").isInt({ min: 1900, max: 9999}).withMessage("Year must be valid"),
    body("inv_price").isNumeric().withMessage("Price must be a number"),
    body("inv_miles").isNumeric().withMessage("Miles must be a number"),
    body("inv_color").trim().notEmpty().withMessage("Color is required"),
    body("inv_image").trim().notEmpty().withMessage("Image path is required"),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required"),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Classification is required"),
  ];
};

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(
      req.body.classification_id,
    );
    res.render("inventory/add-inventory", {
      errors,
      nav,
      classificationList,
      ...req.body,
    });
    return;
  }
  next();
};

// New validation rules for updating inventory
validate.checkUpdateData  = async (req, res, next) => {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const classificationSelect =
      await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    return
  }
  next()
}

module.exports = validate;
