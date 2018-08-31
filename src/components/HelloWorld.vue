<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <form>
      <input type="text" name="username" v-model="username" autocomplete="off">
      <br>
      <input type="password" name="password" v-model="password" autocomplete="off">
      <input style="display:none" type="password" name="password"/>
      <input style="display:none" type="text" name="username"/>
      <br>
      <a href="javascript:;" @click="addUser">提交</a>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      username: '',
      password: ''
    }
  },
  methods: {
    addUser() {
      var username = this.username,
        password = this.password;
      this.$http.post('/api/user/addUser', {
        username: username,
        password: password
      }, {}).then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

</style>
