const { JSDOM } = require("jsdom");

const profile = async (username) => {
  const response = await fetch(`https://codeforces.com/profile/${username}`);
  const html = await response.text();

  const dom = new JSDOM(html);
  const document = dom.window.document;
  const rank = document.getElementsByClassName("user-rank")[0].textContent.trim();
  const rating = document.querySelectorAll("ul")[3]?.querySelectorAll("li")[0]?.textContent.trim() || null;
  let contest;
  let max;
  let maxRate;
  let maxRank;
  if (!rating) {
    contest = null;
    max = null;
    maxRate = null;
  } else {
    contest = rating.split("  ")[12];
    maxRank = rating.split("  ")[13].split(" ")[1].replace(",", "");
    maxRate = rating.split("  ")[14];
  }

  const activity = document.getElementsByClassName("_UserActivityFrame_counterValue");

  const question = {};
  const streak = {};

  question.allTime = activity[0].textContent.split(" ")[0];
  question.lastYear = activity[1].textContent.split(" ")[0];
  question.lastMonth = activity[2].textContent.split(" ")[0];

  streak.max = activity[3].textContent.split(" ")[0];
  streak.lastYear = activity[4].textContent.split(" ")[0];
  streak.lastMonth = activity[5].textContent.split(" ")[0];

  let sc = document.querySelectorAll('script[data-nocturne="true"]');

  const calander = JSON.parse(sc[2].textContent
    .split("calendar_yearview_blocks({")[1]
    .split("start_monday")[0]
    .trim()
    .replace("data: ","")
    .slice(0, -1)
    .replace(/(\w+):/g, '"$1":'))

  const details = {
    username,
    rank,
    rating: {
      contest,
      maxRank,
      maxRate,
    },
    question,
    streak,
    calander,
  };

  return details;
};


const questionsCount = async (username) => {
  const response = await fetch(`https://codeforces.com/profile/${username}`);
  const html = await response.text();

  const dom = new JSDOM(html);
  const document = dom.window.document;

  const activity = document.getElementsByClassName("_UserActivityFrame_counterValue");

  const question = {};

  question.allTime = activity[0].textContent.split(" ")[0];
  question.lastYear = activity[1].textContent.split(" ")[0];
  question.lastMonth = activity[2].textContent.split(" ")[0];

  console.log(question);
  
  return question

};


module.exports = {
    profile,
    questionsCount
}