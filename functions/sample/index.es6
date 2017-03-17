import Alexa from "alexa-sdk";

import { handler as greetHandler } from "./src/handlers/greet.es6";
import { handler as questionsHandler } from "./src/handlers/questions.es6";

export default (event, context) => {
    const alexa = Alexa.handler(event, context);
    console.log("Skill was triggered");
    alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(greetHandler, questionsHandler);
    //alexa.dynamoDBTableName =  process.env.TABLE_NAME;
    alexa.dynamoDBTableName = "Pradnya_favoritesSkillUsers";

    alexa.execute();
};

// Using async functions in event emitters will swallow rejected promise errors,
// so propagate them here
process.on("unhandledRejection", e => {
    console.log(e.stack);
});
