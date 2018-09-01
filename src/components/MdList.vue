<template>
    <div class='md-list'>
        <div class="md" v-for="(item,index) in mdList">
            <div class="md-head">
                <span class="author">作者：{{item.author}}</span>
                <span class="time">创建时间：{{item.create_time}}</span>
            </div>
            <div class="md-cont">
                <router-link :to="{ path: 'article/' + item.id }">
                    {{item.title}}
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
            return {
                mdList: []
            }
        },
        mounted() {
            var that = this
            this.$nextTick(() => {
                this.$http.get('/api/article/listArticles')
                    .then((response) => {
                        console.log(response)
                        that.mdList = response.body
                    })
            })
        }
}
</script>
<style scoped>
@import url(../assets/css/list.css);
</style>
