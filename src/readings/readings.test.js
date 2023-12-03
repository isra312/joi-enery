const { meters } = require("../meters/meters");
const { readings } = require("./readings");
const { readingsData } = require("./readings.data");

describe("readings", () => {
    it("should get readings", () => {
        const { getReadings } = readings(readingsData);

        expect(getReadings(meters.METER0).length).toBeGreaterThan(0);
    });

    it("should get readings with meter id", () => {
        const { getReadings } = readings(readingsData);

        expect(getReadings(meters.METER1)[0]).toHaveProperty("time");
        expect(getReadings(meters.METER1)[0]).toHaveProperty("reading");
    });

    it("should get empty array if can't find meter id", () => {
        const { getReadings } = readings(readingsData);

        expect(getReadings("meter-no")).toHaveLength(0);
    });

    it("should set readings with meter id", () => {
        const { getReadings, setReadings } = readings(readingsData);

        const length = getReadings(meters.METER0).length;

        setReadings(meters.METER0, [
            { time: 923874692387, reading: 0.26785 },
            { time: 923874692387, reading: 0.26785 },
            { time: 923874692387, reading: 0.111 },
        ]);

        const newLength = getReadings(meters.METER0).length;

        expect(length + 3).toEqual(newLength);
    });

    it("should get readings of last week for a meter id", () => {
        const { setReadings, getReadingsOfLastWeek } = readings(readingsData);

        setReadings(meters.METER0, [
            { time: new Date(2023, 10, 17).getTime() * 0.001, reading: Math.random() },
            { time: new Date(2023, 10, 18).getTime() * 0.001, reading: Math.random() },
            { time: new Date(2023, 10, 19).getTime() * 0.001, reading: Math.random() },
            { time: new Date(2023, 10, 20).getTime() * 0.001, reading: Math.random() },
            { time: new Date(2023, 10, 21).getTime() * 0.001, reading: Math.random() },
            { time: new Date(2023, 10, 22).getTime() * 0.001, reading: Math.random() },
            { time: new Date(2023, 10, 23).getTime() * 0.001, reading: Math.random() },
            { time: new Date(2023, 10, 24).getTime() * 0.001, reading: Math.random() },
            { time: new Date(2023, 10, 25).getTime() * 0.001, reading: Math.random() },
            { time: new Date(2023, 10, 26).getTime() * 0.001, reading: Math.random() },
            { time: new Date(2023, 10, 27).getTime() * 0.001, reading: Math.random() }
        ]);

        const readingsOfLastWeek = getReadingsOfLastWeek(meters.METER0,new Date(2023,11,2));

        const lastWeekLenght = readingsOfLastWeek.length;

        expect(lastWeekLenght).toEqual(7);
    });
});
