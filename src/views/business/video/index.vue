<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="用户火脉号">
        <el-input
          v-model="queryParams.uuid"
          placeholder="请输入用户Id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="视频标题">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入视频标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          size="small"
          @change="handleQuery"
        >
          <el-option label="全部" :value="null" />
          <el-option
            v-for="item in statusOptions"
            :key="item.label + item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关键词">
        <KeywordSelect
          v-model="queryParams.keywordId"
          single
          @change="handleQuery"
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

    <el-table v-loading="loading" :data="videoList">
      <el-table-column type="index" width="55" align="center" label="编号" />
      <el-table-column label="用户Id" align="center" prop="userId" />
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
      <el-table-column
        label="用户手机号"
        align="center"
        prop="phone"
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
      <el-table-column label="视频时长" align="center" prop="duration" />
      <el-table-column label="关联话题" align="center">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.topicArr" :key="index">
            #{{ item }}#
          </div>
        </template>
      </el-table-column>
      <el-table-column label="关联好友" align="center" prop="buddy">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.buddyArr" :key="index">
            @{{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="是否可见" align="center" prop="visible" />
      <el-table-column label="点赞量" align="center" prop="starNum" />
      <el-table-column label="评论量" align="center" prop="commentNum" />
      <el-table-column label="播放量" align="center" prop="viewNum" />
      <el-table-column label="关键词" align="center">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.keywordArr" :key="index">
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="150"
      />
      <el-table-column label="状态" align="center" prop="statusStr" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-if="+scope.row.status !== 1"
            @click="handleChangeStatus(scope.row, 1)"
            >审核通过
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-if="+scope.row.status !== 2"
            @click="handleChangeStatus(scope.row, 2)"
            >审核拒绝
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:video:remove']"
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

    <VideoPreview :src="videoSrc" :visible.sync="videoDialog" />
  </div>
</template>

<script>
import {
  listVideo,
  changeStatus
} from "@/api/business/video";
import VideoPreview from "@/components/VideoPreview/index";
import KeywordSelect from "@/components/KeywordSelect/index";

export default {
  name: "Video",
  components: {
    VideoPreview,
    KeywordSelect
  },
  data () {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 视频信息表格数据
      videoList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: undefined,
        title: undefined,
        status: null,
        keywordId: undefined
      },
      statusOptions: [
        { label: "草稿", value: 0 },
        { label: "审核通过", value: 1 },
        { label: "审核拒绝", value: 2 },
        { label: "已删除", value: 3 }
      ],

      // video
      videoDialog: false,
      videoSrc: ""
    };
  },
  created () {
    this.getList();
  },
  methods: {
    /** 查询视频信息列表 */
    getList () {
      this.loading = true;
      listVideo(this.queryParams).then(response => {
        this.videoList = response.rows.map(item => {
          return Object.assign({}, item, {
            'topicArr': item.topic.split(','),
            'buddyArr': item.buddy.split(','),
            'visible': +item.visible === 1 ? '公开' : '私密',
            'statusStr': this.typeToStr(this.statusOptions, item.status),
            'keywordArr': item.keyword.split(',')
          })
        });
        this.total = response.total;
        this.loading = false;
      });
    },
    typeToStr (list, type) {
      const item = list.find(i => +i.value === +type)
      return item === undefined ? '' : item.label
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
    /** 删除按钮操作 */
    handleDelete (row) {
      this.$confirm(`确定要删除该视频吗?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        try {
          await changeStatus({ videoId: row.videoId, status: 3 });
          this.msgSuccess(`删除成功`);
          this.getList();
        } catch (error) { }
      }).catch(() => { });
    },
    handleChangeStatus (row, val) {
      const msg = val === 1 ? "审核通过" : "审核拒绝";
      this.$confirm(`确定要${msg}该视频吗?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        try {
          await changeStatus({ videoId: row.videoId, status: val });
          this.msgSuccess(`${msg}成功`);
          this.getList();
        } catch (error) { }
      }).catch(() => { });
    },
    handlePreview (row) {
      this.videoSrc = row.videoUrl;
      this.videoDialog = true;
    }
  }
};
</script>
