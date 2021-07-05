<template>
  <div class="app-container">
    <el-card style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <span style="font-size: 20px; font-weight: bold">推广配置</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="edit"
        >
          修改
        </el-button>
      </div>
      <el-row :gutter="20">
        <el-col :span="4" class="card-label"> 参与作品需邀请人数: </el-col>
        <el-col :span="8">
          <el-button type="text" size="small">{{ detail.inviteNum }}</el-button>
        </el-col>
      </el-row>
      <!--  -->
      <el-row :gutter="20">
        <el-col :span="4" class="card-label"> 作品推广热门人数限定: </el-col>
        <el-col :span="4">
          <el-button type="text" size="small">{{ detail.maxNum }}</el-button>
        </el-col>
        <el-col :span="4" class="card-label"> 作品热门推广金额设定: </el-col>
        <el-col :span="4">
          <el-button type="text" size="small">{{ detail.money }}</el-button>
        </el-col>
      </el-row>
      <!--  -->
      <el-row :gutter="20">
        <el-col :span="4" class="card-label"> 作品推广金设定平台: </el-col>
        <el-col :span="4">
          <el-button type="text" size="small">
            {{ detail.platformRate }}
          </el-button>
        </el-col>
        <el-col :span="4" class="card-label"> 邀请人: </el-col>
        <el-col :span="4">
          <el-button type="text" size="small">
            {{ detail.inviteRate }}
          </el-button>
        </el-col>
        <el-col :span="4" class="card-label"> 被助推人: </el-col>
        <el-col :span="4">
          <el-button type="text" size="small">
            {{ detail.boosterRate }}
          </el-button>
        </el-col>
      </el-row>
      <!--  -->
    </el-card>

    <!-- 添加或修改钱包明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="550px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="155px">
        <el-form-item label="参与作品需邀请人数" prop="inviteNum">
          <el-input
            v-model="form.inviteNum"
            placeholder="请输入"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="作品推广热门人数限定" prop="maxNum">
          <el-input
            v-model="form.maxNum"
            placeholder="请输入"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="作品热门推广金额设定" prop="money">
          <el-input
            v-model="form.money"
            placeholder="请输入"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="作品推广金设定平台" prop="platformRate">
          <el-input
            v-model="form.platformRate"
            placeholder="请输入"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="邀请人" prop="inviteRate">
          <el-input
            v-model="form.inviteRate"
            placeholder="请输入"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="被助推人" prop="boosterRate">
          <el-input
            v-model="form.boosterRate"
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
import { listConfig, updateConfig } from "@/api/business/promote";

export default {
  name: "Promote-Setting",
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
        xxx: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
      },
      form: {
        id: 0,
        inviteNum: 0,
        maxNum: 0,
        money: 0,
        platformRate: 0,
        inviteRate: 0,
        boosterRate: 0,
      },
      detail: {
        id: 0,
        inviteNum: 0,
        maxNum: 0,
        money: 0,
        platformRate: 0,
        inviteRate: 0,
        boosterRate: 0,
      }
    };
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      try {
        const { rows } = await listConfig()
        this.detail = !rows.length ? {
          inviteNum: 0,
          maxNum: 0,
          money: 0,
          platformRate: 0,
          inviteRate: 0,
          boosterRate: 0,
        } : rows[0]
      } catch (error) {
      }
    },
    edit () {
      this.title = '修改推广配置'
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
          updateConfig(this.form).then(response => {
            this.buttonLoading = false;
            this.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    checkInputDecimal (val) {
      val = /^\d+\.?\d{0,2}$/.test(val) || val === '' ? val : (val = '')
      return val
    }
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
