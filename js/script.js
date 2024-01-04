let currentSong = new Audio();
let songs;
let currentFolder;

function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const Minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(Minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;

}

async function getSongs(folder) {
    currentFolder = folder;
    let a = await fetch(`./${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response; // Fix the typo here
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`./${folder}/`)[1]);
        }
    }
    // showing all the songs in the playlist section
    let songsUL = document.querySelector("#songslist ol");
    songsUL.innerHTML = "";
    for (const song of songs) {
        songsUL.innerHTML += `<li>
        <img class="invert" src="./media/music.svg" alt="">
        <div id="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Song Artist</div>
        </div>
        <div id="playnow">
            <img class="invert" src="./media/play.svg" alt="">
        </div>
    </li>`;
    }
    // attach an event listener to each song
    Array.from(document.querySelector("#songslist ol").children).forEach(e => {
        e.addEventListener("click", element => {

            playMusic(e.querySelector("#info").firstElementChild.innerHTML);
        })
    });
    return songs;
}

let currentSongIndex = 0;

function playNextSong() {
    currentSongIndex++;

    if (currentSongIndex < songs.length) {
        playMusic(songs[currentSongIndex]);
    } else {
        // If it's the last song, reset the index to 0 and play the first song
        currentSongIndex = 0;
        playMusic(songs[currentSongIndex]);
    }
}


const playMusic = (track, pause = false) => {
    currentSong.src = `/${currentFolder}/` + track;

    // Event listener for the 'ended' event
    currentSong.addEventListener('ended', () => {
        playNextSong()
    });

    if (!pause) {
        currentSong.play();
        play.src = "........../media/pause.svg";
    }

    document.querySelector("#song-info").innerHTML = decodeURI(track || "Start A Song");
    document.querySelector("#song-time").innerHTML = "00:00 / 00:00";
}


async function displayAlbums() {
    let a = await fetch(`./songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector("#card-container");


    // Clear the existing content before adding new cards
    cardContainer.innerHTML = '';

    Array.from(anchors).forEach(async (e) => {
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[1];
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();

            // Use class instead of id for multiple cards
            cardContainer.innerHTML +=
                `<div data-folder="${folder}" class="card">
                <div class="play-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <img src="/songs/${folder}/cover.jpg" alt="">
                <h3>${response.title}</h3>
                <p>${response.description}</p>
            </div>`;
        }
    });

    // Load the playlist whenever a card is clicked
    cardContainer.addEventListener("click", async (event) => {
        const card = event.target.closest(".card");

        if (card) {
            console.log("Fetching Songs");
            const songs = await getSongs(`songs/${item.dataset.folder}`);
            playMusic(songs[0]);
        }
        document.querySelector("#left").style.left = "0"
    });


    cardContainer.addEventListener("click", () => {
        document.querySelector("#left").style.left = "0"
    });


}

// Call the function to display albums
displayAlbums();



async function main() {

    // getting list of all the songs
    await getSongs(`.songs/${currentFolder}`);
    playMusic(songs[0], true)

    // displaying all the albums on page
    displayAlbums()

    // attach an event listener to play next and prev
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "........../media/pause.svg";
        } else {
            currentSong.pause()
            play.src = "./media/play.svg";
        }
    })

    document.getElementById("vol-percentage").innerHTML = currentSong.volume * 100 + "%"



    // listen for time update event

    currentSong.addEventListener("timeupdate", () => {

        document.querySelector("#song-time").innerHTML = `${secondsToMinutes(currentSong.currentTime)}/${secondsToMinutes(currentSong.duration)}`
        document.querySelector("#circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // add an event listener to sekbar
    document.querySelector("#seekbar").addEventListener("click", (dets) => {
        let percent = (dets.offsetX / dets.target.getBoundingClientRect().width) * 100
        document.querySelector("#circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    // add an event listener on hamburger icon
    document.querySelector("#nav .hamburger").addEventListener("click", () => {
        document.querySelector("#left").style.left = "0"
    })
    // add an event listener on close icon
    document.querySelector("#left .close").addEventListener("click", () => {
        document.querySelector("#left").style.left = "-110" + "%"
    })
    // add an event listener on home icon to direct the user to home screen
    document.querySelector("#left #home-button").addEventListener("click", () => {
        document.querySelector("#left").style.left = "-110" + "%"
    })
    // add an event listener on search icon to direct the user to pop up a screen screen
    document.querySelector("#left #search-button").addEventListener("click", () => {
        alert("Search Feature Is In Progress! Coming Soon")
    })

    // add an event listener to prev
    document.querySelector("#prev").addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    })
    // add an event listener to next
    document.querySelector("#next").addEventListener("click", () => {
        currentSong.pause();

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    })


    // adding an event listener to control the volume
    document.querySelector("#range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        const volumeImage = document.getElementById("volume");

        if (currentSong.volume === 0) {
            volumeImage.src = "./media/mute.svg";
        } else if (currentSong.volume > 0) {
            volumeImage.src = "./media/volume.svg";
        }
        // volume change showing on the screen
        document.getElementById("vol-percentage").innerHTML = currentSong.volume * 100 + "%"
    })



    // adding an event listener to mute the track
    document.getElementById("volume").addEventListener("click", (e) => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector("#range").getElementsByTagName("input")[0].value = 0
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .5;
            document.querySelector("#range").getElementsByTagName("input")[0].value = 50
        }
        let latestVolume = currentSong.volume * 100;
        document.getElementById("vol-percentage").innerHTML = parseInt(latestVolume) + "%"
    })

    var tl = gsap.timeline();
    tl.to("#loading-container", {
        delay: 2,
        opacity: 0,
        backgroundColor: "#000",
        duration: 2,
        onComplete: function () {
            document.getElementById("loading-container").style.display = "none";
        }
    });

}
main()
