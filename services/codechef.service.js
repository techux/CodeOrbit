const { JSDOM } = require('jsdom')

const profile = async (username) => {
    const response = await fetch(`https://www.codechef.com/users/${username}`, {
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET"
    });

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const name = document.getElementsByClassName('h2-style')[0]?.textContent.trim() || null

    if (!name) {
        return false
    }
    
    const star = document.getElementsByClassName('rating')[0]?.textContent || 0
    const rating = document.getElementsByClassName('rating-number')[0]?.textContent.replace("★","") || 0
    const highestRating = document.getElementsByClassName('rating-header')[0]?.getElementsByTagName('small')[0].textContent.split(' ')[2].replace(')','') || 0
    const globalRank = document.getElementsByClassName('inline-list')[0]?.querySelectorAll('a')[0].text || 0
    const countryRank = document.getElementsByClassName('inline-list')[0]?.querySelectorAll('a')[1].text || 0
    const contestParticipated = document.getElementsByClassName('contest-participated-count')[0]?.querySelectorAll('b')[0].textContent || 0
    const problemSolved = document.getElementsByClassName('problems-solved')[0].querySelectorAll('h3')[3].textContent.split(' ')[3] || 0
    const calander = JSON.parse(document.getElementsByTagName('body')[0].textContent.split('var userDailySubmissionsStats = ')[1].split(";")[0])

    let badges = []
    for (let x of document.getElementsByClassName('badge')){
        badges.push(x.getElementsByClassName('badge__title')[0].textContent)
    }

    return {
        name,
        star,
        rating,
        highestRating,
        globalRank,
        countryRank,
        contestParticipated,
        problemSolved,
        badges,
        calander
    }
}

module.exports = {
    profile
}