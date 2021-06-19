<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户火脉号Id" prop="uuid">
        <el-input
          v-model="queryParams.uuid"
          placeholder="请输入用户火脉号Id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="微信同一用户同一应用唯一标识" prop="openid">
        <el-input
          v-model="queryParams.openid"
          placeholder="请输入微信同一用户同一应用唯一标识"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="微信同一用户不同应用唯一标识" prop="unionid">
        <el-input
          v-model="queryParams.unionid"
          placeholder="请输入微信同一用户不同应用唯一标识"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户头像" prop="avatar">
        <el-input
          v-model="queryParams.avatar"
          placeholder="请输入用户头像"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户性别 (0未知 1男 2女)" prop="sex">
        <el-select v-model="queryParams.sex" placeholder="请选择用户性别 (0未知 1男 2女)" clearable size="small">
          <el-option label="请选择字典生成" value=""/>
        </el-select>
      </el-form-item>
      <el-form-item label="用户生日" prop="birthday">
        <el-date-picker clearable size="small"
                        v-model="queryParams.birthday"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择用户生日">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="星座" prop="constellation">
        <el-input
          v-model="queryParams.constellation"
          placeholder="请输入星座"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="省" prop="province">
        <el-input
          v-model="queryParams.province"
          placeholder="请输入省"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="市" prop="city">
        <el-input
          v-model="queryParams.city"
          placeholder="请输入市"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区" prop="area">
        <el-input
          v-model="queryParams.area"
          placeholder="请输入区"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入详细地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="个人介绍" prop="desc">
        <el-input
          v-model="queryParams.desc"
          placeholder="请输入个人介绍"
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
          v-hasPermi="['system:user:add']"
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
          v-hasPermi="['system:user:edit']"
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
          v-hasPermi="['system:user:remove']"
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
          v-hasPermi="['system:user:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="用户Id" align="center" prop="userId" v-if="false"/>
      <el-table-column label="用户火脉号Id" align="center" prop="uuid"/>
      <el-table-column label="微信同一用户同一应用唯一标识" align="center" prop="openid"/>
      <el-table-column label="微信同一用户不同应用唯一标识" align="center" prop="unionid"/>
      <el-table-column label="用户头像" align="center" prop="avatar"/>
      <el-table-column label="用户昵称" align="center" prop="nickName"/>
      <el-table-column label="用户性别 (0未知 1男 2女)" align="center" prop="sex"/>
      <el-table-column label="用户生日" align="center" prop="birthday" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.birthday, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="phone"/>
      <el-table-column label="星座" align="center" prop="constellation"/>
      <el-table-column label="省" align="center" prop="province"/>
      <el-table-column label="市" align="center" prop="city"/>
      <el-table-column label="区" align="center" prop="area"/>
      <el-table-column label="详细地址" align="center" prop="address"/>
      <el-table-column label="个人介绍" align="center" prop="desc"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:user:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:user:remove']"
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

    <!-- 添加或修改用户信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户火脉号Id" prop="uuid">
          <el-input v-model="form.uuid" placeholder="请输入用户火脉号Id"/>
        </el-form-item>
        <el-form-item label="微信同一用户同一应用唯一标识" prop="openid">
          <el-input v-model="form.openid" placeholder="请输入微信同一用户同一应用唯一标识"/>
        </el-form-item>
        <el-form-item label="微信同一用户不同应用唯一标识" prop="unionid">
          <el-input v-model="form.unionid" placeholder="请输入微信同一用户不同应用唯一标识"/>
        </el-form-item>
        <el-form-item label="用户头像" prop="avatar">
          <el-input v-model="form.avatar" placeholder="请输入用户头像"/>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入用户昵称"/>
        </el-form-item>
        <el-form-item label="用户性别 (0未知 1男 2女)" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择用户性别 (0未知 1男 2女)">
            <el-option label="请选择字典生成" value=""/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户生日" prop="birthday">
          <el-date-picker clearable size="small"
                          v-model="form.birthday"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择用户生日">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="星座" prop="constellation">
          <el-input v-model="form.constellation" placeholder="请输入星座"/>
        </el-form-item>
        <el-form-item label="省" prop="province">
          <el-input v-model="form.province" placeholder="请输入省"/>
        </el-form-item>
        <el-form-item label="市" prop="city">
          <el-input v-model="form.city" placeholder="请输入市"/>
        </el-form-item>
        <el-form-item label="区" prop="area">
          <el-input v-model="form.area" placeholder="请输入区"/>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入详细地址"/>
        </el-form-item>
        <el-form-item label="个人介绍" prop="desc">
          <el-input v-model="form.desc" placeholder="请输入个人介绍"/>
        </el-form-item>
        <el-form-item label="创建者" prop="createBy">
          <el-input v-model="form.createBy" placeholder="请输入创建者"/>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker clearable size="small"
                          v-model="form.createTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新者" prop="updateBy">
          <el-input v-model="form.updateBy" placeholder="请输入更新者"/>
        </el-form-item>
        <el-form-item label="更新时间" prop="updateTime">
          <el-date-picker clearable size="small"
                          v-model="form.updateTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择更新时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
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
  import {listUser, getUser, delUser, addUser, updateUser, exportUser} from "@/api/business/user";

  export default {
    name: "User",
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
        // 用户信息表格数据
        userList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          uuid: undefined,
          openid: undefined,
          unionid: undefined,
          avatar: undefined,
          nickName: undefined,
          sex: undefined,
          birthday: undefined,
          phone: undefined,
          constellation: undefined,
          province: undefined,
          city: undefined,
          area: undefined,
          address: undefined,
          desc: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          uuid: [
            {required: true, message: "用户火脉号Id不能为空", trigger: "blur"}
          ],
          avatar: [
            {required: true, message: "用户头像不能为空", trigger: "blur"}
          ],
          nickName: [
            {required: true, message: "用户昵称不能为空", trigger: "blur"}
          ],
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询用户信息列表 */
      getList() {
        this.loading = true;
        listUser(this.queryParams).then(response => {
          this.userList = response.rows;
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
          userId: undefined,
          uuid: undefined,
          openid: undefined,
          unionid: undefined,
          avatar: undefined,
          nickName: undefined,
          sex: undefined,
          birthday: undefined,
          phone: undefined,
          constellation: undefined,
          province: undefined,
          city: undefined,
          area: undefined,
          address: undefined,
          desc: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined,
          remark: undefined
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
        this.ids = selection.map(item => item.userId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加用户信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.loading = true;
        this.reset();
        const userId = row.userId || this.ids
        getUser(userId).then(response => {
          this.loading = false;
          this.form = response.data;
          this.open = true;
          this.title = "修改用户信息";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.buttonLoading = true;
            if (this.form.userId != null) {
              updateUser(this.form).then(response => {
                this.buttonLoading = false;
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addUser(this.form).then(response => {
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
        const userIds = row.userId || this.ids;
        this.$confirm('是否确认删除用户信息编号为"' + userIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.loading = true;
          return delUser(userIds);
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
      }
    }
  };
</script>
