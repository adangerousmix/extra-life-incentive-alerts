const container = document.getElementsByClassName("main-container")[0];
const image = document.getElementById("image");
const alert = document.getElementsByClassName("alert")[0];

let donations = [],
    incentives = [],
    lastDonationDateTime = "",
    setIncentives = [];

let playAlert = (incentiveId) => {
    if ({enableAlerts}) {
        let rnd = Math.floor(Math.random() * Math.floor(2));
        let sound = new Audio("{incentive-" + rnd + "-sound-1}");
        // image.src = "{image1}";
        sound.play();


        // alert.classList.add("alert-show");
        // void alert.offsetWidth;
        // alert.classList.remove("alert-hide");

        // setTimeout(() => { 
        //     alert.classList.add("alert-hide");
        //     void alert.offsetWidth;
        //     alert.classList.remove("alert-show");
        // }, 8000);
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

let setIncentivesAlerts = (fields) => {
    for (i = 1; i <= 5; i++) {
        let incentive = "incentive-" + i;
        if (fields[incentive + "-name"]) {
            let sounds = [];
            for (j = 1; j <= 5; j++) {
                if (fields[incentive + "-sound-" + j]) {
                    let soundName = "sound-" + j;
                    sounds.push({
                        {soundName}: fields[incentive + "-sound-" + j]
                    });
                }
            }

            setIncentives.push({
                "name": fields[incentive + "-name"],
                "sounds": sounds
            });
        }
    }

    console.log("Alerts: ", setIncentives);
}

window.addEventListener("onWidgetLoad", async (obj) => {
    console.log(obj);
    if ("{participantId}" !== "") {
        setIncentivesAlerts(obj.detail.fieldData);
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