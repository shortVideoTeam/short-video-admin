<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="邀请人ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入邀请人ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="被邀请人ID" prop="byUserId">
        <el-input
          v-model="queryParams.byUserId"
          placeholder="请输入被邀请人ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邀请金额" prop="money">
        <el-input
          v-model="queryParams.money"
          placeholder="请输入邀请金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邀请码" prop="inviteCode">
        <el-input
          v-model="queryParams.inviteCode"
          placeholder="请输入邀请码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:invite:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:invite:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:invite:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['system:invite:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inviteList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="ID" align="center" prop="id" v-if="false"/>
      <el-table-column label="邀请人ID" align="center" prop="userId"/>
      <el-table-column label="被邀请人ID" align="center" prop="byUserId"/>
      <el-table-column label="邀请金额" align="center" prop="money"/>
      <el-table-column label="邀请码" align="center" prop="inviteCode"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:invite:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:invite:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改邀请记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="邀请人ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入邀请人ID"/>
        </el-form-item>
        <el-form-item label="被邀请人ID" prop="byUserId">
          <el-input v-model="form.byUserId" placeholder="请输入被邀请人ID"/>
        </el-form-item>
        <el-form-item label="邀请金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入邀请金额"/>
        </el-form-item>
        <el-form-item label="邀请码" prop="inviteCode">
          <el-input v-model="form.inviteCode" placeholder="请输入邀请码"/>
        </el-form-item>
        <el-form-item label="邀请时间" prop="createTime">
          <el-date-picker clearable size="small"
                          v-model="form.createTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择邀请时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {listInvite, getInvite, delInvite, addInvite, updateInvite, exportInvite} from "@/api/business/invite";

  export default {
    name: "Invite",
    components: {},
    data() {
      return {
        //按钮loading
        buttonLoading: false,
        // 遮罩层
        loading: true,
        // 导出遮罩层
        exportLoading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 邀请记录表格数据
        inviteList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userId: undefined,
          byUserId: undefined,
          money: undefined,
          inviteCode: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询邀请记录列表 */
      getList() {
        this.loading = true;
        listInvite(this.queryParams).then(response => {
          this.inviteList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          userId: undefined,
          byUserId: undefined,
          money: undefined,
          inviteCode: undefined,
          createTime: undefined
        };
        this.resetForm("form");
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
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加邀请记录";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.loading = true;
        this.reset();
        const id = row.id || this.ids
        getInvite(id).then(response => {
          this.loading = false;
          this.form = response.data;
          this.open = true;
          this.title = "修改邀请记录";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.buttonLoading = true;
            if (this.form.id != null) {
              updateInvite(this.form).then(response => {
                this.buttonLoading = false;
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addInvite(this.form).then(response => {
                this.buttonLoading = false;
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除邀请记录编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.loading = true;
          return delInvite(ids);
        }).then(() => {
          this.loading = false;
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有邀请记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportInvite(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
