<template>
  <v-btn 
    flat 
    icon 
    color="cyan"
    dark 
    class="jbtn-file"
  >
    <v-icon>fa-upload</v-icon>
    <input 
      id="selectFile" 
      type="file" 
      @change="fileSelected"
    >
  </v-btn>
</template>

<script>
export default {
    props:{
        selectedCallback: {
            type: Function,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    },
    methods: {
        fileSelected (e) {
            if (this.selectedCallback) {
                if (e.target.files[0]) {
                    this.selectedCallback(e.target.files[0])
                } else {
                    this.selectedCallback(null)
                }
            }
        }
    }
}
</script>

<style scoped>
  .jbtn-file {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    bottom: -15px;
  }

  .jbtn-file input[type=file] {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    font-size: 100px;
    text-align: right;
    filter: alpha(opacity=0);
    opacity: 0;
    outline: none;
    cursor: inherit;
    display: block;
  }
</style>
