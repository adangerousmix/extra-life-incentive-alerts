const container = document.getElementsByClassName("main-container")[0];
const image = document.getElementById("image");
const alert = document.getElementsByClassName("alert")[0];

let donations = [],
    incentives = [],
    lastDonationDateTime = "",
    setIncentives = [];

let playAlert = () => {
    if ({enableAlerts}) {
        let sound = new Audio("{incentive-1-sound-1}");
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

let getSetIncentivesAlerts = () => {
    for (i = 0; i < 5; i++) {
        let v = "incentive-" + i + "-name";
        if ({{v}}) {
            setIncentives.push({{v}});
        }
    }

    console.log("Alerts: ", setIncentives);
}

window.addEventListener("onWidgetLoad", async (obj) => {
    if ("{participantId}" !== "") {
        getSetIncentivesAlerts();
        getIncentives();
        getDonations();
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