<template>
    <div class="list-container">
      <ul>
        <li v-for="item in list" >
            <div class="item-container" @click="navigateToItem(item.ID)">
                <div class="item-name">{{ item.Name }}</div>
                <div class="item-price">NT${{ item.Price }}</div>
                <div class="item-seller">{{ item.Seller }}</div>
            </div>
        </li>
      </ul>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
defineProps({
  list: {
    type: Array as () => { ID: number; Name: string; Seller: string; Price: number; Quantity: number }[],
    required: true
  }
});
const navigateToItem = (ID: number) => {
      router.push({ name: 'item', params: { ID } });
};
</script>

<style scoped>
.list-container {
background-color: transparent;
width: 70%;
margin-left: 15%;
margin-top: 35px;
}
ul {
list-style-type: none;
padding: 0;
margin: 0;
color: #efefef;
}
li {
box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
padding: 0.5rem;
margin-bottom: 25px;
}
li:last-child {
border-bottom: none;
}

.item-container {
    display: flex;
    flex-direction: column;
    cursor: pointer;
}

.item-name{
    font-size: 24px;
    font-weight: bold;
}
.item-seller{
    color: gray;
}
.item-price{
    align-self: flex-end; /* Price on the right */
    vertical-align: middle;
    font-weight: bold;
} 

</style>
