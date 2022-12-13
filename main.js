const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PlAYER_STORAGE_KEY = "F8_PLAYER";

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');



const app = {
    currentIndex: 0,
    isplaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},

    songs: [
        {
          name: "Be Ok",
          singer: "Baker Grace",
          path: './music/1Baker Grace - Be Ok (Official Music Video).mp3',
          image: "./img/1beok.jpg"
        },
        {
          name: "Head In The Clouds",
          singer: "Hayd",
          path: "./music/2Hayd - Head In The Clouds (Official Video).mp3",
          image: "./img/2head in the clouds.jpg"
        },
        {
          name: "Nếu Màn Hình Đó Không Phải Là Em",
          singer: "NHA",
          path: "./music/3neumanhinhdo.mp3",
          image: "./img/3neumanhinhdo.jpg"
        },
        {
          name: "Ghé Qua",
          singer: "Dick",
          path: "./music/4Ghé Qua - Dick x Tofu x PC [Official Audio].mp3",
          image: "./img/ghequa.jpg"
        },
        {
          name: "Tình Sầu Thiên Thu Muôn Lối",
          singer: "Doãn Hiếu",
          path: "./music/Doãn Hiếu - 'Tình Sầu Thiên Thu Muôn Lối' (M-V) (Prod.LongDrae).mp3",
          image:
            "./img/doanhieu.jpg"
        },
        {
          name: "Hẹn Ngày Mai Yêu",
          singer: "Long Cao",
          path:
            "./music/Long Cao - HẸN NGÀY MAI YÊU (Audio).mp3",
          image:
            "./img/6henngaymaiyeu.jpg"
        },
        {
            name: "Hẹn Ngày Mai Yêu",
            singer: "Long Cao",
            path:
              "./music/Long Cao - HẸN NGÀY MAI YÊU (Audio).mp3",
            image:
              "./img/6henngaymaiyeu.jpg"
          },
          {
            name: "Hẹn Ngày Mai Yêu",
            singer: "Long Cao",
            path:
              "./music/Long Cao - HẸN NGÀY MAI YÊU (Audio).mp3",
            image:
              "./img/6henngaymaiyeu.jpg"
          },
        {
          name: "Bên Ấy Bên Này",
          singer: "Long Cao",
          path: "./music/Long Cao - BÊN ẤY BÊN NÀY (Audio).mp3",
          image:
            "./img/benaybennay.jpg"
        }
      ],
      setConfig: function (key, value) {
        this.config[key] = value;
        // (2/2) Uncomment the line below to use localStorage
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
      },

      render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                        </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
      },

      defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() { 
                return this.songs[this.currentIndex]
            }
        })
      },

      handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
          { transform: 'rotate(360deg)'}
        ], {
          duration: 10000, //10 second
          iterations: Infinity
        })

        cdThumbAnimate.pause()

        //Xử lý phóng to thu nhỏ hình ảnh
        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
      
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
          };

          // Xử lý khi click play
          playBtn.onclick = function() {
            if (_this.isplaying){
              audio.pause();
            } else {
              audio.play();
            }
          }

          // Khi song được play
          audio.onplay = function() {
            _this.isplaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
          }

          // Khi song bị pause
          audio.onpause = function() {
            _this.isplaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
          }

          // Khi tiến độ bài hát tay đổi
          audio.ontimeupdate = function() {
            if(audio.duration) {
              const progressPercent = audio.currentTime / audio.duration *100;
              progress.value = progressPercent
            }
          }

          // Xử lý khi tua song
          progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime
          }

          // Khi next song 
          nextBtn.onclick = function() {
            if (_this.isRandom) {
              _this.playRandomSong();
            } else {
              _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong();
          }

          // Khi prev song 
          prevBtn.onclick = function() {
            if (_this.isRandom) {
              _this.playRandomSong();
            } else {
              _this.prevSong() 
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong();
          }

          // Xử lý bật / tắt random song
          randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom)
          }

          // Xử lý phát lại một bài hát
          repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat)
          }

          // Xử lý next song khi audio ended
          audio.onended = function() {
            if (_this.isRepeat) {
              audio.play()
            } else {
              nextBtn.click()
            }
          }

          //Lắng nghe hành vi click vào playlist 
          playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')

            if(songNode || e.target.closest('option')) {
              // Xử lý khi kích vào song
              if(songNode) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()
              }

              // Xử lý khi click vào option
              if (e.target.closest('option')) {

              }
            }
          } 

      },

      scrollToActiveSong: function() {
        setTimeout(() => {
          $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          })
        }, 300)
      },

      loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
      },

      loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
      },

      nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
          this.currentIndex = 0
        }
        this.loadCurrentSong()
      },

      prevSong: function() {
        this.currentIndex--
        if(this.currentIndex  < 0) {
          this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
      },

      playRandomSong: function() {
        let newIndex
        do {
          newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        
        this.currentIndex = newIndex
        this.loadCurrentSong()
      },

      start: function() {
        // Gán cấu hình từ config vào ứng dụng
        // Assign configuration from config to application
        this.loadConfig();

        //Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiên (DOM events)
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render plasylist
        this.render();

        // Hiển thị trạng thái ban đầu của button repeat & random
        // Display the initial state of the repeat & random button
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
      }
}

app.start()