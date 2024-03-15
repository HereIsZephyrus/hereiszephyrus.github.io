

const msDay = 86400000;
const msFirstDay = 1553385600000;
let counter = 0;

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
const today = new Date();

const weekName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekLen = weekName.length;
const start_week = (today.getDay() + 1) % weekLen;
const weekArr = weekName.slice(start_week, weekName.length).concat(weekName.slice(0, start_week));

const weekNum = 50;
const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const start_month = today.getMonth();
let monthArr = [];
let monthGaplen = [0];
var count_preday = today.getDate();
var now_month = start_month;
while (count_preday < weekNum * weekLen) {
    const now_year = today.getFullYear() - (now_month > start_month);
    let colnum = parseInt(count_preday / weekLen) + 1;
    monthGaplen.push(colnum);
    monthArr.push(monthName[now_month]);
    now_month = (now_month - 1 + 12)%12;
    count_preday += getMonthDays(now_month+1, now_year);
    console.log(now_month);
}
if ( parseInt(count_preday / weekLen) + 1 < weekNum) {
    monthGaplen.push(weekNum);
    monthArr.push(monthName[now_month]);
}
//monthArr = monthArr.reverse();
//console.log(monthArr);

const monthArrContainer = document.getElementById('months');
monthArr.forEach(function(month, index) {
    let spanItem = document.createElement('span');
    spanItem.className = 'grid-head__cell';
    spanItem.textContent = month;
    spanItem.style.gridColumn = `${weekNum-monthGaplen[index]} / ${Math.max(weekNum-monthGaplen[index+1],1)}`;
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

//get github contributions info from GitHub REST API
const getDateString = (cnt) => {
	const date = new Date(msFirstDay + msDay * cnt);
	return `${monthArr[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

const getContributionsObj = (cnt, isCommits) => {
	const min = 1;
	const max = 12;
	const rand = isCommits ? Math.floor(Math.random() * (+max - +min) + +min) : 0;
	
	return {
		rand,
		str: isCommits ? `${rand} contribution${rand > 1 ? 's' : ''}` : 'No contributions'
	};
}

const gridCell = document.querySelectorAll('.grid__cell');
const drawSpace = () => {
    for (let num = 0; num < weekNum; num++){
        for (let week = 0; week < weekLen; week++) {
            date = getDateString(counter);
            commit = getContributionsObj(counter, false);
            gridCell[counter].setAttribute('data-commit', commit.str);
            gridCell[counter].setAttribute('data-date', date);
            counter++;
        }
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