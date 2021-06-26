<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="用户火脉号" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" @change="handleQuery">
          <el-option label="全部" :value="null" />
          <el-option
            v-for="item in statusOptions"
            :key="item.label + item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间" prop="time">
        <el-date-picker
          clearable
          size="small"
          v-model="queryParams.time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择申请时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="WithdrawList">
      <el-table-column type="index" width="55" align="center" label="编号" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="用户头像" align="center">
        <template slot-scope="scope">
          <el-image
            size="mini"
            slot="reference"
            fit="contain"
            :src="scope.row.avatar"
            :style="{ width: '50px', height: '50px', marginRight: '5px' }"
            :previewSrcList="[scope.row.avatar]"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="会员昵称"
        align="center"
        prop="nickName"
        width="120"
      />
      <el-table-column
        label="会员火脉号"
        align="center"
        prop="uuid"
        width="120"
      />
      <el-table-column
        label="会员手机号"
        align="center"
        prop="phone"
        width="120"
      />
      <el-table-column label="提现金额" align="center" prop="amount" />
      <el-table-column
        label="提现时间"
        align="center"
        prop="payTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际金额" align="center" prop="" />
      <el-table-column label="提现状态" align="center" prop="" />
      <el-table-column label="申请时间" align="center" prop="" />
      <el-table-column label="审核时间" align="center" prop="" />
      <el-table-column label="微信流水号" align="center" prop="" />
      <el-table-column label="驳回原因" align="center" prop="" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-if="+scope.row.status !== 1"
            @click="handleChangeStatus(scope.row, 1)"
            >审核通过
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-if="+scope.row.status !== 2"
            @click="handleChangeStatus(scope.row, 2)"
            >审核拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listWithdraw, exportWithdraw, changeStatus } from "@/api/business/withdraw";

export default {
  name: "Withdraw",
  data () {
    return {
      // 遮罩层
      loading: false,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户信息表格数据
      WithdrawList: [{}],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uuid: undefined,
        status: null,
        createTime: null
      },
      statusOptions: [
        { label: "启用", value: 1 },
        { label: "禁用", value: 0 }
      ]
    };
  },
  created () {
    // this.getList();
  },
  methods: {
    /** 查询用户信息列表 */
    getList () {
      this.loading = true;
      listWithdraw(this.queryParams).then(response => {
        this.WithdrawList = response.rows.map(item => {
          return Object.assign({}, item, {
            statusStr: +item.status === 1 ? "启用" : "禁用",
            isBindWx: !!item.phone ? "是" : "否"
          });
        });
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户信息数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.exportLoading = true;
        return exportWithdraw(queryParams);
      }).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      }).catch(() => { });
    },
    handleChangeStatus (row, val) {
      const msg = val === 1 ? "审核通过" : "审核拒绝";
      this.$confirm(`确定要${msg}该视频吗?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        try {
          await changeStatus({ WithdrawId: row.WithdrawId, status: val });
          this.msgSuccess(`${msg}成功`);
          this.getList();
        } catch (error) { }
      }).catch(() => { });
    }
  }
};
</script>
