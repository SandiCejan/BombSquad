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

    this.mazeTimer = document.createElement("div");
    this.mazeTimer.id = "maze_timer";

    this.mazeLevel = document.createElement("div");
    this.mazeLevel.id = "maze_level";
    this.mazeLevel.innerHTML = "Level: 1";
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
    mazeOutputDiv.id = "maze_output1";
    mazeOutputDiv.className = "Bottom";
    var mazeOutputDiv2 = document.createElement("div");
    mazeOutputDiv2.id = "maze_output2";
    mazeOutputDiv2.className = "Bottom";

    mazeOutputDiv.appendChild(this.mazeTimer);
    mazeOutputDiv.appendChild(this.mazeMessage);

    mazeOutputDiv2.appendChild(this.mazeScore);
    mazeOutputDiv2.appendChild(this.mazeLevel);
    this.mazeContainer.insertAdjacentElement("afterend", mazeOutputDiv2);
    this.mazeContainer.insertAdjacentElement("afterend", mazeOutputDiv);

    this.setMessage("Find the water bucket");

    // activate control keys
    this.keyPressHandler = this.mazeKeyPressHandler.bind(this);
    document.addEventListener("keydown", this.keyPressHandler, false);
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
    FireExteng();
    regenerate();
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
    if (nextStep == "exit") {
        if (this.heroHasKey) {
            this.heroWins();
            return;
        } else {
            this.setMessage("you need a water bucket to deactivate the bomb");
            return;
        }
    }

    // move hero one step
    this.maze[this.heroPos].classList.remove("hero");
    this.maze[this.heroPos].classList.remove("heroWater");
    this.maze[pos].classList.add(this.heroHasKey ? "heroWater" : "hero");
    this.heroPos = pos;

    // after moving
    if (nextStep.match(/nubbin/)) {
        this.heroTakeTreasure();
        return;
    }
    if (nextStep.match(/key/)) {
        this.heroTakeKey();
        this.maze[this.heroPos].classList.remove("hero");
        this.maze[pos].classList.add("heroWater");
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