<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="火脉号">
        <el-input
          v-model="queryParams.uuid"
          placeholder="请输入用户火脉号Id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="followList">
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
      <el-table-column label="关注好友总数" align="center" prop="" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleLook(scope.row)"
          >
            关注详情
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

    <el-dialog title="关注列表详情" :visible.sync="dialog">
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
        <el-table-column label="邀请码" align="center" prop="" />
        <el-table-column label="邀请人数" align="center" prop="" />
        <el-table-column label="累计收益" align="center" prop="" />
        <el-table-column
          label="可提现金额"
          align="center"
          prop=""
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
import {
  listFollow,
  getFollow,
  delFollow,
  addFollow,
  updateFollow,
  exportFollow
} from "@/api/business/follow";

export default {
  name: "Follow",
  components: {},
  data () {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户关注表格数据
      followList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uuid: undefined
      },
      //
      dialog: false,
      dialogLoading: false,
      dialogTotal: 0,
      dialogList: [],
      dialogParams: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  created () {
    this.getList();
  },
  methods: {
    /** 查询用户关注列表 */
    getList () {
      this.loading = true;
      listFollow(this.queryParams).then(response => {
        this.followList = response.rows;
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
    handleLook (row) {
      this.dialog = true;
      this.dialogTotal = 0;
      this.dialogList = [];
      this.dialogParams = {
        pageNum: 1,
        pageSize: 10
      };
      this.getDialogList();
    },
    getDialogList () { }
  }
};
</script>
