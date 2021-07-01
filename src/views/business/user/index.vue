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
      <el-form-item label="账号状态" prop="status">
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
      <el-form-item label="注册时间" prop="createTime">
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
          v-hasPermi="['system:user:export']"
          >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="userList">
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
      <el-table-column label="上级火脉号" align="center" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="searchUUid(scope.row.inviteUserId)">
            {{ scope.row.inviteUserId }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="邀请码"
        align="center"
        prop="inviteCode"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column label="邀请人数" align="center" prop="inviteNum" />
      <el-table-column label="累计收益" align="center" prop="income" />
      <el-table-column
        label="可提现金额"
        align="center"
        prop="money"
        width="100"
      />
      <el-table-column
        label="是否绑定微信"
        align="center"
        prop="isBindWx"
        width="100"
      />
      <el-table-column label="账号状态" align="center" prop="statusStr" />
      <el-table-column
        label="注册时间"
        align="center"
        prop="createTime"
        width="150"
      />

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="150"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleLook(scope.row)">
            直推
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-if="+scope.row.status !== 1"
            @click="handleChangeStatus(scope.row, 1)"
          >
            启用
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-if="+scope.row.status !== 0"
            @click="handleChangeStatus(scope.row, 0)"
          >
            禁用
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

    <el-dialog :visible.sync="dialog" title="直推会员列表" width="75%">
      <el-table v-loading="dialogLoading" :data="dialogList">
        <el-table-column type="index" width="55" align="center" label="编号" />
        <el-table-column label="用户头像" align="center">
          <template slot-scope="scope">
            <el-image
              size="mini"
              slot="reference"
              fit="contain"
              :src="scope.row.avatar"
              :style="{ width: '50px', height: '50px', marginRight: '5px' }"
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
        <el-table-column
          label="上级火脉号"
          align="center"
          width="120"
          prop="inviteUserId"
        />
        <el-table-column
          label="邀请码"
          align="center"
          prop="inviteCode"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column label="邀请人数" align="center" prop="inviteNum" />
        <el-table-column label="累计收益" align="center" prop="income" />
        <el-table-column
          label="可提现金额"
          align="center"
          prop="money"
          width="100"
        />
        <el-table-column
          label="是否绑定微信"
          align="center"
          prop="isBindWx"
          width="100"
        />
        <el-table-column label="账号状态" align="center" prop="statusStr" />
        <el-table-column
          label="注册时间"
          align="center"
          prop="createTime"
          width="150"
        />
      </el-table>
      <pagination
        v-show="dialogTotal > 0"
        :total="dialogTotal"
        :page.sync="dialogParams.pageNum"
        :limit.sync="dialogParams.pageSize"
        @pagination="getDialogList"
      />
    </el-dialog>
  </div>
</template>

<script>
import { listUser, getUser, exportUser, changeStatus } from "@/api/business/user";

export default {
  name: "User",
  components: {},
  data () {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户信息表格数据
      userList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uuid: undefined,
        status: null,
        createTime: null
      },
      statusOptions: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],

      dialog: false,
      dialogLoading: false,
      dialogTotal: 0,
      dialogList: [],
      dialogParams: {
        pageNum: 1,
        pageSize: 10,
      },

    };
  },
  created () {
    this.getList();
  },
  methods: {
    /** 查询用户信息列表 */
    getList () {
      this.loading = true;
      listUser(this.queryParams).then(response => {
        this.userList = response.rows.map(item => {
          return Object.assign({}, item, {
            'statusStr': +item.status === 1 ? '启用' : '禁用',
            'isBindWx': !!item.phone ? '是' : '否'
          })
        });
        this.total = response.total;
        this.loading = false;
      });
    },
    searchUUid (val) {
      this.queryParams.pageNum = 1;
      this.queryParams.uuid = val
      this.getList()
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
      this.$confirm('是否确认导出所有用户信息数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.exportLoading = true;
        return exportUser(queryParams);
      }).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      }).catch(() => {
      });
    },
    handleLook (row) {
      this.dialog = true
      this.dialogTotal = 0
      this.dialogList = []
      this.dialogParams = {
        pageNum: 1,
        pageSize: 10,
        userId: row.userId
      }
      this.getDialogList()
    },
    getDialogList () {
      this.dialogLoading = true;
      getUser(this.dialogParams).then(response => {
        this.dialogList = response.rows.map(item => {
          return Object.assign({}, item, {
            'statusStr': +item.status === 1 ? '启用' : '禁用',
            'isBindWx': !!item.phone ? '是' : '否'
          })
        });
        this.dialogTotal = response.total;
        this.dialogLoading = false;
      });
    },
    handleChangeStatus (row, val) {
      const msg = val === 1 ? '启用' : '禁用'
      this.$confirm(`确定要${msg}该用户吗?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        try {
          await changeStatus({ userId: row.userId, status: val })
          this.msgSuccess(`${msg}成功`);
          this.getList();
        } catch (error) {

        }
      }).catch(() => { });
    }
  }
};
</script>
