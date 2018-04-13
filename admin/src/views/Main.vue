<template>
	<section>
		欢迎 {{ user.username }} 登录到后台~
	</section>
</template>

<script>
	export default {
		name: 'Main',
		data () {
			return {
				user: {}
			}
		},
		created () {
			this.user = JSON.parse(sessionStorage.getItem('user'));
		}
	}

</script>

<style scoped>

</style>