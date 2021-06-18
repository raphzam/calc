const Calculator = require("./src/lambda/calculator.js");

const validateParams = (params) => {
  var ret = params;
  if (ret.x == undefined || ret.y == undefined) {
    return {
      error: "Unexpected params. Expected parameters x and y to be integers.",
    };
  }
  ret.x = parseInt(ret.x);
  ret.y = parseInt(ret.y);
  return ret;
};

exports.handler = async (event) => {
  console.log(event);

  var responseMessage = "";
  var func = null;

  switch (event.path) {
    case "/calculator-api/add":
      func = Calculator.add;
      break;
    case "/calculator-api/subtract":
      func = Calculator.subtract;
      break;
    default:
      return {
        statusCode: 502,
        body: "This path is unsupported by the API.",
      };
      break;
  }

  switch (event.httpMethod) {
    case "GET":
      //write some logic
      //responseMessage = "HTTP METHOD IS GET";
      const params = validateParams(event.queryStringParameters);

      if (params.error) {
        responseMessage = params.error;
      } else {
        responseMessage = `${params.x} + ${params.y} = ${func(
          params.x,
          params.y
        )}`;
      }

      break;
    case "POST":
      responseMessage = "HTTP METHOD IS POST";
      break;
    default:
      //no-op
      responseMessage = "HTTP METHOD IS NOT SUPPORTED";
      break;
  }

  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify(responseMessage),
  };
  return response;
};
