var MusicSound;
var TimeSound = new sound("audio/TimerOK.mp3", false);
var TimeWarningSound = new sound("audio/TimerWarning.mp3", false);
var TimeLastSound = new sound("audio/TimerLast.mp3", false);
var ExplosionSound = new sound("audio/Explosion.mp3", false);
var ClapsSound = new sound("audio/Claps.mp3", false);
var FireExtinguished = new sound("audio/FireExtinguished.mp3", false);
var StringOnFire = new sound("audio/StringOnFire.mp3", true);
var x;
let Maze = new MazeBuilder(16, 12);
Maze.placeKey();
Maze.display("maze_container");
var maze;
window.addEventListener("DOMContentLoaded", function(e) {
    maze = new Mazing("maze");
    /*  maze.setChildMode(); */
    document.getElementById("maze_timer").innerHTML = "Detonation in:2m 0s ";

}, false);
var muted = false;
ShowHello();

function muteMe(elem, mute) {
    elem.muted = mute;
}

function mute() {
    if (muted) {
        muted = false
        document.getElementsByTagName("audio").muted = false;
        var elems = document.querySelectorAll("audio");
        [].forEach.call(elems, function(elem) {
            muteMe(elem, false);
        });
        document.getElementById("soundB").style.backgroundImage = "url('img/soundOK.png')";
    } else {
        muted = true
        document.getElementsByTagName("audio").muted = true;
        var elems = document.querySelectorAll("audio");
        [].forEach.call(elems, function(elem) {
            muteMe(elem, true);
        });
        document.getElementById("soundB").style.backgroundImage = "url('img/soundNO.png')";
    }
}
var now = 0;
var Level = 1;
var time = 119;
var anim;

function startGame() {
    document.getElementById("maze_timer").innerHTML = "Detonation in:2m 0s ";
    StringOnFire.play();
    ClapsSound = new sound("audio/Claps.mp3", false);
    MusicSound = new sound("audio/Music.mp3", true);
    MusicSound.play();
    x = setInterval(function() {
        var distance = time - now;
        now++;
        var minutes = Math.floor(distance / 60);
        var seconds = Math.floor(distance % 60);

        document.getElementById("maze_timer").innerHTML = "Detonation in:" + minutes + "m " + seconds + "s ";
        if (distance < 11) {
            if (distance < 3) {
                if (distance == -1) {
                    endGame();
                    document.getElementById("maze_timer").innerHTML = "EXPIRED";
                    ExplosionSound.play();
                    StringOnFire.stop();
                    Swal.fire({
                        title: "THE BOMB WENT KABOOM",
                        text: (Level == 1 ? "You didn't even try. Why are you still here?" : "You were able to deactivate " + (Level - 1 > 1 ? Level + " bombs" : "1 bomb") + ". " + (Level > 5 ? (Level > 13 ? "Just go to army, you are a natural talent!" : "Greate job out there, I am surprised!") : "Good job, but try to do it better!")),
                        confirmButtonText: "Try again",
                        confirmButtonColor: 'green',
                    }).then((result) => {
                        now = 20;
                        Level = 0;
                        regenerate();
                        startGame();
                    })
                    $(".swal2-modal").css('background', 'url("img/grass1.jpg")');
                    $(".swal2-html-container").css('font-family', 'cursive');
                    $(".swal2-confirm").css('background', 'url("img/wall.png")');
                    $(".swal2-confirm").css('color', 'white');
                    $(".swal2-confirm").css('border', 'white 1px solid');
                    $(".swal2-confirm").css('font-weight', '600');
                } else {
                    TimeLastSound.play();
                }
            } else {
                TimeWarningSound.play();
            }
        } else {
            TimeSound.play();
        }

    }, 1000);
}

function ShowHello() {
    const href = $(this).attr('href')
    Swal.fire({
        title: "<h5 style='color:white'>WELCOME TO THE BOMB SQUAD</h5>",
        text: "The mission is simple. Get to the water bucket, pick it up, run to the bomb and disable it. Think fast and be fast. Are you ready?",
        confirmButtonText: "Yeah!",
        confirmButtonColor: 'black',
    }).then((result) => {
        startGame();
    })
}

function endGame() {
    clearInterval(x);
    maze.heroScore = 0;
    MusicSound.stop();
    clearInterval(anim);
}

function FireExteng() {
    FireExtinguished.play();
}

function regenerate() {
    clearInterval(anim);
    document.getElementById('maze').remove();
    Maze = new MazeBuilder(16, 12);
    Maze.placeKey();
    Maze.display("maze_container");
    maze.mazeContainer = document.getElementById('maze');
    maze.maze = [];
    maze.heroPos = {};
    maze.heroHasKey = false;
    maze.childMode = false;
    for (i = 0; i < maze.mazeContainer.children.length; i++) {
        for (j = 0; j < maze.mazeContainer.children[i].children.length; j++) {
            var el = maze.mazeContainer.children[i].children[j];
            maze.maze[new Position(i, j)] = el;
            if (el.classList.contains("entrance")) {
                // place hero at entrance
                maze.heroPos = new Position(i, j);
                maze.maze[maze.heroPos].classList.add("hero");
            }
        }
    }
    Level++;
    document.getElementById("maze_level").innerHTML = "Level: " + Level;
    now = now - 20;
    maze.setMessage("Find the water bucket");
    maze.mazeScore.innerHTML = maze.heroScore;
    ClapsSound.stop();

    c = document.getElementById("exit");
    context = c.getContext('2d');
    anim = setInterval(animate, 100);
}
$(".swal2-modal").css('background', 'url("img/grass1.jpg")');
$(".swal2-html-container").css('font-family', 'cursive');
$(".swal2-confirm").css('background', 'url("img/wall.png")');
$(".swal2-confirm").css('color', 'white');
$(".swal2-confirm").css('border', 'white 1px solid');
$(".swal2-confirm").css('font-weight', '600');

function sound(src, loop) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.setAttribute("allow", "autoplay");
    if (loop)
        this.sound.setAttribute("loop", "loop");
    document.body.appendChild(this.sound);
    this.play = function() {
        this.sound.play();
    }
    this.stop = function() {
        this.sound.pause();
    }
}
var shift = 0;
var frameWidth = 111;
var frameHeight = 200;
var totalFrames = 4;
var currentFrame = 0;
var c;
var context;
var bombAnime = new Image();
bombAnime.src = 'img/bombInAction.png';
c = document.getElementById("exit");
context = c.getContext('2d');
anim = setInterval(animate, 100);

function animate() {

    context.clearRect(0, 0, 111, 200);
    context.drawImage(bombAnime, shift, 0, frameWidth, frameHeight,
        (frameWidth / 4), 0, (frameWidth / 2), frameHeight);

    shift += frameWidth;
    if (currentFrame == totalFrames) {
        currentFrame = 0;
        shift = 0;
    }

    currentFrame++;

}