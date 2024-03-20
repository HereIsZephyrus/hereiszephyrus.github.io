const today = new Date();
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
const start_week = (today.getDay() + 1) % weekLen;
const weekArr = weekName.slice(start_week, weekName.length).concat(weekName.slice(0, start_week));

const weekNum = 50;
const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const start_month = today.getMonth();
let monthArr = [];
let monthGaplen = [];
var count_preday = today.getDate();
var now_month = start_month;
while (count_preday < weekNum * weekLen) {
    const now_year = today.getFullYear() - (now_month > start_month);
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
//monthArr = monthArr.reverse();
//console.log(monthArr);

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
    date.setDate(today.getDate() - cnt);
    //console.log(date);
	return `${monthName[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

//get github contributions info from GitHub REST API

function get_GitHub_contributions(user_name) {
    const api_url = `https://github.com/users/${user_name}/contributions`
    const axios = require('axios');
    const cheerio = require('cheerio');
    let count = []
    axios.get(api_url)
      .then((response) => {
        const htmlString = response.data;
        const $ = cheerio.load(htmlString);
        const table = $('tbody'); // 选择表格元素
        const rows = table.find('tr'); // 获取所有行
        rows.each((index, row) => {
            const columns = $(row).find('tooltip'); 
            columns.each((index, column) => {
                count.add($(column).text())
                console.log($(column).text());
            });
        })
      .catch((error) => {
            console.error('Error retrieving HTML:', error);
      });
    });
}
const contributionInfo = get_GitHub_contributions('HereIsZephyrus');

const getContributionsObj = (cnt) => {
	const min = 1;
	const max = 12;
	const rand =  Math.floor(Math.random() * (+max - +min) + +min);
	
	return {
		rand,
		str: `${rand} contribution${rand > 1 ? 's' : 'No contributions'}` 
	};
}

const gridCell = document.querySelectorAll('.grid__cell');
let counter = 0;
const drawSpace = () => {
    for (let num = 0; num < weekNum; num++){
        for (let week = 0; week < weekLen; week++) {
            dateStr = getDateString(weekNum * weekLen - counter);
            commit = getContributionsObj(weekNum * weekLen - counter);
            gridCell[counter].setAttribute('data-commit', commit.str);
            gridCell[counter].setAttribute('data-date', dateStr);
            counter ++;
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