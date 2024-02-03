<script setup lang="ts">
import ListSurvey from '../components/ListSurvey.vue'
const props = defineProps(['userUuid'])

const emits = defineEmits(['surveySelected'])
function handleSurveySelected(title: string) {
  emits('surveySelected', title)
}
</script>

<template>
  <main>
    <ListSurvey :userUuid="userUuid" @surveySelected="handleSurveySelected" />
  </main>
</template>
