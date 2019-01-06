// 添加任务栏
Vue.component('header-addtodo', {
	props: ['value'],
	data: function() {
		return {

		}
	},
	template: `
		<header class="header">
			<h1>todos</h1>
			<input
				class="new-todo"
				placeholder="做点什么？('Enter'添加)"
				autofocus
				:value="value"
				@input="$emit('input', $event.target.value)"
				@keydown.enter="$emit('addtodo')"
			>
		</header>
		`
})
