// 任务列表项
Vue.component('todo-list', {
	props: ['item'],
	data: function() {
		return {
			editValue: this.item.content,
			editActive: false
		}
	},
	template: `
	<li
		
		:class="{completed: item.active}"
		@dblclick="editActive=true"
	>
		<div class="view">
			<input
				class="toggle"
				type="checkbox"
				v-model="item.active"
				@click="$emit('done_toggle', item.id)"
				
			>
			<label v-show="!editActive"> {{ item.content }} </label>
			<button
				class="destroy"
				@click="$emit('deltodo', item.id)"
			></button>
		</div>

		<input
			class="edit"
			v-if="editActive"
			v-model="editValue"
			v-focus
			@blur="editActive = false"
			@keyup.esc="escCancelEdit"
			@keyup.enter="enterChangeValue"
		>
	</li>
	`,
	methods: {
		// 用于按esc取消并恢复任务数据,同时取消编辑状态
		escCancelEdit: function() {
			this.editValue = this.item.content
			// 为false,编辑框消失,恢复任务内容展示
			this.editActive = false
		},
		// 按enter,向上触发事件,并上传需要修改的数据
		enterChangeValue: function() {
			this.$emit('change-value', [this.editValue, this.item.id])
			// 为false,编辑框消失,恢复任务内容展示
			this.editActive = false

		}
	},
	// 自定义指令
	directives: {
		// 用于让编辑框自动获取焦点
		focus: {
		  // 指令的定义
		  inserted: function (el) {
			el.focus()
		  }
		}
	}
})