<template>
  <div class="about">
    <h1>This is an about page</h1>
    
    <button @click="showModal1">Show Modal1</button>
    <Modal title="Model1 title goes here" ref="thisModal1">
        <template #body>This should be in the body</template>
        <template #footer>
            <button class="btn btn-primary">Extra footer button</button>
        </template>
    </Modal>

    <button @click="showModal2">Show Modal2</button>
    <Modal title="Model2 title goes here" ref="thisModal2">
        <template #body>This should be in the body</template>
        <template #footer>
            <button class="btn btn-primary">Extra footer button</button>
        </template>
    </Modal>

  </div>
</template>

<script setup>
import { ref } from "vue";
import Modal from "@/components/UI/Modal.vue";

let thisModal1 = ref(null);
let thisModal2 = ref(null);

function showModal1() {
    thisModal1.value.show();
}
function showModal2() {
    thisModal2.value.show();
}
</script>