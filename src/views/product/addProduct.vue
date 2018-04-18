<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card>
          <div slot="header">
            <strong>Product </strong> <small></small>
          </div>
          <b-row>
            <b-col sm="4">
              <b-form-group>
                <label for="company">Product Name</label>
                <b-form-input
                type="text"
                v-model="addForm.product_name"
                id="company"
                placeholder="Enter your Product name"
                />
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group>
                <label for="company">Barcode</label>
                <b-form-input
                type="text"
                v-model="addForm.barcode"
                id="company"
                placeholder="Enter your Product Barcode"
                />
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group>
                <label for="vat">Product size</label>
                <b-form-input
                type="number" id="vat"
                v-model="addForm.product_size"
                placeholder="0">
                </b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="4">
              <b-form-group>
                <label for="unit">Product unit</label>
                <b-form-select id="product_category" v-model="addForm.product_unit" :options="unit" size="md" />
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group>
                <label for="postal-code">items per box</label>
                <b-form-input
                type="text"
                id="postal-code"
                placeholder="Please insert items per box"
                v-model="addForm.items_of_box"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <label for="product_category">product category</label>
              <b-form-select
              id="product_category"
              v-model="addForm.product_category"
              :options="category"
              size="md" />
            </b-col>

          </b-row>
          <b-row>
            <b-col sm="4">
              <b-form-group>
               <label for="product_category">company</label>
              <b-form-select id="product_category" v-model="addForm.company" :options="company" size="md" />
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <label for="product_category">product package</label>
              <b-form-select
              id="product_category"
              v-model="addForm.product_package"
              :options="package"
              size="md" />
            </b-col>
            <b-col sm="4">
              <b-form-group
                label="photo"
                label-for="fileInputMulti">
                   <b-form-file accept=".jpg, .png, .gif"
                   v-model="addForm.photo"
                   v-on:input="onInsertFile()"
                   placeholder="Choose a file..."></b-form-file>
              </b-form-group>
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
                      style="max-width: 20rem;"
                      class="mb-2 img-card-photo">
                  <b-button
                  v-on:click = "ondeleteImg(url)"
                  variant="primary"><i class="fa fa-trash"></i></b-button>
                </b-card>
              </b-card-group>
            </b-col>
          </b-row>
          <b-row class="price-add-button">
            <b-col sm="4">
              <b-form-group>
                <b-button variant="primary" v-on:click="addPriceModel" class="pull-right">Add Price</b-button>
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
          <div class="form-group form-actions pull-right">
            <b-button type="submit" v-on:click="onSubmit" :disabled="isSubmit" variant="primary"><i class="fa fa-dot-circle-o"></i> Submit</b-button>
            <b-button type="reset" v-on:click="reset" variant="danger"><i class="fa fa-ban"></i> Reset</b-button>
          </div>
        </b-card>
      </b-col>

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
    </b-row>
  </div>
</template>
<script>
import { required, minLength, email } from 'vuelidate/lib/validators'
import * as firebase from 'firebase'
import moment from 'moment'
export default {
  name: 'forms',
  data () {
    return {
      addForm: {
        product_name: '',
        barcode: '',
        product_size: '',
        photo: [],
        product_unit: '',
        product_category: {},
        product_price: [],
        product_package: {},
        items_of_box: '',
        company: {}
      },
      photoUrl: [],
      isSubmit: false,
      city: [],
      price_data: [],
      unit: [],
      package: [],
      price: {
        price: '',
        store: {},
        city: {}
      },
      store: [],
      company: [],
      category: [],
      isAddPriceModal: false,
      isUploadPhoto: false
    }
  },
  validations: {
    addForm: {
      usr_name: {
        required,
        minLength: minLength(5)
      },
      usr_email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(5)
      }
    }
  },
  methods: {
    ondeleteImg (img) {
      console.log(img)
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
      if (this.addForm.barcode === '') {
        this.$msg('Please insert barcode!')
        return
      }
      var isFile = false
      try {
        isFile = this.addForm.photo.name
      } catch (error) {
        console.log(error)
      }
      var imagepath = 'images/' + this.addForm.barcode + '/' + this.addForm.photo.name
      var storageRef = firebase.storage().ref()
      var mountainsRef = storageRef.child(imagepath)
      if (isFile) {
        mountainsRef.put(this.addForm.photo).then(function (snapshot) {
          console.log('Uploaded a blob or file!', snapshot.downloadURL, snapshot.metadata.fullPath)
          _this.photoUrl.push({url: snapshot.downloadURL, path: snapshot.metadata.fullPath})
        })
      }
    },
    onSubmit () {
      let isValidation = true
      console.log(this.addForm.photo)
      if (this.addForm.barcode === '') {
        this.$msg('Please insert barcode!')
        return
      }
      for (const key in this.addForm) {
        if (this.addForm.hasOwnProperty(key)) {
          if (this.addForm[key] === '') {
            isValidation = false
          }
        }
      }
      if (!isValidation) {
        this.$msg('Please insert full data!')
        return
      }
      this.addForm.created_at = moment().format('YYYY mm dd, h:mm:ss a')
      this.addForm.product_price = this.price_data
      this.addForm.photo = this.photoUrl
      console.log(this.addForm.photo)
      this.addForm._uid = this.addForm.barcode
      firebase.database().ref('products/' + this.addForm.barcode).set(this.addForm)
      firebase.database().ref('/products/' + this.addForm.barcode).once('value').then((snapshot) => {
        this.$store.dispatch('pushProduct', snapshot.val())
      })
      this.isaddmodal = true
      this.$msg('Add city Successfuly!')
      for (const key in this.addForm) {
        this.addForm[key] = ' '
      }
      this.price_data = []
      this.photoUrl = []
    },
    reset () {
      this.addForm = []
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
      this.isAddPriceModal = true
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
    addPriceSubmit () {
      if (!this.price_data) {
        this.price_data = []
      }
      if (this.price.price) {
        this.price_data.push(this.price)
      } else {
        this.$msg('Add Price Failed! Please Input full data')
      }
      this.price = {}
    }
  },
  computed: {
  },
  mounted () {
    this.getcity()
    this.getcompany()
    this.getcategory()
    this.getstore()
    this.getunit()
    this.getpackage()
  }
}
</script>

<style>
  .price-add-button {
    padding-top: 15px;
  }
  .form-actions {
    padding-top: 15px;
  }
  .img-card-photo {
    margin: 15px;
  }
  .card-img-top {
    height: 150px;
  }

</style>
