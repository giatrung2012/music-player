const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = 'BRAYNIACS_PLAYER';

const player = $('.player');
const heading = $('header h2');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const repeatBtn = $('.btn-repeat');
const prevBtn = $('.btn-prev');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const progress = $('#progress');
const audio = $('#audio');
const playlist = $('.playlist');

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  setConfig(key, value) {
    this.config[key] = value;
    localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: "1. Ta CÓ Nên (Intro) [HiddenGem Mixtape]",
      singer: "B Ray, Jurrivh",
      path: "https://onmbiq.bl.files.1drv.com/y4mY8YEF_js5I6lDCGJdPVjmPwoVi5vzcF2r7sdee8k4diypfq1NtjreDi0JVyDi-B10fK-NMyC3GCn3fktjenmrhtdNBR2iBbdSqiOFJ09kSLEjUAlTZ_iNtpgVIdCJ02vnNtS2xO82iNWBS3hpyJ5RNSHwRDiDUWDm65Be4u6uXkxcBEEG_xrzKX4-hFTOQb19GjPX2ryQ0u-aGX5S5nmyA",
      image:
        "data:image/jpeg;base64,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",
    },
    {
      name: "2. Cho Ba [HiddenGem Mixtape]",
      singer: "B Ray",
      path: "https://onmaiq.bl.files.1drv.com/y4mprsMYvt7b7iQPUjIBYnA__mrXJAFQNmvJZkK2PNoCQxIOaDoNQF0NfLuZ2e8NcMeVj8NSEalwQvcVkY9n4kyqC2fR1baJUJCGsBl2TTsnucaSsF6r4ue4qISNDM5iQlO7DO8GR-odqoPtFhkEsCU_v0CJQrM9naeVksGXkOgKO-6tfHYxDN_BHvEH-2d7KVNNXWN_KvEp-4Eq5NqSlNGXA",
      image:
        "data:image/jpeg;base64,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",
    },
    {
      name: "3. Chân Mệnh [HiddenGem Mixtape]",
      singer: "B Rizzle, B Ray",
      path: "https://onmziq.bl.files.1drv.com/y4mcbb1maMRuFiYSuBn-JIBVCtaOe7myE1YIEPIvlylbaFoJyuiZGXSbO7ixKClJD9QXFG4cJIyFLFX3hP93TDT35TnjORK1Tu_75RqrUkixlWlHvB7ObU6Np7YFwoqPxWmkFGw7SC0k8EAGHne6vp8yYpauvfe6voRFcwCwoo0wFbv5VepjM0i0BUtHpMPy_NOGm23eaOgC1yGFwUxARKOoQ",
      image:
        "data:image/webp;base64,UklGRrILAABXRUJQVlA4IKYLAAAQggCdASrhAOEAPs1Wo0unsjohstQry0AZiWNuY/wfAiv06TQZ9A7zAJfmLW8GdQOSuWrUKf3cF5v/CyBi8AGuREug/divPYGNlJ7OQNlF8HfRrElajAeXXgRbHJ5d8zYxQytVnfXD23p+OEqya/WJSolHud8U0sh8oh/yGVi1/LjiXKF/UN4xdC7qvtW/q7sGHYZELY7huh19MGLh7bpQaKbSepyo27DKELTlq7fXpfF8tBE945ZVzXGB8h31nDxXUruavtz1JKpcY/3TP85sz4Bc/8KukZhoXzGEYMlN4YOsZNSxYEV2kYh7h+Rs9nfdcgASOeYxD6cKahGjGMqV3VeeZrW/CH2tqf3/sV4ToXMqFXa6+IhnNKC1hOrGVl/7HdN+5ZCjAbEfIB8EzeQRZ6TEAt/Z5N5UQ4fBT1C/TYq2gW13qbOZqm6wssIf5j/Nzj4MHlnf67sJl5vUwtDt4pDH744y+Ho3qydCFh5AN1iPVWhkBQ4XvgaD/6gBtvku2eRBtXWKU6AWezLjKL5ZbCIeGjIYIXBfTu2ZvD8+s+0fhc8pQDtRRIR9vRLGusu0ZZJZa1NmOXAm9gLUODU7Awoczb611SLICX/4HZ7v59blmuhV9RO36Jt7sv+/7qh9/NxPOHi3031735YNAXWC63zhiZqQKYofdN9OIAtDHBOBiH47JOmWNnEo65exYHm7K772q9yjXh9v5reKBvdD9TT53+ItGlsvlpNGZyWOqCizE0ImtUb9ztAoYq+bEmjT3/CnMHeZXV/xAc2ITXptWEDvEG56s8EKASxTO6e+bjWexwZjeaZSZ+i/z7wle9BHZhVR9EJOl5r+ERjRKABzlTbvUfu3A6eOFTTmOr5ULXVt4144lqTqJUNvfIi2lyrne+AJ2FQVZGS/3ulWSL5hTkzl8uTk1sGSVVm0vz6YkjrAf9DiLYFSfne1jt0dM6WP3OREbdEV/2i9SKaQGwS3MQdnWZ/cQ1dp1LpWH5PcFaYleVek5dYg0s/+3pxFeMj7nsswwTkxyPvb1boPzN0lNkG1RpbDs7BeOD8R+hrgOG8A6K5LTs3TeXX6ziMPNDJX6ub2QflQeeqIrTPuavOGxlWR+SMKfSHINeRLJy0sOLCYI8LnJ7Pd2jGl2GugzekaGVmktToG752pQR+OAnBf+BNEfohpSaE71y9wtohJ1MIdkdCGKPTVmmJn0UibTQQAebUeI1Hr7R3kK6P4JGDZi74Kzaqvg5OgUe9OSQqLSyaaNEtMYwif9sCUdV7ox0RmMlEihPD6K68dO7USrd1fd+jX7lsmd5C68pBmuA2+NHkmexz5Y3PMVfhXn1DaFmfZWtGn5Pm9v0rLKyGMjgxC29yN0Zb5AWJNlzM2NUMXA8RVM//PbLheAAD+8bKNxfjGoFLEL4GdZT96Et8RecLQVktP79w2l+IvJPGvXEmUCjlCkg3AblmeVnluIcba8UaK66qx6/uViDSF9HlbBJdZxY4LnFKIyqcqeYSQgxzYtCDl8OBuWCh4CyxWaQ6wARDJVEjv6V1O5X8wQoYkMShFJ70VkaOf74T16RUPyTOQz+dfcQHqIWSJpQvdIsCNh9dbmm/jO/qXaOwA5T7dJ6V0Lhx2iavIfuNJKwF3QzooHqzaOa2cEg5lR0cD87EWNtqY+xIH10ozrHNHmlbIL/LkVB1O1ibVp71Pd0KKEIpzgiE7C7PlYLtCakid63/jMXzGZzx1I5TczAoQ1h/rsosEc33UckU8Uka7XhnrGggEnryobTbZilOlST5LyiyLpAdXHb06NbRPO86vEfGJR+bobqWEqMq5fsIUH4IU4XftZvJi45GcF+rPbEDUTKfHcZ/yzg2ixnaRD0v48V5Sp5PPHF68uhg0AddqT2r2wwLs4WN2p01S6ERCUAb4zOz4hmQK5jwZTP98lbxojqy444YWfnfB5gl7bhjWwgZf8rOPbdWVZ7hRlvGrdmhD81dYgHMxwZwpbS1dwp4SQVFSlJstS3YBq6G2ww8qkIK3CMTxIlWfBKGGgTbKxLbHgrV49eIl9FndTj9j8mgbgTxYlq0BUdkPO1f1s8dZSgMCvPdWoFhelMZa0oYz1+xWKH48tZ2YGkhYWas+YZBOFMgrVlRYpNp3HF/v/BjvX+ZtxXvk/Wv3e1lA8mIS/SmGTgSDHDPsYeAFoKR5Bov5rkXBkVk/J+0L542L0T0UjhUXuoc7gLKDEubt5EtVpk6Dggfl/5QC370kmLToFnpI78Y+REDLZlvCoEXpN3rObRh5VAZeqENaBpsUrjVQY/ExPuSCCD9QSdiOUWtHW3Z0XGLWurnFcn60btEZfigzgXy9mCaWQ1dt16UYtMhkWITjQriPwvuriui5wen4g2kTAK/dWo0HVrPbuK4RRacAku3AqjE8KRQyUaqw6VAgwaZwkfhkerxsPzekMcVB9jJKDMRIA3li8qQj0GG8z8gf1XSl4I9qPQ4MtKLWV2/U6xF6uX55/o9AS6HEgd6gPjI3KrBHLi4R5KaWsvGBGAJl8FjcykD73mzAVHLySslcY0elje+frgCOFwy9/h/Aqx05+gMrxPUMH+a6cc/elYx/RTq3nKgs66hqAIzHaDu2a39XhC88FLc1oR76PLiGPMMYk158bvT2W3zSq3eHwuE9sAqAnK1PI7xpDE3ikLRfpGAFx6SXBei2c1xkj6k/nOu/sSRQfIxTlskO14qzVEVpAIhKzemtPA7xalTD2AfvtiEvovyT+lEmzxxDmzsIbp2BwnkPmkaIzPB/EEXYuB3Ln2oCNv0ra1z79QyBr1dZccuwO39N2L9tlAYONamaL0yakvV4KB1wjHYGjR6N2yuW5wZ6Q+m605zrIvozd4HlRu26wTy8LnhMQlYpTrwliAivd1AWyHLSCdBUoOqnoBEmyeMRSQX4/7yr6xP+plsReBMAfYv80+RIl2xe9FklfzhDyQ41APw/6kXYUckhVOAB+NjpV8AsBhwdVfcyDO+BI64PQbK6WK5Coy5t0W+SNrmG2q25UBQjuMgYj79tCADp4pXxwsdHZTWzuu0DpA+iNP2vFszMdf8g1fNFjOyarEtms+fwmFvSZatmmit06IaF78ZqZLCtQd7Jh5gaXa2/x6I9RoLasUd2Wogay8moM1kt4jUQftUq2MbWnbhTNyxb36A1nU53arT/1BsdVC9gXsEsQgBkEurrGAgra1k20CEgpW+logOgei6MKgXnUN+bglllcEh7QDob6EpTP5WyYf+1xQH9I/9n3yPcz+H9ZYaEP1M4YA2T/44yE//PXB4hGILh9Dgw+9+OcI+fcWjst2ukNSCCHiTOY6lEbPmx+EGPuNZtHJzW5XkXsP7hLAMgKcb5EsLowvCx4rnJ+WUqnTvBM5QGUTm6AD4jPxX6aZrXX60J8FwznKLPOsSe2gUn4ePSqmFc4hzHVjAAje/ueWPOMCGDg7dK+HcDWSqImu0fC9ROX5YeT8ROODZreKtXOQYu3zaPWBs0W1R+D5NvJgC/LDef7cciFEaInQYwaaAOh25uoQgTdOsepMLmy1X5vj1bz19VBQCO33yYuxef/3NW5/K4hDTESOSgvIdWOCqnicE5xYcGrG+hC2M31RhfMyYJCewAqOgXT6FWAZ0GKLq8rfZ1cG0cNSsbj4UHv5KGcUUrnPH3On4PsiI3TRTh4op3dMDz/8N4hu8L0W56fe0crwoujUnznKHehBHvC4iKltOhMBpDlNxyE1nxS7wrNc22aJ827Py87Y9wfWjSkTuA1IUqUYhJsGBvaLRktq83PUVGwdGYL8yjYt8K/mhVb7A8hn6gOmZOhs5EdjVgXTV7959cIzfF3SWgtHI/vThxBZoIlPxieoiPOGL0yZjajyzO1xzO4j6stAkYcEgfb75epFV3y9TaTq1weeBOXuHppkBTQqZeP6MBhJEnqkaNQvHgYOLxH28yqnkNwZWabXLFLT4xBJ/6INICAAA=",
    },
    {
      name: "4. 1 Vòng Sài Gòn [HiddenGem Mixtape]",
      singer: "B Ray",
      path: "https://onmciq.bl.files.1drv.com/y4mUSEK_ZWacYK_mTC9oPjFpczcqVUZn_BY-8eQgtoRH-mfc7TISorri1W-Lm0yD3xh1xsOmrBsf6sQoaqzryC3MuyPEIayoGrqu6qm0lGE01lUp2sP_mZM5FvD80TOjk_L1sdDf8Rz0O58f4TSXwYLzZ-mZma4BTGuwyF_A1hboKLmr5IXoj30JexJSp7wgSq9eNm5ihZNBTgoA3KPYfjzLQ",
      image:
        "data:image/webp;base64,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",
    },
    {
      name: "5. Hoàn Hảo [HiddenGem Mixtape]",
      singer: "B Ray",
      path: "https://onmyiq.bl.files.1drv.com/y4mBZfPylP3RvYHvlKFkYl_CLEyyDu80doinIbrMxjHE32Wgf9XMXmCiq0YuJ_4lM0KMo9-NwMDU44eA40J-7Mtg2SGozQXwObX8AEHr6cNDBB_iuhT_rvZnqfJ_bFJUtszvWM2I5V4EijORen9peaFzPxXcTfgJN4-NvpHoRV-njuXGX5JDAc6Z9nlf0lxojLbqpFeFgmlZ6Mw9fY5-KJJJQ",
      image:
        "data:image/webp;base64,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",
    },
    {
      name: "6. Boomerang [HiddenGem Mixtape]",
      singer: "B Ray",
      path: "https://onmniq.bl.files.1drv.com/y4mTMDPgxET7WcwGhTSkYIizNDYKJ0gEKrXw1GIV3zC5eAZ1MAwkcpF5bKjQCZ_ih1GOsofetsYIqZPvTP_xpA0Evo2W0GNYEv2WjYGjMaqckvjlkYzwJKSYCOfPwcQpOfD83sj70Umd5aPB0cX95ldFHx_L5deNOY8bP_ZxW2s9XI3SIea5cbZuhmcXQ0CjaXVJNEjX5Fp9oi6saR7NZKB-A",
      image: "https://i.ytimg.com/vi/Lv5pg2t1yiQ/hq720.jpg",
    },
    {
      name: "7. J Cole Nói [HiddenGem Mixtape]",
      singer: "B Ray",
      path: "https://onmdiq.bl.files.1drv.com/y4mPdabh36mjvtCKDf5UH_INoND-9S6g0GZ7xVwRTr2E1ItimQgNdlZy92hdo7_IcOD4wC3Z0rMyhP_btcj1g7LYT9VE6ADqKKlZpI56FXnn1-bHByqOlYqMko_iqqLPGUTrumozsdRKVVi9X_cYihgfltMlVVZYckcb-eWBYaYJmRkiLf7RchZ2US8AH8oWnOmvYdfIIqshSuekbHPcYUERA",
      image:
        "https://i1.sndcdn.com/artworks-z0rFKtmqCUivmHJB-5uxnhw-t500x500.jpg",
    },
    {
      name: "8. The Last Finale. [HiddenGem Mixtape]",
      singer: "B Ray",
      path: "https://onmmiq.bl.files.1drv.com/y4mQ7i1oenWZZPaldzZttspoYPjKuDAHykvezpVKaeE209HiHGgGwg0euZGRBIJse4v4goNMNQRBgDjs7wP-ffI2tAlytigigWgYVwQouZ42b2ARJ9WUI-i3XYeyylHIsd9hcSnezzFUQKqZygPl579qaZuT91z2-1N1EKWHgrB__KzNB63xxnRkgnJFxuv19JLDBsaQGPWLcra3hnEzycEJg",
      image:
        "https://i1.sndcdn.com/artworks-uyRywzFisIyJVtC0-SF3TSA-t500x500.jpg",
    },
  ],
  render() {
    const htmls = this.songs.map(
      (song, index) => `
      <div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index="${index}">
          <div class="thumb"
            style="background-image: url('${song.image}')">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
      `
    );
    playlist.innerHTML = htmls.join("");
  },
  defineProperties() {
    Object.defineProperty(this, "currentSong", {
      get() {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents() {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Handle CD spins / stops
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Handles CD enlargement / reduction
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      const newMarginTop = (newCdWidth / cdWidth) * 8;
      const newMarginBottom = (newCdWidth / cdWidth) * 12;

      cd.style.width = newCdWidth > 0 ? `${newCdWidth}px` : 0;
      cd.style.opacity = newCdWidth / cdWidth;
      cd.style.marginTop = newMarginTop > 0 ? `${newMarginTop}px` : 0;
      cd.style.marginBottom = newMarginBottom > 0 ? `${newMarginBottom}px` : 0;
    };

    // Handle when click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // When the song is played
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // When the song is paused
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // When the song progress changes
    audio.ontimeupdate = function () {
      if (audio.duration) {
        // Check not NaN
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;
      }
    };

    // Handling when seek
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value; // Event of progress
      audio.currentTime = seekTime;
    };

    // When next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      _this.scrollToActiveSong();
      audio.play();
    };

    // When prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      _this.scrollToActiveSong();
      audio.play();
    };

    // Handling on / off random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Handle repeat 1 song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Handle next song when audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Listen to playlist click behavior
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Handle when clicking on the song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          audio.play();
        }

        // Handle when clicking on the song option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong() {
    setTimeout(() => {
      if (this.currentIndex <= 3) {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      } else {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 300);
  },
  loadCurrentSong() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;

    if ($(".song.active")) {
      $(".song.active").classList.remove("active");
    }
    const listSong = $$(".song");
    listSong.forEach((song) => {
      if (Number(song.getAttribute("data-index")) === this.currentIndex) {
        song.classList.add("active");
      }
    });
  },
  loadConfig() {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong() {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start() {
    // Assign configuration from config to application
    this.loadConfig();

    // Display the initial state of the repeat & random button
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);

    // Defines properties for the object
    this.defineProperties();

    // Listening / handling events (DOM events)
    this.handleEvents();

    // Load the first song information into the UI when running the app
    this.loadCurrentSong();

    // Render playlist
    this.render();
  },
};

app.start();
