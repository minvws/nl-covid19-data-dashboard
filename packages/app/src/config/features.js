"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.features = void 0;
exports.features = [
    {
        name: 'downscaling',
        isEnabled: false,
        route: '/afschaling',
    },
    {
        name: 'vaccineStockPerSupplier',
        isEnabled: false,
        metricScopes: ['nl'],
        metricName: 'vaccine_stock',
        metricProperties: ['astra_zeneca_total', 'astra_zeneca_available'],
    },
];
