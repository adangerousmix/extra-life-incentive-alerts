const container = document.getElementsByClassName("main-container")[0];
const image = document.getElementById("image");
const alert = document.getElementsByClassName("alert")[0];

let donations = [],
    incentives = [],
    lastDonationDateTime = "",
    alerts = [];

let playAlert = (incentiveId) => {
    if ({enableAlerts}) {
        let alert = [];
        let incentive = [];

        for (i = 0; i < incentives.length; i++) {
            console.log("Current Incentive:", incentives[i].incentiveID);
            if (incentives[i].incentiveID == incentiveId) {
                incentive = incentives[i];
            }
        }

        for (j = 0; j < alerts.length; j++) {
            if (alerts[j].name == incentive.description) {
                alert = alerts[j];
            }
        }

        let rnd = Math.floor(Math.random() * Math.floor(alert.sounds.length));
        let sound = new Audio(alert.sounds[rnd].sound);
        sound.play();
    }
};

let sleep = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
};
  
let arrayColumn = (arr, n) => {
    return arr.map(x => x[n]);
};
  
async function getLatestDonations() {
    const response = await fetch("https://extralife.donordrive.com/api/{ExtraLifeType}/{participantId}/donations?where=createdDateUTC>%3D%27" + donations[0].createdDateUTC + "%27");
    const text = await response.text();
    return JSON.parse(text);
}

async function getELDetails() {
    const response = await fetch("https://extralife.donordrive.com/api/{ExtraLifeType}/{participantId}");
    const text = await response.text();
    return JSON.parse(text);
}
  
async function getDonations() {
    const response = await fetch("https://extralife.donordrive.com/api/{ExtraLifeType}/{participantId}/donations?limit=10");
    const text = await response.text();
    donations = JSON.parse(text);
    console.log("Donations: ", donations);
}

async function getIncentives() {
    const response = await fetch("https://extralife.donordrive.com/api/{ExtraLifeType}/{participantId}/incentives");
    const text = await response.text();
    incentives = JSON.parse(text);
    console.log("Incentives: ", incentives);
}
  
let checkForDonation = () => {
    if ("{participantId}" !== "") {
        getLatestDonations().then(async (donos) => {
            for (let i = 0; i < donos.length; i++) {
                if (!arrayColumn(donations, "donationID").includes(donos[i].donationID) && donos[i].createdDateUTC >= donations[0].createdDateUTC) {
                    donations.unshift(donos[i]);

                    let percent = (donationSum / donationGoal) * 100;
                    if (donos[i].incentiveID) {
                        playAlert(donos[i].incentiveID);
                    }
                    await sleep(8000);
                }
            }

            setTimeout(function () { checkForDonation(); }, 15000);
        });
    }
}

let setAlerts = (fields) => {
    for (i = 1; i <= 5; i++) {
        let incentive = "incentive-" + i;
        if (fields[incentive + "-name"]) {
            let sounds = [];
            for (j = 1; j <= 5; j++) {
                if (fields[incentive + "-sound-" + j]) {
                    sounds.push({
                        "sound": fields[incentive + "-sound-" + j]
                    });
                }
            }

            alerts.push({
                "name": fields[incentive + "-name"],
                "sounds": sounds
            });
        }
    }

    console.log("Alerts: ", alerts);
}

window.addEventListener("onWidgetLoad", async (obj) => {
    console.log(obj);
    if ("{participantId}" !== "") {
        getIncentives();
        getDonations();
        setAlerts(obj.detail.fieldData);
        setTimeout(function () { checkForDonation(); }, 15000);
    }
});