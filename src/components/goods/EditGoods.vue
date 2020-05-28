<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>商品修改</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="修改商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :space="200" :active="activeIndex-0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <el-form
        label-position="top"
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-tabs @tab-click="tabClicked" :tab-position="'left'" v-model="activeIndex">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名" prop="goods_name">
              <el-input v-model="editForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="editForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="editForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="editForm.goods_number" type="number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              v-model="item.attr_vals"
              :key="item.attr_id"
            >
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border v-for="(cb,i) in item.attr_vals" :key="i" :label="cb"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片上传到后端的哪个api接口 -->
            <el-upload
              :file-list="pics"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
              :headers="headerObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑组件 -->
            <quill-editor v-model="editForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="edit" class="btnedit">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="PreviewDialogVisible" width="50%">
      <img :src="previewPath" alt="🤮" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      // 当前进度
      activeIndex: 0,
      //   修改表单
      editForm: {},
      //   添加表单的校验规则
      editFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入重量', trigger: 'blur' }
        ]
      },
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //   动态参数
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
      // 后端接受图片的地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // token
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      PreviewDialogVisible: false
    }
  },
  methods: {
    getinfo() {
      this.goods = this.$route.query.row
      // console.log(this.$route.query.row)
      this.getGoods()
    },
    async getGoods() {
      const { data: res } = await this.$http.put(
        'goods/' + this.goods.goods_id + '/attributes'
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品信息失败')
      }
      console.log(res.data)

      this.editForm = res.data
    },
    editGoods() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.put('goods', this.editForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
      })
    },
    // catChange() {
    //   if (this.editForm.goods_cat.length !== 3) this.editForm.goods_cat = []
    // },
    // beforeTabsLeave(activeName, oldActiveName) {
    //   //   console.log('即将离开的标签页是' + oldActiveName)
    //   //   console.log('即将进入的标签页是' + activeName)
    //   //   return true
    //   if (oldActiveName === '0' && this.editForm.goods_cat.length !== 3) {
    //     this.$message.error('请选择商品分类')
    //     return false
    //   }

    //   return true
    // },
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        }
        console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    // 处理移除图片的操作
    handleRemove(file, fileList) {
      console.log(file, fileList)
      const filePath = file.response.data.tmp_path
      const i = this.editForm.pics.findIndex(x => x.pic === filePath)
      this.editForm.pics.splice(i, 1)
    },
    // 处理预览图片的效果
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.PreviewDialogVisible = true
    },
    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path }
      this.editForm.pics.push(picInfo)
      console.log(this.editForm)
    },
    // 添加商品
    edit() {
      // console.log(this.editForm)
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        const form = _.cloneDeep(this.editForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.editForm.attrs.push(newInfo)
        })
        form.attrs = this.editForm.attrs
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.editForm.attrs.push(newInfo)
        })

        form.attrs = this.editForm.attrs
        console.log(form)
        const { data: res } = await this.$http.post('goods', form)
        console.log(res.data)

        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加成功')
        this.$router.push('/goods')
      })
    }
  },
  created() {
    // this.getCateList()
    this.getinfo()
  },
  computed: {
    cateId() {
      return this.editForm.cat_three_id
    },
    pics() {
      var picslist = []
      this.editForm.pics.forEach(it => {
        picslist.push({ id: it.pics_id, url: it.pics_big_url })
      })
      return picslist
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}

.previewImg {
  width: 100%;
}
.btnedit {
  margin-top: 15px;
}
</style>>
