
<!-- ProductCard.vue -->
<template>
  <div class="group relative bg-steam-card rounded-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 animate-fade-in-scale">
    <div class="aspect-[3/2] overflow-hidden">
      <img
          :src="imageUrl"
          :alt="name"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
      />
    </div>
    <div class="p-4">
      <h2 class="text-lg font-bold text-white">{{ name }}</h2>
      <p v-if="discountPercentage" class="text-gray-400 line-through">${{ price.toFixed(2) }}</p>
      <p class="text-steam-success font-bold">${{ discountedPrice.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "ProductCard",
  props: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, required: false },
    imageUrl: { type: String, required: true },
  },
  setup(props) {
    const discountedPrice = computed(() => {
      return props.discountPercentage
          ? props.price * (1 - props.discountPercentage / 100)
          : props.price;
    });

    return { discountedPrice };
  },
});
</script>

<style scoped>
.group {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
