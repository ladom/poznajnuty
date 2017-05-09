    const player = {
        name: '',
        score: 0,
        totalTime: '',
        totalError: '',
        time: ''
    };

    let countdown;
    let clearDisplay;
    const timeToFinish = document.querySelector('.game__score--timer');
    const scoreDisplay = document.querySelector('.game__score--number');
    const levelDisplay = document.querySelector('.game__level--number');
    const startBtn = document.querySelector('.game__window--start');
    const wrongDisplay = document.querySelector('.game__score--wrong');

    // Obrazy nut
    var notes = Array.prototype.slice.call(document.querySelectorAll('.game__window img'));
    var notesSecond = Array.prototype.slice.call(document.querySelectorAll('.game__window--secondLevel img'));
    // Przyciski
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.game__buttons button'));
    var sounds = Array.prototype.slice.call(document.querySelectorAll('.game__window audio'));
    var soundsSecond = Array.prototype.slice.call(document.querySelectorAll('.game__window--secondLevel audio'));
    // zmienna - ostatni losowany numer
    let lastNoteIndex;
    let lastButtonIndex;

    function randomNote() {
        const index = Math.floor(Math.random() * notes.length);
        let pick = notes[index];

        if (pick === lastNoteIndex) {
            return randomNote();
        }
        lastNoteIndex = pick;
        return pick;
    }

    function randomNoteSecond() {
        const index = Math.floor(Math.random() * notesSecond.length);
        let pick = notesSecond[index];

        if (pick === lastNoteIndex) {
            return randomNoteSecond();
        }
        lastNoteIndex = pick;
        return pick;
    }

    function randomButton() {
        const index = Math.floor(Math.random() * buttons.length);
        let pick = buttons[index];

        if (pick === lastButtonIndex) {
            return randomButton();
        }
        lastButtonIndex = pick;
        return pick;
    }

    function pickCorrect() {
        let correctNote = randomNote();
        let correctButton = randomButton();

        function correctSound() {
            for (var i = 0; i < sounds.length; i++) {
                if (correctNote.dataset.name === sounds[i].dataset.name) {
                    sounds[i].play();
                }
            }
        }

        notes.forEach(img => img.style.display = "none");

        correctNote.style.display = 'block';
        correctButton.innerHTML = `${correctNote.name}`;
        notes.splice(notes.indexOf(correctNote), 1);
        buttons.splice(buttons.indexOf(correctButton), 1);
        let secondButton = notes[Math.floor(Math.random() * notes.length)];
        let secondButtonText = secondButton.name;
        notes.splice(notes.indexOf(secondButton), 1);

        let thirdButtonText = notes[Math.floor(Math.random() * notes.length)].name;

        buttons[0].innerHTML = `${secondButtonText}`;
        buttons[1].innerHTML = `${thirdButtonText}`;
        setTimeout(correctSound, 100);


        function checkAnswer(e) {
            if (e.toElement.innerText == correctButton.innerText) {
                wrongDisplay.textContent = "Brawo!";
                clearDisplay = setTimeout(clear, 500);
                player.score++;
                scoreDisplay.innerHTML = player.score;
                notes = Array.prototype.slice.call(document.querySelectorAll('.game__window img'));
                buttons = Array.prototype.slice.call(document.querySelectorAll('.game__buttons button'));

                Array.prototype.slice.call(document.querySelectorAll('.game__buttons button')).forEach(button => button.removeEventListener('click', checkAnswer));
                checkLevel();


            } else {
                wrongDisplay.textContent = "Spróbuj jeszcze raz";
                player.totalError++;
            }
        }



        Array.prototype.slice.call(document.querySelectorAll('.game__buttons button')).forEach(button => button.addEventListener('click', checkAnswer));

    }
    var clear = function() {
        wrongDisplay.textContent = "";
    };

    function checkLevel() {
        if (player.score > 9 && player.time > 0) {


            Array.prototype.slice.call(document.querySelectorAll('.game__buttons button')).forEach(button => button.textContent = "");
            Array.prototype.slice.call(document.querySelectorAll('.game__window img')).forEach(img => img.style.display = "none");
            clearInterval(countdown);
            startBtn.textContent = "Przejdź do poziomu 2";
            startBtn.style.display = "block";
            removeStartListener();
            startBtn.addEventListener('click', secondLevelStart);

        } else if (player.score <= 9 && player.time > 0) {
            sounds.forEach(sound => sound.pause());
            sounds.forEach(sound => sound.currentTime = 0);
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
        startBtn.style.display = "none";
        document.querySelector('.game__window').style.display = "none";
        document.querySelector('.game__window--secondLevel').style.display = "flex";
        player.totalTime = player.time;

        player.score = 10;
        scoreDisplay.textContent = player.score;
        levelDisplay.textContent = '2';
        notes = [];
        notesSecond = Array.prototype.slice.call(document.querySelectorAll('.game__window--secondLevel img'));
        buttons = Array.prototype.slice.call(document.querySelectorAll('.game__buttons button'));
        timer(70);
        secondLevel();
    }

    startBtn.addEventListener('click', newGame);

    function secondLevel() {
        let correctNote = randomNoteSecond();
        let correctButton = randomButton();

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
        notesSecond.forEach(img => img.style.display = "none");
        correctNote.style.display = 'block';
        correctButton.innerHTML = `${correctNote.name}`;
        notesSecond.splice(notesSecond.indexOf(correctNote), 1);
        buttons.splice(buttons.indexOf(correctButton), 1);
        let secondButton = pickFalse();
        let secondButtonText = secondButton.name;
        notesSecond.splice(notesSecond.indexOf(secondButton), 1);
        let thirdButtonText = pickThird().name;
        buttons[0].innerHTML = `${secondButtonText}`;
        buttons[1].innerHTML = `${thirdButtonText}`;
        setTimeout(correctSoundSecond, 100);

        function checkAnswer(e) {
            if (e.toElement.innerText == correctButton.innerText) {
                wrongDisplay.textContent = "Brawo!";
                clearDisplay = setTimeout(clear, 500);
                player.score++;
                scoreDisplay.innerHTML = player.score;
                notesSecond = Array.prototype.slice.call(document.querySelectorAll('.game__window--secondLevel img'));
                buttons = Array.prototype.slice.call(document.querySelectorAll('.game__buttons button'));
                Array.prototype.slice.call(document.querySelectorAll('.game__buttons button')).forEach(button => button.removeEventListener('click', checkAnswer));

                checkSecondLevel();

            } else {
                wrongDisplay.textContent = "Spróbuj jeszcze raz";
                player.totalError++;
            }
        }

        Array.prototype.slice.call(document.querySelectorAll('.game__buttons button')).forEach(button => button.addEventListener('click', checkAnswer));
    }

    function checkSecondLevel() {
        if (player.score > 49 && player.time > 0) {
            scoreDisplay.innerHTML = "50";
            notes.forEach(img => img.style.display = "none");
            buttons.forEach(button => button.innerHTML = "");
            clearInterval(countdown);
            clearTimeout(clearDisplay);
            player.totalTime = 105 - (player.totalTime + player.time);

            document.querySelector('.game__window').style.display = "flex";
            document.querySelector('.game__window--secondLevel').style.display = "none";
            var succes = function() {
                startBtn.textContent = "Zagraj jeszcze raz";
                wrongDisplay.textContent = "";
            };

            removeStartListener();
            startBtn.style.display = "block";
            startBtn.innerHTML = "Wygrana!";
            console.log(player.totalError);
            // tutaj trzeba:
            // dodać imię gracza
            // stworzyć nową pozycję listy wygranych
            // dodać imię do listy wygranych
            // dodać totalTime
            // dodać totalError
            // posortować
            // ponumerować
            // wyświetlić

            totalTimeDisplay(player.totalTime);

            setTimeout(succes, 5000);

            startBtn.addEventListener('click', newGame);
        } else if (player.score <= 49 && player.score >= 10 && player.time > 0) {
            soundsSecond.forEach(sound => sound.pause());
            soundsSecond.forEach(sound => sound.currentTime = 0);
            secondLevel();
        } else {
            notes.forEach(img => img.style.display = "none");
            notesSecond.forEach(img => img.style.display = "none");
            buttons.forEach(button => button.innerHTML = "");
            document.querySelector('.game__window').style.display = "flex";
            document.querySelector('.game__window--secondLevel').style.display = "none";

            removeStartListener();
            startBtn.innerHTML = "Zagraj jeszcze raz";
            startBtn.style.display = "block";
            startBtn.addEventListener('click', secondLevelOnceMore);
        }
    }



    function timer(seconds) {
        const now = Date.now();
        const finish = now + seconds * 1000;
        displayTimer(seconds);

        countdown = setInterval(() => {
            const secondsLeft = Math.round((finish - Date.now()) / 1000);
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
        notes.forEach(img => img.style.display = "none");
        buttons = Array.prototype.slice.call(document.querySelectorAll('.game__buttons button'));
        buttons.forEach(button => button.textContent = "");
        player.score = '';
        wrongDisplay.textContent = "";
        removeStartListener();
        startBtn.innerHTML = "Zagraj jeszcze raz";
        startBtn.style.display = "block";
        startBtn.addEventListener('click', newGame);

    }

    function secondLevelOnceMore() {
        notesSecond = Array.prototype.slice.call(document.querySelectorAll('.game__window--secondLevel img'));
        notesSecond.forEach(img => img.style.display = "none");
        buttons = Array.prototype.slice.call(document.querySelectorAll('.game__buttons button'));
        buttons.forEach(button => button.textContent = "");
        player.score = 10;
        wrongDisplay.textContent = "";
        removeStartListener();
        startBtn.innerHTML = "Zagraj jeszcze raz";
        startBtn.style.display = "block";
        startBtn.addEventListener('click', secondLevelStart);
    }



    function displayTimer(seconds) {
        const minutes = Math.floor(seconds / 60);
        const restSeconds = seconds % 60;
        const timerDisplay = `${minutes}:${restSeconds < 10 ? '0' : ''}${restSeconds}`;

        timeToFinish.textContent = timerDisplay;
    }

    function totalTimeDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const restSeconds = seconds % 60;
        const timerDisplay = `${minutes}:${restSeconds < 10 ? '0' : ''}${restSeconds}`;

        wrongDisplay.textContent = `Twój czas: ${timerDisplay}`;
    }

    function removeStartListener() {
        startBtn.removeEventListener('click', newGame);
        startBtn.removeEventListener('click', secondLevelStart);
    }

    function playerName() {
        var name = prompt("Twoje imię", '');
        player.name = name;
    }