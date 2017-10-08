//// create consructor named BasicCard
///Create two arguments 1- front and 2- back, the constructor whould except 2 arguments 

//Object should have a front property that contains the text on the front of the card
//object should have a back property that contains the text on the back of the card 
function BasicCard(front, back) {
    this.front = front;
    this.back = back;

};

module.exports = BasicCard;