<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="视频ID" prop="videoId">
        <el-input
          v-model="queryParams.videoId"
          placeholder="请输入视频ID"
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
      <el-form-item label="评论用户Id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入评论用户Id"
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
        >
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="commentList">
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
        label="用户昵称"
        align="center"
        prop="nickName"
        width="120"
      />
      <el-table-column
        label="用户火脉号"
        align="center"
        prop="uuid"
        width="120"
      />
      <el-table-column label="视频标题" align="center" prop="title" />
      <el-table-column label="视频信息" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-video-play"
            @click="handlePreview(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="评论内容" align="center" prop="content" />
      <el-table-column label="评论用户Id" align="center" prop="userId" />
      <el-table-column label="评论用户头像" align="center">
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
        label="评论用户昵称"
        align="center"
        prop="nickName"
        width="120"
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
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:comment:remove']"
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
  </div>
</template>

<script>
import {
  listComment,
  getComment,
  delComment,
  addComment,
  updateComment,
  exportComment
} from "@/api/business/comment";
import Editor from "@/components/Editor";

export default {
  name: "Comment",
  components: {
    Editor
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 评论表格数据
      commentList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        videoId: undefined,
        title: undefined,
        userId: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询评论列表 */
    getList() {
      this.loading = true;
      listComment(this.queryParams).then(response => {
        this.commentList = response.rows;
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const commentIds = row.commentId || this.ids;
      this.$confirm(
        '是否确认删除评论编号为"' + commentIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loading = true;
          return delComment(commentIds);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    }
  }
};
</script>
