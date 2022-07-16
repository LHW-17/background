<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "progressChart",
  mounted() {
    const lineChart = echarts.init(this.$refs.charts);
    lineChart.setOption({
      xAxis: {
        show: false,
        //最大值与最小值
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        //均分
        type: "category",
      },

      series: [
        {
          type: "bar",
          data: [78],
          color: "blue",
          barWidth: 12,
          showBackground: true,
          backgroundStyle: {
            color: "#eee",
          },
          label: {
            show: true,
            formatter: "|",
            position: "right",
          },
        },
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      tooltip: {},
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>