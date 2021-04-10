const container = document.getElementsByClassName("main-container")[0];
const image = document.getElementById("image");
const alert = document.getElementsByClassName("alert")[0];

let donations = [],
    incentives = [],
    lastDonationDateTime = "",
    alerts = [];

let playAlert = (incentiveId) => {
    if ({enableAlerts}) {
        let alert = "";
        let incentive = "";
        for (i = 0; i < incentives.length; i++) {
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
        console.log("Rnd:", rnd);
        let sound = new Audio(alert.sounds[rnd]);
        sound.play();
    }
};

let sleep = () => {
    return new Promise(resolve => setTimeout(resolve, 8000));
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
                    playAlert();
                    await sleep();
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
        setAlerts(obj.detail.fieldData);
        getIncentives();
        getDonations();
        playAlert("6BDC6058-EF95-6B0C-9588E5794C9153CE");
        setTimeout(function () { checkForDonation(); }, 15000);
    }
});

window.addEventListener("onEventReceived", (obj) => {
    const event = obj.detail.event;
  
    if (event.listener === "widget-button" && event.field === "testAlert") {
        playAlert();
    }
});

window.addEventListener("onSessionUpdate", (obj) => {

});