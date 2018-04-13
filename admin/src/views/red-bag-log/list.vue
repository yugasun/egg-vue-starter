<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="姓名/手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getRedBagLogs">查询</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item> -->
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="logs" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <!-- <el-table-column type="selection" width="55">
      </el-table-column> -->
      <!-- <el-table-column type="index" width="60">
      </el-table-column> -->
      <el-table-column prop="User.name" label="姓名" sortable>
      </el-table-column>
      <el-table-column prop="User.phone" label="联系电话" sortable>
      </el-table-column>
      <el-table-column prop="amount" label="提现金额" width="180" sortable>
      </el-table-column>
      <el-table-column prop="created_at" label="提现时间" :formatter="formatTime" min-width="180" sortable>
      </el-table-column>
      <!-- <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
import { formatDate } from "@/utils/tool";
//import NProgress from 'nprogress'

export default {
  data() {
    return {
      filters: {
				keyword: ''
			},
      logs: [],
      total: 0,
      page: 1,
      listLoading: false,
    };
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue, 'YYYY-MM-DD HH:mm:ss');
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getRedBagLogs();
    },
    //获取用户列表
    async getRedBagLogs() {
      let para = {
        page: this.page,
        keyword: this.filters.keyword
      };
      this.listLoading = true;
			//NProgress.start();
			const res = await this.$http.get(this.$apis.redBagLogList, para);
      this.total = res.data.total;
			this.logs = res.data.logs;
			this.listLoading = false;
			//NProgress.done();
    },
  },
  mounted() {
    this.getRedBagLogs();
  }
};
</script>

<style scoped>

</style>