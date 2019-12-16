<script>
export default {
  props: {
    delay: {
      type: Number,
      required: true,
    },
  },
  mounted () {
    this.id = window.setInterval(() => this.$emit('tick'), this.delay);
  },
  beforeDestroy () {
    window.clearInterval(this.id);
  },
  render: () => null,
}
</script>

<style>

</style>