const router = require("express").Router();

const { createVm, getVmDomain, stopVm } = require("../controller/vm");

router.route("/").get(getVmDomain).post(createVm).delete(stopVm);

module.exports = router;
