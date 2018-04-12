<template>
  <b-card>
    <div slot="header">
       Company Table
    </div>
     <b-row>
        <b-col md="3" offset-md="3" class="pull-right add_button">
          <b-form-radio-group id="radios2"
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

    <b-table :hover="hover" :striped="striped" :small="small" :filter="filter" responsive="sm" :items="currentItems" :fields="fields" :current-page="currentPage" :per-page="perPage">

    </b-table>

    <nav>
      <b-pagination
      v-on:change="onchangePage"
      :total-rows="getRowCount(items)"
      :per-page="perPage"
      v-model="currentPage"
      prev-text="Prev"
      next-text="Next" hide-goto-end-buttons/>
    </nav>
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
      getBadge (status) {
        return status === '1' ? 'active'
          : status === '2' ? 'inactive'
            : status === 'active' ? 'primary'
              : status === 'inactive' ? 'danger' : 'inactive'
      },
      deleteSubmit () {
        var updates = {}
        updates['/products/' + this.delete_uid] = null
        firebase.database().ref().update(updates)
        this.isdeleteModal = false
        this.searchByCity()
      },
      init () {
        let fields = []
        fields = [
          { key: 'product_name', sortable: true }
        ]
        for (const key in this.city) {
          fields.push({ key: this.city[key].city_name, sortable: true })
        }
        fields.push({ key: 'city_cheapest_location', sortable: true })
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
        this.items = this.allProducts
        this.searchByCity()
        fields.push({ key: 'product_name' })
        if (param === 'city') {
          for (const key in this.city) {
            if (this.store.hasOwnProperty(key)) {
              fields.push({ key: this.city[key].city_name })
            }
          }
          fields.push({ key: 'city_cheapest_location' })
        } else {
          for (const key in this.store) {
            if (this.store.hasOwnProperty(key)) {
              fields.push({ key: this.store[key].store_name })
            }
          }
          fields.push({ key: 'store_cheapest_location' })
        }
        console.log(fields)
        this.fields = fields
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
        var tmpAll = this.allProducts
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
        console.log(this.$store.getters.product)
        let allusers = []
        let tmpproduct = this.$store.getters.product
        for (const key in tmpproduct) {
          var user = []
          var cityCheapest = ''
          var storeCheapest = ''
          let maxPrice = 0
          let maxPriceStore = 0
          var product = tmpproduct[key]
          user = tmpproduct[key]
          user['product_name'] = tmpproduct[key].product_name
          for (const city in this.city) {
            for (const i in product.product_price) {
              if (product.product_price.hasOwnProperty(i)) {
                if (product.product_price[i].city.city_name === this.city[city].city_name) {
                  if (maxPrice < parseInt(product.product_price[i].price)) {
                    maxPrice = product.product_price[i].price
                    cityCheapest = this.city[city].city_name
                  }
                  user[this.city[city].city_name] = product.product_price[i].price
                }
              }
            }
          }
          for (const store in this.store) {
            for (const i in product.product_price) {
              if (product.product_price.hasOwnProperty(i)) {
                if (product.product_price[i].store.store_name === this.store[store].store_name) {
                  if (maxPriceStore < parseInt(product.product_price[i].price)) {
                    maxPriceStore = product.product_price[i].price
                    storeCheapest = this.store[store].store_name
                  }
                  user[this.store[store].store_name] = product.product_price[i].price
                }
              }
            }
          }
          user['city_cheapest_location'] = cityCheapest
          user['store_cheapest_location'] = storeCheapest
          allusers.push(user)
        }
        this.allProducts = allusers
        this.items = this.allProducts
      },
      setepLoading () {
        var allusers = this.allProducts
        firebase.database().ref('/products/').orderByKey().startAt(this.productLatestUid).limitToFirst(100).once('value').then((snapshot) => {
          if (Object.keys(snapshot.val()).length < 2) {
            return
          }
          for (const key in snapshot.val()) {
            var user = []
            var cityCheapest = ''
            var storeCheapest = ''
            let maxPrice = 0
            let maxPriceStore = 0
            var product = snapshot.val()[key]
            user = snapshot.val()[key]
            user['product_name'] = snapshot.val()[key].product_name
            for (const city in this.city) {
              for (const i in product.product_price) {
                if (product.product_price.hasOwnProperty(i)) {
                  if (product.product_price[i].city.city_name === this.city[city].city_name) {
                    if (maxPrice < parseInt(product.product_price[i].price)) {
                      maxPrice = product.product_price[i].price
                      cityCheapest = this.city[city].city_name
                    }
                    user[this.city[city].city_name] = product.product_price[i].price
                  }
                }
              }
            }
            for (const store in this.store) {
              for (const i in product.product_price) {
                if (product.product_price.hasOwnProperty(i)) {
                  if (product.product_price[i].store.store_name === this.store[store].store_name) {
                    if (maxPriceStore < parseInt(product.product_price[i].price)) {
                      maxPriceStore = product.product_price[i].price
                      storeCheapest = this.store[store].store_name
                    }
                    user[this.store[store].store_name] = product.product_price[i].price
                  }
                }
              }
            }
            user['city_cheapest_location'] = cityCheapest
            user['store_cheapest_location'] = storeCheapest
            allusers.push(user)
          }
          this.allProducts = allusers
          this.items = this.allProducts
          this.searchByCity(this.wishlistuid)
        }).catch(err => {
          console.log(err)
          return []
        })
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
      }
    }
  }
</script>

<style>
.add_button {
		margin-bottom: 15px;
}

</style>

