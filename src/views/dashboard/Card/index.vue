<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥126560">
            <template slot="charts">
              <span
                >周同比&nbsp;&nbsp;56.67%
                <svg
                  t="1657809443439"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="12077"
                  width="12"
                  height="12"
                >
                  <path
                    d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"
                    p-id="12078"
                    fill="#1afa29"
                  ></path>
                </svg>
              </span>
              &nbsp;&nbsp;
              <span
                >日同比&nbsp;&nbsp;19.96%
                <svg
                  t="1657808380786"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="10802"
                  width="12"
                  height="12"
                >
                  <path
                    d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
                    p-id="10803"
                    fill="#d81e06"
                  ></path></svg
              ></span>
            </template>
            <template slot="footer">
              <span>日销售额￥ 12032</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <lineChart></lineChart>
            </template>

            <template slot="footer">
              <span>日访问量 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <barChart></barChart>
            </template>
            <template slot="footer">
              <span>转化率 65%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <progressChart></progressChart>
            </template>
            <template slot="footer">
              <span
                >周同比&nbsp;&nbsp;56.67%
                <svg
                  t="1657808414893"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="11818"
                  width="12"
                  height="12"
                >
                  <path
                    d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"
                    p-id="11819"
                    fill="#1afa29"
                  ></path>
                </svg>
              </span>
              &nbsp;&nbsp;
              <span
                >日同比&nbsp;&nbsp;19.96%
                <svg
                  t="1657808380786"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="10802"
                  width="12"
                  height="12"
                >
                  <path
                    d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
                    p-id="10803"
                    fill="#d81e06"
                  ></path></svg
              ></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import lineChart from "./lineChart";
import barChart from "./barCharts";
import progressChart from "./progressChart";
export default {
  name: "Card",
  components: {
    Detail,
    lineChart,
    barChart,
    progressChart,
  },
};
</script>

<style>
</style>