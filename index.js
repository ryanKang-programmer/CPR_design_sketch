const currentTimeStamp = new Date().getTime();

const alarms = [
    {
        id: 1,
        instruction: [
            "Begin bag-mask ventilation and given oxygen",
            "Attach monitor/defibrillator"
        ],
        epinephrine: false,
        cpr: true,
        question: {
            title: "Rythm shockable?",
            y: {
                goto: 2,
                contents: [
                    "VF/pVT",
                    "Shock",
                    "CPR 2 min"
                ]
            },
            n: {
                goto: 9,
                contents: [
                    "Asystole/PEA",
                    "Epinephrine ASAP",
                    "CPR 2 min"
                ]
            }
        }
    },
    {
        id: 2,
        instruction: [
            "VP/pVT",
            "Shock",
            "CPR 2 min",
            "IV/IO Access"
        ],
        epinephrine: false,
        cpr: true,
        question: {
            title: "Rythm shockable?",
            y: {
                goto: 5,
                contents: [
                    "Shock",
                    "CPR 2 min"
                ]
            },
            n: {
                goto: 12,
                contents: [
                    "Return of spontaneous circulation?"
                ]
            }
        }
    },
    {
        id: 5,
        instruction: [
            "Shock",
            "CPR 2 min",
            "Epinephrine every 3-5 min",
            "Consider advanced airway"
        ],
        epinephrine: true,
        cpr: true,
        question: {
            title: "Rythm shockable?",
            y: {
                goto: 7,
                contents:[
                    "Shock",
                    "CPR 2 min"
                ]
            },
            n: {
                goto: 12,
                contents:[
                    "Return of spontaneous circulation?"
                ]
            }
        }
    },
    {
        id: 7,
        instruction: [
            "Shock",
            "CPR [2:00]",
            "Amiodarone or lidocaine",
            "Treat reversible causes",
        ],
        epinephrine: true,
        cpr: true,
        question: {
            title: "Rythm shockable?",
            y: {
                goto: 5,
                contents:[
                    "Shock",
                    "CPR 2 min"
                ]
            },
            n: {
                goto: 12,
                contents: [
                    "Return of spontaneous circulation?"
                ]
            }
        }
    },
    {
        id: 12,
        instruction: [],
        epinephrine: false,
        cpr: false,
        question: {
            title: "Check Return of spontaneous circulation (ROSC)",
            y: {
                goto: 999,
                contents:[
                    "Post-Cardiac Arrest Care checklist"
                ]
            },
            n: {
                goto: 10,
                contents: [
                    "CPR 2 min"
                ]
            }
        }
    },
    {
        id: 9,
        instruction: [
            "Asytole/PEA",
            "Epinephrine ASAP",
            "CPR [2:00]",
            "IV/IO access",
            "Epinephrine every 3-5 min",
            "Consider advanced airway and capnography",
        ],
        epinephrine: true,
        cpr: true,
        question: {
            title: "Rythm shockable?",
            y: {
                goto: 7,
                contents:[
                    "Shock",
                    "CPR 2 min"
                ]
            },
            n: {
                goto: 11,
                contents: [
                    "CPR 2 min"
                ]
            }
        }
    },
    {
        id: 10,
        instruction: [
            "CPR [2:00]",
            "IV/IO access",
            "Epinephrine every 3-5 min",
            "Consider advanced airway and capnography",
        ],
        epinephrine: true,
        cpr: true,
        question: {
            title: "Rythm shockable?",
            y: {
                goto: 7,
                contents:[
                    "Shock",
                    "CPR 2 min"
                ]
            },
            n: {
                goto: 11,
                contents: [
                    "CPR 2 min"
                ]
            }
        }
    },
    {
        id: 11,
        instruction: [
            "CPR [2:00]",
            "Treat reversible causes",
        ],
        epinephrine: true,
        cpr: true,
        question: {
            title: "Rythm shockable?",
            y: {
                goto: 7,
                contents:[
                    "Shock",
                    "CPR 2 min"
                ]
            },
            n: {
                goto: 12,
                contents: [
                    "Return of spontaneous circulation?"
                ]
            }
        }
    },
]

