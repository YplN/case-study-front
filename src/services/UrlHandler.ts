import type { UserUuid } from '@/interfaces/interfaces'

const DATABASE_URL = 'http://localhost:8080'

export function generateSortedSurveyUrl(userUuid: UserUuid): string {
  return `${DATABASE_URL}/api/surveys/user/${userUuid}`
}

export function generateSurveyUrl(surveyId: number): string {
  return `${DATABASE_URL}/api/surveys/${surveyId}`
}

export function generateSurveyForUserUrl(surveyId: number, userUuid: UserUuid): string {
  return `${DATABASE_URL}/api/surveys/${surveyId}/user/${userUuid}`
}

export function generateSurveySubmissionUrl(surveyId: number): string {
  return `${DATABASE_URL}/api/surveys/${surveyId}/submit`
}

export function generateQuestionFetchUrl(surveyId: number): string {
  return `${DATABASE_URL}/api/surveys/${surveyId}/question`
}
