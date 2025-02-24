const profile = async (username) => {
    const data = await fetch(`https://www.hackerrank.com/rest/contests/master/hackers/${username}/profile`, {
        "headers": { "content-type": "application/json" },
        "body": null,
        "method": "GET"
    });        
    return await data.json().model
}


const badges = async (username) => {
    const data = await fetch(`https://www.hackerrank.com/rest/hackers/${username}/badges`, {
        "headers": { "content-type": "application/json" },
        "body": null,
        "method": "GET"
    });
    return await data.json().models
}


const skills = async (username) => {
    const data = await fetch(`https://www.hackerrank.com/rest/hackers/${username}/skills`, {
        "headers": { "content-type": "application/json" },
        "body": null,
        "method": "GET"
    });
    return await data.json()
}



module.exports = {
    profile,
    badges,
    skills
}