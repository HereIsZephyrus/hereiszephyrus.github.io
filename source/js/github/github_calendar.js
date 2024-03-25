function getLatestSaturdayDate(count_base_day) {
    const currentDay = count_base_day.getDay(); 
    const daysOffset = (currentDay + 1)%7;
    const latestSaturday = new Date();
    latestSaturday.setDate(count_base_day.getDate() - daysOffset);
  
    return latestSaturday;
  }
const today = new Date();
const latestSat = getLatestSaturdayDate(today);

function isLeapYear(year) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {return true;}
    return false;
}
function getMonthDays(month, year) {
    const longMonth = [1,3,5,7,8,10,12];
    const shortMonth = [4,6,9,11];
    if (longMonth.includes(month))     return 31;
    if (shortMonth.includes(month))    return 30;
    if (month === 2) return 28 + isLeapYear(year);
    console.log(month);
    console.error('Invalid month');
}

//print calendar base image
const weekName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekLen = weekName.length;
const start_week = (latestSat.getDay() + 1) % weekLen;
//const weekArr = weekName.slice(start_week, weekName.length).concat(weekName.slice(0, start_week));
const weekArr = weekName;

const weekNum = 49;
const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const start_month = latestSat.getMonth();
let monthArr = [];
let monthGaplen = [];
var count_preday = latestSat.getDate();
var now_month = start_month;
while (count_preday < weekNum * weekLen) {
    const now_year = latestSat.getFullYear() - (now_month > start_month);
    let colnum = parseInt(count_preday / weekLen) + 1;
    monthGaplen.push(colnum);
    monthArr.push(monthName[now_month]);
    now_month = (now_month - 1 + 12)%12;
    count_preday += getMonthDays(now_month+1, now_year);
    //console.log(now_month);
}
if ( parseInt(count_preday / weekLen) + 1 < weekNum) {
    monthGaplen.push(weekNum);
    monthArr.push(monthName[now_month]);
}
monthGaplen.push(weekNum)

const monthArrContainer = document.getElementById('months');
monthArr.forEach(function(month, index) {
    let spanItem = document.createElement('span');
    spanItem.className = 'grid-head__cell';
    spanItem.textContent = month;
    spanItem.style.gridColumn = `${weekNum-monthGaplen[index+1]+1} / ${weekNum-monthGaplen[index]}`;
    //console.log(`${weekNum-monthGaplen[index]}`);
    spanItem.style.gridRow = '1 / 1';
    monthArrContainer.appendChild(spanItem);
});
const weekArrContainer = document.getElementById('weekdays');
weekArr.forEach(function(day) {
    let spanItem = document.createElement('span');
    spanItem.className = 'grid-cols__cell';
    spanItem.textContent = day;
    weekArrContainer.appendChild(spanItem);
});

const block = document.getElementById('calendar_grid');
for (let num = 0; num < weekNum; num++) {
    for (let week = 0; week < weekLen; week++) {
        let listItem = document.createElement('li');
        listItem.className = 'grid__cell';
        block.appendChild(listItem);
    }
}

const getDateString = (cnt) => {
	var date = new Date();
    date.setDate(latestSat.getDate() - cnt);
    //console.log(date);
	return `${monthName[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

//get github contributions info from GitHub REST API

function get_GitHub_contributions_API(user_name, weekLen) {
    return new Promise((resolve, reject) => {
        const url = `https://gh-calendar.rschristian.dev/user/${user_name}`;
        fetch(url)
            .then(response => response.json())
            .then(jsonData => {
                const contributionList = jsonData.contributions;
                const lastWeekContributions = contributionList.slice(contributionList.length - (weekLen + 1)).reverse();
                resolve(lastWeekContributions);
            })
            .catch(error => {
                console.error('Error:', error);
                reject(error);
            });
    });
}
function get_GitHub_contributions(){
    //let res;
    get_GitHub_contributions_API('HereIsZephyrus', weekNum)
        .then(contributions => {
            console.log(contributions);
            return contributions;
        })
        .catch(error => {
            console.error(error);
        });
    //return res;
}
const contributionInfo = get_GitHub_contributions();
console.log(contributionInfo);
const gridCell = document.querySelectorAll('.grid__cell');
let counter = 0;
const drawSpace = () => {
    ongoingWeek = [].push(contributionInfo[0]);
    console.log(ongoingWeek);
    ongoingWeek.forEach(day => {
        gridCell[counter].setAttribute('data-commit', day["count"]);
        gridCell[counter].setAttribute('data-date', day["date"]);
        gridCell[counter].classList.add(`grid__cell_color_${ongodayingWeek["intensity"]}`);
        counter ++;
    });
    for (let week = 0; week<ongoingWeek.length; week++){
        gridCell[counter].setAttribute('data-commit', ongoingWeek["count"]);
        gridCell[counter].setAttribute('data-date', ongoingWeek["date"]);
        gridCell[counter].classList.add(`grid__cell_color_${ongoingWeek["intensity"]}`);
        //console.log(gridCell[counter].intensity);
        counter ++;
    }
    for (let num = 0; num < weekNum; num++){
        currentWeek = contributionInfo[num+1];
        console.log(currentWeek);
        currentWeek.forEach(day => {
            gridCell[counter].setAttribute('data-commit', day["count"]);
            gridCell[counter].setAttribute('data-date', day["date"]);
            gridCell[counter].classList.add(`grid__cell_color_${day["intensity"]}`);
            counter ++;
        })
    }
}

drawSpace();


//add mouse listener to each cell
let timer = null;
const tooltip = document.querySelector('.tooltip');
const clearTooltip = () => {tooltip.innerHTML = '';}

/**
* Closes the tooltip and sets a timer to remove display of the tooltip after a delay.
*
* @return {undefined} 
*/
const closeTooltip = () => {
	tooltip.classList.remove('tooltip_visible');
	
	timer = setTimeout(() => {
		tooltip.classList.remove('tooltip_display');
		clearTooltip();
	}, 200);
}

/**
 * Function to open a tooltip at specified coordinates with commit information.
 *
 * @param {object} param - Object containing x, y, commit, and date properties.
 * @return {void} 
 */
const openTooltip = ({ x, y, commit, date }) => {
	clearTimeout(timer);
	clearTooltip();
	tooltip.style.top = y+'px';
	tooltip.style.left = x+'px';
	tooltip.classList.add('tooltip_display');
	setTimeout(() => {
		tooltip.classList.add('tooltip_visible');
	}, 1);
	
	const commitMsgNode = document.createElement("strong");
	const commitMsg = document.createTextNode(commit);
	commitMsgNode.appendChild(commitMsg);
	const dateMsg = document.createTextNode(` on ${date}`);
	tooltip.appendChild(commitMsgNode);
	tooltip.appendChild(dateMsg);
}
gridCell.forEach(cell => {
	cell.addEventListener('mouseover', () => {
		const coords = cell.getBoundingClientRect();
		const commit = cell.getAttribute('data-commit');
		const date = cell.getAttribute('data-date');

		openTooltip({
			x: coords.x + coords.width / 2,
			y: coords.y,
			commit,
			date
		});
	});
	cell.addEventListener('mouseout', closeTooltip);
});