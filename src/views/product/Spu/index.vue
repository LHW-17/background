<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0" />
    </el-card>
    <el-card>
      <!-- 此处有三个部分进行切换 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSpu"
          :disabled="!category3Id"
          >添加SPU</el-button
        >
        <el-table :data="records" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改sku"
                @click="updateSpu(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="dialogVisible(row)"
              ></HintButton>
              <el-popconfirm title="确定删除吗？" @onConfirm="deleteSpu(row)">
                <HintButton
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- @size-change="handleSizeChange"
          @current-change="handleCurrentChange" -->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu" />
      <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes" />
    </el-card>
    <el-dialog
      :title="spu.spuName + '的sku列表'"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column
          prop="skuName"
          label="名称"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="200"
        ></el-table-column>
        <el-table-column prop="weight" label="重量"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";

export default {
  name: "Spu",
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      dialogTableVisible: false,
      page: 1,
      limit: 3,
      records: [],
      total: 0,
      scene: 0, //0：spu列表，1 添加spu，2 添加sku
      spu: {},
      skuList: [],
      loading: true,
    };
  },
  methods: {
    //三级联动的自定义事件，将子组件id转递给父组件
    getCategoryId(cForm) {
      const { category1Id, category2Id, category3Id } = cForm;
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      this.getSpuList();
    },
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        //切回列表页
        this.scene = 0;
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //分页器限制
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    addSpu() {
      this.scene = 1;
      //通知子组件spuForm发请求
      this.$refs.spu.addSpuData(this.category3Id);
    },
    updateSpu(row) {
      this.scene = 1;
      //console.log(this);
      //通过ref拿到子组件，访问子组件的方法
      this.$refs.spu.initSpuData(row);
    },
    changeScene({ scene, flag }) {
      this.scene = scene;
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList(1);
      }
    },
    //skuForm自定义事件
    changeScenes(scene) {
      this.scene = scene;
    },
    //删除spu
    async deleteSpu(row) {
      let res = await this.$API.spu.reqDeleteSpu(row.id);
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    //添加sku
    addSku(row) {
      this.scene = 2;
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //查看sku
    async dialogVisible(row) {
      this.dialogTableVisible = true;
      this.spu = row;
      let res = await this.$API.spu.reqSkuList(this.spu.id);
      if (res.code == 200) {
        this.skuList = res.data;
        this.loading = false;
      }
    },
    //弹窗关闭的回调
    close(done) {
      this.loading = true;
      this.skuList = [];
      done();
    },
  },
};
</script>

<style>
</style>