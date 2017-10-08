var inquirer = require("inquirer");
var FlashQuestions = require("./AllQuestions.json");
var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js");
const fs = require("fs");

var drawnCard;
var playedCard;
var count = 0;


function openMenu() {
  inquirer.prompt([															//use inquirer to ask question
      {
          type: "list",														//type list gives user a list of options
          message: "\nPlease choose a playing option from below?",	//message shown to the user
          choices: ["Create new", "Play Now", "Exit"],	//options that show in list
          name: "playOptions"												//refrence name of object
      }
  ]).then(function (answer) {												//Once inquirer gets answer then...
    var waitMsg;


        switch (answer.playOptions) {

        case 'Create New':
            console.log("Ok lets make a new flashcard...");
            waitMsg = setTimeout(createCard, 1000);
            break;

        case 'Play Now':
            console.log("OK I'll print all cards in the deck to your screen...");
            waitMsg = setTimeout(showCards, 1000);
            break;

        case 'Exit':
            console.log("Thank you for using the Flashcard-Generator, come back soon!")
            return;
            break;

        default:
            console.log("");
            console.log("Sorry I don't understand");
            console.log("");
    }

  });

}

openMenu();