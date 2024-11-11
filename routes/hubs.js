// const express = require('express');
// const { authRefreshMiddleware, getHubs, getProjects, getProjectContents, getItemVersions } = require('../services/aps.js');

// let router = express.Router();

// router.use('/api/hubs', authRefreshMiddleware);

// router.get('/api/hubs', async function (req, res, next) {
//     try {
//         const hubs = await getHubs(req.internalOAuthToken.access_token);
//         res.json(hubs);
//     } catch (err) {
//         next(err);
//     }
// });

// router.get('/api/hubs/:hub_id/projects', async function (req, res, next) {
//     try {
//         const projects = await getProjects(req.params.hub_id, req.internalOAuthToken.access_token);
//         res.json(projects);
//     } catch (err) {
//         next(err);
//     }
// });

// router.get('/api/hubs/:hub_id/projects/:project_id/contents', async function (req, res, next) {
//     try {
//         const contents = await getProjectContents(req.params.hub_id, req.params.project_id, req.query.folder_id, req.internalOAuthToken.access_token);
//         res.json(contents);
//     } catch (err) {
//         next(err);
//     }
// });

// router.get('/api/hubs/:hub_id/projects/:project_id/contents/:item_id/versions', async function (req, res, next) {
//     try {
//         const versions = await getItemVersions(req.params.project_id, req.params.item_id, req.internalOAuthToken.access_token);
//         res.json(versions);
//     } catch (err) {
//         next(err);
//     }
// });

// module.exports = router;











//esm

import express from 'express';
import { authRefreshMiddleware, getHubs, getProjects, getProjectContents, getItemVersions } from '../services/aps.js';

const router = express.Router();

// Apply authRefreshMiddleware to the /api/hubs route
router.use('/api/hubs', authRefreshMiddleware);

// Get hubs
router.get('/api/hubs', async (req, res, next) => {
    try {
        const hubs = await getHubs(req.internalOAuthToken.access_token);
        res.json(hubs);
    } catch (err) {
        next(err);
    }
});

// Get projects by hub ID
router.get('/api/hubs/:hub_id/projects', async (req, res, next) => {
    try {
        const projects = await getProjects(req.params.hub_id, req.internalOAuthToken.access_token);
        res.json(projects);
    } catch (err) {
        next(err);
    }
});

// Get project contents by project ID
router.get('/api/hubs/:hub_id/projects/:project_id/contents', async (req, res, next) => {
    try {
        const contents = await getProjectContents(req.params.hub_id, req.params.project_id, req.query.folder_id, req.internalOAuthToken.access_token);
        res.json(contents);
    } catch (err) {
        next(err);
    }
});

// Get item versions by project ID and item ID
router.get('/api/hubs/:hub_id/projects/:project_id/contents/:item_id/versions', async (req, res, next) => {
    try {
        const versions = await getItemVersions(req.params.project_id, req.params.item_id, req.internalOAuthToken.access_token);
        res.json(versions);
    } catch (err) {
        next(err);
    }
});

// Export the router as the default export
export default router;
