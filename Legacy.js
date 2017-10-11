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
var sorry = ("\nSorry Please Try Again :(\n");
var exit = ("\nThank you for playing, come back soon!\n");


function openMenu() {
  inquirer.prompt([															//use inquirer to ask question
      {
          type: "list",														//type list gives user a list of options
          message: "\nPlease choose a playing option from below",	//message shown to the user
          choices: ["Create new", "Play Now", "Exit"],	//options that show in list
          name: "playOptions"												//refrence name of object
      }
  ]).then(function (answer) {												//Once inquirer gets answer then...


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
            console.log(sorry);
    }

  });

}

openMenu();


function createCard() {
    inquirer.prompt([
        {
            type: "list",
            message: "What type of flashcard do you want to create?",
            choices: ["Basic Card", "Cloze Card"],
            name: "cardType"
        }

    ]).then(function (inputData) {

        var cardType = inputData.cardType;  			//the variable cardType will store the choice from the cardType inquirer object.
        // console.log(cardType);			  			//prints the card type chosen to the user

        if (cardType === "Basic Card") {
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

            	flashQuestions.push(cardd);				//push the new card into the array of cards
                fs.writeFile("AllQuestions.json", JSON.stringify(flashQuestions, null, 2)); //write the updated array to the carLibrary.json file


                 inquirer.prompt([					//use inquirer to ask if the user wants to keep making cards
                    {
                        type: "list",
                        message: "Do you want to create another card?",
                        choices: ["Yes", "No"],
                        name: "anotherCard"
                    }

                ]).then(function (inputData) {				//once the user gives answer....
                    if (inputData.anotherCard === "Yes") {	//If 'Yes' then..
                        createCard();						//call the create card function again (recursion)
                    } else {								//Else (if the answer isnt Yes then its No)...
                        openMenu();			//reopen the main menu to the user
                    }
                });
            });

        } else {						//Else (if the anser isn't Basic it had to be Cloze)
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please type out the full text of your statement (remove cloze in next step).",
                    name: "text"
                },

                {
                    type: "input",
                    message: "Please type the portion of text you want to cloze, replacing it with '...'.",
                    name: "cloze"
                }

                ]).then(function (cardInfo) {            //once we have the users cloze data run this function

                var cardd = {						//builds and object from the text and cloze info
                    type: "ClozeCard",
                    text: cardInfo.text,
                    cloze: cardInfo.cloze
                };
                if (cardd.text.indexOf(cardd.cloze) !== -1) {   //checking to make sure the Cloze matches some text in the statement
                    flashQuestions.push(cardd);							//push the new card into the array of cards
                    fs.writeFile("AllQuestions.json", JSON.stringify(flashQuestions, null, 2)); //write the updated array to the cardLibrary file
                } else {											//if the cloze doesnt match then give a message to the user.
                    console.log("Sorry, The cloze must match some word(s) in the text of your statement.");

                }
                inquirer.prompt([					//use inquirer to ask if the user wants to keep making cards
                    {
                        type: "list",
                        message: "Do you want to create another card?",
                        choices: ["Yes", "No"],
                        name: "anotherCard"
                    }

                ]).then(function (inputData) {				//once the user gives answer....
                    if (inputData.anotherCard === "Yes") {	//If 'Yes' then..
                        createCard();						//call the create card function again (recursion)
                    } else {								//Else (if the answer isnt Yes then its No)...
                        openMenu();		//return the user to the open menu
                    }
                });
            });
        }

    });
};


 //function used to get the question from the drawnCard in the askQuestions function
function getQuestion(card) {
    if (card.type === "BasicCard") {						//If the cards type is "BasicCard" then....
        drawnCard = new BasicCard(card.front, card.back);	//drawnCard becomes a new instance of BasicCard constuctor with its front and back passed in
        return drawnCard.front;								//Return the front of the card (the questions side)
    } else if (card.type === "ClozeCard") {					//If the card type is "Cloze Card" then...
        drawnCard = new ClozeCard(card.text, card.cloze)	//drawnCard becomes a new instance of ClozeCard constuctor with its text and cloze passed in
        return drawnCard.clozeRemoved();					//Return the ClozeCard prototpe method clozeRemoved to show the question missing the cloze
    }
};


//function to ask questions from all stored card in the library
function askQuestions() {
    if (count < flashQuestions.length) {					//if current count (starts at 0) is less than the number of cards in the library....
        playedCard = getQuestion(flashQuestions[count]);	//playedCard stores the question from the card with index equal to the current counter.
        inquirer.prompt([							//inquirer used to ask the question from the playedCard.
            {
                type: "input",
                message: playedCard,
                name: "question"
            }

        ]).then(function (answer) {					//once the user answers
        	//if the users answer equals .back or .cloze of the playedCard run a message "You are correct."
            if (answer.question === flashQuestions[count].back || answer.question === flashQuestions[count].cloze) {
                console.log("You are correct.");
            } else {
            	//check to see if current card is Cloze or Basic
                if (drawnCard.front !== undefined) { //if card has a front then it is a Basic card
                    console.log("Sorry thats Wrong, the correct answer is " + flashQuestions[count].back + "."); //grabs & shows correct answer
                } else { // otherwise it is a Cloze card
                    console.log("Sorry thats wrong, the correct answer is " + flashQuestions[count].cloze + ".");//grabs & shows correct answer
                }
            }
            count++; 		//increase the counter for the next run through
            askQuestions(); //recursion. call the function within the function to keep it running. It will stop when counter=library.length
        });
    } else {
      	count=0;			//reset counter to 0 once loop ends
      	openMenu();			//call the menu for the user to continue using the app
    }
};









