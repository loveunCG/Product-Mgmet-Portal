<template>
<div>
  <b-card>

    <div slot="header">
      <strong>Product </strong> <small></small>
    </div>
    <b-row>
      <b-col sm="3">
        <b-form-group>
          <label for="company">Barcode</label>
          <b-form-input
          type="text"
          v-model="searchForm.barcode"
          placeholder="Enter your Barcode"
          />
        </b-form-group>
      </b-col>
      <b-col sm="3">
        <label for="product_category">product category</label>
        <b-form-select
        id="product_category"
        v-model="searchForm.product_category"
        :options="category"
        size="md" />
      </b-col>
      <b-col sm="3" >
        <b-form-group>
          <label for="product_category">company</label>
        <b-form-select id="product_category" v-model="searchForm.company" :options="company" size="md" />
        </b-form-group>
      </b-col>
      <b-col sm="3">
        <label for="product_category">product package</label>
        <b-form-select
        id="product_category"
        v-model="searchForm.product_package"
        :options="package"
        size="md" />
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="3" offset-sm="8">
        <b-form-group>
          <b-button variant="success" class="pull-left" v-on:click="search()"><i class="fa fa-search"></i>&nbsp;search</b-button>
          <b-button variant="info" class="pull-right" v-on:click="clear()"><i class="fa fa-circle-thin"></i>&nbsp;clear</b-button>
         </b-form-group>
      </b-col>
    </b-row>
  </b-card>
  <b-card>
    <div slot="header">
       Company Table
    </div>
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

    <b-button variant="primary" class="add_button float-right" v-on:click="onAddModal"><i class="fa fa-plus"></i>&nbsp;Add</b-button>
    <b-row>
      <b-col md="3"  offset-md="6">
        <b-form-group>
          <label for="vat">Page Size</label>
          <b-form-input
          type="number"
          v-model="pageSize"
          placeholder="0">
          </b-form-input>
        </b-form-group>
      </b-col>
      <b-col md="3" class="pull-right">
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
    <b-table :hover="hover" :striped="striped" :bordered="bordered" :small="small" responsive="sm"
    :items="currentItems"
    :filter="filter"
    :fields="fields"
    :current-page="currentPage"
    :per-page="perPage">
      <template slot="status" slot-scope="data">
        <b-badge :variant="getBadge(data.item.status)">{{data.item.status}}</b-badge>
      </template>
      <template slot="action" slot-scope="data">
        <b-button variant="success" v-on:click="onEditModel(data.item.action)"><i class="fa fa-edit"></i></b-button>
        <b-button variant="danger" v-on:click="onDeleteOPenModal(data.item.action)"><i class="fa fa-trash"></i></b-button>
        <b-button variant="danger" v-on:click="onAddlist(data.item.action)"><i class="fa fa-plus"></i></b-button>
      </template>
      <template slot="product_price" slot-scope="data">
        <b-button variant="success" class="md-12" v-on:click="onViewModel(data.item.action)"><i class="fa fa-eye"></i>&nbsp;view</b-button>
      </template>
    </b-table>
    <nav>
      <b-pagination
      v-on:change="onchangePage"
      :total-rows="getRowCount(items)"
      :per-page="perPage"
      v-model="currentPage"
      prev-text="Prev"
      next-text="Next"
      hide-goto-end-buttons/>
    </nav>
    <b-modal title="Product Edit" hide-footer class="modal-info" size="lg" v-model="iseditmodal" @ok="editSubmit" ok-variant="primary">
          <div slot="header">
            <strong>Product </strong> <small></small>
          </div>
          <b-row>
            <b-col sm="4">
              <b-form-group>
                <label for="company">Product Name</label>
                <b-form-input
                type="text"
                v-model="editForm.product_name"
                id="company"
                v-on:change="onchangePage"
                placeholder="Enter your Product name"
                />
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group>
                <label for="company">Barcode</label>
                <b-form-input
                v-on:change="onchangePage"
                type="text"
                v-model="editForm.barcode"
                id="company"
                placeholder="Enter your Product name"
                />
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group>
                <label for="vat">Product size</label>
                <b-form-input
                type="number" id="vat"
                v-on:change="onchangePage"
                v-model="editForm.product_size"
                placeholder="0">
                </b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="4">
              <b-form-group>
                <label for="unit">Product unit</label>
                <b-form-select id="product_category"
                v-on:change="onchangePage"
                v-model="editForm.product_unit" :options="unit" size="md" />
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group>
                <label for="postal-code">items per box</label>
                <b-form-input
                v-on:change="onchangePage"
                type="text"
                id="postal-code"
                placeholder="Please insert items per box"
                v-model="editForm.items_of_box"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <label for="product_category">product category</label>
              <b-form-select
              v-on:change="onchangePage"
              v-model="editForm.product_category"
              :options="category"
              size="md" />
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="4">
              <b-form-group>
               <label for="product_category">company</label>
              <b-form-select id="product_category"
              v-on:change="onchangePage"
              v-model="editForm.company" :options="company" size="md" />
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group
                label="photo"
                label-for="fileInputMulti">
                   <b-form-file
                   accept=".jpg, .png, .gif"
                   v-on:input="onInsertFile()"
                   v-model="editForm.photo" placeholder="Choose a file..."></b-form-file>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <label for="product_category">product package</label>
              <b-form-select
              id="product_category"
              v-on:change="onchangePage"
              v-model="editForm.product_package"
              :options="package"
              size="md" />
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12">
              <b-card-group>
                <b-card
                title=""
                v-for="(url, index) in photoUrl" :key="index"
                      v-bind:img-src="url.url"
                      img-alt="Image"
                      img-top
                      tag="article"
                      style="max-width: 12rem;"
                      class="mb-2">
                  <b-button
                  v-on:click = "ondeleteImg(url)"
                  variant="primary"><i class="fa fa-trash"></i></b-button>
                </b-card>
              </b-card-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="4">
              <b-form-group>
                <b-button variant="primary"
                v-on:click="addPriceModel" class="pull-right">Add Price</b-button>
              </b-form-group>
            </b-col>
            <b-col sm="8">
              <b-list-group >
                <b-list-group-item
                v-for="(rprice, index) in price_data" :key="index">
                  Price value: {{rprice.price}}&nbsp;&nbsp;
                  City: {{rprice.city.city_name}}&nbsp;&nbsp;
                  Store: {{rprice.store.store_name}}&nbsp;&nbsp;
                 <b-button
                 variant="danger"
                 v-on:click="onDeleteModal(index)"
                 class="pull-right"><i class="fa fa-trash"></i></b-button>
                </b-list-group-item>
              </b-list-group>
            </b-col>
          </b-row>
          <div class="form-group form-actions pull-right add_button">
            <b-button type="submit" v-on:click="editSubmit" :disabled="isSubmit" variant="primary">Save</b-button>
          </div>
    </b-modal>
    <b-modal title="Price Info" v-model="isviewModal" @ok="isviewModal = false">
      <b-list-group>
          <b-list-group-item v-for="(rprice, index) in view_price_data" :key="index">
              Price value: {{rprice.price}}&nbsp;&nbsp;
              City: {{rprice.city.city_name}}&nbsp;&nbsp;
              Store: {{rprice.store.store_name}}&nbsp;&nbsp;
          </b-list-group-item>
      </b-list-group>
    </b-modal>
    <b-modal title="Add Price" class="modal-success" v-model="isAddPriceModal" @ok="addPriceSubmit" ok-variant="success">
           <b-row>
            <b-col sm="4">
              <b-form-group>
                <label for="name">Price</label>
                <b-form-input type="text"
                id="name"
                v-model="price.price"
                placeholder="Enter Price"/>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group >
                <label for="month1">City</label>
                <b-form-select id="month1"
                  :plain="true"
                  v-model="price.city"
                  :options="city">
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group>
                <label for="year1">Store</label>
                <b-form-select id="year1"
                  :plain="true"
                  v-model="price.store"
                  :options="store">
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
      </b-modal>

    <b-modal title="Info" class="modal-info" v-model="isdeleteModal" @ok="deleteSubmit">
      are you sure delete this Product?
    </b-modal>
    <b-modal title="Add Wish List" class="modal-info" v-model="isAddListModal" @ok="addWishList">
      <b-col sm="12">
         <b-form-group>
            <label for="unit">Work List</label>
            <b-form-select id="product_category" v-model="wishList_uid" :options="wishlists" size="md" />
         </b-form-group>
         <b-list-group>
           <b-list-group-item
                v-for="(rprice, index) in editForm.wishlist" :key="index">
                  Wish List: {{wishList_data[rprice].wash_name}}&nbsp;
                 <b-button
                 variant="danger"
                 v-on:click="ondeleteWishList(index)"
                 class="pull-right"><i class="fa fa-trash"></i></b-button>
            </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-modal>
  </b-card>
