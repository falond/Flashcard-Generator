///create a constructor with the name ClozeCard

// The constructor should accept two arguments: text and cloze.

// The constructed object should have a cloze property that contains only the cloze-deleted portion of the text.

// The constructed object should have a partial property that contains only the partial text.

// The constructed object should have a fullText property that contains only the full text.

// The constructor should throw or log an error when the cloze deletion does not appear in the input text.

// Use prototypes to attach these methods, wherever possible.


// Constructor function for the Cloze Card
function ClozeCard(text, cloze) {
    this.text = text.split(cloze);
    this.cloze = cloze;

};

function ClozeCardPrototype() {

    this.clozeRemoved = function () {
        return `${this.text[0]} ... ${this.text[1]}`;
    };											
};

ClozeCard.prototype = new ClozeCardPrototype();

module.exports = ClozeCard; 


























module.export = ClozeCard;
