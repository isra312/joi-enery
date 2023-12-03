const { readings } = require("../readings/readings");
const { usageCost } = require("../usage/usage");
const { getUsageOfLastWeek } = require("./usage-controller");
const { readingsData } = require("../readings/readings.data");
const { pricePlanNames } = require("../price-plans/price-plans");
const { meters } = require("../meters/meters");

describe("usage", () => {
    it("should return error if the meter is not attached to a price plan", () => {

        expected = { "error": "A price plan must be provided" };

        const usageCostOfLastWeek = getUsageOfLastWeek(usageCost, {
            params: {
                smartMeterId: meters.METER0,
                today: new Date(2023, 11, 2)
            },
            query: {}
        });

        expect(usageCostOfLastWeek).toEqual(expected);

    })
});

describe("usage", () => {
    it("should return the last week usage for the meter attached to its price plan", () => {
        const { setReadings } = readings(readingsData);

        setReadings(meters.METER0, [
            { time: new Date(2023, 10, 17).getTime() * 0.001, reading: 30 },
            { time: new Date(2023, 10, 18).getTime() * 0.001, reading: 30 },
            { time: new Date(2023, 10, 19).getTime() * 0.001, reading: 30 },
            { time: new Date(2023, 10, 20).getTime() * 0.001, reading: 30 },
            { time: new Date(2023, 10, 21).getTime() * 0.001, reading: 30 },
            { time: new Date(2023, 10, 22).getTime() * 0.001, reading: 30 },
            { time: new Date(2023, 10, 23).getTime() * 0.001, reading: 30 },
            { time: new Date(2023, 10, 24).getTime() * 0.001, reading: 30 },
            { time: new Date(2023, 10, 25).getTime() * 0.001, reading: 30 },
            { time: new Date(2023, 10, 26).getTime() * 0.001, reading: 30 },
            { time: new Date(2023, 10, 27).getTime() * 0.001, reading: 30 }
        ]);

        expected = 2;

        const usageCostOfLastWeek = getUsageOfLastWeek(usageCost, {
            params: {
                smartMeterId: meters.METER0,
                pricePlanName: pricePlanNames.PRICEPLAN0,
                today: new Date(2023, 11, 2)
            },
            query: {}
        });

        expect(Math.floor(usageCostOfLastWeek.meterUsage)).toEqual(expected);

    })
});