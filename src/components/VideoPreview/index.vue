<template>
  <div>
    <el-dialog :visible.sync="visible">
      <video
        v-if="visible"
        :src="src"
        controls="controls"
        autoplay
        width="100%"
        height="auto"
      >
        your browser does not support the video tag
      </video>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "components-video-preview",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ""
    }
  }
};
</script>
