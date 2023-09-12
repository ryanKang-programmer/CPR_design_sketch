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
            "CPR 2 min",
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
            "CPR 2 min",
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
            "CPR 2 min",
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
            "CPR 2 min",
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

const history = [0];

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
            //for CPR
            if (obj.id === "cpr-timer" || obj.id === "cpr-timer-type3" || obj.id === "cpr-timer-type1") {
                let pNode = obj.parentNode.parentNode;
                if (obj.id === "cpr-timer-type1") {
                    pNode = obj.parentNode.parentNode.parentNode.parentNode.parentNode;
                }
                if (time - now < 1000 * 10){
                    //red
                    pNode.classList.remove('green');
                    pNode.classList.add('red');
                } else if (time - now < 1000 * 60) {
                    //green
                    pNode.classList.add('green');
                    pNode.classList.remove('red');
                } else {
                    //normal
                    pNode.classList.remove('green');
                    pNode.classList.remove('red');
                } 
            //for Epinephrine
            } else if (obj.id === "epi-timer-from") {
                if (time - now <= 0){
                    const toVal = document.getElementById("epi-timer-to").getAttribute("value");
                    if (toVal - now < 1000 * 10) {
                        obj.parentNode.parentNode.classList.remove('green');
                        obj.parentNode.parentNode.classList.add('red');
                    } else if (toVal - now < 1000 * 60 * 2) {
                        obj.parentNode.parentNode.classList.add('green');
                        obj.parentNode.parentNode.classList.remove('red');
                    }
                } else {
                    obj.parentNode.parentNode.classList.remove('green');
                    obj.parentNode.parentNode.classList.remove('red');
                }
            } else if (obj.id === "epi-timer-from-type3") {
                if (time - now <= 0){
                    const toVal = document.getElementById("epi-timer-to-type3").getAttribute("value");
                    if (toVal - now < 1000 * 10) {
                        obj.parentNode.parentNode.classList.remove('green');
                        obj.parentNode.parentNode.classList.add('red');
                    } else if (toVal - now < 1000 * 60 * 2) {
                        obj.parentNode.parentNode.classList.add('green');
                        obj.parentNode.parentNode.classList.remove('red');
                    }
                } else {
                    obj.parentNode.parentNode.classList.remove('green');
                    obj.parentNode.parentNode.classList.remove('red');
                }
            } else if (obj.id === "epi-timer-from-type1") {
                if (time - now <= 0){
                    const toVal = document.getElementById("epi-timer-to-type1").getAttribute("value");
                    if (toVal - now < 1000 * 10) {
                        obj.parentNode.parentNode.classList.remove('green');
                        obj.parentNode.parentNode.classList.add('red');
                    } else if (toVal - now < 1000 * 60 * 2) {
                        obj.parentNode.parentNode.classList.add('green');
                        obj.parentNode.parentNode.classList.remove('red');
                    }
                } else {
                    obj.parentNode.parentNode.classList.remove('green');
                    obj.parentNode.parentNode.classList.remove('red');
                }
            }

            obj.innerHTML = toHoursAndMinutes((time - now) / 1000);
        }
    }, 1000);
    //Timer end

    type(1, document.querySelectorAll('.type-btn')[0]);

    document.querySelectorAll('.a1').forEach(o => o.onclick = () => updateUI(1, 'Jump to 1'));
    document.querySelectorAll('.a2').forEach(o => o.onclick = () => updateUI(2, 'Jump to 2'));
    document.querySelectorAll('.a5').forEach(o => o.onclick = () => updateUI(5, 'Jump to 5'));
    document.querySelectorAll('.a7').forEach(o => o.onclick = () => updateUI(7, 'Jump to 7'));
    document.querySelectorAll('.a9').forEach(o => o.onclick = () => updateUI(9, 'Jump to 9'));
    document.querySelectorAll('.a11').forEach(o => o.onclick = () => updateUI(11, 'Jump to 11'));
    document.querySelectorAll('.a12').forEach(o => o.onclick = () => updateUI(12, 'Jump to 12'));
    // updateUI(${y}, 'Yes clicked, Move to ${y}');"
}

