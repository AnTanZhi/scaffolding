const publicMixin = {
  data() {
    return {
      /* 加载中 */ loading: false,
      /* 总条数 */ total: 0,
      /* 列表数据 */ tableData: [],
      /* 添加/修改按钮加载中 */ btnLoading: false,
      /* 添加/修改对话框 */ addOrUpdateDig: false,
      /* 对话框标题 */ title: "",
      /* 后端返回的当前页 */ current: 0,
      /* 后端返回的总页码 */ pages: 0,
    }
  },
  methods: {
    /**
     * @param {string} 通用查询
     * @param {boolean} total 是否有分页(默认为true)
     */
    publicSelect(total = true) {
      this.loading = true
      this.mixinParams.api[this.mixinParams.name](this.selectParams).then(res => {
        this.tableData = res.data.records || res.data
        this.loading = false
        if (total) {
          this.total = res.data.total
          this.current = res.data.current
          this.pages = res.data.pages
        }
      })
    },
    /**
     * @param {string} 通用移动
     * @param {string} name 接口名字
     * @param {Array} params 参数对象
     */
    publicMove(name, params) {
      this.mixinParams.api[name](params).then(res => {
        this.$message.success('排序成功')
        this.publicSelect(true)
      })
    },
    /**
     * @param {string} 通用添加
     * @param {string} name 接口名字
     * @param {Array} params 参数对象
     * @param {string} url 添加成功后跳转地址 dig是ture的时候可随便填写
     * @param {boolean} dig 是否有弹出层
     */
    publicAdd(name, params, url, dig = true) {
      this.btnLoading = true
      this.mixinParams.api[name](params).then(res => {
        this.$message.success('操作成功')
        this.btnLoading = false
        if (dig) {
          this.addOrUpdateDig = false
          this.publicSelect()
        } else this.$router.push({
          path: url.path,
          query: url.query
        })
      })
    },
    /**
     * @param {string} 通用非空校验
     * @param {string} name ref名字
     */
    publicRules(name) {
      let isOk = false
      this.$refs[name].validate((valid) => {
        if (valid) isOk = true
        else {
          setTimeout(() => {
            let isError = document.getElementsByClassName('is-error')
            isError[0].querySelector('input').focus()
          }, 100)
          isOk = false
        }
      })
      return isOk
    },
    /**
     * @param {string} 通用更改每页显示的数据
     */
    publicSizeSelect(size) {
      this.selectParams.pageSize = size
      this.publicSelect()
    },
    /**
     * @param {string} 通用分页查询
     */
    publicPageSelect(page) {
      this.selectParams.pageIndex = page
      this.publicSelect()
    },
    /**
     * @param {string} 通用解锁
     * @param {string} name 接口名字
     * @param {Array} ids 多个id
     */
    publicUnlock(name, ids) {
      this.mixinParams.api[name](ids).then(res => {
        this.$message.success('解锁成功')
        this.publicSelect()
      })
    },
    /**
    * @param {string} 通用锁定
    * @param {string} name 接口名字
    * @param {Array} ids 多个id
    */
    publicLocked(name, ids) {
      this.mixinParams.api[name](ids).then(res => {
        this.$message.success('锁定成功')
        this.publicSelect()
      })
    },
    /**
    * @param {string} 通用删除
    * @param {string} name 接口名字
    * @param {Array} ids 多个id
    */
    publicDel(name, ids) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.mixinParams.api[name](ids).then(res => {
          this.$message.success('删除成功')
          if (this.selectParams) {
            let pages = Math.ceil(this.total)
            if (this.selectParams.pageIndex == pages && this.selectParams.pageIndex != 1 && this.ids.length == this.total)
              this.selectParams.pageIndex -= 1
          }
          this.publicSelect()
        })
      })
    },
  },
}
export default publicMixin