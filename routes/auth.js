const express = require('express');
const { getAuthorizationUrl, authCallbackMiddleware, authRefreshMiddleware, getUserProfile } = require('../services/aps.js');

const sql = require('mssql');

// Azure SQL configuration
// test push
const config = {
    user: 'sqlserverdb8_admin',
    password: 'jCz91%z%FlS7',
    server: 'sqlserverdb8.database.windows.net',
    database: 'SQLDB_DB8',
    options: {
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true, // Change to false in production for a secure setup
    }
};

let router = express.Router();

router.get('/api/auth/login', function (req, res) {
    res.redirect(getAuthorizationUrl());
});

router.get('/api/auth/logout', function (req, res) {
    req.session = null;
    res.redirect('/');
});

// router.get('/api/auth/callback', authCallbackMiddleware, function (req, res) {
//     res.redirect('/');
// });

router.get('/api/auth/callback', authCallbackMiddleware, function (req, res) {
    // Close the login window and optionally refresh the opener window
    res.send(`
        <script>
            // window.opener.location.reload();  // Refresh the main window
            window.close();  // Close the login window
        </script>
    `);
});


router.get('/api/auth/token', authRefreshMiddleware, function (req, res) {
    res.json(req.publicOAuthToken);
});

router.get('/api/auth/profile', authRefreshMiddleware, async function (req, res, next) {
    try {
        const profile = await getUserProfile(req.internalOAuthToken.access_token);
        res.json({ name: `${profile.name}` });
    } catch (err) {
        next(err);
    }
});


// Create a connection pool (this will be reused for all requests)
let poolPromise;

async function getPool() {
    if (!poolPromise) {
        // Create the pool only once on the first request
        poolPromise = sql.connect(config);
    }
    return poolPromise;
}

// Route to retrieve sensor value
router.get('/api/sensor/:location', async (req, res) => {
    const location = req.params.location;
    try {
        // Get the connection pool
        const pool = await getPool();

        // Query the database
        const result = await pool.request()
            .input('location', sql.VarChar, location)
            .query('SELECT TOP (1) [value], [observationTime] FROM [dbo].[LiveData] WHERE sensorId = @location ORDER BY observationTime DESC');

        if (result.recordset.length > 0) {
            res.json({ value: result.recordset[0].value });
        } else {
            res.status(404).send('Sensor not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving sensor value');
    }
});

// Route to fetch graph data
router.get('/api/graphdata/:location', async (req, res) => {
    const location = req.params.location;
    try {
        // Get the connection pool
        const pool = await getPool();

        // Query the database
        const result = await pool.request()
            .input('location', sql.VarChar, location)
            .query(`
                SELECT TOP (4)
                FORMAT(ld.observationTime, 'HH:mm - dd MMM') AS observationTime,
                    ld.value
                FROM
                    [dbo].[LiveData] ld
                WHERE
                    ld.sensorId = @location
                ORDER BY
                    ld.observationTime DESC
            `);

        if (result.recordset.length > 0) {
            res.json(result.recordset);
        } else {
            res.status(404).send('No data found for the specified location');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving graph data');
    }
});


module.exports = router;
