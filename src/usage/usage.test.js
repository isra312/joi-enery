const { readings } = require("../readings/readings");
const { meters, meterPricePlanMap } = require("../meters/meters");
const { pricePlanNames, pricePlans } = require("../price-plans/price-plans");
const {
    average,
    timeElapsedInHours,
    usage,
    usageCost,
    usageForAllPricePlans,
} = require("./usage");

describe("usage", () => {
    it("should average all readings for a meter", () => {
        const { getReadings } = readings({
            [meters.METER0]: [
                { time: 923874692387, reading: 0.26785 },
                { time: 923874692387, reading: 0.26785 },
                { time: 923874692387, reading: 0.26785 },
            ],
        });

        const averageMeter0 = average(getReadings(meters.METER0));

        expect(averageMeter0).toBe(0.26785);
    });

    it("should get time elapsed in hours for all readings for a meter", () => {
        const { getReadings } = readings({
            [meters.METER0]: [
                { time: 1607686135, reading: 0.26785 },
                { time: 1607599724, reading: 0.26785 },
                { time: 1607512024, reading: 0.26785 },
            ],
        });

        const timeElapsedMeter0 = timeElapsedInHours(
            getReadings(meters.METER0)
        );

        expect(timeElapsedMeter0).toBe(48);
    });

    it("should get usage for all readings for a meter", () => {
        const { getReadings } = readings({
            [meters.METER0]: [
                { time: 1607686125, reading: 0.26785 },
                { time: 1607599724, reading: 0.26785 },
                { time: 1607513324, reading: 0.26785 },
            ],
        });

        const usageMeter0 = usage(getReadings(meters.METER0));

        expect(usageMeter0).toBe(0.26785 / 48);
    });

    it("should get usage cost for all readings for a meter", () => {
        const { getReadings } = readings({
            [meters.METER2]: [
                { time: 1607686125, reading: 0.26785 },
                { time: 1607599724, reading: 0.26785 },
                { time: 1607513324, reading: 0.26785 },
            ],
        });

        const rate = meterPricePlanMap[meters.METER2].rate;
        const usageCostForMeter = usageCost(getReadings(meters.METER2), rate);

        expect(usageCostForMeter).toBe(0.26785 / 48 * 1);
    });

    it("should get usage cost for all readings for all price plans", () => {
        const { getReadings } = readings({
            [meters.METER2]: [
                { time: 1607686125, reading: 0.26785 },
                { time: 1607599724, reading: 0.26785 },
                { time: 1607513324, reading: 0.26785 },
            ],
        });

        const expected = [
            {
                [pricePlanNames.PRICEPLAN0]: 0.26785 / 48 * 10,
            },
            {
                [pricePlanNames.PRICEPLAN1]: 0.26785 / 48 * 2,
            },
            {
                [pricePlanNames.PRICEPLAN2]: 0.26785 / 48 * 1,
            },
        ];

        const usageForAllPricePlansArray = usageForAllPricePlans(
            pricePlans,
            getReadings(meters.METER2)
        );

        expect(usageForAllPricePlansArray).toEqual(expected);
    });

    it("should get usage cost for all readings of last week for a given price plan", () => {
        const { getReadingsOfLastWeek } = readings({
            [meters.METER2]: [
                { time: 1607686125, reading: 0.26785 },
                { time: 1607599724, reading: 0.26785 },
                { time: 1607513324, reading: 0.26785 },
                { time: new Date(2023, 10, 17).getTime() * 0.001, reading: 0.5 },
                { time: new Date(2023, 10, 18).getTime() * 0.001, reading: 0.5 },
                { time: new Date(2023, 10, 19).getTime() * 0.001, reading: 0.5 },
                { time: new Date(2023, 10, 20).getTime() * 0.001, reading: 0.5 },
                { time: new Date(2023, 10, 21).getTime() * 0.001, reading: 0.5 },
                { time: new Date(2023, 10, 22).getTime() * 0.001, reading: 0.5 },
                { time: new Date(2023, 10, 23).getTime() * 0.001, reading: 0.5 },
                { time: new Date(2023, 10, 24).getTime() * 0.001, reading: 0.5 },
                { time: new Date(2023, 10, 25).getTime() * 0.001, reading: 0.5 },
                { time: new Date(2023, 10, 26).getTime() * 0.001, reading: 0.5 },
                { time: new Date(2023, 10, 27).getTime() * 0.001, reading: 0.5 }
            ],
        });

        const pricePlan = pricePlans[pricePlanNames.PRICEPLAN0];

        const readingsofLastWeek = getReadingsOfLastWeek(meters.METER2, new Date(2023,11,2));

        const expected =
            (average(readingsofLastWeek)
                / timeElapsedInHours(readingsofLastWeek))
            * pricePlan.rate;

        const lastWeekUsageCost = usageCost(readingsofLastWeek, pricePlan.rate);

        expect(lastWeekUsageCost).toEqual(expected);
    });
});
