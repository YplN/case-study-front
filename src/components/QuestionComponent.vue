<script setup lang="ts">
import type { Form, Question } from '@/interfaces/interfaces'

const props = defineProps<{
  question: Question
  index: number
  form: Form
  hasSubmitted: boolean
}>()

const emits = defineEmits(['toggleAnswer'])

const getClass = (index: number, optionValue: number) => {
  return props.form &&
    props.form.submissions[index].rating != null &&
    Number(props.form.submissions[index].rating) !== optionValue
    ? 'hided'
    : ''
}

const handleToggleAnswer = (index: number, optionRating: number) =>
  emits('toggleAnswer', index, optionRating)
</script>

<template>
  <div class="question">
    <span class="question_text">{{ question.text }}</span>
    <div class="option_list">
      <label
        v-for="optionValue in [
          { rating: 1, name: 'one' },
          { rating: 2, name: 'two' },
          { rating: 3, name: 'three' },
          { rating: 4, name: 'four' },
          { rating: 5, name: 'five' }
        ]"
        :for="`${question.id}_${optionValue.name}`"
        :class="`option ${optionValue.name} ${getClass(index, optionValue.rating)}`"
        :key="`${question.id}_${optionValue.name}`"
      >
        <!-- We have to reacreate the v-model by hand since the form is in the parent-->
        <input
          type="radio"
          :id="`${question.id}_${optionValue.name}`"
          :value="optionValue.rating"
          @click="handleToggleAnswer(index, optionValue.rating)"
          :disabled="hasSubmitted"
          :checked="form.submissions[index].rating == optionValue.rating"
        />
        <span class="checkmark">{{ optionValue.rating }}</span>
      </label>
    </div>
  </div>
</template>

<style>
:root {
  --checkbox-size: 50px;
}

.question {
  font-family:
    Work Sans,
    sans-serif;
  padding: 1em;
  cursor: default;
  display: flex;
  align-items: center;
}

@media (max-width: 900px) {
  .question {
    flex-direction: column;
  }
}

[type='radio']:checked,
[type='radio']:not(:checked) {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.question_text {
  /* width: 400px; */
  width: clamp(260px, 100%, 800px);
  padding-inline: 1rem;
}

.option_list {
  width: clamp(260px, 50%, 800px);
  display: flex;
  gap: 1em;
  height: var(--checkbox-size);
  margin: 0.5em auto;
  justify-content: space-evenly;
  flex-direction: row;
}

.option {
  display: block;
  cursor: pointer;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: var(--checkbox-size);
  transition: 200ms;
}

.checkmark {
  --color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  height: var(--checkbox-size);
  width: var(--checkbox-size);
  background-color: var(--color);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 25px;
  font-weight: 600;
  border: 2px solid var(--color);
  background-color: transparent;
  color: var(--color);
  transition: 200ms;
}

.option:hover .checkmark {
  background-color: var(--color) !important;
  color: var(--color-background);
}

.option.hided:not(:hover) {
  opacity: 0.5;
}

.option.hided:not(:hover) .checkmark {
  --color: rgb(196, 196, 196);
}

.option.one .checkmark {
  --color: #c74b4b;
}
.option.two .checkmark {
  --color: #e3a143;
}
.option.three .checkmark {
  --color: #e0cf51;
}
.option.four .checkmark {
  --color: #cbe051;
}
.option.five .checkmark {
  --color: #98e051;
}

.option input:checked ~ .checkmark {
  background-color: var(--color) !important;
  color: var(--color-background);
}

.option input:checked:hover ~ .checkmark {
  opacity: 0.5;
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.option input:checked ~ .checkmark:after {
  display: block;
}

@media (max-width: 450px) {
  :root {
    --checkbox-size: 40px !important;
  }

  .checkmark {
    font-size: 20px;
    border-radius: 7px;
  }
}
</style>
