<template>
  <el-card class="box-card" style="margin: 10px 0">
    <div slot="header" class="clearfix">
      <el-tabs @tab-click="handleClick" class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="setDate('day')">今日</span>
        <span @click="setDate('week')">本周</span>
        <span @click="setDate('month')">本月</span>
        <span @click="setDate('year')">本年</span>
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="date"
          class="date"
          size="mini"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6" class="rightTag">
          <h3>门店{{ title }}排名</h3>
          <ul>
            <li>
              <span class="rindex">1</span>
              <span>肯德基</span>
              <span class="rvalue">1244341</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span>肯德基</span>
              <span class="rvalue">1244341</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span>肯德基</span>
              <span class="rvalue">1244341</span>
            </li>
            <li>
              <span class="rindex">4</span>
              <span>肯德基</span>
              <span class="rvalue">1244341</span>
            </li>
            <li>
              <span class="rindex">5</span>
              <span>肯德基</span>
              <span class="rvalue">1244341</span>
            </li>
            <li>
              <span class="rindex">6</span>
              <span>肯德基</span>
              <span class="rvalue">1244341</span>
            </li>
            <li>
              <span class="rindex">7</span>
              <span>肯德基</span>
              <span class="rvalue">1244341</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      charts: null,
      date: [],
    };
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
  },
  watch: {
    title() {
      this.charts.setOption({
        title: {
          text: this.title + "趋势",
        },
      });
    },
  },
  methods: {
    handleClick() {},
    setDate(mode) {
      switch (mode) {
        case "day":
          const day = dayjs().format("YYYY-MM-DD");
          this.date = [day, day];
          break;
        case "week": {
          const start = dayjs().day(1).format("YYYY-MM-DD");
          const end = dayjs().day(7).format("YYYY-MM-DD");
          this.date = [start, end];
          break;
        }
        case "month": {
          const start = dayjs().startOf("month").format("YYYY-MM-DD");
          const end = dayjs().endOf("month").format("YYYY-MM-DD");
          this.date = [start, end];
          break;
        }
        case "year": {
          const start = dayjs().startOf("year").format("YYYY-MM-DD");
          const end = dayjs().endOf("year").format("YYYY-MM-DD");
          this.date = [start, end];
          break;
        }
        default:
          break;
      }
    },
  },
  mounted() {
    this.charts = echarts.init(this.$refs.charts);
    this.charts.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220, 110, 90, 150, 120, 90],
        },
      ],
    });
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
}
.date {
  width: 250px;
  margin: 0 20px;
}
.right span {
  margin: 0 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
ul li:nth-child(-n + 3) span.rindex {
  background: #000;
  color: white;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
  margin-right: 20px;
}
.rvalue {
  float: right;
}
</style>