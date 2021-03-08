const container = document.getElementsByClassName("main-container")[0];

let donations = [],
    lastDonationDateTime = "",
    audio = new Audio("{alertSound}");

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
}
  
function checkForDonation() {
    if ("{participantId}" !== "") {
        getLatestDonations().then(async (donos) => {
            for (let i = 0; i < donos.length; i++) {
                if (!arrayColumn(donations, "donationID").includes(donos[i].donationID) && donos[i].createdDateUTC >= donations[0].createdDateUTC) {
                    donations.unshift(donos[i]);
                    donationSum = donationSum + donations[0].amount;

                    if (donationSum >= donationGoal && !goalMet) {
                        goalComplete.play();
                        goalMet = true;
                    }

                    let percent = (donationSum / donationGoal) * 100;
                    updateProgress(percent);
                    playAlert();
                    await sleep();
                }
            }

            setTimeout(function () { checkForDonation(); }, 15000);
        });
    }
}

window.addEventListener("onWidgetLoad", async (obj) => {

});

window.addEventListener("onEventReceived", (obj) => {
    const event = obj.detail.event;
  
    if (event.listener === "widget-button" && event.field === "testAlert") {
        playAlert();
    }
});

window.addEventListener("onSessionUpdate", (obj) => {

});