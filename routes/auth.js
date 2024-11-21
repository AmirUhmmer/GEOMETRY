const express = require('express');
const { getAuthorizationUrl, authCallbackMiddleware, authRefreshMiddleware, getUserProfile } = require('../services/aps.js');

const sql = require('mssql');

// Azure SQL configuration
const config = {
    user: 'sqlserverdb8_admin',
    password: 'jCz91%z%FlS7',
    server: 'sqlserverdb8.database.windows.net',
    database: 'SQLDB_DB8',
    options: {
        encrypt: true,
        enableArithAbort: true
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

router.get('/api/auth/callback', authCallbackMiddleware, function (req, res) {
    res.redirect('/');
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


// Connect to Azure SQL and retrieve sensor value
router.get('/api/sensor/:location', async (req, res) => {
    const location = req.params.location;
    const name = req.params.location;
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
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

// New route to fetch graph data based on the custom query
router.get('/api/graphdata/:location', async (req, res) => {
    const location = req.params.location;
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('location', sql.VarChar, location)
            .query(`
                WITH Interval AS (
                    SELECT CAST(CAST(GETDATE() AS DATE) AS DATETIME) AS IntervalStart
                    UNION ALL
                    SELECT DATEADD(MINUTE, 30, IntervalStart) 
                    FROM Interval
                    WHERE IntervalStart < CAST(GETDATE() AS DATETIME)
                ),
                LiveDataWithRank AS (
                    SELECT 
                        ld.sensorId,
                        ld.observationTime,
                        ld.value,
                        ri.point_name,
                        ri.is_point_of_furniture_name,
                        ROW_NUMBER() OVER (PARTITION BY ld.sensorId, i.IntervalStart ORDER BY ABS(DATEDIFF(MINUTE, ld.observationTime, i.IntervalStart))) AS rn
                    FROM 
                        Interval i
                    JOIN [dbo].[LiveData] ld
                        ON ld.observationTime >= CAST(CAST(GETDATE() AS DATE) AS DATETIME)
                        AND ld.observationTime <= GETDATE()
                    JOIN [dbo].[RelynkIdentifier0711] ri
                        ON ld.sensorId = ri.point_id
                    WHERE 
                        ri.point_name = 'Current'
                        AND ri.point_id = @location
                )
                SELECT 
                    FORMAT(DATEADD(MINUTE, DATEDIFF(MINUTE, 0, ld.observationTime) / 30 * 30, 0), 'HH:mm') AS observationTime,
                    ld.value
                FROM 
                    LiveDataWithRank ld
                WHERE 
                    ld.rn = 1 -- Select only the closest observation time for each interval
                ORDER BY 
                    observationTime DESC;

            `);

        if (result.recordset.length > 0) {
            // Send back the data for the chart
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