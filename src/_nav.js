var userRole = JSON.parse(localStorage.getItem('user_role'))
var hasRole = (param) => {
  var isHide = true
  for (const key in userRole) {
    if (userRole[key] === param) {
      isHide = false
    }
  }
  return isHide
}
export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'fa fa-apple',
      badge: {
        variant: 'primary',
        text: 'Status'
      }
    },
    {
      title: true,
      name: 'User',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      }
    },
    {
      name: 'User Manager',
      url: '/user',
      icon: 'fa fa-users',
      hide: false,
      children: [
        {
          name: 'User Table',
          url: '/user/usertable',
          icon: 'fa fa-user',
          hide: hasRole('usertable')
        },
        {
          name: 'Add User',
          url: '/user/addUser',
          icon: 'fa fa-user-plus',
          hide: hasRole('adduser')
        }
      ]
    },
    {
      title: true,
      name: 'Product'
    },
    {
      name: 'Product',
      url: '/product',
      icon: 'fa fa-shopping-basket',
      hide: false,
      children: [
        {
          name: 'Product Table',
          url: '/product/table',
          icon: 'fa fa-shopping-cart',
          hide: hasRole('product_table')
        },
        {
          name: 'Add Product',
          url: '/product/add',
          hide: hasRole('add_product'),
          icon: 'fa fa-shopping-bag'
        },
        {
          name: 'Compare Price',
          hide: hasRole('compare'),
          url: '/product/compare',
          icon: 'fa fa-scribd'
        },
        {
          name: 'Wish List',
          hide: hasRole('wishlist'),
          url: '/product/wishlist',
          icon: 'fa fa-address-card'
        }
        // {
        //   name: 'Error 500',
        //   url: '/pages/500',
        //   icon: 'icon-star'
        // }
      ]
    },
    {
      name: 'Company',
      url: '/company',
      hide: hasRole('company'),
      icon: 'fa fa-university',
      badge: {
        variant: 'primary'
      }
    },
    {
      name: 'City & Store',
      url: '/price',
      hide: false,
      icon: 'fa fa-gears',
      children: [
        {
          name: 'Category',
          url: '/category',
          hide: hasRole('category'),
          icon: 'fa fa-cube'
        },
        {
          name: 'City',
          url: '/city',
          hide: hasRole('city'),
          icon: 'fa fa-archive'
        },
        {
          name: 'Store',
          url: '/store',
          hide: hasRole('store'),
          icon: 'fa fa-microchip'
        },
        {
          name: 'Package',
          url: '/package',
          hide: hasRole('package'),
          icon: 'fa fa-briefcase'
        },
        {
          name: 'measurement',
          url: '/measurement',
          hide: hasRole('unit'),
          icon: 'fa fa-opencart'
        }
      ]
    }
  ]
}