</div>
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
        default: false
      },
      striped: {
        type: Boolean,
        default: false
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
        photoUrl: [],
        allProducts: [],
        deleteModal: false,
        isviewModal: false,
        wishList_uid: '',
        product_uid: '',
        view_price_data: [],
        isAddListModal: false,
        lastuid: '',
        editForm: {
          product_name: '',
          product_package: {},
          product_size: '',
          barcode: '',
          photo: [],
          product_unit: '',
          product_category: {},
          product_price: [],
          items_of_box: '',
          is_active: '',
          _uid: '',
          company: {}
        },
        searchForm: {
          product_category: {},
          barcode: '',
          product_package: {},
          company: {}
        },
        wishlists: [],
        isdeleteModal: false,
        isSubmit: true,
        city: [],
        filter: null,
        price_data: [],
        price: {
          price: '',
          store: {},
          city: {}
        },
        store: [],
        unit: [],
        package: [],
        company: [],
        delete_uid: '',
        isAddPriceModal: false,
        category: [],
        isaddmodal: false,
        iseditmodal: false,
        isBusy: false,
        fields: [
          {key: 'product_name', text: 'Product Name', sortable: true},
          {key: 'barcode', sortable: true},
          {key: 'product_package'},
          {key: 'product_size', text: 'Product Size'},
          {key: 'items_of_box', text: 'Item Number'},
          {key: 'created_at', text: 'Created Time'},
          {key: 'product_category', text: 'Created Time'},
          {key: 'product_unit', text: 'Product Unit'},
          {key: 'company', text: 'Producted Company'},
          {key: 'product_price'},
          {key: 'action'}
        ],
        wishList_data: [],
        loadcount: 1,
        pageSize: 10,
        totalRows: 0,
        currentPage: 1,
        gotoPage: 1
      }
    },
    computed: {
      perPage: function () {
        return parseInt(this.pageSize)
      },
      currentItems: function () {
        return this.items
      }
    },
    methods: {
      ondeleteImg (img) {
        var storageRef = firebase.storage().ref()
        var desertRef = storageRef.child(img.path)
        desertRef.delete().then(() => {
          var tmp = []
          for (const key in this.photoUrl) {
            if (this.photoUrl.hasOwnProperty(key)) {
              if (this.photoUrl[key].path === img.path) {
                continue
              }
            }
            tmp.push(this.photoUrl[key])
          }
          this.photoUrl = tmp
        }).catch((error) => {
          console.log(error)
        })
      },
      onInsertFile () {
        var _this = this
        if (this.editForm.barcode === '') {
          this.$msg('Please insert barcode!')
          return
        }
        var isFile = false
        try {
          isFile = this.editForm.photo.name
        } catch (error) {
          console.log(error)
        }
        var imagepath = 'images/' + this.editForm.barcode + '/' + this.editForm.photo.name
        var storageRef = firebase.storage().ref()
        var mountainsRef = storageRef.child(imagepath)
        if (isFile) {
          mountainsRef.put(this.editForm.photo).then(function (snapshot) {
            _this.photoUrl.push({url: snapshot.downloadURL, path: snapshot.metadata.fullPath})
          })
        }
        this.isSubmit = false
      },
      onGoToPage () {
        this.currentPage = parseInt(this.gotoPage)
      },
      getBadge (status) {
        return status === '1' ? 'active'
          : status === '2' ? 'inactive'
            : status === 'active' ? 'primary'
              : status === 'inactive' ? 'danger' : 'inactive'
      },
      ondeleteWishList (index) {
        this.editForm.wishlist.splice(index, 1)
        console.log(index)
      },
      deleteSubmit () {
        var updates = {}
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
      },
      editSubmit () {
        var updates = {}
        if (typeof this.price_data === 'undefined') {
          this.price_data = []
        }
        this.editForm.product_price = this.price_data
        this.editForm.photo = this.photoUrl
        updates['/products/' + this.editForm._uid] = this.editForm
        firebase.database().ref().update(updates)
        this.iseditmodal = false
        var user = {}
        var tmpProduct = []
        this.editForm.photo = this.photoUrl
        this.$store.dispatch('pushProduct', this.editForm)
        for (const key in this.items) {
          if (this.items[key]._uid === this.editForm._uid) {
            user = this.editForm
            user._uid = this.editForm._uid
            user.action = this.editForm._uid
            user.product_category = this.editForm.product_category.category_name
            user.product_unit = this.editForm.product_unit.unit_name
            user.company = this.editForm.company.company_name
            user.product_package = this.editForm.product_package.package_name
            console.log('that is user', user)
            tmpProduct.push(user)
          } else {
            tmpProduct.push(this.items[key])
          }
        }
        this.allProducts = tmpProduct
        this.items = tmpProduct
        this.isSubmit = true
        this.photoUrl = []
        this.$msg('Edit Comapny Successfuly!')
      },
      addWishList () {
        if (this.wishList_uid === '') {
          this.$msg('Please Select Work list!')
        } else {
          firebase.database().ref('/products/' + this.product_uid).once('value').then((snapshot) => {
            this.editForm._uid = this.product_uid
            var updates = {}
            for (const key in this.editForm.wishlist) {
              if (this.editForm.wishlist.hasOwnProperty(key)) {
                if (this.editForm.wishlist[key] === this.wishList_uid._uid) {
                  this.$msg('Already Added Wish list!')
                  return
                }
              }
            }
            var addwish = []
            if (typeof this.editForm.wishlist === 'undefined') {
              this.editForm.wishlist = []
            }
            addwish[this.wishList_uid._uid] = this.wishList_uid._uid
            try {
              this.editForm.wishlist.push(addwish[this.wishList_uid._uid])
            } catch (error) {
              console.log(error)
              this.editForm.wishlist = []
              this.editForm.wishlist.push(addwish[this.wishList_uid._uid])
            }
            updates['/products/' + this.product_uid] = this.editForm
            firebase.database().ref().update(updates)
            this.$store.dispatch('pushProduct', this.editForm)
            this.$msg('Successfuly Add list!')
          })
        }
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
      onAddlist (_uid) {
        this.product_uid = _uid
        firebase.database().ref('/products/' + _uid).once('value').then((snapshot) => {
          console.log(snapshot.val())
          this.editForm = snapshot.val()
          this.editForm._uid = _uid
          this.price_data = snapshot.val().product_price
          this.isAddListModal = true
        })
      },
      onEditModel (uid) {
        this.getcity()
        this.getcompany()
        this.getcategory()
        this.getstore()
        this.getunit()
        this.getpackage()
        this.photoUrl = []
        firebase.database().ref('/products/' + uid).once('value').then((snapshot) => {
          this.editForm = snapshot.val()
          this.editForm._uid = uid
          if (snapshot.val().hasOwnProperty('company')) {
            for (const key in this.company) {
              if (snapshot.val().company._uid === this.company[key].value._uid) {
                this.editForm.company = this.company[key].value
              }
            }
          }
          if (snapshot.val().hasOwnProperty('product_category')) {
            for (const key in this.category) {
              if (snapshot.val().product_category._uid === this.category[key].value._uid) {
                this.editForm.product_category = this.category[key].value
              }
            }
          }
          if (snapshot.val().hasOwnProperty('product_package')) {
            for (const key in this.package) {
              if (snapshot.val().product_package._uid === this.package[key].value._uid) {
                this.editForm.product_package = this.package[key].value
              }
            }
          }
          if (snapshot.val().hasOwnProperty('product_unit')) {
            for (const key in this.unit) {
              if (snapshot.val().product_unit._uid === this.unit[key].value._uid) {
                this.editForm.product_unit = this.unit[key].value
              }
            }
          }
          console.log(snapshot.val().photo)
          if (Array.isArray(snapshot.val().photo)) {
            this.photoUrl = snapshot.val().photo
          }
          this.price_data = snapshot.val().product_price
          console.log('that is editform', this.editForm)
          console.log('this is database data', snapshot.val())
          this.iseditmodal = true
        })
      },
      onViewModel (uid) {
        firebase.database().ref('/products/' + uid).once('value').then((snapshot) => {
          this.view_price_data = snapshot.val().product_price
          this.isviewModal = true
        })
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
            allusers.push({ value, text: value.city_name })
          }
          this.city = allusers
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      getstore () {
        firebase.database().ref('/stores/').once('value').then((snapshot) => {
          var allusers = []
          for (const key in snapshot.val()) {
            var value = snapshot.val()[key]
            value._uid = key
            allusers.push({ value, text: value.store_name })
          }
          this.store = allusers
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      addPriceModel () {
        this.isSubmit = false
        this.isAddPriceModal = true
      },
      onDeleteOPenModal (uid) {
        this.delete_uid = uid
        this.isdeleteModal = true
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
      addPriceSubmit () {
        if (!this.price_data || typeof this.price_data === 'undefined') {
          this.price_data = []
        }
        if (this.price.price) {
          this.price_data.push(this.price)
        } else {
          this.$msg('Add Price Failed! Please Input full data')
        }
        this.iseditmodal = true
        this.price = {}
      },
      getwishList () {
        firebase.database().ref('/wishlists/').once('value').then((snapshot) => {
          console.log(snapshot.val())
          this.wishList_data = snapshot.val()
          var allusers = []
          for (const key in snapshot.val()) {
            var value = snapshot.val()[key]
            value._uid = key
            allusers.push({ value, text: value.wash_name })
          }
          this.wishlists = allusers
          console.log(this.wishlists)
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      myProvider () {
        var allusers = []
        var lastuid = ''
        firebase.database().ref('/products/').orderByKey().limitToFirst(100).once('value').then((snapshot) => {
          for (const key in snapshot.val()) {
            var user = snapshot.val()[key]
            user._uid = key
            user.action = key
            user.product_category = user.product_category.category_name
            user.product_unit = user.product_unit.unit_name
            user.company = user.company.company_name
            user.product_package = user.product_package.package_name
            user.action = key
            lastuid = key
            allusers.push(user)
          }
          this.items = allusers
          this.lastuid = lastuid
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      onchangePage (page) {
        this.gotoPage = page
        this.isSubmit = false
      },
      search () {
        var items = (this.allProducts)
        var filterd = []
        for (const key in items) {
          if (this.searchForm.barcode !== '' && items[key].barcode !== this.searchForm.barcode) {
            continue
          }
          if (typeof this.searchForm.product_category.category_name !== 'undefined' && items[key].product_category !== this.searchForm.product_category.category_name) {
            console.log('this is')
            continue
          }
          if (typeof this.searchForm.company.company_name !== 'undefined' && items[key].company !== this.searchForm.company.company_name) {
            console.log('this is company')
            continue
          }
          if (typeof this.searchForm.product_package.package_name !== 'undefined' && items[key].product_package !== this.searchForm.product_package.package_name) {
            console.log('this is product_package')
            continue
          }
          filterd.push(items[key])
        }
        this.items = filterd
      },
      clear () {
        for (const key in this.searchForm) {
          this.searchForm[key] = ''
        }
        this.items = this.allProducts
        this.loadcount = 1
      },
      getRowCount (items) {
        return items.length
      },
      onAddModal () {
        this.$router.push('/product/add')
      },
      getpackage () {
        firebase.database().ref('/packages/').once('value').then((snapshot) => {
          var allusers = []
          for (const key in snapshot.val()) {
            var value = snapshot.val()[key]
            value._uid = key
            allusers.push({ value, text: value.package_name })
          }
          this.package = allusers
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      getunit () {
        firebase.database().ref('/units/').once('value').then((snapshot) => {
          var allusers = []
          for (const key in snapshot.val()) {
            var value = snapshot.val()[key]
            value._uid = key
            allusers.push({ value, text: value.unit_name })
          }
          this.unit = allusers
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      loadData () {
        setTimeout(this.onceLoading, 1000)
      },
      onceLoading () {
        console.log(this.$store.getters.product)
        let pushProduct = []
        let tmpproduct = this.$store.getters.product
        for (const key in tmpproduct) {
          var user = tmpproduct[key]
          if (user.product_category.hasOwnProperty('category_name')) {
            user.product_category = user.product_category.category_name
          }
          if (user.product_unit.hasOwnProperty('unit_name')) {
            user.product_unit = user.product_unit.unit_name
          }
          if (user.product_package.hasOwnProperty('package_name')) {
            user.product_package = user.product_package.package_name
          }
          if (user.company.hasOwnProperty('company_name')) {
            user.company = user.company.company_name
          }
          user._uid = key
          user.action = key
          pushProduct.push(user)
        }
        this.allProducts = pushProduct
        this.items = this.allProducts
      },
      stepLoading () {
        var allusers = this.allProducts
        var lastuid = ''
        firebase.database().ref('/products/').orderByKey().startAt(this.lastuid).limitToFirst(100).once('value').then((snapshot) => {
          if (Object.keys(snapshot.val()).length < 2) {
            this.lastuid = this.lastuid
            return
          }
          console.log('product table loading ', Object.keys(snapshot.val()).length)
          for (const key in snapshot.val()) {
            var user = snapshot.val()[key]
            user._uid = key
            user.action = key
            user.product_category = user.product_category.category_name
            user.product_unit = user.product_unit.unit_name
            user.company = user.company.company_name
            user.product_package = user.product_package.package_name
            user.action = key
            lastuid = key
            allusers.push(user)
          }
          this.allProducts = allusers
          this.items = this.allProducts
          this.search()
          this.lastuid = lastuid
        }).catch(err => {
          console.log(err)
          return []
        })
      }
    },
    mounted () {
      this.getcity()
      this.getstore()
      this.getcompany()
      this.getpackage()
      this.getcategory()
      this.getwishList()
      this.loadData()
    }
  }
</script>

<style>
.add_button {
		margin-bottom: 15px;
}
.img-card-photo {
    height: 80px;
}
.card-img-top {
  height: 150px;
}
</style>

