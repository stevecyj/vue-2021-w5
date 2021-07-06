import userProductModal from './userProductModal.js';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'steve-hex';

Vue.createApp({
  data() {
    return {
      loadingStatus: {
        loadingItem: '',
      },
      products: [],
      product: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {},
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    getProducts() {
      const url = `${apiUrl}/api/${apiPath}/products`;
      axios.get(url).then((res) => {
        if (res.data.success) {
          console.log(res.data.products);
          this.products = res.data.products;
        } else {
          alert(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    getProduct(id) {
      const url = `${apiUrl}/api/${apiPath}/product/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.get(url).then((res) => {
        if (res.data.success) {
          this.loadingStatus.loadingItem = '';
          this.product = res.data.product;
          this.$refs.userProductModal.openModal();
        } else {
          alert(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    addToCart(id, qty = 1) {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      this.loadingStatus.loadingItem = id;
      const cart = {
        product_id: id,
        qty,
      };

      this.$refs.userProductModal.hideModal();
      axios.post(url, { data: cart }).then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        } else {
          alert(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    deleteAllCarts() {
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(url).then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          this.getCart();
        } else {
          alert(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    getCart() {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios.get(url).then((res) => {
        if (res.data.success) {
          this.cart = res.data.data;
        } else {
          alert(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    removeCartItem(id) {
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.delete(url).then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        } else {
          alert(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    createOrder() {
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios.post(url, { data: order }).then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.getCart();
        } else {
          alert(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
  },
  created() {
    this.getProducts();
    this.getCart();
  },
})
  .component('userProductModal', userProductModal)
  .mount('#app');