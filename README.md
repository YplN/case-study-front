# AgileValue Coding Challenge - Frontend

This project is the frontend part of an application designed to handle surveys, where the user can rate questions of an anonymous survey to give my opinion about
teamwork.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile for Production

```sh
npm run build
```

and then

```sh
npm run preview
```

**Notes**:

1. The backend part has to be running before in order the application to run properly.
2. This should run on the port 5173 by default. The communication with the backend will not work if it is not the case.

## Presentation

The website consists of two simple pages :

1. **/surveys** appears the list of the surveys in the database. The surveys are split into two separate lists: the first contains the surveys that are available for the user with a direct link and a short description, and the second contains the list of the surveys already answered by the user. The links for the second part are not clickable.
2. **/surveys/:id** If the id is valid (i.e. corresponds to a valid surveyId in the database), and if the survey was not already answered by the user, it shows a list of the questions contained in the survey. The user can answer the questions (or leave the question empty), and then submit the survey to the database. At the end, the user is redirected to the /survey. Similarly, if the survey is not valid or already answered by the user, they will be redirected to /survey.

**Notes**

- Any access to another url should redirect to /surveys.
- For sake of simplicity, the UUID of the user is shown in the right top corner of the website, this part would not be present in a production setting.

## Final remarks on the UUID

So far, the UUIDs sent for submissions are computed locally and stored in the user's local storage. This approach aligns with several principles:

- **No Account Connection Requirement**: Users can answer surveys without needing to create an account or log in.
- **Prevention of Duplicate Responses**: Each user "cannot" submit multiple responses to a survey (discussed further below).
- **User Anonymity**: The user's anonymity is maintained in the database.

However, it's crucial to recognize the limitations of this method. This approach lacks resilience against malicious users, as local storage can be deleted through various means: directly from the browser, using private navigation, using a different browser, or switching to another device. Specifically, ensuring adherence to the three principles mentioned earlier becomes challenging when considering the latter scenario.
