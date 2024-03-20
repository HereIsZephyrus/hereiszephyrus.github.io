const path = require('path');

module.exports = {
  mode: 'production',
  entry: './source/js/github_calendar/github_calendar.js',
  output: {
    path: path.resolve(__dirname, "./github_calendar"), // 输出文件的目录
    filename: 'github_calendar_api.js' // 输出文件的名称
  }
};