export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'primary',
        text: 'Satus'
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
      icon: 'icon-star',
      children: [
        {
          name: 'User Table',
          url: '/user/usertable',
          icon: 'icon-user'
        },
        {
          name: 'Add User',
          url: '/user/addUser',
          icon: 'icon-note'
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
      icon: 'icon-basket-loaded',
      children: [
        {
          name: 'Product Table',
          url: '/product/table',
          icon: 'icon-basket'
        },
        {
          name: 'Add Product',
          url: '/product/add',
          icon: 'icon-star'
        }
        // {
        //   name: 'Compare Price',
        //   url: '/product/compare',
        //   icon: 'icon-shop'
        // }
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
      icon: 'icon-speedometer',
      badge: {
        variant: 'primary'
      }
    },
    {
      name: 'City & Store',
      url: '/price',
      icon: 'icon-basket-loaded',
      children: [
        {
          name: 'Category',
          url: '/category',
          icon: 'icon-basket'
        },
        {
          name: 'City',
          url: '/city',
          icon: 'icon-basket'
        },
        {
          name: 'Store',
          url: '/store',
          icon: 'icon-star'
        },
        {
          name: 'Package',
          url: '/package',
          icon: 'icon-star'
        },
        {
          name: 'measurement',
          url: '/measurement',
          icon: 'icon-star'
        }
      ]
    }
  ]
}
