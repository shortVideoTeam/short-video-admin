<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单金额" prop="amount">
        <el-input
          v-model="queryParams.amount"
          placeholder="请输入金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支付时间" prop="payTime">
        <el-date-picker
          clearable
          size="small"
          v-model="queryParams.payTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择支付时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select v-model="queryParams.orderStatus" @change="handleQuery">
          <el-option label="全部" :value="null" />
          <el-option
            v-for="item in orderStatusOptions"
            :key="item.label + item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式" prop="payWay">
        <el-select v-model="queryParams.payWay" @change="handleQuery">
          <el-option label="全部" :value="null" />
          <el-option
            v-for="item in payWayOptions"
            :key="item.label + item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付来源" prop="paySource">
        <el-select v-model="queryParams.paySource" @change="handleQuery">
          <el-option label="全部" :value="null" />
          <el-option
            v-for="item in paySourceOptions"
            :key="item.label + item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
          v-hasPermi="['system:order:export']"
          >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="orderList">
      <el-table-column label="ID" align="center" prop="id" v-if="false" />
      <el-table-column label="订单号" align="center" prop="orderNo" />
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
      <el-table-column label="订单金额" align="center" prop="amount" />
      <el-table-column
        label="支付时间"
        align="center"
        prop="payTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="status" />
      <el-table-column label="支付方式" align="center" prop="payWay" />
      <el-table-column label="支付来源" align="center" prop="payWay" />
      <!-- <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope"> </template>
      </el-table-column> -->
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
import {
  listOrder,
  getOrder,
  delOrder,
  addOrder,
  updateOrder,
  exportOrder
} from "@/api/business/order";

export default {
  name: "Order",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 订单记录表格数据
      orderList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: undefined,
        userId: undefined,
        amount: undefined,
        payTime: null,
        orderStatus: null,
        payWay: null,
        paySource: null
      },
      orderStatusOptions: [],
      payWayOptions: [],
      paySourceOptions: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询订单记录列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then(response => {
        this.orderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有订单记录数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.exportLoading = true;
          return exportOrder(queryParams);
        })
        .then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    }
  }
};
</script>
