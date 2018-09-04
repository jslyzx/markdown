<template>
  <div id="main">
    <ul class="list">
      <li class="icon" v-for="(item,index) in iconList">
        <i :class="item"></i>
        <div class="icon-name">{{item}}</div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      iconList: []
    }
  },
  created() {
    this.$http.get('/api/icon/list')
      .then((response) => {
        var text = response.body
        text = text.replace(/\s/g, '')
        var list = text.match(/icon(-[\w]+){1,4}/g)
        this.iconList = list
      })
  }
}

</script>
<style scoped>
@import url(../assets/css/icon-font.css);
@font-face {
  font-family: FontAwesome;
  src: url(../assets/font/fontawesome-webfont.eot?v=3.2.1);
  src: url(../assets/font/fontawesome-webfont.eot?#iefix&v=3.2.1) format('embedded-opentype'), url(../assets/font/fontawesome-webfont.woff?v=3.2.1) format('woff'), url(../assets/font/fontawesome-webfont.ttf?v=3.2.1) format('truetype');
  font-weight: 400;
  font-style: normal
}
[class^=icon-] {
  font-family: FontAwesome;
}
.icon{
	width: 180px;
	height: 60px;
	border: 1px solid #e2e2e2;
	display: inline-block;
	text-align: center;
	font-size: 14px;
}
.icon i{
	font-size: 20px;
	vertical-align: -webkit-baseline-middle;
}
.icon:hover{
	background-color: #f2f2f2;
}
</style>
