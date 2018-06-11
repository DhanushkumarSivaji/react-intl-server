// Require from package
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const dirTree = require('directory-tree');

// Require from local files
const pkg = require('./package.json');

// Declare constants
const PORT = pkg.port || 3011;
const CONFIG = pkg.config || './client/src/.config.json';

// Inititalize Express
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());
app.use(helmet());

/* Application routes */

app.put('/config', (req, res) => {
    let json;
    try {
        const contents = fs.readFileSync(CONFIG).toString();
        try {
            json = JSON.parse(contents);
        } catch(e) {
            json = {};
        }
    } catch (e) {
        console.error('Could not read and parse config file', e);
        json = {};
    }
    Object.keys(req.body).forEach(key => json[key] = req.body[key]);
    try {
        fs.writeFileSync(CONFIG, JSON.stringify(json, undefined, 2));
        res.send({ok: true});
    } catch (e) {
        res.send({ok: false, message: e});
    }
});

app.get('/config', (req, res) => {
    try {
        const contents = fs.readFileSync(CONFIG).toString();
        try {
            res.send(JSON.parse(contents));
        } catch(e) {
            console.error('Could not parse config', e);
            res.send(null);
        }
    } catch(e) {
        console.error('Could not read config file', e);
        res.send(null);
    }
});

app.get('/fetchFiles', async (req, res) => {
    try {
        const contents = fs.readFileSync(CONFIG).toString();
        try {
            const json = JSON.parse(contents);
            try {
                try {

                    const filteredTree = dirTree(json.translationsDir, {extensions:/\.json/, normalizePaths: true});

                    const addData = arr => {
                        arr.forEach(item => {
                            if (item.children) return addData(item.children);

                            let data;
                            try {
                                data = fs.readFileSync(item.path).toString();
                            } catch (e) {
                                console.error('Could not read translation file', item.path, e);
                                data = '';
                            }

                            item.content = data;
                        });
                    };

                    addData([filteredTree]);

                    // let files = await recursive(json.translationsDir, ['.DS_Store']);
                    // files = files.map(file => {
                    //     let data;
                    //     try {
                    //         data = fs.readFileSync(file).toString();
                    //     } catch (e) {
                    //         console.warning('Could not read translation file', file, e);
                    //         data = '';
                    //     }
                    //     return { name: file.replace(new RegExp(`^(${json.translationsDir}/)`), ''), data };s
                    // });

                    res.send(filteredTree);
                } catch (e) {
                    console.error('Could not read translations directory', e);
                    res.send(null);
                }
            } catch(e) {
                console.error('Could not read directory');
                res.send(null);
            }
        } catch(e) {
            console.error('Could not parse JSON file');
            res.send(null);
        }
    } catch(e) {
        console.error('No config file', e);
        res.send(null);
    }
});

app.patch('/updateTranslation', (req, res) => {
    const { path, key, value } = req.body;

    try {
        const content = fs.readFileSync(path).toString();

        try {
            const json = JSON.parse(content);

            try {
                json[key] = value;

                fs.writeFileSync(path, JSON.stringify(json, undefined, 2));

                res.send(json);
            } catch(e) {
                console.error('Could not write', path, e);
                res.send(null);
            }
        } catch (e) {
            console.error('Could not parse', path, e);
            res.send(null);
        }
    } catch(e) {
        console.error('Could not read file', e);
        res.send(null);
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`react-intl-server started at ${PORT}`); // eslint-disable-line no-console
    console.log('Access web ui at http://localhost:3012 or at supplied port number'); // eslint-disable-line no-console
});
