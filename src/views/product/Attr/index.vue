<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 展示表格 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 15px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteAttr(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0px"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="prop"
            align="center"
            label="属性值名称"
            width="width"
          >
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template></el-table-column
          >
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//引入深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowTable: true,
      //新增或修改属性使用的参数
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 0,
      },
    };
  },
  methods: {
    getCategoryId(cForm) {
      const { category1Id, category2Id, category3Id } = cForm;
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      this.getAttrList();
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      //发请求获取数据
      const result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    addAttr() {
      this.isShowTable = false;
      //清除原数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
      //收集三级分类id
    },
    updateAttr(row) {
      this.isShowTable = false;
      //展示原数据
      this.attrInfo = cloneDeep(row);
      //为属性值添加flag标记
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id || undefined,
        valueName: "",
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    toLook(row) {
      //若属性值为空，则不能变为查看模式
      if (row.valueName.trim() == "") {
        this.$message("请输入一个非空属性值");
        return;
      }
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat) {
        this.$message("属性值重复");
        return;
      }
      row.flag = false;
    },
    toEdit(row, index) {
      row.flag = true;
      //获取input节点聚焦
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    deleteAttr() {},
    //气泡确认框的确认回调
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    async addOrUpdateAttr() {
      //整理参数 去除空属性值
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          //过滤属性值为空的
          if (item.valueName != "") {
            //删除flag属性
            delete item.flag;
            return true;
          }
        }
      );
      //发请求
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.$message({ type: "success", message: "保存成功" });
        this.getAttrList();
        this.isShowTable = true;
      } catch (error) {
        this.$message({ type: "warning", message: `${error.message}` });
      }
    },
  },
};
</script>

<style>
</style>