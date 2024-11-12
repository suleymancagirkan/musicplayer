const musics = [
    {
        id: 1,
        name: "Durumlar Müsait",
        author: "Gökhan Türkmen",
        file: new Audio("assets/mp3/durumlar_musait.mp3"),
        thumbnail: new Image().src = "assets/img/durumlar_musait.jpg"
    },
    {
        id: 2,
        name: "Merhametine Dön",
        author: "Sagopa Kajmer",
        file: new Audio("assets/mp3/merhametine_don.mp3"),
        thumbnail: new Image().src = "assets/img/merhametine_don.jpg"
    },
]
let progressBar = document.querySelector("#progressBar")
let counterTime = document.querySelector("#counterTime")
let endTime = document.querySelector("#endTime")
let duration;
let counterTimeDuration;
let interval; // Global interval değişkeni, pauseButton için kullanacağız.

window.onload = function() { //Yüklendiğinde müzik dosyasını algılaması için
    let openedMusic;
    musics.map((item) => {
    let otherMusics = document.querySelector("#otherMusics")
        let anyMusic = document.createElement("button")
        anyMusic.id = "playOtherMusicButton"
        anyMusic.setAttribute("key", item.id)
        anyMusic.className = "flex flex-row w-full items-center justify-around border-2 border-neutral-300 p-3 rounded-xl"
        anyMusic.innerHTML = `<img class="rounded-xl" src="${item.thumbnail}" width="100" height="100"/>
                    <div class="flex flex-col items-start justify-center gap-y-2">
                        <span class="text-black text-lg" id="name">${item.name}</span>
                        <span class="text-neutral-700 text-sm">${item.author}</span>
                    </div>
                    <a>
                        <i class="ti ti-player-play p-1 text-2xl rounded-lg border-2 border-[#ccc] hover:bg-[#ccc]"></i>
                    </a>`
        otherMusics.appendChild(anyMusic)

        anyMusic.addEventListener("click", function() {
            openedMusic = item.name
            openMusic(item.name)
            console.log(openedMusic)
        })
    })


    let home = document.querySelector("#home")
    
    function openMusic(name) {
        let selectedMusic = musics.find(item => item.name === name);
        if(selectedMusic) {
            const audio = selectedMusic.file
            home.innerHTML = ""
            let mainPage = document.createElement("div")
            let defaultValue = 0;
            mainPage.className = "flex flex-col items-center mx-auto justify-center gap-y-2"
            mainPage.innerHTML = `<img id="thumb" src="${selectedMusic.thumbnail}" class=" rounded-xl"/>
                    <span class="text-black text-lg" id="name">${selectedMusic.name}</span>
                    <span class="text-neutral-700 text-sm">${selectedMusic.author}</span>
                    <input type="range" id="progressBar" max="${Math.round(audio.duration)}" step="1" value="${defaultValue}" class="w-full mt-5 bg-black" />
                    <div class="flex flex-row items-center justify-between w-full">
                        <span id="counterTime" class="text-black text-md">${timeConvert(defaultValue)}</span>
                        <audio id="audio">
                            <source src="${audio.src}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                        <span id="endTime" class="text-black text-md">${timeConvert(Math.round(audio.duration))}</span>
                    </div>
                    <div id="buttonList" class="flex flex-row items-center justify-between mt-3 w-full">
                        <button id="previousButton">
                            <i class="ti ti-player-skip-back p-1 text-2xl rounded-lg border-2 border-[#ccc] hover:bg-[#ccc]"></i>
                        </button>
                        <button id="playButton">
                            <i class="ti ti-player-play p-1 text-2xl rounded-lg border-2 border-[#ccc] hover:bg-[#ccc]"></i>
                        </button>
                        <button id="nextButton">
                            <i class="ti ti-player-skip-forward p-1 text-2xl rounded-lg border-2 border-[#ccc] hover:bg-[#ccc]"></i>
                        </button>
                    </div>`
    
            home.appendChild(mainPage)
            
            let progressBar = document.querySelector("#progressBar")
            let previousButton = document.querySelector("#previousButton")
            let nextButton = document.querySelector("#nextButton")
            let playButton = document.querySelector("#playButton")
            let counterTime = document.querySelector("#counterTime")
            audio.currentTime = 0

            previousButton.addEventListener("click", function() {
                let newSelectedMusic;
                if (selectedMusic.id - 1 < 1) {
                    newSelectedMusic = musics[musics.length - 1]; 
                } else {
                    newSelectedMusic = musics.find(item => item.id === selectedMusic.id - 1); 
                }
                openMusic(newSelectedMusic.name);
            });

            nextButton.addEventListener("click", function() {
                let newSelectedMusic;
                if (selectedMusic.id + 1 > musics.length) {
                    newSelectedMusic = musics[0]; 
                } else {
                    newSelectedMusic = musics.find(item => item.id === selectedMusic.id + 1); 
                }
                openMusic(newSelectedMusic.name);
            })
            

            progressBar.addEventListener("change", function() { //progressBar üzerindeki değişiklikler için
                let newValue = document.querySelector("#progressBar").value
                counterTime.textContent = timeConvert(newValue)
                audio.currentTime = newValue
            })
            
            

            playButton.addEventListener("click", function() { // Oynat butonuna bastığımda olan değişiklikler için
                let buttonList = document.querySelector("#buttonList")
                let playButton = document.querySelector("#playButton")
                
                let pauseButton = document.createElement("button")
                pauseButton.id = "pauseButton"
                pauseButton.innerHTML = `<i class="ti ti-player-pause p-1 text-2xl rounded-lg border-2 border-[#ccc] hover:bg-[#ccc]"></i>`
                buttonList.replaceChild(pauseButton, playButton)
                
                console.log("Ses dosyası çalmaya başladı.");
                console.log(Math.round(progressBar.value, progressBar.max))
                audio.play()
                
                interval = setInterval(() => {
                    if (Math.round(audio.currentTime) < Math.round( audio.duration)) {
                        console.log(audio.currentTime, audio.duration);
                        counterTime.innerHTML = timeConvert(Math.round(audio.currentTime))
                        progressBar.value = audio.currentTime;
                    } else if (audio.currentTime = audio.duration) {
    
                        buttonList.replaceChild(playButton, pauseButton)
                        progressBar.value = 0;
                        counterTime.innerHTML = timeConvert(progressBar.value);
                        clearInterval(interval);
                        audio.pause() 
                    }
                }, 1000);
    
                pauseButton.addEventListener("click", function() {
                    audio.pause()
                    clearInterval(interval);
                    buttonList.replaceChild(playButton, pauseButton)
                })
            })
            
        } else {
            let noMusic = document.createElement("span")
            noMusic.id = "noMusicPlaying"
            noMusic.className = "w-full bg-red-300 border-2 border-red-400 rounded-xl p-3 text-center"
            noMusic.textContent = "Herhangi bir müzik oynatılmıyor."
    
            home.appendChild(noMusic)
        }
    }

}

function timeConvert(time) { //saniye çevirici
    const minutes = Math.floor(time / 60); 
    const seconds = time % 60; 

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
