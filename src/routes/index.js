let express = require('express'),
    router = express.Router();

router.use('/api', require('./internal.routes'));
module.exports = router;