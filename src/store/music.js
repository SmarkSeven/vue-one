// import axios from 'axios';

const music = {
  state: {
    musicId: 0,
    title: undefined, // 文章标题
    author: undefined,  // 文章作者
    musicName: undefined, // 当前展示项的音乐名
    audioAuthor: undefined, // 当前展示项的音乐作者
    audioAlbum: undefined, // 专辑
    playList: [], // 音乐播放列表
    playIndex: -1, // 当前播放项下标
    playState: 'pause',  // 播放状态 pause | playing
    playId: '', // 正在播放的音乐ID
  },
  mutations: {
    updateMusicTitle(state, payload) {
      state.title = payload.title;
    },
    updateMusicId(state, payload) {
      state.musicId = payload.musicId;
    },
    updateMusicName(state, payload) {
      state.musicName = payload.musicName;
    },
    updateAudioAuthor(state, payload) {
      state.audioAuthor = payload.audioAuthor;
    },
    updateAudioAlbum(state, payload) {
      state.audioAlbum = payload.audioAlbum;
    },
    updateWordsAuthor(state, payload) {
      state.author = payload.author;
    },
    updatePlayList(state, payload) {
      state.playList = payload.playList;
    },
    updatePlayIndex(state, payload) {
      state.playIndex = payload.playIndex;
    },
    updatePlayState(state, payload) {
      state.playState = payload.playState;
    },
    updatePlayId(state, payload) {
      state.playId = payload.playId;
    },
  },
  actions: {
    fetchAudioFromXiami({ commit }, payload) {
      /** 在Promise中直接或间接调用Play()都会被手机端Chrome拦截 */
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          const audio = {
            musicName: payload.musicName,
            musicId: payload.musicId,
            musicAuthor: payload.audioAuthor,
            audioUrl: res.data.url,
          };
          commit('updatePlayList', { playList: [audio] });
          commit('updatePlayIndex', { playIndex: 0 });
        }
      };
      // 必须使用同步请求false
      // 否则在手机端Chrome中得到一下错误
      // Uncaught (in promise) DOMException: play() can only be initiated by a user gesture.
      xhr.open('GET', `/xiami/song?id=${payload.musicId}`, false);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(null);
    },
  },
};

export default music;
