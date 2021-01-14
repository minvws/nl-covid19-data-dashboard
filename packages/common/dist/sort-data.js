var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
export function sortNationalTimeSeriesInDataInPlace(data) {
    var timeSeriesPropertyNames = getTimeSeriesPropertyNames(data).filter(
    // restrictions doesn't have any timeseries so needs to be removed from this list
    function (propertyName) { return propertyName !== 'restrictions'; });
    for (var _i = 0, timeSeriesPropertyNames_1 = timeSeriesPropertyNames; _i < timeSeriesPropertyNames_1.length; _i++) {
        var propertyName = timeSeriesPropertyNames_1[_i];
        if (isWhitelistedProperty(propertyName)) {
            continue;
        }
        var timeSeries = data[propertyName];
        timeSeries.values = sortTimeSeriesValues(timeSeries.values);
    }
}
export function sortRegionalTimeSeriesInDataInPlace(data) {
    var timeSeriesPropertyNames = getTimeSeriesPropertyNames(data).filter(
    // restrictions doesn't have any timeseries so needs to be removed from this list
    function (propertyName) { return propertyName !== 'restrictions'; });
    for (var _i = 0, timeSeriesPropertyNames_2 = timeSeriesPropertyNames; _i < timeSeriesPropertyNames_2.length; _i++) {
        var propertyName = timeSeriesPropertyNames_2[_i];
        if (isWhitelistedProperty(propertyName)) {
            continue;
        }
        /**
         * There is one property in the dataset that contains timeseries nested
         * inside values, so we need to process that separately.
         */
        if (propertyName === 'sewer_per_installation') {
            var nestedSeries = data[propertyName];
            nestedSeries.values = nestedSeries.values.map(function (x) {
                x.values = sortTimeSeriesValues(x.values);
                return x;
            });
            // Skip the remainder of this loop
            continue;
        }
        var timeSeries = data[propertyName];
        timeSeries.values = sortTimeSeriesValues(timeSeries.values);
    }
}
export function sortMunicipalTimeSeriesInDataInPlace(data) {
    var timeSeriesPropertyNames = getTimeSeriesPropertyNames(data);
    for (var _i = 0, timeSeriesPropertyNames_3 = timeSeriesPropertyNames; _i < timeSeriesPropertyNames_3.length; _i++) {
        var propertyName = timeSeriesPropertyNames_3[_i];
        if (isWhitelistedProperty(propertyName)) {
            continue;
        }
        /**
         * There is one property in the dataset that contains timeseries nested
         * inside values, so we need to process that separately.
         */
        if (propertyName === 'sewer_per_installation') {
            var nestedSeries = data[propertyName];
            nestedSeries.values = nestedSeries.values.map(function (x) {
                x.values = sortTimeSeriesValues(x.values);
                return x;
            });
            // Skip the remainder of this loop
            continue;
        }
        var timeSeries = data[propertyName];
        timeSeries.values = sortTimeSeriesValues(timeSeries.values);
    }
}
/**
 * From the data structure, retrieve all properties that hold a "values" field
 * in their content. All time series data is kept in this values field.
 */
function getTimeSeriesPropertyNames(data) {
    return Object.entries(data).reduce(function (acc, _a) {
        var propertyKey = _a[0], propertyValue = _a[1];
        return isTimeSeries(propertyValue) ? __spreadArrays(acc, [propertyKey]) : acc;
    }, []);
}
function sortTimeSeriesValues(values) {
    /**
     * There are 3 ways in which time series data can be timestamped. We need
     * to detect and handle each of them.
     */
    if (isReportTimestamped(values)) {
        return values.sort(function (a, b) { return a.date_unix - b.date_unix; });
    }
    else if (isWeekTimestamped(values)) {
        return values.sort(function (a, b) { return a.date_end_unix - b.date_end_unix; });
    }
    /**
     * If none match we throw, since it means an unknown timestamp is used and we
     * want to be sure we sort all data.
     */
    throw new Error("Unknown timestamp in value " + JSON.stringify(values[0], null, 2));
}
/**
 * Some type guards to figure out types based on runtime properties.
 * See: https://basarat.gitbook.io/typescript/type-system/typeguard#user-defined-type-guards
 */
function isTimeSeries(value) {
    return value.values !== undefined;
}
function isReportTimestamped(timeSeries) {
    return timeSeries[0].date_unix !== undefined;
}
function isWeekTimestamped(timeSeries) {
    return timeSeries[0].date_end_unix !== undefined;
}
function isWhitelistedProperty(propertyName) {
    return ['restrictions'].includes(propertyName);
}
//# sourceMappingURL=sort-data.js.map