<script setup lang="ts">
import { ref, watchEffect, defineProps, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { MessageObject, Form, Question, UserUuid } from '@/interfaces/interfaces'
import { generateSurveyForUserUrl, generateSurveySubmissionUrl } from '@/services/UrlHandler'
import { useToast } from 'vue-toast-notification'
import router from '@/router'
import QuestionComponent from './QuestionComponent.vue'

const route = useRoute()
const $toast = useToast()

const HOME = '/surveys'
const props = defineProps<{ userUuid: UserUuid }>()
const questions = ref<Array<Question> | null>(null)
const hasSubmitted = ref<boolean>(false)
const form = ref<Form>({
  submissions: [],
  userUuid: props.userUuid
})
const messageObject = ref<MessageObject>({
  isError: false,
  message: '',
  link: null,
  timeoutId: null,
  link_text: null
})

function clearMessageTimeout() {
  if (messageObject.value.timeoutId) {
    clearTimeout(messageObject.value.timeoutId)
    messageObject.value.timeoutId = null
  }
}

onUnmounted(() => {
  clearMessageTimeout()
})

function redirectTo(link: string) {
  router.push(link)
}

function handleFetchResponse(response: any) {
  if (response.status === 200) {
    questions.value = response.data
    if (questions.value) {
      initializeFormSubmissions(questions.value)
    }
  } else if (response.status === 204) {
    handleSurveyDoesNotExist()
  } else {
    handleGenericError('Something went wrong while fetching the survey from the server')
  }
}

function initializeFormSubmissions(questions: Array<Question>) {
  form.value.submissions = questions.map((question) => ({
    questionId: question.id,
    rating: null
  }))
}

function createMessage(
  isError: boolean,
  message: string,
  link: string | null,
  timeoutId: number | null,
  link_text: string | null
) {
  messageObject.value.isError = isError
  messageObject.value.message = message
  messageObject.value.link = link
  if (timeoutId && link) {
    messageObject.value.timeoutId = setTimeout(() => {
      redirectTo(link)
    }, 3000)
    messageObject.value.link_text = link_text
  }
}
function handleSurveyDoesNotExist() {
  messageObject.value.isError = false
  messageObject.value.message =
    'This survey does not exist. You will be redirected to the main page in 3 seconds or click to the following link.'
  messageObject.value.link = '/surveys'
  messageObject.value.timeoutId = setTimeout(() => {
    redirectTo(HOME)
  }, 3000)
}

function handleError(error: any) {
  if (error.response && error.response.status === 400) {
    handleSurveyAlreadyAnswered()
  } else {
    handleGenericError(error.response?.data)
  }
}

function handleSurveyAlreadyAnswered() {
  createMessage(
    true,
    'You have already answered this survey. Please choose another one.',
    HOME,
    3000,
    'Come back to the list'
  )
}

function handleGenericError(data: string | undefined) {
  $toast.error(data ?? 'Something went wrong', {
    position: 'bottom'
  })
}

watchEffect(async () => {
  try {
    const surveyId = Number(route.params.id)
    if (isNaN(surveyId)) {
      handleSurveyDoesNotExist()
      return
    }
    const fetchUrl = generateSurveyForUserUrl(surveyId, props.userUuid)
    const response = await axios.get(fetchUrl)
    handleFetchResponse(response)
  } catch (error: any) {
    handleError(error)
  }
})

function toggleValue(index: number, rating: number) {
  if (!hasSubmitted.value) {
    if (form.value && form.value.submissions[index].rating == rating) {
      form.value.submissions[index].rating = null
    } else {
      form.value.submissions[index].rating = rating
    }
  }
}

async function handleSubmit() {
  try {
    hasSubmitted.value = true
    await submitForm()
    handleSubmissionSuccess()
  } catch (error: any) {
    handleSubmissionError(error)
  }
}

async function submitForm() {
  const submissionUrl = generateSurveySubmissionUrl(Number(route.params.id))
  await axios.post(submissionUrl, form.value)
}

function handleSubmissionSuccess() {
  createMessage(
    false,
    'Thank you for answering this survey. You will be redirected to the main page in 3 seconds or click to the following link.',
    HOME,
    3000,
    'Come back to the list'
  )
}

function handleSubmissionError(error: any) {
  hasSubmitted.value = false
  $toast.error(error.response?.data ?? 'Something went wrong', {
    position: 'bottom'
  })
  if (error.response) {
    console.error('Error submitting form:', error.response.data)
  } else if (error.request) {
    console.error('Error submitting form: No response received')
  } else {
    console.error('Error submitting form:', error.message)
  }
}
</script>

<template>
  <div v-if="messageObject.message" class="toast" :class="{ error: messageObject.isError }">
    <div>{{ messageObject.message }}</div>
    <RouterLink v-if="messageObject.link" :to="messageObject.link"
      >Come back to the list</RouterLink
    >
  </div>
  <form :class="{ hide: hasSubmitted }">
    <div id="list_questions">
      <QuestionComponent
        v-for="(question, index) in questions"
        :key="question.id"
        :question="question"
        :index="index"
        :hasSubmitted="hasSubmitted"
        :form="form"
        @toggleAnswer="toggleValue"
      />
    </div>

    <button
      @click.prevent="handleSubmit"
      type="submit"
      class="submit_button"
      :disabled="hasSubmitted"
    >
      Submit
    </button>
  </form>
</template>

<style>
:root {
  --checkbox-size: 50px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 200ms;
}

form.hide {
  filter: blur(2px);
}

#list_questions {
  border: 1px solid rgba(128, 128, 128, 0.144);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}
.toast {
  width: clamp(300px, 80%, 600px);
  background-color: rgb(214, 252, 223);
  padding: 1.5em 2em;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
}

.toast.error {
  color: white;
  background-color: rgb(229, 104, 104);
}

.toast.error a {
  color: rgb(0, 0, 0);
  text-decoration: underline;
}

.question:nth-child(2n + 1) {
  background-color: #d3d3d32c;
}

.submit_button {
  --color: #ea984c;
  border-radius: 10px;
  border-style: none;
  box-sizing: border-box;
  background-color: transparent;
  color: var(--color);
  cursor: pointer;
  display: inline-block;
  font-weight: 600;
  font-size: 18px;
  list-style: none;
  margin: 1em auto;
  outline: none;
  padding: 0.5em 1.75em;
  text-align: center;
  text-decoration: none;
  border: 2px solid var(--color);
  transition: 200ms;
}

.submit_button:hover,
.submit_button:focus {
  background-color: var(--color);
  color: white;
}
</style>
