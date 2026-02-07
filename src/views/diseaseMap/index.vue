<template>
  <div class="diseaseMap">
    <!-- 筛选区1 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>患病率分析</span>
      </div>
      <el-form :inline="true" class="inline-form">
        <el-form-item>
          <template #label>
            <span class="required" style="color:red;">*</span> 条件选项
          </template>
          <el-select v-model="barQuery.filterKey" placeholder='选择条件' clearable>
            <el-option
            v-for="key in Object.keys(optionsMap)"
            :key="key"
            :label="key"
            :value="key"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <template #label>
            <span class="required" style="color:red;">*</span> 条件值
          </template>
          <el-select v-model="barQuery.filterValue" placeholder='选择条件值(最多10个)' multiple collapse-tags clearable>
            <el-option
            v-for="item in optionsMap[barQuery.filterKey] || []"
            :key="item"
            :label="item"
            :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button class="analyze-rate-btn" @click="handleDiseaseSearch" :disabled="!isDiseaseRateFormValid">
            患病率分析
          </el-button>
          <el-button @click="resetBar">重置</el-button>
        </el-form-item>

      </el-form>
      <p class="note">注: 传染病样本数据只有得病和NA, 患病率无法计算, 此处略 </p>
    </el-card>

    <!-- 筛选区2 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>疾病分布分析</span>
      </div>
      <el-form :inline="true" class="inline-form">
        <el-form-item>
          <template #label>
            <span class="required" style="color:red;">*</span> 疾病名称
          </template>
          <el-select v-model="pieQuery.diseases" multiple placeholder='选择疾病(最多11个)' collapse-tags>
            <el-option
            v-for="disease in diseaseList"
            :key="disease"
            :label="disease"
            :value="disease"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <template #label>
            <span class="required" style="color:red;">*</span> 条件选项
          </template>
          <el-select v-model="pieQuery.filterKey" placeholder='选择条件' clearable>
            <el-option
            v-for="key in Object.keys(optionsMap)"
            :key="key"
            :label="key"
            :value="key"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button class="analyze-distribute-btn" @click="handleConditionSearch" :disabled="!isDiseaseDistributionFormValid">
            疾病分布分析
          </el-button>
          <el-button @click="resetPie">重置</el-button>
        </el-form-item>

      </el-form>
    </el-card>

    <!-- 图表展示区域 -->
    <div class="chart-container">
      <!-- 患病率柱状图 -->
      <el-card v-if="showBarChart" class="chart-card">
        <template #header>
          <div class="chart-title">
            疾病患病率分析
            <div class="chart-subtitle" v-if="barQuery.filterKey">
              {{barQuery.filterKey}}: {{barQuery.filterValue.join('、') }}
            </div>
          </div>
        </template>
        <div ref="barChart" style="height: 500px;"></div>
      </el-card>

      <!-- 疾病分布饼图组 -->
      <div v-if="showPieChart" class="pie-charts-container">
        <el-card 
          v-for="(pieData, index) in pieChartData" 
          :key="index" 
          class="pie-chart-card"
        >
          <template #header>
            <div class="chart-title">
              疾病分布分析 - {{ pieQuery.diseases }}
              <div class="chart-subtitle" v-if="pieQuery.filterKey">
                条件: {{ pieQuery.filterKey }}
              </div>
            </div>
          </template>
          <div :ref="`pieChart${index}`" style="height: 400px;"></div>
        </el-card>
      </div>

      <!-- 无数据提示 -->
      <el-card v-if="!showBarChart && !showPieChart" class="no-data-card">
        <div class="no-data">
          <i class="el-icon-data-analysis" style="font-size: 48px; margin-bottom: 16px;"></i>
          <div>请选择搜索条件并点击分析按钮查看图表</div>
        </div>
      </el-card>
    </div>

    <!-- 图表区 -->
    <el-card :class="chartClass">
      <div class="chart-header">
        <div class="title">{{ chartTitle }}</div>
        <div class="sub">{{ chartSubtitle }}</div>
      </div>
      <!-- 图表容器 -->
      <div v-show="!chartEmpty" ref="chartArea" class="echart" />
      <!-- 空数据提示 -->
      <div v-if="chartEmpty" class="empty-tip">
        <p> 请选择搜索条件并点击分析按钮查看图表 </p>
      </div>
    </el-card>

  </div>