function type(idx, t) {
    document.querySelectorAll(".type-container").forEach(
        o => o.style.display = "none"
    )
    document.querySelector(`#type-${idx}`).style.display = ""

    document.querySelectorAll(".type-btn").forEach(
        o => o.classList.remove("selected")
    )

    t.classList.add("selected");
}

function updateUI(idx, msg, isBack = false) {
    if (!isBack) {
        history.push(idx);
    }

    if (idx === 0) {
        location.reload();
    }

    document.querySelectorAll('.algo').forEach(o => o.classList.remove('selected'));
    document.querySelectorAll(`.a${idx}`).forEach(o => o.classList.add('selected'));

    const chunkContainer = document.getElementById("chunck-container");
    chunkContainer.innerHTML = "";
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
    
    const i_e = document.getElementById('instruction');
    const p_i_e = document.getElementById('prev-instruction');
    const c_i_e = document.getElementById('cur-instruction');
    const et_e = document.getElementById('epi-timer');
    const ct_e = document.getElementById('cpr-timer');
    const qt_e = document.getElementById('q-title');
    const t3_qt_e = document.getElementById('t1-q-title');
    const y_b = document.getElementById('yes-btn');
    const t1_y_b = document.getElementById('t1-yes-btn');
    const ys_e = document.getElementById('yes-summary');
    const t1_ys_e = document.getElementById('t1-yes-summary');
    const n_b = document.getElementById('no-btn');
    const t1_n_b = document.getElementById('t1-no-btn');
    const ns_e = document.getElementById('no-summary');
    const t1_ns_e = document.getElementById('t1-no-summary');
    
    const isntruction_html = target.instruction?.reduce((prev, curr) => {
        return prev + `<li>${curr}</li>`;
    }, '')

    i_e.innerHTML = isntruction_html;
    c_i_e.innerHTML = isntruction_html;
    if (history[history.length - 2] !== undefined || history[history.length - 2] !== 0) {
        const prevObj = alarms.find(e => e.id === history[history.length - 2]);

        if (prevObj !== undefined && prevObj !== 0) {
            console.log(prevObj);
            p_i_e.innerHTML = prevObj.instruction?.reduce((prev, curr) => {
                return prev + `<li>${curr}</li>`;
            }, '')
        } else {
            p_i_e.innerHTML = "";
        }
    }

    if (target.epinephrine === true) {
        //TO-DO
        if (document.getElementById("epi-timer-from").getAttribute("value") === "" && document.getElementById("epi-timer-to").getAttribute("value") === "") {
            document.getElementById("epi-timer-from").setAttribute("value", lastTime.getTime() + 1000 * 60 * 3);
            document.getElementById("epi-timer-to").setAttribute("value", lastTime.getTime() + 1000 * 60 * 5);
        }

        if (document.getElementById("epi-timer-from-type3").getAttribute("value") === "" && document.getElementById("epi-timer-to-type3").getAttribute("value") === "") {
            document.getElementById("epi-timer-from-type3").setAttribute("value", lastTime.getTime() + 1000 * 60 * 3);
            document.getElementById("epi-timer-to-type3").setAttribute("value", lastTime.getTime() + 1000 * 60 * 5);
        }

        if (document.getElementById("epi-timer-from-type1").getAttribute("value") === "" && document.getElementById("epi-timer-to-type1").getAttribute("value") === "") {
            document.getElementById("epi-timer-from-type1").setAttribute("value", lastTime.getTime() + 1000 * 60 * 3);
            document.getElementById("epi-timer-to-type1").setAttribute("value", lastTime.getTime() + 1000 * 60 * 5);
        }
    }

    if (target.cpr === true) {
        document.getElementById("cpr-timer").setAttribute("value", lastTime.getTime() + 1000 * 60 * 2);
        document.getElementById("cpr-timer-type3").setAttribute("value", lastTime.getTime() + 1000 * 60 * 2);
        document.getElementById("cpr-timer-type1").setAttribute("value", lastTime.getTime() + 1000 * 60 * 2);
    }
    // target.question
    target.question?.title ? qt_e.innerHTML = target.question?.title : null;
    target.question?.title ? t3_qt_e.innerHTML = target.question?.title : null;

    // target.question.y
    y_b.onclick = () => updateUI(target.question?.y?.goto, `Yes clicked, Move to ${target.question?.y?.goto}`);
    t1_y_b.onclick = () => updateUI(target.question?.y?.goto, `Yes clicked, Move to ${target.question?.y?.goto}`);
    const y_html = target.question?.y?.contents?.reduce((prev, curr) =>
        prev + `<li>${curr}</li>`
    , '')
    ys_e.innerHTML = y_html;
    t1_ys_e.innerHTML = y_html;

    // target.question.n
    t1_n_b.onclick = () => updateUI(target.question?.n?.goto, `No clicked, Move to ${target.question?.n?.goto}`);
    n_b.onclick = () => updateUI(target.question?.n?.goto, `No clicked, Move to ${target.question?.n?.goto}`);
    const n_html = target.question?.n?.contents?.reduce((prev, curr) =>
        prev + `<li>${curr}</li>`
    , '')
    ns_e.innerHTML = n_html;
    t1_ns_e.innerHTML = n_html;

    switch (idx) {
        case 1:
            chunkContainer.innerHTML = `
            ${gray_li("Start CPR",target.instruction)}
            ${question_box(target.question?.title, target.question?.y?.goto, target.question?.n?.goto)}`
            break;
        case 2:
            chunkContainer.innerHTML = `
            ${simple_gray_html(target.instruction[0])}
            ${shock_html()}
            ${gray_li(target.instruction[2],[target.instruction[3]])}
            ${question_box(target.question?.title, target.question?.y?.goto, target.question?.n?.goto)}`
            break;
        case 5:
            chunkContainer.innerHTML = `
            ${shock_html()}
            ${gray_li(target.instruction[1], [target.instruction[2], target.instruction[3]])}
            ${question_box(target.question?.title, target.question?.y?.goto, target.question?.n?.goto)}`
            break;
        case 7:
            chunkContainer.innerHTML = `
            ${shock_html()}
            ${gray_li(target.instruction[1], [target.instruction[2], target.instruction[3]])}
            ${question_box(target.question?.title, target.question?.y?.goto, target.question?.n?.goto)}`
            break;
        case 9:
            chunkContainer.innerHTML = `
            ${simple_gray_html(target.instruction[0])}
            ${epi_html()}
            ${gray_li(target.instruction[2], [target.instruction[3], target.instruction[4], target.instruction[5]])}
            ${question_box(target.question?.title, target.question?.y?.goto, target.question?.n?.goto)}
            `
            break;
        case 10:
            chunkContainer.innerHTML = `
            ${gray_li(target.instruction[0], [target.instruction[1], target.instruction[2], target.instruction[3]])}
            ${question_box(target.question?.title, target.question?.y?.goto, target.question?.n?.goto)}
            `
            break;
        case 11:
            chunkContainer.innerHTML = `
                ${gray_li(target.instruction[0], [target.instruction[1]])}
                ${question_box(target.question?.title, target.question?.y?.goto, target.question?.n?.goto)}
            `
            break;
    }
}

