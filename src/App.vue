<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onBeforeMount, ref } from 'vue'
import { uuid } from 'vue-uuid'
import { type UserUuid } from './interfaces/interfaces'

const userUuid = ref<UserUuid>(localStorage.getItem('userUuid') || uuid.v4())

const currentSurveyTitle = ref<String>('')

function handleSurveySelected(title: string) {
  currentSurveyTitle.value = title
}

onBeforeMount(() => {
  localStorage.setItem('userUuid', userUuid.value)
})
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/surveys">Surveys</RouterLink>
      <div id="title">{{ currentSurveyTitle }}</div>
      <span id="uuid">{{ userUuid }}</span>
    </nav>
  </header>
  <router-view :userUuid="userUuid" @surveySelected="handleSurveySelected"></router-view>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--color-dark);
  z-index: 2;
  box-shadow: var(--default-shadow);
  height: var(--header-height);
  color: var(--color-text);
}

nav {
  font-size: 15px;
  text-align: center;
  /* margin: 1rem; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  padding-inline: 1rem;
}
nav a {
  display: inline-block;
  font-weight: bold;
}

nav li {
  float: left;
  text-decoration: none;
}
#uuid {
  color: var(--color-faded-text);
  font-size: 80%;
  font-family: 'Courier New', Courier, monospace;
}

#title {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  color: var(--color-background);
  height: var(--header-height);
  display: flex;
  align-items: center;
  font-size: 120%;
  font-weight: 600;
}

@media (max-width: 850px) {
  #uuid {
    font-size: 65%;
  }
}

@media (max-width: 450px) {
  #title {
    font-size: 100%;
  }
  #uuid {
    display: none;
  }
}
</style>
