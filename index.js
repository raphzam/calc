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
    case "/calculator-api/multiply":
      func = Calculator.multiply;
      break;
    case "/calculator-api/divide":
      func = Calculator.divide;
      break;

    default:
      return {
        statusCode: 502,
        body: "This path is unsupported by the API.",
      };
  }

  var params = null;
  switch (event.httpMethod) {
    case "GET":
      params = validateParams(event.queryStringParameters);
      break;

    case "POST":
      params = validateParams(JSON.parse(event.body));
      break;

    default:
      //no-op
      responseMessage = "HTTP METHOD IS NOT SUPPORTED";
      break;
  }

  if (params != null) {
    if (params.error) {
      responseMessage = params.error;
    } else {
      responseMessage = {
        value: func(params.x, params.y),
      };
    }
  }

  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify(responseMessage),
  };
  return response;
};
