<template>
  <div class="save-box-container">
    <!-- <savevideo v-if ="this.boxset == 'savevideo'&&!this.startloading"></savevideo> -->
    <saveproject v-if="this.boxset == 'saveproject'"></saveproject>
    <saveas v-else-if="this.boxset == 'saveas'"></saveas>
    <addtrack v-else-if="this.boxset == 'addtrack'"></addtrack>
    <savezc v-else-if="this.boxset == 'savezc'"></savezc>
    <setRecord v-else-if="this.boxset == 'setrecord'"></setRecord>
  </div>
</template>

<script>
import saveproject from '@/model/setBox/saveProject'
import saveas from '@/model/setBox/saveAs'
import savezc from '@/model/setBox/setZc'
import addtrack from '@/model/setBox/addTrack'
import setRecord from '@/model/setBox/setRecord'
import { mapState } from 'vuex'
export default {
  components: {
    saveproject,
    savezc,
    saveas,
    addtrack,
    setRecord
  },
  computed: {
    ...mapState(['boxset'])
  }
}
</script>

<style lang="scss" scoped></style>