let index = 7;

window.onload = () => {
    updateUI(1);
    //Timer function
    setInterval(() => {
        const now = new Date().getTime();
        const times = document.querySelectorAll('.time');

        for (let i = 0; i < times.length; i++) {
            const obj = times[i];
            const time = obj.getAttribute("value");
            if (time === "") {
                obj.style.display = "none";
                continue;
            } else {
                obj.style.display = "";
            }
            if (time - now < 1000 * 10){
                //red
                obj.parentNode.parentNode.classList.remove('green');
                obj.parentNode.parentNode.classList.add('red');
            } else if (time - now < 1000 * 60) {
                //green
                obj.parentNode.parentNode.classList.add('green');
                obj.parentNode.parentNode.classList.remove('red');
            } else {
                //normal
                obj.parentNode.parentNode.classList.remove('green');
                obj.parentNode.parentNode.classList.remove('red');
            } 

            obj.innerHTML = toHoursAndMinutes((time - now) / 1000);
        }
    }, 1000);
    //Timer end
}

function updateUI(idx, msg) {
    const x = document.getElementById("snackbar");
    const lastTime = new Date();
    if (msg !== undefined) {
        x.innerText = msg;
        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    if (idx === 12) {
        document.getElementById("modal").style.display = 'block';
        return;
    }
    //idx !== goto
    const target = alarms.find(e => e.id === idx);
    console.log(target);
    const i_e = document.getElementById('instruction');
    const et_e = document.getElementById('epi-timer');
    const ct_e = document.getElementById('cpr-timer');
    const qt_e = document.getElementById('q-title');
    const y_b = document.getElementById('yes-btn');
    const ys_e = document.getElementById('yes-summary');
    const n_b = document.getElementById('no-btn');
    const ns_e = document.getElementById('no-summary');
    
    const isntruction_html = target.instruction?.reduce((prev, curr) => {
        return prev + `<li>${curr}</li>`;
    }, '')

    i_e.innerHTML = isntruction_html;

    if (target.epinephrine === true) {
        //TO-DO
        if (document.getElementById("epi-timer-from").getAttribute("value") === "" && document.getElementById("epi-timer-to").getAttribute("value") === "") {
            document.getElementById("epi-timer-from").setAttribute("value", lastTime.getTime() + 1000 * 60 * 3);
            document.getElementById("epi-timer-to").setAttribute("value", lastTime.getTime() + 1000 * 60 * 5);
        }
    }

    if (target.cpr === true) {
        document.getElementById("cpr-timer").setAttribute("value", lastTime.getTime() + 1000 * 60 * 3);
    }
    // target.question
    target.question?.title ? qt_e.innerHTML = target.question?.title : null;
    // target.question.y
    y_b.onclick = () => updateUI(target.question?.y?.goto, "Yes clicked");
    const y_html = target.question?.y?.contents?.reduce((prev, curr) =>
        prev + `<li>${curr}</li>`
    , '')
    ys_e.innerHTML = y_html;

    // target.question.n
    n_b.onclick = () => updateUI(target.question?.n?.goto, "No clicked");
    const n_html = target.question?.n?.contents?.reduce((prev, curr) =>
        prev + `<li>${curr}</li>`
    , '')
    ns_e.innerHTML = n_html;
}

function toHoursAndMinutes(totalSeconds) {
    const totalMinutes = Math.floor(totalSeconds / 60);
  
    const seconds = Math.floor(totalSeconds % 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let str = "";

    // if (hours > 0) {
    //     if (hours === 1) {
    //         str += hours + " hour ";
    //     } else {
    //         str += hours + " hours ";
    //     }
    // }

    // if (minutes > 0) {
    //     if (minutes === 1) {
    //         str += minutes + " minute ";
    //     } else {
    //         str += minutes + " minutes ";
    //     }
    // } 

    // if (seconds > 0) {
    //     if (seconds === 1) {
    //         str += seconds + " second";
    //     } else {
    //         str += seconds + " seconds";
    //     }
    // }

    if (hours <= 0 && minutes <= 0 && seconds <= 0)  {
        str = "00:00";
        return str;
    }

    // if (hours == 0) {
    //     str += "00:";
    // } else if (hours < 10) {
    //     str += `0${hours}:`;
    // } else {
    //     str += `${hours}:`;
    // }

    if (minutes == 0) {
        str += "00:";
    } else if (minutes < 10) {
        str += `0${minutes}:`;
    } else {
        str += `${minutes}:`;
    }

    if (seconds == 0) {
        str += "00";
    } else if (seconds < 10) {
        str += `0${seconds}`;
    } else {
        str += `${seconds}`;
    }

    return str;
}

function ROSC_YES() {
    document.getElementById("modal").style.display = 'none';
    const x = document.getElementById("snackbar");

    x.innerText = "Post-Cardiac Arrest Care checklist";
    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function ROSC_NO() {
    updateUI(10, "No clicked");
    document.getElementById("modal").style.display = 'none';
    //TODO;
}

function refreshEpi() {
    const lastTime = new Date();

    if (document.getElementById("epi-timer-from").getAttribute("value") !== "" && document.getElementById("epi-timer-to").getAttribute("value") !== "") {
        document.getElementById("epi-timer-from").setAttribute("value", lastTime.getTime() + 1000 * 60 * 3);
        document.getElementById("epi-timer-to").setAttribute("value", lastTime.getTime() + 1000 * 60 * 5);
    }
}

function addAlarm() {
    const container = document.getElementById('alarm-container');

    const now = new Date().getTime();

    const obj = {
        title: "Title",
        contents: "Contents",
        timestamp: now + 1000 * 60 * 1,
        index: index++
    }

    alarms.push(obj)

    alarms.sort((a, b) => {
        if (a.timestamp < b.timestamp) {
            return -1;
        }
        if (a.timestamp > b.timestamp) {
            return 1;
        }
        // a must be equal to b
        return 0;
    });

    const orderAfterSort = alarms.findIndex(o => o.index === obj.index);

    //insertBefore
    const div = document.createElement("div");

    div.innerHTML = `
        <div class="title">${obj.title}</div>
        <div class="contents">${obj.contents}</div>
        <div class="time" value="${obj.timestamp}">
            ${toHoursAndMinutes((obj.timestamp - currentTimeStamp) / 1000)}
        </div>
        <div style="position: absolute; top: 0; right: 0; padding: 1rem; cursor: pointer;" onclick="closeAlarm(${obj.index})">
            <i class="fas fa-times-circle"></i>
        </div>
    `

    div.classList.add('alarm-box');
    div.setAttribute('index', obj.index);

    container.insertBefore(div, container.childNodes[orderAfterSort]);
}

function drawAlarms() {
    const container = document.getElementById('alarm-container');

    const html = alarms.reduce((prev, curr) => {
        return prev +
        `<div class="alarm-box" index="${curr.index}">
            <div class="title">${curr.title}</div>
            <div class="contents">${curr.contents}</div>
            <div class="time" value="${curr.timestamp}">
                ${toHoursAndMinutes((curr.timestamp - currentTimeStamp) / 1000)}
            </div>
            <div style="position: absolute; top: 0; right: 0; padding: 1rem; cursor: pointer;" onclick="closeAlarm(${curr.index})">
                <i class="fas fa-times-circle"></i>
            </div>
        </div>`
    }, '')

    container.innerHTML = html;
}

function closeAlarm(idx) {
    const container = document.getElementById('alarm-container');

    alarms.splice(idx, 1);

    for (let i = 0; i < container.childNodes.length; i++) {
        console.log(container.childNodes[i].getAttribute('index'));
        console.log(idx);
        if (container.childNodes[i].getAttribute('index') == idx) {
            container.childNodes[i].remove();
        }
    }
}