<template>
  <div class="app-container">
    <!-- ⭐ 筛选条件区域 -->
    <div class="filter-container">
      <el-form :inline="true" :model="query">

        <!-- 样本编号 -->
        <el-form-item label="样本编号">
          <el-input v-model="query.sampleId" placeholder="输入样本编号" />
        </el-form-item>

        <!-- 现住址 -->
        <el-form-item label="现住址（省/市）">
          <el-select v-model="query.city" placeholder="请选择省/市">
            <el-option label="林芝市" value="林芝市" />
            <el-option label="拉萨市" value="拉萨市" />
            <el-option label="四川省" value="四川省" />
          </el-select>
        </el-form-item>

        <el-form-item label="现住址（县）">
          <el-select v-model="query.county" placeholder="请选择县">
            <el-option label="波密县" value="波密县" />
            <el-option label="林芝县" value="林芝县" />
          </el-select>
        </el-form-item>

        <el-form-item label="民族">
          <el-select v-model="query.ethnicity" placeholder="请选择民族">
            <el-option label="汉族" value="汉族" />
            <el-option label="藏族" value="藏族" />
          </el-select>
        </el-form-item>

        <!-- 查询与重置 -->
        <div class="button-wrapper">
          <el-button type="primary" @click="filterSamples">查询患者样本</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </div>
      </el-form>
    </div>

    <!-- ⭐ 疾病筛选部分 -->
    <div class="filter-container">
      <h4 style="width:100%;color: dimgray;">传染病疾病筛选</h4>
      <el-checkbox-group v-model="query.infectiousDiseases">
        <el-checkbox label="包虫病" />
        <el-checkbox label="病毒性肝炎" />
        <el-checkbox label="肺结核" />
        <el-checkbox label="流行性感冒" />
        <el-checkbox label="手足口病" />
      </el-checkbox-group>
      
      <h4 style="width:100%;color: dimgray;">慢性疾病筛选</h4>
      <el-checkbox-group v-model="query.chronicDiseases">
        <el-checkbox label="红细胞增多症" />
        <el-checkbox label="高血压" />
        <el-checkbox label="高血脂" />
        <el-checkbox label="肥胖" />
        <el-checkbox label="脂肪肝" />
        <el-checkbox label="高尿酸" />
      </el-checkbox-group>
      
      <div style="margin-top:10px;" class="button-wrapper">
        <el-button type="primary" @click="filterSamples">查询患者样本</el-button>
        <el-button @click="resetFilters">重置</el-button>
      </div>

    </div>

    <br>

    <!-- 表格呈现 -->
    <el-table
      v-loading="listLoading"
      :data="paginatedList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :label="col.label"
        :prop="col.prop"
        :width="col.width"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row[col.prop] }}
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页组件 -->
    <div class="pagination" style="text-align:center; margin-top:20px;">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="filteredList.length"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
    NA: No data provided by project <br>
    ND: Missing data
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      filteredList: [], // ⭐ 筛选后的数据
      listLoading: true,
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示条数
      query: { // ⭐ 存放筛选条件
        sampleId: '',
        city: '',
        county: '',
        ethnicity: '',
        infectiousDiseases: [],
        chronicDiseases: []
      },
      columns: [
        { label: '编号', prop: '编号', width: 120 },
        { label: '年龄', prop: '年龄', width: 80 },
        { label: '年龄段', prop: '年龄段', width: 100 },
        { label: '性别', prop: '性别', width: 80 },
        { label: '职业', prop: '职业', width: 100 },
        { label: '红细胞增多症', prop: '红细胞增多症', width: 150 },
        { label: '高血压', prop: '高血压', width: 100 },
        { label: '高血脂', prop: '高血脂', width: 100 },
        { label: '肥胖', prop: '肥胖', width: 80 },
        { label: '脂肪肝', prop: '脂肪肝', width: 100 },
        { label: '高尿酸', prop: '高尿酸', width: 100 },
        { label: '包虫病', prop: '包虫病', width: 100 },
        { label: '包虫病患病年份', prop: '包虫病患病年份', width: 150 },
        { label: '病毒性肝炎', prop: '病毒性肝炎', width: 150 },
        { label: '病毒性肝炎患病年份', prop: '病毒性肝炎患病年份', width: 180 },
        { label: '肺结核', prop: '肺结核', width: 100 },
        { label: '肺结核患病年份', prop: '肺结核患病年份', width: 150 },
        { label: '流行性感冒', prop: '流行性感冒', width: 120 },
        { label: '流行性感冒患病年份', prop: '流行性感冒患病年份', width: 180 },
        { label: '手足口病', prop: '手足口病', width: 100 },
        { label: '手足口病患病年份', prop: '手足口病患病年份', width: 150 },
        { label: '现住址-市', prop: '现住址-市', width: 120 },
        { label: '现住址-县', prop: '现住址-县', width: 120 },
        { label: '现住址-乡镇', prop: '现住址-乡镇', width: 130 },
        { label: '民族', prop: '民族', width: 80 },
        { label: '受教育程度', prop: '受教育程度', width: 120 }
      ]
    }
  },
  computed: {
    // 计算要显示的数据
    paginatedList() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredList.slice(start, end)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.filteredList = this.list // ⭐ 默认显示全部
        this.listLoading = false
      })
    },
    // ⭐ 分页（在模板的分页组件里绑定该事件）
    handlePageChange(page) {    
      this.currentPage = page
    },
    // ⭐ 点击查询
    filterSamples() {
      this.filteredList = this.list.filter(item => {
        const matchSampleId =
          !this.query.sampleId ||
          String(item.编号 || '').includes(String(this.query.sampleId).trim())
        const matchCity =
          !this.query.city || item['现住址-市'] === this.query.city
        const matchCounty =
          !this.query.county || item['现住址-县'] === this.query.county
        const matchEthnicity =
          !this.query.ethnicity || item.民族 === this.query.ethnicity

        const matchInfectious =
          this.query.infectiousDiseases.length === 0 ||
          this.query.infectiousDiseases.some(disease => item[disease] === '1')

        const matchChronic =
          this.query.chronicDiseases.length === 0 ||
          this.query.chronicDiseases.some(disease => item[disease] === '1')

        return (
          matchSampleId &&
          matchCity &&
          matchCounty &&
          matchEthnicity &&
          matchInfectious &&
          matchChronic
        )
      })
      this.currentPage = 1
    },
    // ⭐ 点击重置
    resetFilters() {
      this.query = {
        sampleId: '',
        city: '',
        county: '',
        ethnicity: '',
        infectiousDiseases: [],
        chronicDiseases: []
      }
      this.filteredList = this.list
      this.currentPage = 1
    }
  }
}
</script>

<style scoped>
.filter-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px; /* 控制间距 */
  background: #f6f6f6;
  padding: 20px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.filter-container .el-input,
.filter-container .el-select {
  width: 180px;
}

.filter-container .el-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
}

.filter-container .el-button.el-button--primary {
  background-color: #4e73df;
  border-color: #4e73df;
}

.filter-container .el-button.el-button--primary:hover {
  background-color: #3558c2;
  border-color: #3558c2;
}

.filter-container .el-button.el-button--info {
  background-color: #a0aec0;
  border-color: #a0aec0;
}

.filter-container .el-button.el-button--info:hover {
  background-color: #7b8794;
  border-color: #7b8794;
}

.button-wrapper {
  width: 100%;       /* 占满整行 */
  margin: 15px 0;
  justify-content: center; 
}

.filtered-container h4 {
  margin: 0;        /* 先清除浏览器默认 margin */
  padding: 0;  /* 自己控制间距 */
}

</style>
