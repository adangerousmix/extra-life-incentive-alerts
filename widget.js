const container = document.getElementsByClassName("main-container")[0];

let donations = [];

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