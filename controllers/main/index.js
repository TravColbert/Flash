'use strict'

module.exports = function () {
  return {
    index: (req, res) => {
      res.redirect('/users')
    }
  }
}
