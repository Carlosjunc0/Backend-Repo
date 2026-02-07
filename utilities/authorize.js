const authorize = {}

authorize.checkEmployeeOrAdmin = (req, res, next) => {
  const account = res.locals.accountData

  if (!account) {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

  if (account.account_type === "Employee" || account.account_type === "Admin") {
    return next()
  }

  req.flash("notice", "You are not authorized to access this area.")
  return res.redirect("/account/login")
}

module.exports = authorize
