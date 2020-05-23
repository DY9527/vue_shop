<!--  -->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意:只允许为第三级分类设置相关参数!" show-icon :closable="false" type="warning"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="selectedCateKeys"
            :props="cateProps"
            :options="catelist"
            @change="handleCange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab标签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button
            type="primary"
            @click="addDialogVisible=true"
            size="mini"
            :disabled="isBtnDisabled"
          >添加参数</el-button>
          <!-- 动态参数列表 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  closable
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 新标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column v-slot="scope" label="操作">
              <template>
                <el-button
                  type="primary"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  icon="el-icon-edit"
                >修改</el-button>
                <el-button
                  @click="removeParams(scope.row.attr_id)"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button
            type="primary"
            @click="addDialogVisible=true"
            size="mini"
            :disabled="isBtnDisabled"
          >添加属性</el-button>
          <!-- 静态参数列表 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  closable
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 新标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  icon="el-icon-edit"
                >修改</el-button>
                <el-button
                  type="danger"
                  @click="removeParams(scope.row.attr_id)"
                  size="mini"
                  icon="el-icon-delete"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主题区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主题区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      catelist: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      selectedCateKeys: [],
      //   被激活的标签页
      activeName: 'many',
      // 动态参数
      manyTableData: [],
      // 静态参数
      onlyTableData: [],
      // 添加对话框
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 添加表单的验证规则
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      },
      editForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data
      console.log(this.catelist)
    },
    async handleCange() {
      console.log(this.selectedCateKeys)
      //   只允许选中三级
      this.getParamsData()
    },
    // tab 页签点击事件
    handleTabClick() {
      console.log(this.activeName)
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return null
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框输入的值
        item.inputValue = ''
      })
      console.log(res.data.attr_vals)
      if (this.activeName === 'many') this.manyTableData = res.data
      else this.onlyTableData = res.data
    },
    // 监听添加参数对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },

    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return null
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 展示修改的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 重置修改表单
    editialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改参数
    editParams() {
      console.log(this.editForm)

      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return null
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改成功')
        this.editDialogVisible = false
        this.getParamsData()
      })
    },
    async removeParams(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.error('已取消删除！')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功')
      this.getParamsData()
    },
    showInput(row) {
      row.inputVisible = true
      // $nextTick 当页面上元素被重新渲染后才会执行回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return null
      }
      // 如果没有return 做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
      row.inputValue = ''
      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改成功！')
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) return this.selectedCateKeys[2]
      return null
    },
    titleText() {
      if (this.activeName === 'many') return '动态参数'
      else return '静态属性'
    }
  }
}
</script>
<style lang=less scoped>
.cat_opt {
  margin: 15px 0px;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>
