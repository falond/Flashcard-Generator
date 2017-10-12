var inquirer = require("inquirer");
var flashQuestions = require("./AllQuestions.json");
var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js");
const fs = require("fs");

var drawnCard;
var playedCard;
var count = 0;

var playnow = ("\nOK Lets start!\n");
var createNew = ("\nOk lets make a new flashcard...\n");
// var sorry = ("\nSorry Please Try Again :(\n");
var exit = ("\nThank you for playing, come back soon!\n");

// *************************************************************MENU******************************************************************************
function openMenu() {
    //Option for user to select how they want to play
  inquirer.prompt([															
      {
          type: "list",														
          message: "\nPlease choose a playing option from below",	
          choices: ["Create new", "Play Now", "Exit"],	
          name: "playOptions"												
      }
  ]).then(function (answer) {												
       //Switch for each choice option slected 
        switch (answer.playOptions) {

        case 'Create New':
            console.log(createNew);
            createCard();
            break;

        case 'Play Now':
            console.log(playnow);
            askQuestions();
            break;

        case 'Exit':
            console.log(exit);
            return;
            break;

        default:
            // console.log(sorry);
            createCard();
    }

  });

}

openMenu();


// *************************************************************CREATE CARD******************************************************************************
// This function creates New cards with the option of Basic Card or Cloze Card
function createCard() {
    inquirer.prompt([
        {
            type: "list",
            message: "What type of flashcard do you want to create?",
            choices: ["Basic Card", "Cloze Card"],
            name: "cardType"
        }
// *************************************************BASIC CARD********************************************************************************************
    ]).then(function (inputData) {
        // This holds the user selection 
        var cardType = inputData.cardType;
        if (cardType === "Basic Card") {
            // Ask user to fill in the front and back of the card
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please fill out the front of your card (Your Question).",
                    name: "front"
                },

                {
                    type: "input",
                    message: "Please fill out the back of your card (Your Answer).",
                    name: "back"
                }

            ]).then(function (cardInfo) {

            	var cardd = {
            		type: "BasicCard",
            		front: cardInfo.front,
            		back: cardInfo.back
            	};
                // Move the new card into an array
            	flashQuestions.push(cardd);
                //send array to .json file
                fs.writeFileSync("AllQuestions.json", JSON.stringify(flashQuestions, null, 2));
                // Ask if user wants to make another card
                 inquirer.prompt([
                    {
                        type: "list",
                        message: "Do you want to create another card?",
                        choices: ["Yes", "No"],
                        name: "anotherCard"
                    }
                // If yes then call createcard function, else reopen the menu to user
                ]).then(function (inputData) {				
                    if (inputData.anotherCard === "Yes") {
                        return createCard();
                    } else {								
                        openMenu();		
                    }
                });
            });
 // *************************************************************CLOZE CARD******************************************************************************
        //Else if the answer is Cloze
        } else {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please type out the full text of your statement.",
                    name: "text"
                },

                {
                    type: "input",
                    message: "Please type the portion of text you want to cloze, replacing it with '....'",
                    name: "cloze"
                }

                ]).then(function (cardInfo) {            

                var cardd = {
                    type: "ClozeCard",
                    text: cardInfo.text,
                    cloze: cardInfo.cloze
                };
                // check for matches in the text
                if (cardd.text.indexOf(cardd.cloze) !== -1) {
                    // Move new card into the array
                    flashQuestions.push(cardd);
                    // send arry to .json file
                    fs.writeFileSync("AllQuestions.json", JSON.stringify(flashQuestions, null, 2)); 
                } else {
                    // if it doesnt match diplay this message
                    console.log("Sorry, The cloze must match some word's within the text of your statement.");

                }
                // Ask if user wants to make another card
                inquirer.prompt([				
                    {
                        type: "list",
                        message: "Do you want to create another card?",
                        choices: ["Yes", "No"],
                        name: "anotherCard"
                    }
                // If yes then call createcard function, else reopen the menu to user
                ]).then(function (inputData) {				
                    if (inputData.anotherCard === "Yes") {	
                        createCard();						
                    } else {
                        openMenu();
                    }
                });
            });
        }

    });
};

// *************************************************************GET QUESTIONS******************************************************************************
 //Used to get the question for var drawnCard for BasicCard
function getQuestion(card) {
    if (card.type === "BasicCard") {						
        drawnCard = new BasicCard(card.front, card.back);	
        return drawnCard.front;
    } else if (card.type === "ClozeCard") {
        drawnCard = new ClozeCard(card.text, card.cloze)
        return drawnCard.clozeRemoved();					
    }
};

// *************************************************************ASK QUESTIONS******************************************************************************
//function to ask questions from all stored card in the library
function askQuestions() {
    // Less than 0 less than the number of cards in flashQuestions
    if (count < flashQuestions.length) {
        // Stores the questions with the index equal to the curent number
        playedCard = getQuestion(flashQuestions[count]);
        //Ask Questions from playedCards
        inquirer.prompt([
            {
                type: "input",
                message: playedCard,
                name: "question"
            }

        ]).then(function (answer) {
        	//if the users answer equals back or cloze of the playedCard run a message
            if (answer.question === flashQuestions[count].back || answer.question === flashQuestions[count].cloze) {
                console.log("You are correct.");
            } else {
            	//check to see if current card is Cloze or Basic
                if (drawnCard.front !== undefined) { //if card has a front then it is a Basic card
                    console.log("Sorry thats Wrong, the correct answer is " + flashQuestions[count].back + ".");
                } else { // otherwise it is a Cloze card
                    console.log("Sorry thats wrong, the correct answer is " + flashQuestions[count].cloze + ".");
                }
            }
            //increase the counter
            count++;
            //recursion
            askQuestions();
        });
    } else {
        //reset counter
      	count=0;
      	openMenu();
    }
};
// ***********************************************************END*******************************************************************************************







