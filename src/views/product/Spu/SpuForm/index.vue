<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in trademarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 照片墙 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
            v-for="unSelect in unSelectSaleAttr"
            :key="unSelect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="" label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- input和button 只显示一个
              @keyup.enter.native="handleInputConfirm(row)" -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      //收集未选择的销售属性的id
      attrIdAndAttrName: "",
      //Tag用到的数据
      inputValue: "",
      //
      dialogImageUrl: "",
      dialogVisible: false,
      //spu信息属性 修改时为服务器返回的数据，添加时使用默认
      spu: {
        category3Id: 0,
        description: "",
        tmId: "",
        spuImageList: [
          {
            id: 0,
            imgName: "",
            imgUrl: "",
            spuId: 0,
          },
        ],
        spuName: "",
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "",
          //       saleAttrName: "",
          //       saleAttrValueName: "",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      trademarkList: [],
      spuImageList: [],
      saleAttrList: [],
    };
  },
  computed: {
    unSelectSaleAttr() {
      //未选择的销售属性
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
  methods: {
    //照片墙新增图片功能回调
    handleSuccess(response, file, fileList) {
      //收集数据
      this.spuImageList = fileList;
    },
    //照片墙删除功能回调
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },
    //照片墙预览功能回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //初始化spuForm数据
    async initSpuData(spu) {
      //发请求拿数据 spu
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      } else {
        return Promise.reject(new Error("spu faile"));
      }
      //获取品牌信息
      let trademarkResult = await this.$API.spu.reqTrademarkList();
      if (trademarkResult.code == 200) {
        this.trademarkList = trademarkResult.data;
      } else {
        return Promise.reject(new Error("trademark faile"));
      }
      //获取spu图片数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      } else {
        return Promise.reject(new Error("image faile"));
      }
      //获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      } else {
        return Promise.reject(new Error("saleList faile"));
      }
    },
    //添加销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      //向spu对象添加新属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      this.attrIdAndAttrName = "";
    },

    //elementui Tag

    //添加按钮的回调
    addSaleAttrValue(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },
    //失焦事件回调
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      //新增属性判断
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      //属性值不能重复
      let res = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue.trim()
      );
      if (!res) {
        this.$message("属性值不能重复");
        return;
      }

      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      row.inputVisible = false;
    },
    //保存按钮回调
    async addOrUpdateSpu() {
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      let res = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (res.code == 200) {
        this.$message({ type: "success", message: "保存成功" });
        //回到上一级
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
        //初始化数据
        Object.assign(this._data, this.$options.data());
      }
    },
    //父组件添加spu获取数据回调
    async addSpuData(category3Id) {
      //获取品牌信息
      let trademarkResult = await this.$API.spu.reqTrademarkList();
      if (trademarkResult.code == 200) {
        this.trademarkList = trademarkResult.data;
      } else {
        return Promise.reject(new Error("trademark faile"));
      }
      //获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      } else {
        return Promise.reject(new Error("saleList faile"));
      }
      //获取category3Id
      this.spu.category3Id = category3Id;
    },
    //取消的回调
    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "" });
      //初始化数据 组件实例this._data可以操作data中的响应式数据
      //this.$options可以获取配置对象，配置对象中的data函数执行，返回的响应式数据为空
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>