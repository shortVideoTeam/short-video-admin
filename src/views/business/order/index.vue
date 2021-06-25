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
      <el-form-item label="推广时长" prop="time">
        <el-input
          v-model="queryParams.time"
          placeholder="请输入推广时长"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推荐页面，1-热门页" prop="page">
        <el-input
          v-model="queryParams.page"
          placeholder="请输入推荐页面，1-热门页"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额" prop="amount">
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
      <el-form-item label="状态，1-待付款 2-已付款" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态，1-待付款 2-已付款"
          clearable
          size="small"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式 1-微信 2-余额" prop="payWay">
        <el-input
          v-model="queryParams.payWay"
          placeholder="请输入支付方式 1-微信 2-余额"
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:order:add']"
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
          v-hasPermi="['system:order:edit']"
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
          v-hasPermi="['system:order:remove']"
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
          v-hasPermi="['system:order:export']"
          >导出
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="orderList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" v-if="false" />
      <el-table-column label="订单号" align="center" prop="orderNo" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="推广时长" align="center" prop="time" />
      <el-table-column label="推荐页面，1-热门页" align="center" prop="page" />
      <el-table-column label="金额" align="center" prop="amount" />
      <el-table-column
        label="支付时间"
        align="center"
        prop="payTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态，1-待付款 2-已付款"
        align="center"
        prop="status"
      />
      <el-table-column
        label="支付方式 1-微信 2-余额"
        align="center"
        prop="payWay"
      />
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
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:order:edit']"
            >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:order:remove']"
            >删除
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

    <!-- 添加或修改订单记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="推广时长" prop="time">
          <el-input v-model="form.time" placeholder="请输入推广时长" />
        </el-form-item>
        <el-form-item label="推荐页面，1-热门页" prop="page">
          <el-input
            v-model="form.page"
            placeholder="请输入推荐页面，1-热门页"
          />
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="支付时间" prop="payTime">
          <el-date-picker
            clearable
            size="small"
            v-model="form.payTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择支付时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态，1-待付款 2-已付款">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="支付方式 1-微信 2-余额" prop="payWay">
          <el-input
            v-model="form.payWay"
            placeholder="请输入支付方式 1-微信 2-余额"
          />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            clearable
            size="small"
            v-model="form.createTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择创建时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOrder, getOrder, delOrder, addOrder, updateOrder, exportOrder } from "@/api/business/order";

export default {
  name: "Order",
  components: {},
  data () {
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
      // 订单记录表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: undefined,
        userId: undefined,
        time: undefined,
        page: undefined,
        amount: undefined,
        payTime: undefined,
        status: undefined,
        payWay: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderNo: [
          { required: true, message: "订单号不能为空", trigger: "blur" }
        ],
        userId: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "金额不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created () {
    this.getList();
  },
  methods: {
    /** 查询订单记录列表 */
    getList () {
      this.loading = true;
      listOrder(this.queryParams).then(response => {
        this.orderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        id: undefined,
        orderNo: undefined,
        userId: undefined,
        time: undefined,
        page: undefined,
        amount: undefined,
        payTime: undefined,
        status: "0",
        payWay: undefined,
        createTime: undefined
      };
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加订单记录";
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getOrder(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改订单记录";
      });
    },
    /** 提交按钮 */
    submitForm () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateOrder(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then(response => {
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
    handleDelete (row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除订单记录编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loading = true;
        return delOrder(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有订单记录数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.exportLoading = true;
        return exportOrder(queryParams);
      }).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      }).catch(() => {
      });
    }
  }
};
</script>
