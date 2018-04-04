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
      children: [
        {
          name: 'User Table',
          url: '/user/usertable',
          icon: 'fa fa-user'
        },
        {
          name: 'Add User',
          url: '/user/addUser',
          icon: 'fa fa-user-plus'
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
      children: [
        {
          name: 'Product Table',
          url: '/product/table',
          icon: 'fa fa-shopping-cart'
        },
        {
          name: 'Add Product',
          url: '/product/add',
          icon: 'fa fa-shopping-bag'
        },
        {
          name: 'Compare Price',
          url: '/product/compare',
          icon: 'fa fa-scribd'
        },
        {
          name: 'Wish List',
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
      icon: 'fa fa-university',
      badge: {
        variant: 'primary'
      }
    },
    {
      name: 'City & Store',
      url: '/price',
      icon: 'fa fa-gears',
      children: [
        {
          name: 'Category',
          url: '/category',
          icon: 'fa fa-cube'
        },
        {
          name: 'City',
          url: '/city',
          icon: 'fa fa-archive'
        },
        {
          name: 'Store',
          url: '/store',
          icon: 'fa fa-microchip'
        },
        {
          name: 'Package',
          url: '/package',
          icon: 'fa fa-briefcase'
        },
        {
          name: 'measurement',
          url: '/measurement',
          icon: 'fa fa-opencart'
        }
      ]
    }
  ]
}
