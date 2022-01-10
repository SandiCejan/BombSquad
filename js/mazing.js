function Position(x, y) {
    this.x = x;
    this.y = y;
}

Position.prototype.toString = function() {
    return this.x + ":" + this.y;
};

function Mazing(id) {

    // bind to HTML element
    this.mazeContainer = document.getElementById(id);

    this.mazeScore = document.createElement("div");
    this.mazeScore.id = "maze_score";

    this.mazeMessage = document.createElement("div");
    this.mazeMessage.id = "maze_message";

    this.heroScore = 0;

    this.maze = [];
    this.heroPos = {};
    this.heroHasKey = false;
    this.childMode = false;

    this.utter = null;

    for (i = 0; i < this.mazeContainer.children.length; i++) {
        for (j = 0; j < this.mazeContainer.children[i].children.length; j++) {
            var el = this.mazeContainer.children[i].children[j];
            this.maze[new Position(i, j)] = el;
            if (el.classList.contains("entrance")) {
                // place hero at entrance
                this.heroPos = new Position(i, j);
                this.maze[this.heroPos].classList.add("hero");
            }
        }
    }

    var mazeOutputDiv = document.createElement("div");
    mazeOutputDiv.id = "maze_output";

    mazeOutputDiv.appendChild(this.mazeScore);
    this.mazeContainer.insertAdjacentElement("afterend", mazeOutputDiv);
    const container2 = document.createElement("div");
    container2.id = "More";
    const Timep = document.createElement("p");
    Timep.id = "Time";
    Timep.innerHTML = "Detonation in:2m 0s ";
    mazeOutputDiv.appendChild(container2);
    container2.appendChild(Timep);
    mazeOutputDiv.appendChild(this.mazeMessage);

    this.setMessage("Find the code");



    // activate control keys
    this.keyPressHandler = this.mazeKeyPressHandler.bind(this);
    document.addEventListener("keydown", this.keyPressHandler, false);
};

Mazing.prototype.enableSpeech = function() {
    this.utter = new SpeechSynthesisUtterance()
    this.setMessage(this.mazeMessage.innerText);
};

Mazing.prototype.setMessage = function(text) {
    this.mazeMessage.innerHTML = text;
    this.mazeScore.innerHTML = this.heroScore;
    if (this.utter) {
        this.utter.text = text;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(this.utter);
    }
};

Mazing.prototype.heroTakeTreasure = function() {
    this.maze[this.heroPos].classList.remove("nubbin");
    this.setMessage("yay, treasure!");
};

Mazing.prototype.heroTakeKey = function() {
    this.maze[this.heroPos].classList.remove("key");
    this.heroHasKey = true;
    this.mazeScore.classList.add("has-key");
    this.setMessage("Get to the bomb");
};

Mazing.prototype.gameOver = function(text) {
    // de-activate control keys
    document.removeEventListener("keydown", this.keyPressHandler, false);
    this.setMessage(text);
    this.mazeContainer.classList.add("finished");
    document.getElementById("finish").style.display = "inline";
    endGame();
};

Mazing.prototype.heroWins = function() {
    this.mazeScore.classList.remove("has-key");
    this.maze[this.heroPos].classList.remove("door");
    ClapsSound.play();
    this.gameOver("you finished !!!");
};

Mazing.prototype.tryMoveHero = function(pos) {

    if ("object" !== typeof this.maze[pos]) {
        return;
    }

    var nextStep = this.maze[pos].className;

    // before moving

    if (nextStep.match(/wall/)) {
        return;
    }
    if (nextStep.match(/exit/)) {
        if (this.heroHasKey) {
            this.heroWins();
        } else {
            this.setMessage("you need a key to unlock the door");
            return;
        }
    }

    // move hero one step
    this.maze[this.heroPos].classList.remove("hero");
    this.maze[pos].classList.add("hero");
    this.heroPos = pos;

    // after moving
    if (nextStep.match(/nubbin/)) {
        this.heroTakeTreasure();
        return;
    }
    if (nextStep.match(/key/)) {
        this.heroTakeKey();
        return;
    }
    if (nextStep.match(/exit/)) {
        return;
    }
    this.heroScore++;
    this.mazeScore.innerHTML = this.heroScore;
};

Mazing.prototype.mazeKeyPressHandler = function(e) {
    var tryPos = new Position(this.heroPos.x, this.heroPos.y);
    switch (e.keyCode) {
        case 37: // left
            this.mazeContainer.classList.remove("face-right");
            tryPos.y--;
            break;

        case 38: // up
            tryPos.x--;
            break;

        case 39: // right
            this.mazeContainer.classList.add("face-right");
            tryPos.y++;
            break;

        case 40: // down
            tryPos.x++;
            break;

        default:
            return;

    }
    this.tryMoveHero(tryPos);
    e.preventDefault();
};

Mazing.prototype.setChildMode = function() {
    this.childMode = true;
    this.heroScore = 0;
    this.setMessage("collect all the treasure");
};