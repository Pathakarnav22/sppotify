console.log("Let write JavaScript");
let currentSong = new Audio();
let songs;

function secondsToMinutes(seconds) {
  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Pad the seconds with leading zero if necessary
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  // Return formatted string in mm:ss format
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track, pause = false) => {
  //let audio = new Audio("/songs/" + track)
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
};
async function main() {
  songs = await getSongs();
  console.log(songs);
  playMusic(songs[0], true);

  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> <img src="music.svg" alt="" >
                  <div class="info">
                    <div>${song.replaceAll("%20", " ")} </div>
                    <div>Harry</div> 
                  </div>
                  <div class="playnow"> 
                    <span>Play Now</span>
                  <img class="invert" src="play.svg" alt="">
                </div>
         </li>`;
  }
  // Attach n eventlistner to each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg"; // Update image to pause icon
    } else {
      currentSong.pause();
      play.src = "play.svg"; // Update image to play icon
    }
  });
  //Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songTime").innerHTML = `${secondsToMinutes(
      currentSong.currentTime
    )} / ${secondsToMinutes(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
  //addevent listner to seekbar
  document.querySelector(".seekBar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  //add AN event listner to hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });
 // add a Event listener for previous  and next
 previous.addEventListener("click", ()=>{
  console.log("Next Clicked")
  
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  if((index - 1 )>= 0){
    playMusic(songs[index+1])
  }
    
 })
 next.addEventListener("click", ()=>{
  console.log("Next clicked")

  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  if((index + 1 )< songs.length - 1){
    playMusic(songs[index+1])
  }
    
 })
}

main();
