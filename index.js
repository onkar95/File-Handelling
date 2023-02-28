//import the fs module to read and write files
const fs = require("fs");

// read input files
const costData = fs.readFileSync("cost.json");
const channelData = fs.readFileSync("channel-cost.json");

// parse JSON data
const costs = JSON.parse(costData);
const channels = JSON.parse(channelData);

//function to convert paise into rupee
const paisaToRupee = (paisa) => paisa / 100;


let dailyCosts = {};


//main function to loop over channels data 
channels.forEach((channel) => {
    //get  the channel names except date eg email or sms,etc and its value
    const channelName = Object.keys(channel).filter((key) => key !== "date")[0];
    const channelCount = channel[channelName];

    //construct date obj with yyyy-mm-dd
    const date = new Date(channel.date);
    const dateString = date.toISOString().slice(0, 10);

    //convert paise to rupee
    const channelCost = paisaToRupee(channelCount * costs[channelName]);

    //checking for the date and updating the channels with total sum of cost 
    dailyCosts[dateString] = dailyCosts[dateString] || {};
    dailyCosts[dateString][channelName] =
        (dailyCosts[dateString][channelName] || 0) + channelCost;
});


// converts the nested object into array  
const result = Object.keys(dailyCosts).map((date) => {
    return { date, ...dailyCosts[date] };
});

//sort by date
result.sort((a, b) => a.date.localeCompare(b.date));

// write result to file
fs.writeFileSync("daily-costs.json", JSON.stringify(result, null, 2));

