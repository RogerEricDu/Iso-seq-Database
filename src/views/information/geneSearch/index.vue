<template>
  <div class="app-container">
    <!-- ⭐ 条件区域 -->
    <div class="filter-container">
      <el-form :inline="true" :model="query">

        <!-- 输入框 -->
        <el-form-item label="基因">
          <el-input v-model="query.gene" placeholder="请输入基因名或基因号" />
        </el-form-item>

        <!-- 查询与重置 -->
        <div class="button-wrapper">
          <el-button type="primary" @click="filterGene">查询基因注释信息</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </div>
      </el-form>
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
    
  </div>
</template>

<script>
import { getGeneInfo } from '@/api/geneInfo'

export default {
  data() {
    return {
      list: [],
      filteredList: [], // ⭐ 筛选后的数据
      listLoading: true,
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示条数
      query: { gene: '' }, // ⭐ 存放筛选条件
      columns: [
        { label: '基因名', prop: 'geneName', width: 200 },
        { label: '基因号', prop: 'geneId', width: 230 },
        { label: '染色体', prop: 'chromosome', width: 100 },
        { label: '起始位置', prop: 'start', width: 100 },
        { label: '终止位置', prop: 'end', width: 100 },
        { label: '方向', prop: 'strand', width: 100 },
        { label: '基因类型', prop: 'geneType', width: 150 },
        { label: '外显子数量', prop: 'exonNumber', width: 100 },
        { label: '关联转录本', prop: 'associatedTranscript', width: 150 }
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
      getGeneInfo().then(response => {
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
    filterGene() {
      const keyword = String(this.query.gene || '').trim() // 去掉前后空格并转化为字符串

      if (!keyword) {
          this.filteredList = this.list // 默认显示全部（如果keyword为空则返回true）
      } else {
          this.filteredList = this.list.filter(item =>
          String(item.geneName || '').includes(keyword) || // “或者”
          String(item.geneId || '').includes(keyword)
          )
      }
      this.currentPage = 1
    },

    // ⭐ 点击重置
    resetFilters() {
      this.query = { gene: '' }
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
