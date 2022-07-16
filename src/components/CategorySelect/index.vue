<template>
  <div>
    <!-- 三级联动全局组件 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" :model="cForm">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类" :model="cForm">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["show"],
  data() {
    return {
      formInline: {
        user: "",
        region: "",
      },
      list1: [],
      list2: [],
      list3: [],
      //收集分类的id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    async getCategory1List() {
      const result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    async handler1() {
      //清除数据
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      const result = await this.$API.attr.reqCategory2List(
        this.cForm.category1Id
      );
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    async handler2() {
      //清除数据
      this.list3 = [];
      this.cForm.category3Id = "";
      const result = await this.$API.attr.reqCategory3List(
        this.cForm.category2Id
      );
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    async handler3() {
      //向父组件传递id数据
      this.$emit("getCategoryId", this.cForm);
    },
  },
  mounted() {
    this.getCategory1List();
  },
};
</script>

<style>
</style>