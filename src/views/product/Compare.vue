<template>
  <b-card>
    <div slot="header">
       Company Table
    </div>
     <b-row>
        <b-col md="3" offset-md="3" class="pull-right add_button">
          <b-form-radio-group id="radios2"
          v-show="false"
          v-model="searchby"
          v-on:change="onSelectSearchBy"
          name="radioSubComponent">
            <b-form-radio value="city">City</b-form-radio>
            <b-form-radio value="store">Store</b-form-radio>
          </b-form-radio-group>
        </b-col>
        <b-col md="3" class="pull-right add_button">
            <b-form-group horizontal label="Wish List" class="mb-0">
              <b-input-group>
                <b-form-select
                v-model="selectWishList"
                :options="selectWishListOption"
                v-on:change="onSelectList"
                size="md" />
              </b-input-group>
            </b-form-group>
        </b-col>
        <b-col md="3" class="pull-right add_button">
            <b-form-group horizontal class="mb-0">
              <b-input-group>
                <b-form-input v-model="filter" placeholder="Type to Search" />
                <b-input-group-append>
                  <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
        </b-col>
    </b-row>
    <b-row>
        <b-col md="3" offset-md="6">
          <b-form-group>
            <label for="vat">Page Size</label>
            <b-form-input
            type="number"
            v-model="pageSize"
            placeholder="0">
            </b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group>
            <label for="vat">Go</label>
            <b-form-input
            type="number"
            v-on:change="onGoToPage"
            v-model="gotoPage"
            placeholder="0">
            </b-form-input>
          </b-form-group>
        </b-col>
    </b-row>

    <b-table
    :hover="hover"
    :striped="striped"
    :small="small"
    :filter="filter"
    responsive="sm"
    :items="currentItems"
    :fields="fields"
    :current-page="currentPage"
    :per-page="perPage"
    >
      <template slot="action" slot-scope="data">
        <b-button variant="danger"  v-show = "checkButton('wish_del')" v-on:click="onDeleteOPenModal(data.item.action)"><i class="fa fa-trash"></i></b-button>
      </template>
    </b-table>
    <b-col md="10" offset-md="2">
      <b-list-group >
       <b-list-group-item href="#">
         <span v-for="(rprice, index) in currentSum" :key="index">
           <strong>{{index}}:</strong>&nbsp;&nbsp; {{rprice}}&nbsp;
         </span></b-list-group-item>
      </b-list-group>
    </b-col>

    <nav>
      <b-pagination
      v-on:change="onchangePage"
      :total-rows="getRowCount(items)"
      :per-page="perPage"
      v-model="currentPage"
      prev-text="Prev"
      next-text="Next" hide-goto-end-buttons/>
    </nav>



    <b-modal title="Info" class="modal-info" v-model="isdeleteModal" @ok="deleteSubmit">
      are you sure delete this Product?
    </b-modal>
  </b-card>
