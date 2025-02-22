const questions = async (username) => {
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

module.exports = {
    questions
}