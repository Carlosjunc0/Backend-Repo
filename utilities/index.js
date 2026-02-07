const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken")
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the vehicle detail view HTML
 * ************************************ */
Util.buildDetailHTML = async function (vehicle) {
  let price = Number(vehicle.inv_price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  let miles = Number(vehicle.inv_miles).toLocaleString("en-US");

  return `
  <section class="vehicle-detail">
    <div class="vehicle-detail__img">
      <picture>
        <source 
          srcset="${vehicle.inv_image.replace(".jpg", "-tn.jpg")}" 
          media="(max-width: 768px)"
        >
        <img 
          src="${vehicle.inv_image}" 
          alt="${vehicle.inv_make} ${vehicle.inv_model}"
        >
      </picture>
    </div>

    <div class="vehicle-detail__info">
      <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
      <p><strong>Price:</strong> ${price}</p>
      <p><strong>Mileage:</strong> ${miles} miles</p>
      <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      <p><strong>Description:</strong> ${vehicle.inv_description}</p>
    </div>
  </section>
  `;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let list =
    '<select id="classificationList" name="classification_id">'

  list += "<option value=''>Choose a Classification</option>"

  data.rows.forEach(row => {
    list += `<option value="${row.classification_id}"`
    if (classification_id == row.classification_id) {
      list += " selected"
    }
    list += `>${row.classification_name}</option>`
  })

  list += "</select>"
  return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
* Middleware to enforce login
**************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 * Middleware to check admin or employee
 **************************************** */
Util.checkAdminEmployee = (req, res, next) => {
  if (
    res.locals.loggedin &&
    (res.locals.accountData.account_type === "Employee" ||
     res.locals.accountData.account_type === "Admin")
  ) {
    return next()
  }

  req.flash("notice", "You do not have permission to access this area.")
  return res.redirect("/account/login")
}

module.exports = Util;