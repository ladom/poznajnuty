'use strict';

var player = {
    name: '',
    score: 0,
    totalScore: 0,
    time: ''
};

var countdown = void 0;

var timeToFinish = document.querySelector('.game__score--timer');
var scoreDisplay = document.querySelector('.game__score--number');
var levelDisplay = document.querySelector('.game__level--number');
var startBtn = document.querySelector('.game__window--start');
// Obrazy nut
var notes = Array.prototype.slice.call(document.querySelectorAll('.game__window img'));
var notesSecond = Array.prototype.slice.call(document.querySelectorAll('.game__window--secondLevel img'));
// Przyciski
var buttons = Array.prototype.slice.call(document.querySelectorAll('.game__buttons button'));
var sounds = Array.prototype.slice.call(document.querySelectorAll('.game__window audio'));
var soundsSecond = Array.prototype.slice.call(document.querySelectorAll('.game__window--secondLevel audio'));
// zmienna - ostatni losowany numer
var lastNoteIndex = void 0;
var lastButtonIndex = void 0;

function randomNote() {
    var index = Math.floor(Math.random() * notes.length);
    var pick = notes[index];

    if (pick === lastNoteIndex) {
        return randomNote();
    }
    lastNoteIndex = pick;
    return pick;
}

function randomNoteSecond() {
    var index = Math.floor(Math.random() * notesSecond.length);
    var pick = notesSecond[index];

    if (pick === lastNoteIndex) {
        return randomNoteSecond();
    }
    lastNoteIndex = pick;
    return pick;
}

function randomButton() {
    var index = Math.floor(Math.random() * buttons.length);
    var pick = buttons[index];

    if (pick === lastButtonIndex) {
        return randomButton();
    }
    lastButtonIndex = pick;
    return pick;
}

function pickCorrect() {
    var correctNote = randomNote();
    var correctButton = randomButton();

    function correctSound() {
        for (var i = 0; i < sounds.length; i++) {
            if (correctNote.dataset.name === sounds[i].dataset.name) {
                sounds[i].play();
            }
        }
    }

    notes.forEach(function (img) {
        return img.style.display = "none";
    });

    correctNote.style.display = 'block';
    correctButton.innerHTML = '' + correctNote.name;
    notes.splice(notes.indexOf(correctNote), 1);
    buttons.splice(buttons.indexOf(correctButton), 1);
    var secondButton = notes[Math.floor(Math.random() * notes.length)];
    var secondButtonText = secondButton.name;
    notes.splice(notes.indexOf(secondButton), 1);

    var thirdButtonText = notes[Math.floor(Math.random() * notes.length)].name;

    buttons[0].innerHTML = '' + secondButtonText;
    buttons[1].innerHTML = '' + thirdButtonText;
    correctSound();

    function checkAnswer(e) {
        if (e.toElement.innerText == correctButton.innerText) {
            document.querySelector('.game__score--wrong').textContent = "Brawo!";
            setTimeout(clear, 500);
            player.score++;
            scoreDisplay.innerHTML = player.score;
            notes = Array.prototype.slice.call(document.querySelectorAll('.game__window img'));
            buttons = Array.prototype.slice.call(document.querySelectorAll('.game__buttons button'));

            Array.prototype.slice.call(document.querySelectorAll('.game__buttons button')).forEach(function (button) {
                return button.removeEventListener('click', checkAnswer);
            });
            checkLevel();
        } else {
            document.querySelector('.game__score--wrong').textContent = "Spróbuj jeszcze raz";
        }
    }

    Array.prototype.slice.call(document.querySelectorAll('.game__buttons button')).forEach(function (button) {
        return button.addEventListener('click', checkAnswer);
    });
}
var clear = function bravoClear() {
    document.querySelector('.game__score--wrong').textContent = "";
};

function checkLevel() {
    if (player.score >= 10 && player.time > 0) {

        Array.prototype.slice.call(document.querySelectorAll('.game__buttons button')).forEach(function (button) {
            return button.textContent = "";
        });
        Array.prototype.slice.call(document.querySelectorAll('.game__window img')).forEach(function (img) {
            return img.style.display = "none";
        });
        clearInterval(countdown);
        startBtn.textContent = "Przejdź do poziomu 2";
        startBtn.style.display = "block";
        document.querySelector('.game__window--start').removeEventListener('click', newGame);
        document.querySelector('.game__window--start').addEventListener('click', secondLevelStart);
    } else if (player.score < 10 && player.time > 0) {
        console.log(player.time);
        pickCorrect();
    } else {
        setNewTime();
    }
}

function newGame() {
    document.querySelector('.game__window--start').style.display = "none";
    notes = Array.prototype.slice.call(document.querySelectorAll('.game__window img'));
    buttons = Array.prototype.slice.call(document.querySelectorAll('.game__buttons button'));
    player.score = 0;
    player.time = '';
    scoreDisplay.innerHTML = "0";
    levelDisplay.textContent = '1';
    timer(35);
    pickCorrect();
}

function secondLevelStart() {
    document.querySelector('.game__window--start').style.display = "none";
    document.querySelector('.game__window').style.display = "none";
    document.querySelector('.game__window--secondLevel').style.display = "flex";
    player.time = '';
    player.score = 10;
    scoreDisplay.textContent = player.score;
    levelDisplay.textContent = '2';
    notes = [];
    notesSecond = Array.prototype.slice.call(document.querySelectorAll('.game__window--secondLevel img'));
    buttons = Array.prototype.slice.call(document.querySelectorAll('.game__buttons button'));
    timer(70);
    secondLevel();
}

document.querySelector('.game__window--start').addEventListener('click', newGame);

