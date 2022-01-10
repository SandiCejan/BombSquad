
function startGame() {
    var time = 3;
    var now = 0;
    x = setInterval(function () {
        var distance = time - now;
        now++;

        var minutes = Math.floor(distance / 60);
        var seconds = Math.floor(distance % 60);

        document.getElementById("Time").innerHTML = minutes + "m " + seconds + "s ";

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("Time").innerHTML = "EXPIRED";
            Swal.fire({
                title: "THE BOMB WENT KABOOM",
                text: "Mission failed, you are dead. Try running faster!",
                confirmButtonText: "Try again",
            }).then((result) => {
                startGame();
            })
        }
    }, 1000);
}
const href = $(this).attr('href')
Swal.fire({
    title: "WELCOME TO THE BOMB SQUAD",
    text: "The mission is simple. Get the code, disable the bomb and get there before the time runs out. Think fast and be fast. Are you ready?",
    confirmButtonText: "Yeah!",
}).then((result) => {
    startGame();
})
var x;
function endGame() {
    clearInterval(x);
}