</template>

<script>
import * as echarts from 'echarts'
import sampleData from '@/data/testSampleInfo.json'

export default {
  name: 'DiseaseAnalysis',
  data() {
    return {
      optionsMap: {
        年龄段: ['≤14', '15-24', '25-34', '35-44', '45-54', '55-64', '≥65'],
        性别: ['女', '男'],
        职业: ['儿童', '干部/职工', '工人', '农民/牧民', '学生', '其他(或不便透露)'],
        '现住址-市/省': ['林芝市', '拉萨市', '四川省'],
        '现住址-县': ['林芝县', '波密县'],
        民族: ['汉族', '藏族'],
        受教育程度: ['小学', '初中或中职', '高中', '大学本科及以上', '专科(或高职)', '文盲或半文盲']
      },
      diseaseList: [
        '红细胞增多症',
        '高血压',
        '高血脂',
        '肥胖',
        '脂肪肝',
        '高尿酸',
        '包虫病',
        '病毒性肝炎',
        '肺结核',
        '流行性感冒',
        '手足口病'
      ],
      // 筛选区1的query（患病率分析表单）
      barQuery: {
        filterKey: '',
        filterValue: []
      },
      // 筛选区2的query（疾病分布分析表单）
      pieQuery: {
        diseases: [],
        filterKey: ''
      },
      // 图表区
      barChart: null,
      pieCharts: [], // 存储多个饼图实例
      showBarChart: false,
      showPieChart: false,
      barChartData: [],
      pieChartData: [],
      loading: false
    }
  },

  computed: {
    // 患病率分析表单有效性验证（用在button上）
    isDiseaseRateFormValid() {
      return this.barQuery.filterKey && 
             this.barQuery.filterValue.length > 0
    },
    // 疾病分布分析表单有效性验证（用在button上）
    isDiseaseDistributionFormValid() {
      return this.pieQuery.diseases.length > 0 && 
             this.pieQuery.filterKey
    }
  },

  mounted() {
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize)
  },

  beforeDestroy() {
    // 组件销毁前清理图表和监听器
    if (this.barChart) {
      this.barChart.dispose()
    }
    this.pieCharts.forEach(chart => {
      if (chart) chart.dispose()
    })
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    // 根据页面大小变换图表大小
    handleResize() {
      if (this.barChart) {
        this.barChart.resize()
      }
      this.pieCharts.forEach(chart => {
        if (chart) chart.resize()
      })
    },


    // 图表初始化
    initBarChart() {
      if (this.barChart) {
        this.barChart.dispose()
      }
      this.barChart = echarts.init(this.$refs.barChart)
    },

    initPieChart(index) {
      if (this.pieCharts[index]) {
        this.pieCharts[index].dispose()
      }
      this.pieCharts[index] = echarts.init(this.$refs[`pieChart${index}`][0])
    },

    // ================== 分析 ==================
    // 柱状图
    async handleDiseaseSearch() {
      try {
        // 通过条件值过滤 sampleData
        const filteredData = sampleData
        .filter(item => this.barQuery.filterValue.includes(item[this.barQuery.filterKey]))
        .map(item => ({
          ...item,
          conditionValue:item[this.barQuery.filterKey] // 新增字段
        }))

        if (filteredData.length > 0) {
          const diseaseNames = [
            '红细胞增多症', '高血压', '高血脂', '肥胖', 
            '脂肪肝', '高尿酸', '包虫病', '病毒性肝炎',
            '肺结核', '流行性感冒', '手足口病'
          ]

          const barData = []

          this.barQuery.filterValue.forEach(conditionValue => {
            const group = filteredData.filter(item => item.conditionValue === conditionValue) // 数据按照条件值分组

            // 对于每个疾病，分别计算diseaseRate和sampleCount
            diseaseNames.forEach(disease => {
              // 样本数：该条件值下有有效数据的数量（非 'NA'/'ND'）
              const validSamples = group.filter(i => i[disease] !== 'NA' && i[disease] !== 'ND')
              const sampleCount = validSamples.length
              // 患病数：值为非0的数量；患病率：患病数/样本数（非0）
              const diseaseCount = validSamples.filter(i => Number(i[disease]) > 0).length
              const diseaseRate = sampleCount > 0 ? (diseaseCount / sampleCount * 100).toFixed(2) : 0

              barData.push({
                conditionValue,
                diseaseName: disease,
                sampleCount,
                diseaseRate: Number(diseaseRate)
              })
            })
          })

          this.barChartData = barData
          this.showBarChart = true
          this.showPieChart = false
          
          this.$nextTick(() => {
            this.initBarChart()
            this.renderBarChart()
          })

          this.$message.success(`获取到 ${barData.length} 条数据`)
        } 
        else {
          this.$message.warning('暂无相关数据')
          this.showBarChart = false
        }
      } 
      catch (error) {
        console.error('获取患病率数据失败:', error)
        this.$message.error('获取数据失败，请检查网络连接')
      } 
      finally {
        this.loading = false
      }
    },

    // 饼图
    async handleConditionSearch() {
      try {
        const allData = this.pieQuery.diseases.map(disease => {
          // 按照条件选项（filterKey）把 sampleData 分组
          // 生成类似 {'≤14': [item1, item5, item8],
          //          '15-24': [item2, item3]...}
          const groups = {}
          sampleData.forEach(item => {
            const conditionValue = item[this.pieQuery.filterKey]
            if (!groups[conditionValue]){
              groups[conditionValue] = []
            }
            groups[conditionValue].push(item) // 如果该条件不存在，则创建空数组，把相应数据放进去
          })

          // 统计每个条件值下该疾病人数
          const data = Object.keys(groups).map(val => {
            const validSamples = groups[val].filter(i => i[disease] !== 'NA' && i[disease] !== 'ND')
            const diseaseCount = validSamples.filter(i => Number(i[disease]) > 0).length
            return {
              name: val,
              value: diseaseCount
            }
          })

          diseases: this.pieQuery.diseases[index],
          data: res.data || []
        })

        if (allData.some(item => item.data.length > 0)) {
          this.pieChartData = allData
          this.showPieChart = true
          this.showBarChart = false
          
          this.$nextTick(() => {
            this.pieCharts = []
            this.pieChartData.forEach((_, index) => {
              this.initPieChart(index)
              this.renderPieChart(index)
            })
          })

          this.$message.success(`获取到 ${allData.length} 个疾病的分布数据`)
        } else {
          this.$message.warning('暂无相关数据')
          this.showPieChart = false
        }
      } catch (error) {
        console.error('获取疾病分布数据失败:', error)
        this.$message.error('数据获取失败，请检查网络连接')
      } finally {
        this.loading = false
      }
    },

    // ================== 渲染图表 ==================
    // 柱状图
    renderBarChart() {
      if (!this.barChart) return

      // 按条件值（conditionValue）分组数据
      // 得到类似 {"≤14": [...符合≤14的数据], ......}
      const conditionGroups = {}
      this.barChartData.forEach(item => {
        if (!conditionGroups[item.conditionValue]) { //检查 conditionGroups 里有没有当前 item.conditionValue 的数组；
          conditionGroups[item.conditionValue] = [] // 如果没有，就创建一个空数组
        }
        conditionGroups[item.conditionValue].push(item)
      })

      // 取出每个数据组的 Keys（组名"≤14"），为每组生成一个系列
      // Object 是 JavaScript 内置的全局对象，本身有很多静态方法，比如：Object.keys(obj) → 返回对象的键名数组
      const series = Object.keys(conditionGroups).map((conditionValue, index) => ({ // index：对应数组元素在数组里的下标
        name: conditionValue,
        type: 'bar',
        data: conditionGroups[conditionValue].map(item => ({
          value: item.diseaseRate, // 新增字段
          sampleCount: item.sampleCount
        })),
        itemStyle: {
          color: [
            '#5470c6', '#91cc75', '#ee6666', '#fac858', '#73c0de',
            '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#1e90ff'
            ][index % 10] // 取余运算，颜色在这十个之间循环
          }
      }))

      const option = {
        title: {
          text: `患病率对比`,
          left: 'center',
          padding: [-10, 0, 10, 0]
          
        },
        tooltip: {
          trigger: 'axis', // 鼠标悬停显示整条轴上的信息
          axisPointer: {
            type: 'shadow' // 鼠标悬停时显示阴影高亮对应的柱子
          }
        },
        legend: {
          data: Object.keys(conditionGroups),
          top: '30'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: conditionGroups[Object.keys(conditionGroups)[0]].map(item => item.diseaseName), // 只取第一个条件值的数据作为横轴类别
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: '患病率(%)'
        },
        series: series
      }
      this.barChart.setOption(option, true) // 渲染
    },

    // 饼图
    renderPieChart(index) {
      if (!this.pieCharts[index]) return      
      const pieData = this.pieChartData[index]
      const option = {
        title: {
          text: pieData.diseases,
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}例 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle',
          type: 'scroll'
        },
        series: [{
          name: '病例分布',
          type: 'pie',
          radius: '50%',
          data: pieData.data.map(item => ({
            name: item.filterKey,
            value: item.conditionValue
          })),
          color: [
            '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae',
            '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570',
            '#c4ccd3', '#f05b72', '#ef5b9c', '#f47920', '#905a3d',
            '#fab27b', '#2a5caa', '#444693', '#726930', '#b2d235'
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            formatter: '{b}: {c}例 ({d}%)'
          }
        }]
      }
      this.pieCharts[index].setOption(option, true)
    },

    // ================== 重置图表 ==================
    // 柱状图
    resetBar() {
      this.barQuery = {
        filterKey: '',
        filterValue: []
      }
      this.showBarChart = false
      if (this.barChart) {
        this.barChart.dispose()
        this.barChart = null
      }
    },
    // 饼图
    resetPie() {
      this.pieQuery = {
        diseases: [],
        filterKey: ''
      }
      this.showPieChart = false
      this.pieCharts.forEach(chart => {
        if (chart) chart.dispose()
      })
      this.pieCharts = []
    }
  }
}
</script>

