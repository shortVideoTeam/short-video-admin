<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="火脉号" prop="uuid">
        <el-input
          v-model="queryParams.uuid"
          placeholder="请输入用户火脉号Id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" @change="handleQuery">
          <el-option label="全部" :value="null" />
          <el-option
            v-for="item in typeOptions"
            :key="item.label + item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          placeholder="请选择注册时间"
        />
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
          v-hasPermi="['system:funds:export']"
          >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="fundsList">
      <el-table-column type="index" width="55" align="center" label="编号" />
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
      <el-table-column label="金额" align="center" prop="" />
      <el-table-column label="类型" align="center" prop="" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="150"
      />
      <el-table-column label="备注" align="center" prop="" />
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
import { listFunds, exportFunds } from "@/api/business/funds";

export default {
  name: "Funds",
  components: {},
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
      fundsList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uuid: undefined,
        type: null,
        createTime: null
      },
      typeOptions: [
        { label: 'xxx', value: 1 },
      ],

    };
  },
  created () {
    // this.getList();
  },
  methods: {
    /** 查询列表 */
    getList () {
      this.loading = true;
      listFunds(this.queryParams).then(response => {
        this.fundsList = response.rows.map(item => {
          return Object.assign({}, item, {
          })
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
      this.$confirm('是否确认导出数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.exportLoading = true;
        return exportFunds(queryParams);
      }).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      }).catch(() => {
      });
    },
  }
};
</script>
