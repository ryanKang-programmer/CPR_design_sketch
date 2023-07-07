const currentTimeStamp = new Date().getTime();

const alarms = [
    {
        title: "Title",
        contents: "Contents",
        timestamp: currentTimeStamp + 1000 * 60 * 1,
        index: 0
    },
    {
        title: "Title",
        contents: "Contents",
        timestamp: currentTimeStamp + 1000 * 60 * 2,
        index: 1
    },
    {
        title: "Title",
        contents: "Contents",
        timestamp: currentTimeStamp + 1000 * 60 * 3,
        index: 2
    },
    {
        title: "Title",
        contents: "Contents",
        timestamp: currentTimeStamp + 1000 * 60 * 4,
        index: 3
    },
    {
        title: "Title",
        contents: "Contents",
        timestamp: currentTimeStamp + 1000 * 60 * 5,
        index: 4
    },
    {
        title: "Title",
        contents: "Contents",
        timestamp: currentTimeStamp + 1000 * 60 * 6,
        index: 5
    },
    {
        title: "Title",
        contents: "Contents",
        timestamp: currentTimeStamp + 1000 * 60 * 7,
        index: 6
    }
]

let index = 7;

window.onload = () => {
    drawAlarms();

    setInterval(() => {
        const now = new Date().getTime();
        const times = document.querySelectorAll('.time');
        for (let i = 0; i < times.length; i++) {
            const obj = times[i];
            const time = obj.getAttribute("value");

            if (time - now < 1000 * 10){
                //red
                obj.parentNode.classList.remove('green');
                obj.parentNode.classList.add('red');
            } else if (time - now < 1000 * 60) {
                //green
                obj.parentNode.classList.add('green');
                obj.parentNode.classList.remove('red');
            } else {
                //normal
                obj.parentNode.classList.remove('green');
                obj.parentNode.classList.remove('red');
            } 

            obj.innerHTML = toHoursAndMinutes((time - now) / 1000);
        }
    }, 1000);
}

function toHoursAndMinutes(totalSeconds) {
    const totalMinutes = Math.floor(totalSeconds / 60);
  
    const seconds = Math.floor(totalSeconds % 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let str = "";

    if (hours > 0) {
        if (hours === 1) {
            str += hours + " hour "
        } else {
            str += hours + " hours "
        }
    }

    if (minutes > 0) {
        if (minutes === 1) {
            str += minutes + " minute "
        } else {
            str += minutes + " minutes "
        }
    } 

    if (seconds > 0) {
        if (seconds === 1) {
            str += seconds + " second"
        } else {
            str += seconds + " seconds"
        }
    }
  
    if (str === "") {
        str = "Expired";
    }

    return str;
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