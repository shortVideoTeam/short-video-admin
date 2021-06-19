<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户Id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户Id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="视频标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入视频标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="视频地址" prop="videoUrl">
        <el-input
          v-model="queryParams.videoUrl"
          placeholder="请输入视频地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="视频时长" prop="duration">
        <el-input
          v-model="queryParams.duration"
          placeholder="请输入视频时长"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联话题 (按" ,
      "逗号拼接)" prop="topic">
      <el-input
        v-model="queryParams.topic"
        placeholder="请输入关联话题 (按" ,
      "逗号拼接)"
      clearable
      size="small"
      @keyup.enter.native="handleQuery"
      />
      </el-form-item>
      <el-form-item label="关联好友 (按" ,
      "逗号拼接)" prop="buddy">
      <el-input
        v-model="queryParams.buddy"
        placeholder="请输入关联好友 (按" ,
      "逗号拼接)"
      clearable
      size="small"
      @keyup.enter.native="handleQuery"
      />
      </el-form-item>
      <el-form-item label="是否可见 (1 公开 0 私密)" prop="visible">
        <el-input
          v-model="queryParams.visible"
          placeholder="请输入是否可见 (1 公开 0 私密)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态( 0 草稿 1: 审核通过 2: 审核不通过 3: 删除 )" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态( 0 草稿 1: 审核通过 2: 审核不通过 3: 删除 )" clearable
                   size="small">
          <el-option label="请选择字典生成" value=""/>
        </el-select>
      </el-form-item>
      <el-form-item label="点赞量" prop="starNum">
        <el-input
          v-model="queryParams.starNum"
          placeholder="请输入点赞量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评论量" prop="commentNum">
        <el-input
          v-model="queryParams.commentNum"
          placeholder="请输入评论量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="播放量" prop="viewNum">
        <el-input
          v-model="queryParams.viewNum"
          placeholder="请输入播放量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关键词ID (按" ,
      "逗号拼接)" prop="keywordId">
      <el-input
        v-model="queryParams.keywordId"
        placeholder="请输入关键词ID (按" ,
      "逗号拼接)"
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
          v-hasPermi="['system:video:add']"
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
          v-hasPermi="['system:video:edit']"
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
          v-hasPermi="['system:video:remove']"
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
          v-hasPermi="['system:video:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="videoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="视频ID" align="center" prop="videoId" v-if="false"/>
      <el-table-column label="用户Id" align="center" prop="userId"/>
      <el-table-column label="视频标题" align="center" prop="title"/>
      <el-table-column label="视频地址" align="center" prop="videoUrl"/>
      <el-table-column label="视频时长" align="center" prop="duration"/>
      <el-table-column label="关联话题 (按" ,
      "逗号拼接)" align="center" prop="topic" />
      <el-table-column label="关联好友 (按" ,
      "逗号拼接)" align="center" prop="buddy" />
      <el-table-column label="是否可见 (1 公开 0 私密)" align="center" prop="visible"/>
      <el-table-column label="状态( 0 草稿 1: 审核通过 2: 审核不通过 3: 删除 )" align="center" prop="status"/>
      <el-table-column label="点赞量" align="center" prop="starNum"/>
      <el-table-column label="评论量" align="center" prop="commentNum"/>
      <el-table-column label="播放量" align="center" prop="viewNum"/>
      <el-table-column label="关键词ID (按" ,
      "逗号拼接)" align="center" prop="keywordId" />
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:video:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:video:remove']"
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

    <!-- 添加或修改视频信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户Id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户Id"/>
        </el-form-item>
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入视频标题"/>
        </el-form-item>
        <el-form-item label="视频地址" prop="videoUrl">
          <el-input v-model="form.videoUrl" placeholder="请输入视频地址"/>
        </el-form-item>
        <el-form-item label="视频时长" prop="duration">
          <el-input v-model="form.duration" placeholder="请输入视频时长"/>
        </el-form-item>
        <el-form-item label="关联话题 (按" ,
        "逗号拼接)" prop="topic">
        <el-input v-model="form.topic" placeholder="请输入关联话题 (按" ,
        "逗号拼接)" />
        </el-form-item>
        <el-form-item label="关联好友 (按" ,
        "逗号拼接)" prop="buddy">
        <el-input v-model="form.buddy" placeholder="请输入关联好友 (按" ,
        "逗号拼接)" />
        </el-form-item>
        <el-form-item label="是否可见 (1 公开 0 私密)" prop="visible">
          <el-input v-model="form.visible" placeholder="请输入是否可见 (1 公开 0 私密)"/>
        </el-form-item>
        <el-form-item label="状态( 0 草稿 1: 审核通过 2: 审核不通过 3: 删除 )">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="点赞量" prop="starNum">
          <el-input v-model="form.starNum" placeholder="请输入点赞量"/>
        </el-form-item>
        <el-form-item label="评论量" prop="commentNum">
          <el-input v-model="form.commentNum" placeholder="请输入评论量"/>
        </el-form-item>
        <el-form-item label="播放量" prop="viewNum">
          <el-input v-model="form.viewNum" placeholder="请输入播放量"/>
        </el-form-item>
        <el-form-item label="关键词ID (按" ,
        "逗号拼接)" prop="keywordId">
        <el-input v-model="form.keywordId" placeholder="请输入关键词ID (按" ,
        "逗号拼接)" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker clearable size="small"
                          v-model="form.createTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建者" prop="createBy">
          <el-input v-model="form.createBy" placeholder="请输入创建者"/>
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
  import {listVideo, getVideo, delVideo, addVideo, updateVideo, exportVideo} from "@/api/business/video";

  export default {
    name: "Video",
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
        // 视频信息表格数据
        videoList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userId: undefined,
          title: undefined,
          videoUrl: undefined,
          duration: undefined,
          topic: undefined,
          buddy: undefined,
          visible: undefined,
          status: undefined,
          starNum: undefined,
          commentNum: undefined,
          viewNum: undefined,
          keywordId: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          userId: [
            {required: true, message: "用户Id不能为空", trigger: "blur"}
          ],
          title: [
            {required: true, message: "视频标题不能为空", trigger: "blur"}
          ],
          videoUrl: [
            {required: true, message: "视频地址不能为空", trigger: "blur"}
          ],
          visible: [
            {required: true, message: "是否可见 (1 公开 0 私密)不能为空", trigger: "blur"}
          ],
          status: [
            {required: true, message: "状态( 0 草稿 1: 审核通过 2: 审核不通过 3: 删除 )不能为空", trigger: "blur"}
          ],
          keywordId: [
            {required: true, message: "关键词ID (按逗号拼接)不能为空", trigger: "blur"}
          ],
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询视频信息列表 */
      getList() {
        this.loading = true;
        listVideo(this.queryParams).then(response => {
          this.videoList = response.rows;
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
          videoId: undefined,
          userId: undefined,
          title: undefined,
          videoUrl: undefined,
          duration: undefined,
          topic: undefined,
          buddy: undefined,
          visible: undefined,
          status: "0",
          starNum: undefined,
          commentNum: undefined,
          viewNum: undefined,
          keywordId: undefined,
          createTime: undefined,
          createBy: undefined,
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
        this.ids = selection.map(item => item.videoId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加视频信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.loading = true;
        this.reset();
        const videoId = row.videoId || this.ids
        getVideo(videoId).then(response => {
          this.loading = false;
          this.form = response.data;
          this.open = true;
          this.title = "修改视频信息";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.buttonLoading = true;
            if (this.form.videoId != null) {
              updateVideo(this.form).then(response => {
                this.buttonLoading = false;
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addVideo(this.form).then(response => {
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
        const videoIds = row.videoId || this.ids;
        this.$confirm('是否确认删除视频信息编号为"' + videoIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.loading = true;
          return delVideo(videoIds);
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
        this.$confirm('是否确认导出所有视频信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportVideo(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
