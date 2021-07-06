<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="用户火脉号" prop="uuid">
        <el-input
          v-model="queryParams.uuid"
          placeholder="请输入用户火脉号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="视频标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入作品信息"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推广状态" prop="status">
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
      <el-form-item label="推广时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          placeholder="请选择推广时间"
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

    <el-table v-loading="loading" :data="tableList">
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
        label="昵称"
        align="center"
        prop="nickName"
        width="120"
      />
      <el-table-column label="火脉号" align="center" prop="uuid" width="120" />
      <el-table-column label="手机号" align="center" prop="phone" width="120" />
      <el-table-column label="视频标题" align="center" prop="title" />
      <el-table-column label="视频信息" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-video-play"
            @click="handlePreview(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="推广时间" align="center" prop="createTime" />
      <el-table-column label="推广状态" align="center" prop="statusStr" />
      <el-table-column label="热门次数" align="center" prop="hotNum" />
      <el-table-column label="推广收益" align="center" prop="profit" />
      <el-table-column label="发出推广值" align="center" prop="sendVal" />
      <el-table-column label="收到推广值" align="center" prop="receivedVal" />
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
import { listPromote } from "@/api/business/promote";
import VideoPreview from "@/components/VideoPreview/index";

export default {
  name: "Promote",
  components: {
    VideoPreview
  },
  data () {
    return {
      // 遮罩层
      loading: false,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户信息表格数据
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uuid: undefined,
        status: null,
        createTime: null
      },
      statusOptions: [
        { label: "已报名", value: 1 },
        { label: "已参与", value: 2 },
        { label: "已失效", value: 3 }
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
    /** 查询用户信息列表 */
    getList () {
      this.loading = true;
      listPromote(this.queryParams).then(response => {
        this.tableList = response.rows.map(item => {
          return Object.assign({}, item, {
            'statusStr': this.typeToStr(this.statusOptions, item.status),
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
    handlePreview (row) {
      this.videoSrc = row.videoUrl;
      this.videoDialog = true;
    }
  }
};
</script>
