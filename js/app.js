// 初始化本地数据
;(function() {
	// todo数据
	var d = window.localStorage.todosData
	if(d === undefined) {
		window.localStorage.todosData = JSON.stringify([])
	}
	// 全选按钮状态
	var a = window.localStorage.allOrNone
	if(a === undefined) {
		window.localStorage.allOrNone = JSON.stringify(false)
	}
})()

var vm = new Vue({
	el: '#app',
	data: {
		todosData: JSON.parse(window.localStorage.todosData) ,
		inputvalue: '',
		hash: '/',
		// 控制全选按钮状态
		allOrNone: JSON.parse(window.localStorage.allOrNone),
	},
	// 计算属性
	computed: {
		// 过滤出未完成任务,并返回数组
		// (active=false表示未完成)
		filterUndone: function() {
			var d = this.todosData
			var l = d.filter(function(item) {
				if(item.active === false) {
					return true
				} else {
					return false
				}
			})
			// console.log('过滤后进行中的任务', l)
			
			return l
		},
		// 过滤出已完成的任务，并返回数组
		filterDone: function() {
			var d = this.todosData
			var l = d.filter(function(item) {
				if(item.active === false) {
					return false
				} else {
					return true
				}
			})

			return l
		},
		// 根据url过滤todos数组，以显示完成/未完成的任务队列
		filterTodos: function() {
			if (this.hash === '/') {
				return this.todosData
			} else if(this.hash === '/active') {
				return this.filterUndone
			} else if(this.hash === '/completed') {
				return this.filterDone
			}
		},
		// 检查todos是否为空，切换全选按钮状态
		detectionTaskIsEmpty: function() {
			var b = this.todosData.length
			// 把全选按钮的激活状态取消
			if (b === 0) {
				this.allOrNone = false
			}
			// 任务列表不为空，返回true
			return b > 0
		}
	},
	// 方法
	methods: {
		// 添加一个todo
		addtodo: function() {
			// 获取input数据
			var inputvalue = this.inputvalue
			// input没有数据不做操作
			if(!inputvalue) {
				return
			}

			// 获取todo数据
			var d = this.todosData
			// 设置新todoId
			var id
			if(d.length) {
				id = (d[d.length - 1].id + 1)
			} else {
				id = 1
			}

			// 存储数据的模板
			var o = {
				id: id,
				content: inputvalue,
				active: false
			}
			// 添加后，watch会检测到todosData改变，会保存数据
			vm.todosData.push(o)
			// 清空input
			this.inputvalue = ''
		},
		// 删除todo
		deltodo: function(id) {
			// console.log(id)
			var d = this.todosData
			// 找到要删除的任务，并删除
			d.forEach(function(item, index) {
				if(item.id === id) {
					d.splice(index, 1)
					return
				}
			})
		},
		// todo完成状态切换
		doneToggle: function(id) {
			var d = this.todosData
			d.forEach((item, index) => {
				if(item.id === id) {
					// 把任务状态取反
					item.active = !item.active
					// 必须使用$set方法，以触发视图更新
					// (由于JS限制，VUE检测不到)
					this.$set(this.todosData, index, item)
					return
				}
			})
		},
		// 清除已完成任务
		clearCompleted: function() {
			this.todosData = this.filterUndone
		},
		// 点击全选按钮，切换任务全选/全不选状态
		allOrNoneTodos: function() {
			var d = this.todosData
			var a = this.allOrNone
			// 全部设置为allOrNone取反
			d.forEach((item, index) => {
				item.active = !a
				this.$set(this.todosData, index, item)
			})
			// 状态保存
			this.allOrNone = !a
		},
		// 更新任务数据
		updateItem: function(data) {
			var id = data[1]
			var c = data[0]

			var d = this.todosData
			d.forEach((item, index) => {
				if (item.id === id) {
					item.content = c
					console.log(item)
					
					this.$set(this.todosData, index, item)
					return
				}
			})
		}
	},
	// 侦听器
	watch: {
		// todos数据发生变化时自动保存
		todosData: function() {
			// console.log('save')
			window.localStorage.todosData = JSON.stringify(this.todosData)
		},
		allOrNone: function() {
			window.localStorage.allOrNone = JSON.stringify(this.allOrNone)
		}
	}
})
// 载入页面时设置一次，vm.hash
;(function() {
	var hash = location.hash
	if (hash === '') {
		vm.hash = '/'
		return
	}
	vm.hash = hash.slice(1)
})()

// url改变时设置
window.addEventListener("hashchange", function() {
	var hash = location.hash
	vm.hash = hash.slice(1)
	// console.log(hash)
})