</template>
<script>
  import * as firebase from 'firebase'
  export default {
    name: 'c-table',
    props: {
      caption: {
        type: String,
        default: 'Table'
      },
      hover: {
        type: Boolean,
        default: true
      },
      striped: {
        type: Boolean,
        default: true
      },
      bordered: {
        type: Boolean,
        default: false
      },
      small: {
        type: Boolean,
        default: false
      },
      fixed: {
        type: Boolean,
        default: false
      }
    },
    data: () => {
      return {
        items: [],
        searchby: 'city',
        filter: null,
        selectWishList: '',
        selectWishListOption: [],
        deleteModal: false,
        isviewModal: false,
        deleteComapanyId: '',
        view_price_data: [],
        isdeleteModal: false,
        isSubmit: false,
        city: [],
        price_data: [],
        store: [],
        company: [],
        delete_uid: '',
        isAddPriceModal: false,
        category: [],
        isaddmodal: false,
        iseditmodal: false,
        isBusy: false,
        fields: [],
        sum_price: {},
        currentPage: 1,
        totalRows: 0,
        wishlistuid: '',
        pageLoadingCount: 1,
        allProducts: [],
        productLatestUid: '',
        pageSize: 10,
        gotoPage: 1
      }
    },
    methods: {
      checkButton (param) {
        var userRole = JSON.parse(localStorage.getItem('user_role'))
        var isHide = false
        for (const key in userRole) {
          if (userRole[key] === param) {
            isHide = true
          }
        }
        console.log(param, 'is', isHide)
        return isHide
      },
      onDeleteOPenModal (uid) {
        this.delete_uid = uid
        console.log(uid)
        this.isdeleteModal = true
      },

      deleteSubmit () {
        var updates = {}
        console.log(this.delete_uid)
        updates['/products/' + this.delete_uid] = null
        firebase.database().ref().update(updates)
        this.isdeleteModal = false

        for (const key in this.allProducts) {
          if (this.allProducts[key]._uid === this.delete_uid) {
            this.allProducts.splice(key, 1)
          }
        }
        this.items = this.allProducts
        this.$store.dispatch('deleteProduct', this.delete_uid)
        this.searchByCity()
      },
      getBadge (status) {
        return status === '1' ? 'active'
          : status === '2' ? 'inactive'
            : status === 'active' ? 'primary'
              : status === 'inactive' ? 'danger' : 'inactive'
      },
      init () {
        let fields = []
        fields = [
          { key: 'product_name', sortable: true },
          { key: 'barcode', sortable: true }
        ]
        for (const key in this.store) {
          fields.push({ key: this.store[key].store_name, sortable: true })
          this.sum_price[this.store[key].store_name] = 0
        }
        fields.push({ key: 'store_cheapest_location', sortable: true })
        this.sum_price['cheapest_price'] = 0

        fields.push({ key: 'action', sortable: true })
        this.fields = fields
        this.searchByCity()
      },
      onDeleteModal (index) {
        this.price_data.splice(index, 1)
      },
      getcompany () {
        firebase.database().ref('/companys/').once('value').then((snapshot) => {
          var allusers = []
          for (const key in snapshot.val()) {
            var value = snapshot.val()[key]
            value._uid = key
            allusers.push({ value, text: value.company_name })
          }
          this.company = allusers
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      getcity () {
        firebase.database().ref('/citys/').once('value').then((snapshot) => {
          var allusers = []
          for (const key in snapshot.val()) {
            var value = snapshot.val()[key]
            value._uid = key
            allusers.push(value)
          }
          this.city = allusers
          this.init()
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      onSelectList (param) {
        this.wishlistuid = param
        this.searchByCity(param)
      },
      onSelectSearchBy (param) {
        let fields = []
        this.items = this.$store.getters.product
        this.searchByCity()
        fields.push({ key: 'product_name' })
        fields.push({ key: 'barcode' })
        if (param === 'city') {
          for (const key in this.city) {
            if (this.store.hasOwnProperty(key)) {
              fields.push({ key: this.city[key].city_name })
            }
          }
          fields.push({ key: 'city_cheapest_location' })
          fields.push({ key: 'action' })
        } else {
          for (const key in this.store) {
            if (this.store.hasOwnProperty(key)) {
              fields.push({ key: this.store[key].store_name })
            }
          }
          fields.push({ key: 'store_cheapest_location' })
          fields.push({ key: 'action' })
        }
        this.fields = fields
        console.log(this.fields)
      },
      getstore () {
        firebase.database().ref('/stores/').once('value').then((snapshot) => {
          var allusers = []
          for (const key in snapshot.val()) {
            var value = snapshot.val()[key]
            value._uid = key
            allusers.push(value)
          }
          this.store = allusers
          this.getcity()
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      getWishList () {
        firebase.database().ref('/wishlists/').once('value').then((snapshot) => {
          var allusers = []
          for (const key in snapshot.val()) {
            var value = snapshot.val()[key]
            value._uid = key
            allusers.push({ value: key, text: value.wash_name })
          }
          this.selectWishListOption = allusers
          try {
            this.selectWishList = allusers[0].value
            this.wishlistuid = allusers[0].value
          } catch (error) {
            console.log(error)
          }
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      getcategory () {
        firebase.database().ref('/categorys/').once('value').then((snapshot) => {
          var allusers = []
          for (const key in snapshot.val()) {
            var value = snapshot.val()[key]
            value._uid = key
            allusers.push({ value, text: value.category_name })
          }
          this.category = allusers
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      searchByCity (wishUid) {
        var tmpAll = this.$store.getters.product
        var tmpItems = []
        if (!wishUid) {
          wishUid = this.wishlistuid
        }
        for (const key in tmpAll) {
          var isContinue = false
          if (!tmpAll[key].hasOwnProperty('wishlist')) {
            continue
          } else {
            for (const wish in tmpAll[key].wishlist) {
              if (tmpAll[key].wishlist[wish] === wishUid) {
                isContinue = true
                continue
              }
            }
          }
          if (!isContinue) {
            continue
          }
          tmpItems.push(tmpAll[key])
        }
        this.items = tmpItems
      },
      onchangePage (page) {
      },
      onGoToPage () {
        this.currentPage = parseInt(this.gotoPage)
      },
      getRowCount (items) {
        return items.length
      },
      loadOnce () {
        let allusers = []
        console.log(this.sum_price)
        let tmpproduct = this.$store.getters.product
        for (const key in tmpproduct) {
          var user = []
          var cityCheapest = ''
          var storeCheapest = ''
          // let maxPrice = 1000000000
          let maxPriceStore = 100000000000
          var product = tmpproduct[key]
          user = tmpproduct[key]
          user['product_name'] = tmpproduct[key].product_name
          user['barcode'] = tmpproduct[key].barcode
          user['action'] = key
          // for (const city in this.city) {
          //   for (const i in product.product_price) {
          //     if (product.product_price.hasOwnProperty(i)) {
          //       if (product.product_price[i].city.city_name === this.city[city].city_name) {
          //         if (maxPrice > parseInt(product.product_price[i].price)) {
          //           maxPrice = isNaN(product.product_price[i].price) ? 0 : parseInt(product.product_price[i].price)
          //           cityCheapest = this.city[city].city_name
          //         }
          //         user[this.city[city].city_name] = product.product_price[i].price
          //         if (isNaN(sum[this.city[city].city_name])) {
          //           sum[this.city[city].city_name] = 0
          //         }
          //         sum[this.city[city].city_name] += isNaN(product.product_price[i].price) ? 0 : parseInt(product.product_price[i].price)
          //       }
          //     }
          //   }
          // }
          for (const store in this.store) {
            for (const i in product.product_price) {
              if (product.product_price.hasOwnProperty(i)) {
                if (product.product_price[i].store.store_name === this.store[store].store_name) {
                  if (maxPriceStore > parseInt(product.product_price[i].price)) {
                    maxPriceStore = isNaN(product.product_price[i].price) ? 0 : parseInt(product.product_price[i].price)
                    storeCheapest = this.store[store].store_name
                  }
                  user[this.store[store].store_name] = product.product_price[i].price
                }
              }
            }
          }
          user['city_cheapest_location'] = cityCheapest
          user['cheapest_price'] = maxPriceStore === 100000000000 ? 0 : maxPriceStore
          user['store_cheapest_location'] = storeCheapest
          allusers.push(user)
        }
        this.allProducts = allusers
      },
      checkDuplication (param) {
        console.log('------------', param.length)
        var tem
        var i = 0
        var j
        while (i < param.length) {
          tem = param[i]._uid
          j = param.length - 1
          while (j > i) {
            if (param[j]._uid === tem) {
              console.log('------------', param[j])
              param.splice(j, 1)
            }
            --j
          }
          ++i
        }
        return param
      },
      getSumPrice (object) {
        var sum = {}
        for (const key in this.store) {
          sum[this.store[key].store_name] = 0
        }
        sum['cheapest_price'] = 0
        for (const key in object) {
          for (const index in object[key]) {
            if (sum.hasOwnProperty(index)) {
              sum[index] += isNaN(object[key][index]) ? 0 : parseInt(object[key][index])
            }
          }
        }
        return sum
      },
      loadData () {
        setTimeout(this.loadOnce, 1000)
      }
    },
    mounted () {
      this.getstore()
      this.getWishList()
      this.loadData()
    },
    computed: {
      perPage: function () {
        return parseInt(this.pageSize)
      },
      sortOptions () {
        return this.fields.filter(f => f.sortable).map(f => { return { text: f.label, value: f.key } })
      },
      currentItems: function () {
        return this.items
      },
      currentSum: function () {
        return this.getSumPrice(this.items)
      }
    }
  }
</script>

<style>
.add_button {
		margin-bottom: 15px;
}

</style>

