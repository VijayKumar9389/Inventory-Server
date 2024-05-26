"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const location_controllers_1 = require("../controllers/location.controllers");
const router = (0, express_1.Router)();
const locationController = new location_controllers_1.LocationController();
``;
// Define routes
router.get('/getAll', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield locationController.getAllLocationsController(req, res);
}));
// Create a new location
router.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield locationController.createLocationController(req, res);
}));
// Update a location
router.put('/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield locationController.updateLocation(req, res);
}));
// Delete a location
router.delete('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield locationController.deleteLocation(req, res);
}));
// Get a location by ID
router.get('/get/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield locationController.getLocationByIdController(req, res);
}));
exports.default = router;