<style scoped>
.diseaseMap {
  padding: 20px;
}

/* 筛选卡片区域 */
.box-card {
  margin: 20px 0;              /* 卡片之间上下留空 */
  padding-bottom: 10px;
  border-radius: 10px;         /* 圆角 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12); /* 阴影 */
}
.box-card .clearfix {
  padding: 5px 10px;
  font-weight: 600;            /* 字体加粗 */
}

.inline-form {
  padding: 12px 14px;
}

.note {
  color: #777;
  margin-left: 14px;
  font-size: 13px;
}

.el-button + .el-button {
  margin-left: 10px;
}

.analyze-rate-btn {
  background-color: #4c91ea;
  border-color: #4c91ea;
  color: white;
}
.analyze-rate-btn:hover {
  background-color: #4c91ea;
  border-color: #4c91ea;
}

.analyze-distribute-btn {
  background-color: #5bd2cc;
  border-color: #5bd2cc;
  color: white;
}
.analyze-distribute-btn:hover {
  background-color: #5bd2cc;
  border-color: #5bd2cc;
}

/* 图表展示区域 */
.chart-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
}

.pie-charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 20px;
}

.pie-chart-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.chart-subtitle {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  font-weight: normal;
}

.no-data-card {
  text-align: center;
  padding: 60px 20px;
  background-color: #fafafa;
}

.no-data {
  font-size: 16px;
  color: #909399;
}

</style>
