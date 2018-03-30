<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <c-table hover striped bordered small fixed caption="<i class='fa fa-align-justify'></i> Combined All Table"></c-table>
      </b-col>
    </b-row>
  </div>

</template>

<script>
  import cTable from './product/category/table.vue'

  export default {
    name: 'tables',
    components: {cTable}
  }
</script>