function gray_li(title, instructions) {
    return `<div style="flex: 0; padding: 2rem">
        <div class="box">
            <div style="display: flex; justify-content: center; align-items: center; position: relative; height: 100%; width: 100%;">
                <div class="title-container">
                    <div class="title-text">
                        ${title === undefined ? "Title" : title}
                    </div>
                </div>
                <div class="contents-container">
                    <ul id="instruction">
                        ${instructions === undefined ? "" : instructions?.reduce((prev, curr) => 
                        prev + `<li> ${curr} </li>`, '')}
                    </ul> 
                </div>
            </div>
        </div>
    </div>`
}

function question_box(q, y, n) {
    return `<div class="hex3" style="flex: 0; padding: 2rem;">
        <div style="height: 20vh;">
            <div style="display: flex; justify-content: center; align-items: center; position: relative; height: 100%; width: 100%;">
                <div style="position: absolute;top: -1rem; height: 3rem; display: flex; align-items: center; justify-content: center;">
                    <div style="font-size: 1.5rem; font-weight: bold;">
                        ${q === undefined ? "question" : q}
                    </div>
                </div>
                <div style="position: absolute; inset: 2rem; display: flex; justify-content: space-around; align-items: center;">
                    <div onclick="updateUI(${y}, 'Yes clicked, Move to ${y}');" id="t3-yes-btn" style="border-radius: 10px; background-color: rgba(0, 176, 80, 0.5); height: 50%; display: flex; align-items: center; justify-content: center;
                    position:relative; cursor: pointer; flex: .4">
                        <div style="font-size: 1.5rem; font-weight: bold;">Yes</div>
                        <div style="position: absolute; top: 2rem; font-size: 1rem; padding: .5rem;">
                            <ul id="yes-summary" style="list-style-position: inside;">
                            </ul>
                        </div>
                    </div>
                    <div onclick="updateUI(${n}, 'No clicked, Move to ${n}');" id="t3-no-btn" style="border-radius: 10px; background-color: rgba(127, 127, 127, 0.5); height: 50%; display: flex; align-items: center; justify-content: center;
                    position:relative; cursor: pointer; flex: .4">
                        <div style="font-size: 1.5rem; font-weight: bold;">No</div>
                        <div style="position: absolute; top: 2rem; font-size: 1rem; padding: .5rem;">
                            <ul id="no-summary" style="list-style-position: inside;">
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
}

function shock_html() {
    return `
    <div style="padding: 2rem;">
        <div style="display: flex; justify-content: center; align-items: center;">
            <i class="fas fa-bolt" style="color: #ff0000; font-size: 10vh;"></i>
            <span style="color: #ff0000; font-weight: bold; font-size: 1.5rem;">Shock</span>
        </div>
    </div>
    `
}

function epi_html() {
    return `
    <div style="padding: 2rem;">
        <div style="display: flex; justify-content: center; align-items: center;">
            <i class="fas fa-syringe" style="color: #ff0000; font-size: 10vh;"></i>
            <span style="color: #ff0000; font-weight: bold; font-size: 1.5rem;">Epinephrine ASAP</span>
        </div>
    </div>
    `
}

function simple_gray_html(t) {
    return `
    <div style="padding: 2rem">
        <div class="simple-gray-box">
            ${t}
        </div>
    </div>
    `
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
    setTimeout(function(){
        x.className = x.className.replace("show", "");
        alert("Post-Cardiac Arrest Care checklist");
    }, 3000);
}

function ROSC_NO() {
    updateUI(10, "No clicked, Move to 10");
    document.getElementById("modal").style.display = 'none';
    //TODO;
}

function refreshEpi() {
    const lastTime = new Date();

    if (document.getElementById("epi-timer-from").getAttribute("value") !== "" && document.getElementById("epi-timer-to").getAttribute("value") !== "") {
        document.getElementById("epi-timer-from").setAttribute("value", lastTime.getTime() + 1000 * 60 * 3);
        document.getElementById("epi-timer-to").setAttribute("value", lastTime.getTime() + 1000 * 60 * 5);
    }

    if (document.getElementById("epi-timer-from-type3").getAttribute("value") !== "" && document.getElementById("epi-timer-to-type3").getAttribute("value") !== "") {
        document.getElementById("epi-timer-from-type3").setAttribute("value", lastTime.getTime() + 1000 * 60 * 3);
        document.getElementById("epi-timer-to-type3").setAttribute("value", lastTime.getTime() + 1000 * 60 * 5);
    }

    if (document.getElementById("epi-timer-from-type1").getAttribute("value") !== "" && document.getElementById("epi-timer-to-type1").getAttribute("value") !== "") {
        document.getElementById("epi-timer-from-type1").setAttribute("value", lastTime.getTime() + 1000 * 60 * 3);
        document.getElementById("epi-timer-to-type1").setAttribute("value", lastTime.getTime() + 1000 * 60 * 5);
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

function goBack() {
    history.pop();
    const prevID = history[history.length - 1];
    console.log(prevID);

    updateUI(prevID, undefined, true);
    const x = document.getElementById("snackbar");

    x.innerText = `Back to ${prevID}`;
    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){
        x.className = x.className.replace("show", "");
    }, 3000);
}

function overview(bool) {
    if (bool) {
        document.getElementById('algorithm-modal').style.display = "block";
    } else {
        document.getElementById('algorithm-modal').style.display = "none";
    }
}