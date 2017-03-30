<template>
  <div id="music-page">
    <header-bar :leftOptions="leftOptions" title="一个音乐"></header-bar>
    <music-header :cover="cover"></music-header>
    <hp :content="content" :hpAuthorIntroduce="hpAuthorIntroduce" :copyright="copyright"></hp>
    <author v-for="(author, index) in authors" :author="author" @on-click-item="toAuthor" :key="author.user_id"></author>
    <related-label v-if="related.length > 0"></related-label>
    <related v-for="(item,index) in related" :related="item" tag="音乐" @on-clicke-item="toRelated" :key="item.id"></related>
    <comment-label></comment-label>
    <comment v-for="(comment,index) in comments" :comment="comment" :key="comment.id"></comment>
    <footer-bar :data="footerData"></footer-bar>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Author from './Author';
import CommentLabel from './CommentLabel';
import Comment from './Comment';
import RelatedLabel from './RelatedLabel';
import Related from './Related';
import FooterBar from './FooterBar';
import HeaderBar from './HeaderBar';
import MusicHeader from './MusicHeader';
import Hp from './Hp';

export default{
  components: {
    HeaderBar,
    MusicHeader,
    Hp,
    Author,
    CommentLabel,
    Comment,
    RelatedLabel,
    Related,
    FooterBar,
  },
  data() {
    return {
      music: null,
      authors: [],
      comments: [],
      related: [],
      leftOptions: {
        showBack: true,
      },
      update: {
        praisenum: 0,
        sharenum: 0,
        commentnum: 0,
      },
    };
  },
  computed: {
    ...mapState({
      path: state => state.route.path,
      host: state => state.one.host,
      basicQueryString: state => state.one.basicQueryString,
      musicId: state => state.music.musicId,
      author: state => state.music.author,
    }),
    title() {
      return this.music && this.music.title;
    },
    cover() {
      return this.music && this.music.cover;
    },
    authors() {
      return this.authors;
    },
    content() {
      return this.music && this.music.story.replace(/style="height:\d+px; width:\d+px"/g, '');
    },
    authorName() {
      return `文╱${this.music.hp_author}`;
    },
    copyright() {
      return '责任编辑：十三妹 shisanmei@wufazhuce.com';
    },
    hpAuthorIntroduce() {
      return this.essay && `${this.msuic.hp_author_introduce}${this.music.editor_email}`;
    },
    footerData() {
      return this.music && this.update && {
        contentId: this.music.id,
        category: this.music.content_type,
        praisenum: this.update.praisenum,
        commentnum: this.update.commentnum,
      };
    },
  },
  beforeRouteEnter(to, from, next) {
    // 音乐内容ID
    const contentId = to.params.id;
    next((vm) => {
      // 获取music数据
      vm.getData(contentId, vm.musicId);
    });
  },
  beforeRouteUpdate(to, from, next) {
    const contentId = to.params.id;
    this.getData(contentId);
    next();
  },
  methods: {
    getData(contentId, musicId) {
      this.getMusicData(musicId);
      this.getAuthorList(contentId);
      this.getCommentData(contentId);
      this.getRelated(contentId);
      this.getUpdate(contentId);
    },
    async getMusicData(musicId) {
      try {
        const resp = await this.$http.get(`${this.host}/xiami/${musicId}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.music = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getAuthorList(contentId) {
      try {
        const resp = await this.$http.get(`${this.host}/author/list?content_id=${contentId}&category=4${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.authors = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getCommentData(contentId) {
      try {
        const resp = await this.$http.get(`${this.host}/comment/praiseandtime/music/${contentId}/0?${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.comments = result.data.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getRelated(contentId) {
      try {
        const resp = await this.$http.get(`${this.host}/related/music/${contentId}?${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.related = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getUpdate(contentId) {
      const dateString = new Date().toLocaleString().replace(/[\u4e00-\u9fa5]/g, '').replace(/\//g, '-');
      try {
        const resp = await this.$http.get(`${this.host}/music/update/${contentId}/${dateString}?${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.update = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    toAuthor() {
    },
    toRelated(relatedId) {
      // 跳转推荐页面
      console.log('go!');
      this.$router.push({ path: `/music/${relatedId}` });
    },
  },
};
</script>
<style lang="scss">
 @import '../styles/rem.scss';
#music-page {
    padding-bottom: rem(135);
}
</style>