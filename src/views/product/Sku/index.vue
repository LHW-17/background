<template>
  <div>
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column
      ><el-table-column prop="skuName" label="名称" width="width">
      </el-table-column
      ><el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column
      ><el-table-column prop="prop" label="默认图片" width="110">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px" />
        </template> </el-table-column
      ><el-table-column prop="weight" label="重量" width="80"> </el-table-column
      ><el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="success"
            icon="el-icon-download"
            size="mini"
            v-if="row.isSale == 1"
            @click="cancelSale(row.id)"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-upload2"
            size="mini"
            v-else
            @click="sale(row.id)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="$message('正在开发中')"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="getSkuInfo(row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器@size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes,total"
      :total="total"
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="getSkuList"
    >
    </el-pagination>
    <el-drawer :visible.sync="drawer" :show-close="true" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="attr in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin-right: 10px"
            >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="400px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" alt="" style="width: 100%" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,
      records: [],
      total: 0,
      skuInfo: {},
      drawer: false,
    };
  },
  methods: {
    //分页器
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    async getSkuList(pages = 1) {
      this.page = pages;
      let res = await this.$API.sku.reqSkuList(this.page, this.limit);
      if (res.code == 200) {
        this.total = res.data.total;
        this.records = res.data.records;
      }
    },
    //点击事件回调
    async sale(skuId) {
      let res = await this.$API.sku.reqSale(skuId);
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: "上架成功",
        });
      }
      this.getSkuList();
    },
    async cancelSale(skuId) {
      let res = await this.$API.sku.reqCancel(skuId);
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: "下架成功",
        });
      }
      this.getSkuList();
    },
    async getSkuInfo(skuId) {
      this.drawer = true;
      let res = await this.$API.sku.reqSkuById(skuId);
      if (res.code == 200) {
        this.skuInfo = res.data;
      }
    },
  },
  mounted() {
    this.getSkuList();
  },
};
</script>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}
div >>> .el-carousel__button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
}
</style>
<style>
/* 轮播图样式 */
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>