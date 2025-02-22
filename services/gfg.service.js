const submissions = async (username) => {
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


module.exports = {
    submissions
}