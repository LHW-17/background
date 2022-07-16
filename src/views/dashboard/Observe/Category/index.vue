<template>
  <el-card>
    <div slot="header">
      <div class="category-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="radioData">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="chart" ref="chart"></div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Category",
  data() {
    return {
      radioData: "全部渠道",
    };
  },
  mounted() {
    let chart = echarts.init(this.$refs.chart);
    chart.setOption({
      title: {
        text: "视频",
        subtext: "1048",
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },

      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },

          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "1" },
            { value: 735, name: "2" },
            { value: 580, name: "3" },
            { value: 484, name: "4" },
            { value: 300, name: "5" },
          ],
        },
      ],
    });
    chart.on("mouseover", (params) => {
      const { name, value } = params.data;
      chart.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
  },
};
</script>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chart {
  width: 100%;
  height: 300px;
}
</style>