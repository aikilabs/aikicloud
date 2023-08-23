const router  = require('express').Router();

const {createVm } = require('../controller/vm');

router.post('/create', createVm);

module.exports = router;