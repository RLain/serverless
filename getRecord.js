const AWS = require("aws-sdk");
const Joi = require('joi');

/**
 * Validates the request data
 * @param {*} data The request payload data
 * @returns Joi Validation Object
 */
 const validateRequest = (data) => {
  const validation = Joi
    .object()
    .keys({
      client_id: Joi.string().guid().required(),
      dog_id: Joi.string().guid().required(),
      account_balance: Joi.number().required()
    })
    .validate(data);
  return validation;
};

/**
 * Function to return a string if the request object is JSON
 * This is used if the request is not a base64 encoded string such as when cURL testing
 * @param {*} data The request payload data
 * @returns The JSON object
 */
const isJson = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

/**
 * Creates a record in the DynamoDB table
 * @param {*} event The request payload data
 * @returns Upserts a record into the database.
 */
module.exports.createRecord = async (event) => {
  const body = isJson(event.body) ? JSON.parse(event.body) : JSON.parse(Buffer(event.body, 'base64').toString('ascii'));
  const validation = validateRequest(body);
  const dynamoDB = new AWS.DynamoDB.DocumentClient()
  const putParams = {
    TableName: process.env.becca_test,
    Item: {
      client_id: body.client_id,
      dog_id: body.dog_id,
      account_balance: body.account_balance
    }
  }
  await dynamoDB.put(putParams).promise()

  if (validation.hasOwnProperty("error")) {
    let errorMessage = validation.error.details[0].message;
    console.log('error path:', errorMessage)
    return {
      body: JSON.stringify({
        type: "validation_error",
        message: errorMessage,
      }),
    };
  }

  return {
    statusCode: 201
  }
}
