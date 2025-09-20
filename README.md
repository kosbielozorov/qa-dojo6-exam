# API Automation Testing Project

This project provides a robust framework for automated API testing using Playwright. It is designed to validate the functionality, reliability, and security of RESTful API endpoints for a web application. The main goal is to ensure that all API features work as expected, catch regressions early, and support continuous integration workflows. The framework supports local and CI/CD test execution, detailed reporting, and easy extensibility for new test scenarios.

## REQUIREMENTS

- Node.js version 20+
- Microsoft VS Code
- VS Code plugin "Playwright Test for VS Code"

## LOCAL: SETUP, RUN, REPORT

- install Node.js (if not installed)
- use command `git clone` to get local copy of this repository or copy files in
  to your project folder.
- open this folder in VS Code
- in VS Code Terminal, go to directory of your local copy
- in VS Code Terminal - run command `npm ci` to install all dependencies
- install Playwright browsers (in VS Code Terminal input
  `npx playwright install` and press "Enter")

### Run tests locally on your PC:

- to run all tests need to execute this command in terminal: `npm run test`
- to run tests by tag (@smoke): `npx playwright test --grep @your_tag`

> !Tips: you can run tests in two ways. First way is by using plugin "Playwright
> Test for VSCode". Where yon can run tests (all/some one). Second way is by
> running command: `npm run test-ui`. In UI you can run tests (all/some one) and
> viewing test run in real time.

### Results & Reports (local)

For viewing tests results locally, you need to run command in VS Code terminal:

- `npm run report` - this command run Playwright Report based on results of the
  last test run

## GITLAB CI/CD

### Requirements

- Gitlab project for automation API testing
- Gitlab Runner

### Setup

- add gitlab-ci.yml file in the root of project
- in gitlab-ci.yml file should to input actual version of Playwright docker
  image
- in gitlab-ci.yml should define workflow of running tests
- add run tests in "Schedule" (if needed)

## GITHUB CI/CD

### Requirements

- GitHub repository for automation API testing

### Setup

- Add a `.github/workflows/playwright.yml` file in the root of your project.
- Вказати актуальний Playwright docker-образ у workflow-файлі (наприклад, `mcr.microsoft.com/playwright:v1.55.0-noble`).
- Визначити workflow для запуску тестів (див. приклад нижче).
- За потреби додати розклад запуску тестів через [GitHub Actions schedule](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule).

#### Приклад workflow для Playwright:

```yaml
name: Playwright Tests
on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]
  schedule:
    - cron: '0 6 * * *' # запуск щодня о 6:00 UTC
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.55.0-noble
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run tests
        run: npm run test
      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
```

## STRUCTURE

- `app/api` — implementation of API controllers (CRUD, authorization, etc.)
  - `controllers/Articles` — controllers for articles
  - `controllers/Comments` — controllers for comments
  - `controllers/Search` — controllers for search
  - `controllers/Tags` — controllers for tags
  - `controllers/Users` — controllers for users
  - `index.ts` — API entry point
- `fixtures/` — fixtures for tests (initial data, configuration)
- `helpers/` — helper functions for data generation, authorization, etc.
- `testData/` — test data for parameterized tests (negative/positive cases)
- `tests/` — test files (`*.test.ts` format)
- `playwright-report/` — Playwright HTML report after test run
- `test-results/` — Playwright test results (traces, logs)
- `.env` — environment variables file (local)

```
app/
├── api/
│   ├── controllers/
│   │   ├── Articles/
│   │   ├── Comments/
│   │   ├── Search/
│   │   ├── Tags/
│   │   └── Users/
│   └── index.ts
├── fixtures/
├── helpers/
├── testData/
├── tests/
├── playwright-report/
├── test-results/
├── .env
```

## Environment & .env file

For convenient and secure test development, use environment variables.

- **Locally**: create a `.env` file in the project root and add required variables (e.g., API_URL, USER_EMAIL, USER_PASSWORD, tokens, etc.).
- **CI/CD**: in GitHub Actions or GitLab CI/CD, add environment variables via repository settings (secrets or variables).

### Example .env

```
API_URL=https://api.example.com
USER_EMAIL=testuser@example.com
USER_PASSWORD=yourpassword
TOKEN=yourapitoken
```

### Usage in tests

- To access environment variables, use the [dotenv](https://www.npmjs.com/package/dotenv) package (already included in most modern projects).
- In tests, access variables via `process.env`:  
  `const apiUrl = process.env.API_URL;`

### Recommendations

- Do not store secret data in public repositories.
- Add a `.env.example` file with a template for new developers.
- For CI/CD, use secrets/variables, not a .env file.

## Commands

- `npm run test` - this command will start all tests
- `npm run report` - will serv and open local "Playwright Test Report"
- `npm run test-ui` - will launch Playwright UI interface for real time running tests

## Code

For better code writing experience, we use [ESLint](https://eslint.org/) &
[Prettier](https://prettier.io/). They are very useful for automatic code
formatting and JavaScript syntax checking. They are includes in package.json.
Also, we used plugin "eslint-plugin-playwright" it's very helpful in writing
tests.

## Tools

- https://trace.playwright.dev/ - Playwright tool for viewing traces.

## Libraries

- Faker Library - generate data for testing https://fakerjs.dev/

## Tips

> - recommended to use VSCode https://visualstudio.microsoft.com/
> - official Playwright docs: https://playwright.dev/
> - official Playwright plugin for VSCode:
>   https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright

## How to contribute

Contributions are welcome! To add new tests or improve the framework, please follow these guidelines:

### Adding new tests

- Create a new test file in the `tests/` directory. Use the `.test.ts` extension.
- Use Playwright's test syntax and fixtures for consistency.
- Name your test cases clearly and group related tests using `describe` blocks.
- Use helper functions from the `helpers/` folder to avoid code duplication.
- Store test data in the `testData/` folder for parameterized or edge-case tests.
- Make sure your tests are independent and do not rely on the state left by other tests.
- Run all tests locally before submitting a pull request.

### Best practices

- Follow the existing code style (ESLint, Prettier).
- Add comments and JSDoc where necessary for clarity.
- Validate API responses with status and property checks.
- Prefer using environment variables for sensitive data.
- Write both positive and negative test cases.
- Keep tests fast and reliable; avoid unnecessary waits or dependencies.
- Update the README if you add new features or change the test structure.

For major changes, please open an issue first to discuss what you would like to change.

Thank you for helping improve this project!
