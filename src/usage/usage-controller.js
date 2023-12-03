const { readingsData } = require("../readings/readings.data");
const { readings } = require("../readings/readings");
const { meters } = require("../meters/meters");
const { pricePlanNames, pricePlans } = require("../price-plans/price-plans");


const getUsageOfLastWeek = (usageCost, req) => {
    const pricePlan = pricePlans[req.params.pricePlanName];

    if (!pricePlan)
        return {
            error: "A price plan must be provided"
        };

    const { getReadingsOfLastWeek } = readings(readingsData);

    const today = req.params.today ?? new Date();
    console.log("🚀 ~ file: usage-controller.js:18 ~ getUsageOfLastWeek ~ req.params.today:", req.params.today)
    console.log("🚀 ~ file: usage-controller.js:18 ~ getUsageOfLastWeek ~ today:", today)

    const readingsOfLastWeek = getReadingsOfLastWeek(req.params.smartMeterId, today);
    console.log("🚀 ~ file: usage-controller.js:22 ~ getUsageOfLastWeek ~ readingsOfLastWeek:", readingsOfLastWeek)

    if (!readingsOfLastWeek || readingsOfLastWeek.length === 0)
        return {
            meterUsage: 0
        };

    const meterUsage = usageCost(readingsOfLastWeek, pricePlan.rate);

    return {
        meterUsage: meterUsage
    }
}

module.exports = { getUsageOfLastWeek };