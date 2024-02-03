export type UserUuid = string

export type Question = {
  id: number
  text: string
}

export type Submission = {
  questionId: number
  rating: number | null
}

export type Form = {
  submissions: Array<Submission>
  userUuid: UserUuid
}

export type MessageObject = {
  isError: boolean
  message: string
  link: string | null
  timeoutId: any
  link_text: string | null
}

export type Survey = {
  id: number
  title: string
  desc: string
}
