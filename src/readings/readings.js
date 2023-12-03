const { usageIntervalFromPreviousWeek } = require("../usage/usage-interval");

const readings = (data) => ({
    getReadings: (meterId) => data[meterId] || [],
    setReadings: (meterId, readings) => {
        const currentReadings = data[meterId];
        data[meterId] = [...currentReadings, ...readings];
        return data[meterId];
    },
    getReadingsOfLastWeek: (meterId, today) => {
        if (!data[meterId])
            return [];

        const usageInterval = usageIntervalFromPreviousWeek(today)

        const readingsInTheInterval =
            data[meterId].filter(
                x => x.time >= usageInterval.start
                    && x.time < usageInterval.end);

        return readingsInTheInterval;
    }
});

module.exports = { readings };
