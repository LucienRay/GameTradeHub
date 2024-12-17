<template>
  <div class="container">
  <div class="product-upload steam-style">
    <h1>商品上架</h1>
    <form @submit.prevent="submitProduct">
      <div class="form-group">
        <label for="product-name">商品名稱：</label>
        <input v-model="product.name" type="text" id="product-name" placeholder="輸入商品名稱" required />
      </div>

      <div class="form-group">
        <label for="product-price">價格：</label>
        <input v-model.number="product.price" type="number" id="product-price" placeholder="輸入商品價格" min="1" required />
      </div>

      <div class="form-group">
        <label for="product-quantity">數量：</label>
        <input v-model.number="product.quantity" type="number" id="product-quantity" placeholder="輸入商品數量" min="1" required />
      </div>

      <div class="form-group">
        <label for="product-description">商品描述：</label>
        <textarea v-model="product.description" id="product-description" placeholder="輸入商品描述"></textarea>
      </div>

      <div class="form-group">
        <label for="product-category">遊戲分類：</label>
        <select v-model="product.category" id="product-category" required>
          <option disabled value="">請選擇分類</option>
          <option v-for="category in categories" :key="category.id" :value="category.name">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="product-image">商品圖片：</label>
        <input type="file" @change="onFileChange" id="product-image" accept="image/*" />
        <div v-if="product.imagePreview" class="image-preview">
          <img :src="product.imagePreview" alt="商品圖片預覽" />
        </div>
      </div>

      <button type="submit">提交商品</button>
    </form>
  </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: {
        name: '',
        price: null,
        description: '',
        category: '',
        image: null,
        imagePreview: null,
      },
      categories: [
        { id: 1, name: '電子產品' },
        { id: 2, name: '服裝' },
        { id: 3, name: '食品' },
        { id: 4, name: '家居用品' },
      ],
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        // 限制檔案類型
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
          alert('只允許上傳 JPEG 或 PNG 圖片！');
          event.target.value = ''; // 清空選擇的檔案
        }
      }
    },
    submitProduct() {
      if (!this.product.image) {
        alert('請上傳商品圖片！');
        return;
      }
      console.log('提交的商品資訊：', this.product);
      alert('商品已成功上架！');
      // 可將表單資料傳送至後端API
    },
  },
};

</script>

<style scoped>
.product-upload.steam-style {
  background-color: #1b2838; /* Steam 深色背景 */
  color: #ffffff; /* 淺色字體 */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  height: 100vh;
  margin: 0 auto;
  font-family: Arial, Helvetica, sans-serif;
}

.product-upload h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #66c0f4; /* Steam 藍色調 */
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #c7d5e0; /* 次要字體顏色 */
}

input,
textarea,
select {
  width: 100%;
  padding: 8px;
  background-color: #2a475e;
  border: 1px solid #4c6b84;
  color: #ffffff;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

#product-description {
  height: 100px; /* 設置商品描述的固定高度 */
  resize: none; /* 禁止調整大小 */
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #66c0f4;
}

button {
  background-color: #66c0f4; /* Steam 藍 */
  color: #ffffff;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

button:hover {
  background-color: #4a9fd4;
}

.image-preview {
  margin-top: 10px;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  height: auto;
  border: 2px solid #4c6b84;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.container {
  background-color: #2a475e; /* Steam 深色背景 */
}
</style>

