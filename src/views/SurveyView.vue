<script setup lang="ts">
import SurveyComponent from '../components/SurveyComponent.vue'
defineProps(['userUuid'])
</script>

<template>
  <main>
    <SurveyComponent :userUuid="userUuid" />
  </main>
</template>
