import voicelabsSdk from "voicelabs";
import { render } from "mustache";
import get from "lodash.get";

import { LAUNCH, HELP, COLOR, FAVORITECOLOR, FOOD, FAVORITEFOOD, GREETING, GOODBYE, UNIDENTIFIED } from "../../data/speech";

// Track events using Voicelabs: http://voicelabs.co/
// Create a token if you want to track events (optional)
const VoiceLabs = voicelabsSdk(process.env.VOICELABS_APP_TOKEN);

export const handler = {
    LaunchRequest() {        
        this.emit("FavoritesLaunchIntent");
    },

    async FavoritesLaunchIntent(){
        let speech;
        await VoiceLabs.track(this.event.session, "FavoritesLaunchIntent", null, speech);
        if(this.attributes.invokeCount){
            this.attributes.invokeCount++;
            speech = LAUNCH.speech;
        }
        else
        {
            this.attributes.invokeCount = 1;
            speech =  "Welcome to Favorites. "+ HELP.speech;

        }
        //const reprompt = "Are you still there? You can always ask for help. "
        this.emit(":ask", speech, LAUNCH.reprompt );
    },


    async SetMyFavoritesIntent(){
       const speech = COLOR.speech;
       this.emit(":ask", speech, COLOR.reprompt);
    },

    async SetMyFavoritesColor(){
        const color = get(this.event, "request.intent.slots.color.value");
        this.attributes.color = color;
        const speech = FOOD.speech;
        this.emit(":ask", speech, FOOD.reprompt);
    },

    async SetMyFavoritesFood(){
        const food = get(this.event, "request.intent.slots.food.value");
        this.attributes.food = food;
        const speech = "You are all set, do you want me to do anything else?";
        const reprompt = "Are you still there? You can always ask for help. "
        this.emit(":ask", speech, reprompt);
    },

    async GetMyFavoritesIntent(){
        let speech =  FAVORITECOLOR.speech.replace('%%COLOR%%', this.attributes.color);
        speech +=  "and " + FAVORITEFOOD.speech.replace('%%FOOD%%', this.attributes.food);
        const reprompt = "Are you there? what else I can do for you? You can say stop or cancel to exit. "
        this.emit(":ask", speech, reprompt);
    },

    async GetMyFavoritesColor(){
        const speech =  FAVORITECOLOR.speech.replace('%%COLOR%%', this.attributes.color);
        const reprompt = "Are you there? what else I can do for you? You can say stop or cancel to exit. "
        this.emit(":ask", speech, reprompt);
    },

    async GetMyFavoritesFood(){
        const speech =  FAVORITEFOOD.speech.replace('%%FOOD%%', this.attributes.food);
        const reprompt = "Are you there? what else I can do for you? You can say stop or cancel to exit. "
        this.emit(":ask", speech, reprompt);
    },

    SessionEndedRequest(){
        const speech = GOODBYE.speech;        
        this.emit(":tell", speech);
    },

    "AMAZON.CancelIntent" () {
        const speech = GOODBYE.speech;        
        this.emit(":tell", speech);
    },

    "AMAZON.StopIntent" () {
        const speech = GOODBYE.speech;        
        this.emit(":tell", speech);
    },

    "Unhandled" (){
        console.log("Unhandled");
        const speech = UNIDENTIFIED.speech;        
        this.emit(":ask", speech, UNIDENTIFIED.reprompt);
    },

    "AMAZON.HelpIntent" () {
      const speech = HELP.speech;
      const reprompt = "Are you still there? what can I do for you?"
      this.emit(':ask', speech, reprompt);
    },

};
