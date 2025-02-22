const leetcode = async (username) => {
    try {
        const data = await fetch("https://leetcode.com/graphql/", {
            "headers": { "content-type": "application/json" },
            "body": `{\"query\":\"\\n    query userProfileUserQuestionProgressV2($userSlug: String!) {\\n  userProfileUserQuestionProgressV2(userSlug: $userSlug) {\\n    numAcceptedQuestions {\\n      count\\n      difficulty\\n    }\\n    numFailedQuestions {\\n      count\\n      difficulty\\n    }\\n    numUntouchedQuestions {\\n      count\\n      difficulty\\n    }\\n    userSessionBeatsPercentage {\\n      difficulty\\n      percentage\\n    }\\n    totalQuestionBeatsPercentage\\n  }\\n}\\n    \",\"variables\":{\"userSlug\":\"${username}\"},\"operationName\":\"userProfileUserQuestionProgressV2\"}`,
            "method": "POST"
          });
    
        return (await data.json()).data.userProfileUserQuestionProgressV2
    } catch (error) {
        console.error(`Error in fetching Leetcode data: ${error.stack || error.message}`)
        return false
    }    
}


const gfg = async (username) => {
    try {
        const data = await fetch("https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/", {
            "headers": { "content-type": "application/json"},
            "body": `{\"handle\":\"${username}\",\"requestType\":\"\",\"year\":\"\",\"month\":\"\"}`,
            "method": "POST"
        });
        const userData = await data.json();
        return {
            count: userData.count,
            result: userData.result
        }
    } catch (error) {
        console.error(`Error in fetching GFG Data: ${error.stack || error.message}`)
        return false
    }
}


const code360 = async (username) => {
    try {
        const data = await fetch(`https://www.naukri.com/code360/api/v3/public_section/profile/user_details?uuid=${username}`, {
            "headers": { "accept": "application/json, text/plain, */*" },
            "body": null,
            "method": "GET"
        });        
        return (await data.json()).data     
    } catch (error) {
        console.error(`Error in fetching Naukri Code360 data: ${error.stack || error.message}`)
    }
}

code360("devesh75")

module.exports = {
    leetcode,
    gfg,
    code360
}