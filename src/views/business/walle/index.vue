<template>
  <div class="app-container">
    <el-card style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <span style="font-size: 20px; font-weight: bold">红包配置</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="edit"
        >
          修改
        </el-button>
      </div>
      <el-row :gutter="20">
        <el-col :span="3" class="card-label"> 红包剩余总额: </el-col>
        <el-col :span="21">
          <el-button type="text" size="small">{{ detail.sumMoney }}</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3" class="card-label"> 单笔领取金额: </el-col>
        <el-col :span="21">
          <el-button type="text" size="small">{{ detail.money }}</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加或修改钱包明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="红包总额" prop="sumMoney">
          <el-input
            v-model="form.sumMoney"
            placeholder="请输入"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="单笔领取金额" prop="money">
          <el-input
            v-model="form.money"
            placeholder="请输入"
            clearable
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">
          确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { } from "@/api/business/walle";

export default {
  name: "Walle",
  components: {},
  data () {
    return {
      //按钮loading
      buttonLoading: false,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单校验
      rules: {
        sumMoney: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        money: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
      },
      form: {
        sumMoney: 0,
        money: 0
      },
      detail: {
        sumMoney: 0,
        money: 0
      }
    };
  },
  created () {
  },
  methods: {
    edit () {
      this.title = '修改红包配置'
      this.form = { ...this.detail }
      this.open = true
    },
    cancel () {
      this.resetForm("form");
      this.open = false
    },
    /** 提交按钮 */
    submitForm () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          // updateWalle(this.form).then(response => {
          //   this.buttonLoading = false;
          //   this.msgSuccess("修改成功");
          //   this.open = false;
          //   this.getList();
          // });
        }
      });
    },

  }
};
</script>

<style lang="scss" scoped>
.card-label {
  text-align: right;
  line-height: 32px;
  font-size: 16px;
}
</style>