function secondLevel() {
    var correctNote = randomNoteSecond();
    var correctButton = randomButton();

    function correctSoundSecond() {
        for (var i = 0; i < soundsSecond.length; i++) {
            if (correctNote.dataset.name === soundsSecond[i].dataset.name) {
                soundsSecond[i].play();
            }
        }
    }

    function pickFalse() {
        var pick = notesSecond[Math.floor(Math.random() * notesSecond.length)];
        if (correctNote.name === pick.name) {
            return pickFalse();
        } else {
            return pick;
        }
    }

    function pickThird() {
        var pick = pickFalse();
        if (secondButton.name === pick.name) {
            return pickThird();
        } else {
            return pick;
        }
    }
    notesSecond = Array.prototype.slice.call(document.querySelectorAll('.game__window--secondLevel img'));
    notesSecond.forEach(function (img) {
        return img.style.display = "none";
    });
    correctNote.style.display = 'block';
    correctButton.innerHTML = '' + correctNote.name;
    notesSecond.splice(notesSecond.indexOf(correctNote), 1);
    buttons.splice(buttons.indexOf(correctButton), 1);
    var secondButton = pickFalse();
    var secondButtonText = secondButton.name;
    notesSecond.splice(notesSecond.indexOf(secondButton), 1);
    var thirdButtonText = pickThird().name;
    buttons[0].innerHTML = '' + secondButtonText;
    buttons[1].innerHTML = '' + thirdButtonText;
    setTimeout(correctSoundSecond, 100);

    function checkAnswer(e) {
        if (e.toElement.innerText == correctButton.innerText) {
            document.querySelector('.game__score--wrong').textContent = "Brawo!";
            setTimeout(clear, 500);
            player.score++;
            scoreDisplay.innerHTML = player.score;
            notesSecond = Array.prototype.slice.call(document.querySelectorAll('.game__window--secondLevel img'));
            buttons = Array.prototype.slice.call(document.querySelectorAll('.game__buttons button'));
            Array.prototype.slice.call(document.querySelectorAll('.game__buttons button')).forEach(function (button) {
                return button.removeEventListener('click', checkAnswer);
            });
            checkSecondLevel();
        } else {
            document.querySelector('.game__score--wrong').textContent = "Spróbuj jeszcze raz";
        }
    }

    Array.prototype.slice.call(document.querySelectorAll('.game__buttons button')).forEach(function (button) {
        return button.addEventListener('click', checkAnswer);
    });
}

function checkSecondLevel() {
    if (player.score > 49 && player.time > 0) {
        scoreDisplay.innerHTML = "Wygrana!";

        notes.forEach(function (img) {
            return img.style.display = "none";
        });
        buttons.forEach(function (button) {
            return button.innerHTML = "";
        });
        clearInterval(countdown);
        document.querySelector('.game__window').style.display = "flex";
        document.querySelector('.game__window--secondLevel').style.display = "none";

        var _startBtn = document.querySelector('.game__window--start');
        _startBtn.removeEventListener('click', secondLevelStart);
        _startBtn.innerHTML = "Zagraj jeszcze raz";
        _startBtn.style.display = "block";
        _startBtn.addEventListener('click', newGame);
    } else if (player.score <= 49 && player.time > 0) {
        secondLevel();
    } else {
        notes.forEach(function (img) {
            return img.style.display = "none";
        });
        notesSecond.forEach(function (img) {
            return img.style.display = "none";
        });
        buttons.forEach(function (button) {
            return button.innerHTML = "";
        });
        document.querySelector('.game__window').style.display = "flex";
        document.querySelector('.game__window--secondLevel').style.display = "none";
        var _startBtn2 = document.querySelector('.game__window--start');
        _startBtn2.removeEventListener('click', newGame);
        _startBtn2.innerHTML = "Zagraj jeszcze raz";
        _startBtn2.style.display = "block";
        _startBtn2.addEventListener('click', secondLevelOnceMore);
    }
}

function timer(seconds) {
    var now = Date.now();
    var finish = now + seconds * 1000;
    displayTimer(seconds);

    countdown = setInterval(function () {
        var secondsLeft = Math.round((finish - Date.now()) / 1000);
        player.time = secondsLeft;
        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }
        displayTimer(secondsLeft);
    }, 1000);
}

function setNewTime() {

    notes = Array.prototype.slice.call(document.querySelectorAll('.game__window img'));
    notes.forEach(function (img) {
        return img.style.display = "none";
    });
    buttons = Array.prototype.slice.call(document.querySelectorAll('.game__buttons button'));
    buttons.forEach(function (button) {
        return button.textContent = "";
    });
    player.score = '';
    document.querySelector('.game__score--wrong').textContent = "";
    player.time = '';
    var startBtn = document.querySelector('.game__window--start');
    startBtn.innerHTML = "Zagraj jeszcze raz";
    startBtn.style.display = "block";
    startBtn.addEventListener('click', newGame);
}

function secondLevelOnceMore() {
    notesSecond = Array.prototype.slice.call(document.querySelectorAll('.game__window--secondLevel img'));
    notesSecond.forEach(function (img) {
        return img.style.display = "none";
    });
    buttons = Array.prototype.slice.call(document.querySelectorAll('.game__buttons button'));
    buttons.forEach(function (button) {
        return button.textContent = "";
    });
    player.score = 10;
    document.querySelector('.game__score--wrong').textContent = "";
    player.time = '';
    var startBtn = document.querySelector('.game__window--start');
    startBtn.innerHTML = "Zagraj jeszcze raz";
    startBtn.style.display = "block";
    startBtn.addEventListener('click', secondLevelStart);
}

function displayTimer(seconds) {
    var minutes = Math.floor(seconds / 60);
    var restSeconds = seconds % 60;
    var timerDisplay = minutes + ':' + (restSeconds < 10 ? '0' : '') + restSeconds;

    timeToFinish.textContent = timerDisplay;
}