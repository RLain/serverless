const AWS = require("aws-sdk");

/**
 * Fetches all records in the DynamoDB table
 * @param {*} evet The GET request
 * @returns An array of all the records in the DB
 */
module.exports.getRecords = async (event) => {
const scanParams = {
    TableName: process.env.becca_test,
}
const dynamoDB = new AWS.DynamoDB.DocumentClient()
const result = await dynamoDB.scan(scanParams).promise()

if (result.Count === 0){
    return {
        statusCode: 404
    }
}

return {
    statusCode: 200,
    body: JSON.stringify({
        items: await result.Items.map(policy => {
            return {
            client_id: policy.client_id,
            dog_id: policy.dog_id,
            account_balance: policy.account_balance
            }
        })
     })
    }
}
