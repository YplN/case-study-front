<script setup lang="ts">
import type { Survey } from '@/interfaces/interfaces'
import { generateSortedSurveyUrl } from '@/services/UrlHandler'
import axios from 'axios'
import { computed, ref, watchEffect, onMounted } from 'vue'

const emits = defineEmits(['surveySelected'])
const props = defineProps<{ userUuid: string }>()
const answeredSurveys = ref<Array<Survey> | null>(null)
const notAnsweredSurveys = ref<Array<Survey> | null>(null)

const hasNotAnswered = computed(() => notAnsweredSurveys.value && notAnsweredSurveys.value.length)

const hasAnswered = computed(() => answeredSurveys.value && answeredSurveys.value.length)

const hasNothing = computed(() => !answeredSurveys.value && !notAnsweredSurveys.value)

const fetching = ref<{
  isFetching: boolean
  error: boolean
}>({
  isFetching: false,
  error: false
})

onMounted(() => {
  emits('surveySelected', '')
})

watchEffect(async () => {
  try {
    fetching.value.isFetching = true
    fetching.value.error = false
    const fetchUrl = generateSortedSurveyUrl(props.userUuid)
    const response = await axios.get(fetchUrl)

    answeredSurveys.value = response.data.answered
    notAnsweredSurveys.value = response.data.notAnswered
    fetching.value.isFetching = false
  } catch (error) {
    console.error('Error fetching surveys:', error)
    fetching.value.error = true
  }
})

function handleSurveyClick(title: string) {
  emits('surveySelected', title)
}
</script>

<template>
  <div v-if="fetching.error">Error while fetching the surveys. Please try again.</div>
  <div v-else-if="fetching.isFetching">Fetching the surveys...</div>
  <div v-else-if="hasNothing">Nothing to see here...</div>
  <h1 v-if="hasNotAnswered">List of surveys</h1>

  <ul v-if="notAnsweredSurveys">
    <li v-for="{ id, title, desc } in notAnsweredSurveys">
      <router-link
        :to="{ path: `/surveys/${id}` }"
        @click="handleSurveyClick(title)"
        class="commit"
        >{{ title }}</router-link
      >
      - <span class="message">{{ desc }}</span>
    </li>
  </ul>

  <h1 v-if="hasAnswered">Already answered</h1>
  <ul v-if="answeredSurveys">
    <li v-for="{ id, title, desc } in answeredSurveys" class="answered">
      <a href="#" class="commit">{{ title }}</a>
      - <span class="message">{{ desc }}</span
      ><br />
    </li>
  </ul>
</template>

<style>
ul {
  list-style: none;
}

li {
  margin-bottom: 0.5em;
}
.answered {
  opacity: 0.3;
}
</style>
