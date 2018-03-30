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
                <b-form-input type="text"
                id="unit"
                v-model="addForm.product_unit"
                placeholder="Enter your unit"></b-form-input>
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
              <b-form-group
                label="photo"
                label-for="fileInputMulti">
                   <b-form-file v-model="addForm.photo" placeholder="Choose a file..."></b-form-file>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="4">
              <b-form-group>
                <b-button variant="primary" v-on:click="addPriceModel" class="pull-right">Add Price</b-button>
              </b-form-group>
            </b-col>
            <b-col sm="8">
              <b-list-group >
                <b-list-group-item
                v-for="(rprice, index) in price_data"
                >
                  Price value: {{rprice.price}}&nbsp;&nbsp;
                  City: {{rprice.city.city_name}}&nbsp;&nbsp;
                  Store: {{rprice.store.store_name}}&nbsp;&nbsp;
                 <b-button
                 variant="danger"
                 v-on:click="onDeleteModal(index)"
                 class="pull-right"><i class="fa fa-trash"></i>&nbsp;Delete</b-button>

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
        items_of_box: '',
        is_active: '',
        _uid: '',
        company: {}
      },
      isSubmit: false,
      city: [],
      price_data: [],
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
    onSubmit () {
      if (this.addForm.barcode === '') {
        this.$msg('Please insert barcode!')
        return
      }
      var ref = firebase.database().ref()
      var pushref = ref.child('products')
      this.addForm.created_at = moment().format('YYYY mm dd, h:mm:ss a')
      this.addForm.product_price = this.price_data
      pushref.push(this.addForm)
      this.isaddmodal = true
      this.$msg('Add city Successfuly!')
      for (const key in this.addForm) {
        this.addForm[key] = ''
      }
      this.price_data = []
    },
    reset () {

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
    addPriceSubmit () {
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
  }
}
</script>
