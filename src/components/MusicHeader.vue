<template>
  <div class="music-header" id='musicheader'>
    <div class="music-header-box" @click="showDetail">
      <img class="music-header-img" :class="{'rotate': isPlaying}"  src='data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXs7Oxc9QatAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg=='  alt="allbum-imgs" ref="img">
      <img class="muisc-header-xiami" src="../assets/xiami_logo.png" alt="xiami-logo">
      <div :class="{'music-header-play-btn': !isPlaying ,'music-header-pause-btn': isPlaying}" @click.stop="play"></div>
    </div>
    <p class="music-header-subtitle">· {{data && data.musicTitle}} ·</p>
    <p class="music-header-audioAlbum">{{data && data.singer}} | {{data && data.album}}</p>
    <h1 class="music-header-title">{{data && data.storyTitle}}</h1>
    <p class="music-header-author">{{data && data.author}}</p>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'music-header',
  props: {
    data: Object,
  },
  computed: {
    ...mapState({
      // title: state => state.music.title,
      // author: state => state.music.author,
      // musicName: state => state.music.musicName,
      audioAuthor: state => state.music.audioAuthor,
      // audioAlbum: state => state.music.audioAlbum,
    }),
    cover() {
      return this.data && this.data.cover;
    },
    isPlaying() {
      return this.data && this.data.playing;
    },
  },
  watch: {
    data() {
      this.$refs.img.src = this.data.cover;
    },
  },
  methods: {
    ...mapMutations(['updateShowMusicPlayer']),
    showDetail() {
      this.$emit('on-item-click');
    },
    play() {
      this.$emit('on-click-play');
    },
  },
};
</script>
<style lang="scss">
@import '../styles/rem.scss';
@import '../styles/animation.css';
img[src=""] {
      opacity: 0;
}
.music-header {
  position: relative;
  padding-top: rem(1080);
  overflow: hidden;
  .music-header-box {
    position: absolute;
    padding: rem(48);
    margin-bottom: rem(110);
    height: rem(1312);
    width: rem(1312);
    top: rem(-360);
    left: rem(-476);
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    box-shadow: rem(8) rem(6) rem(15) rgb(246, 246, 246);
    .music-header-img {
      height: rem(1216);
      width: rem(1216);
      border-radius: 50%;
      filter: brightness(.9);
      animation: rotate 30s linear infinite;
      animation-play-state: paused;
    }
    .rotate {
      animation-play-state: running;
    }
    .muisc-header-xiami {
      position: absolute;
      height: rem(101);
      width: rem(101);
      top: rem(614);
      right: rem(65);
      border-radius: rem(10);
    }
    .music-header-play-btn, .music-header-pause-btn {
      position: absolute;
      height: rem(192);
      width: rem(192);
      top: rem(565);
      right: rem(560);
      border-radius: 50%;
      background: rgba(250, 250, 250, .5);
      &:after {
        content: '';
        display: block;
        position: absolute;
      }
    }
    .music-header-play-btn {
      &:after {
        top: rem(50);
        left: rem(65);
        border-top: rem(46) solid transparent;
        border-right: rem(78) solid transparent;
        border-bottom: rem(46) solid transparent;
        border-left: rem(78) solid white;
      }
    }
    .music-header-pause-btn {
      &:after {
        height: rem(92);
        width: rem(18);
        top: rem(50);
        left: rem(60);
        border-right: rem(30) solid white;
        border-left: rem(30) solid white;
      }
    }
  }
  p {
    text-align: center;
    color: rgb(196, 196, 196);
  }
 .music-header-title {
      padding: 0 rem(60);
      padding-bottom: rem(10);
      padding-top: rem(75);
      text-align: center;
      font-weight: normal;
      font-size: 22px;
      line-height: 1.4;
    }
    .music-header-author {
      margin-top: rem(25);
      margin-bottom: rem(30);
      font-size: 13.2px;
      color: black;
    }
}

</style>
