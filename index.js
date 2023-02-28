

/*first 
// const fs = require('fs');

// // Load the contents of cost.json and channel-cost.json
// const costData = fs.readFileSync('./cost.json');
// const channelCostData = fs.readFileSync('./channel-cost.json');

// // Parse the JSON data into JavaScript objects
// const cost = JSON.parse(costData);
// const channelCost = JSON.parse(channelCostData);

// // Loop through the data in channel-cost.json to calculate the total cost for each channel for each day
// const dailyCosts = [];
// channelCost.forEach((record) => {
//     const date = record.date.slice(0, 10); // Extract the date part of the string in yyyy-mm-dd format
//     const channels = record;
//     delete channels.date; // Remove the date field from the channels object
//     const dailyCost = { date };
//     Object.keys(channels).forEach((channel) => {
//         const costPerUnit = cost[channel];
//         const units = channels[channel];
//         const channelCostInRupees = (costPerUnit * units) / 100;
//         dailyCost[channel] = channelCostInRupees;
//     });
//     dailyCosts.push(dailyCost);
// });

// // Sort the array by date
// dailyCosts.sort((a, b) => (a.date > b.date ? 1 : -1));


// // Convert the array of daily costs to a JSON string
// const json = JSON.stringify(dailyCosts);

// // Write the JSON string to a file
// fs.writeFileSync('daily-costs.json', json);

*/

/* second
// const fs = require('fs');

// // read cost.json file
// const costFile = fs.readFileSync('./cost.json');
// const costData = JSON.parse(costFile);

// // read channel-cost.json file
// const channelCostFile = fs.readFileSync('./channel-cost.json');
// const channelCostData = JSON.parse(channelCostFile);

// // loop over the channel cost data and calculate the cost per day
// let dailyCosts = {};
// channelCostData.forEach((row) => {
//     const date = row.date.split(' ')[0];
//     const channel = Object.keys(row)[0];
//     const channelCount = row[channel];
//     const channelCost = costData[channel];
//     const dayCost = channelCount * channelCost;

//     if (!dailyCosts[date]) {
//         dailyCosts[date] = {};
//     }
//     if (!dailyCosts[date][channel]) {
//         dailyCosts[date][channel] = 0;
//     }
//     dailyCosts[date][channel] += dayCost;
// });

// // format the daily costs data as an array of objects
// const formattedDailyCosts = [];
// Object.keys(dailyCosts).forEach((date) => {
//     const dayCost = {
//         date: date,
//         sms: dailyCosts[date].sms / 100,
//         whatsapp: dailyCosts[date].whatsapp / 100,
//         email: dailyCosts[date].email / 100,
//         ivr: dailyCosts[date].ivr / 100,
//     };
//     formattedDailyCosts.push(dayCost);
// });

// // sort the daily costs by date
// formattedDailyCosts.sort((a, b) => (a.date > b.date ? 1 : -1));

// // write the formatted daily costs to a file
// fs.writeFileSync('./daily-costs.json', JSON.stringify(formattedDailyCosts));
*/




const fs = require("fs");

// read input files
const costData = fs.readFileSync("cost.json");
const channelData = fs.readFileSync("channel-cost.json");

// parse JSON data
const costs = JSON.parse(costData);
const channels = JSON.parse(channelData);

const paisaToRupee = (paisa) => paisa / 100;

let dailyCosts = {};



channels.forEach((channel) => {
    const channelName = Object.keys(channel).filter((key) => key !== "date")[0];
    const channelCount = channel[channelName];

    const date = new Date(channel.date);
    const dateString = date.toISOString().slice(0, 10);

    const channelCost = paisaToRupee(channelCount * costs[channelName]);

    dailyCosts[dateString] = dailyCosts[dateString] || {};
    dailyCosts[dateString][channelName] =
        (dailyCosts[dateString][channelName] || 0) + channelCost;
});



const result = Object.keys(dailyCosts).map((date) => {
    return { date, ...dailyCosts[date] };
});
result.sort((a, b) => a.date.localeCompare(b.date));

// write result to file
fs.writeFileSync("daily-costs.json", JSON.stringify(result, null, 2));

