<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80"> </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设置默认</el-button
              >
              <el-button type="" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      //存储图片的信息
      spuImageList: [],
      //存储销售属性
      spuSaleAttrList: [],
      //平台属性的数据
      attrInfoList: [],
      skuInfo: {
        category3Id: 0,
        price: 0,
        spuId: 0,
        tmId: 0,
        skuName: "",
        weight: "",
        skuDefaultImg: "",
        skuDesc: "",

        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "",
          // },
        ],

        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   isDefault: "",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],

        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu: {},
      //收集图片数据
      imageList: [],
    };
  },
  methods: {
    //获取数据
    async getData(category1Id, category2Id, spu) {
      //收集已有数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;

      Promise.all([
        this.$API.spu.reqSpuImageList(spu.id),
        this.$API.spu.reqSpuSaleAttrList(spu.id),
        this.$API.spu.reqAttrInfoList(
          category1Id,
          category2Id,
          spu.category3Id
        ),
      ]).then((values) => {
        if (values[0].code == 200) {
          let list = values[0].data;
          list.forEach((item) => {
            item.isDefault = 0;
          });
          this.spuImageList = list;
        }
        if (values[1].code == 200) {
          this.spuSaleAttrList = values[1].data;
        }
        if (values[2].code == 200) {
          this.attrInfoList = values[2].data;
        }
      });
    },
    //table复选框事件回调
    handleSelectionChange(params) {
      this.imageList = params;
    },
    //改变default数据
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //取消按钮的回调
    cancel() {
      this.$emit("changeScenes", 0);
      Object.assign(this._data, this.$options.data());
    },
    //保存按钮的回调
    async save() {
      //整理数据
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.attrIdAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      //整理图片列表
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      //发请求
      let res = await this.$API.spu.reqAddSku(skuInfo);
      if (res.code == 200) {
        this.$message({ type: "success", message: "添加SKU成功" });
        this.$emit("changeScenes", 0);
      }
    },
  },
};
</script>

<style>
</style>