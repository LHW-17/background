<template>
  <div>
    <!-- 按钮组件 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 表格组件 -->
    <el-table :data="list" style="width: 100%" border>
      <el-table-column
        type="index"
        prop="prop"
        label="序号"
        width="80px"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌logo" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 page-count:连续页码数-->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :page-count="5"
      layout="prev, pager, next, jumper, ->,sizes, total"
      :total="total"
    >
    </el-pagination>
    <!-- 弹出对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogVisible"
      width="width"
      :before-close="dialogBeforeClose"
    >
      <!-- form表单的:model属性作用是把表单的数据收集到那个对象身上，同时用于表单验证 -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <!-- 上传图片组件 
           action属性为设置图片上传地址
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      page: 1,
      limit: 3,
      //总数据条数
      total: 0,
      list: [],
      //显示或隐藏对话框
      dialogVisible: false,

      //命名要与服务端配合
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      //表单验证的规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2到10个字符", trigger: "change" },
        ],
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  methods: {
    //获取列表数据
    async getPageList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.reqTradeMarkList(
        this.page,
        this.limit
      );
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //添加按钮的点击事件
    showDialog() {
      this.dialogVisible = true;
      //清除上次数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //修改品牌信息
    updateTradeMark(row) {
      this.dialogVisible = true;
      this.tmForm = { ...row };
    },
    //dialog相关回调
    dialogBeforeClose() {
      this.dialogVisible = false;
    },
    //上传图片相关的回调
    handleAvatarSuccess(res, file) {
      //res，file是上传成功后返回前端的数据
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加或修改品牌
    addOrUpdateTradeMark() {
      //表单验证通过后才可以进入下一步
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          this.dialogVisible = false;
          //发请求(添加或修改)
          const result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            //弹出信息 再次获取列表
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            this.getPageList(this.tmForm.id ? this.page : 1);
            return "ok";
          } else {
            return Promise.reject(new Error("faile"));
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除品牌信息
    deleteTradeMark(row) {
      // 弹框
      this.$confirm(`你确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //发请求删除
          const result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {
    this.getPageList();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>