// Require from package
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');


// Require from local files
const pkg = require('./package.json');

// Inititalize Express
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());
app.use(helmet());

/* Application routes */


// Start server
const PORT = pkg.port || 3011;
app.listen(PORT, () => {
    console.log(`react-intl-server started at ${PORT}`); // eslint-disable-line no-console
    console.log('Access web ui at http://localhost:3012 or at supplied port number'); // eslint-disable-line no-console
});
