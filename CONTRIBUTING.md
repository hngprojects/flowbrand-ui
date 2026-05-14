# Contributing to Flowbrand UI

Thank you for considering contributing to Flowbrand UI! We welcome all kinds of contributions, including bug reports, feature requests, and code improvements.

## Table of Contents

- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Code Contributions](#code-contributions)
    - [Development Workflow](#development-workflow)
      - [Branch Naming Rules](#branch-naming-rules)
      - [Commit Message Rules](#commit-message-rules)
    - [Submitting Pull Requests](#submitting-pull-requests)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

## Getting Started

1. Fork the repository.
2. Clone your forked repository:
   ```sh
   git clone https://github.com/<your-username>/flowbrand-ui.git
   ```
3. Navigate to the project directory:
   ```sh
   cd flowbrand-ui
   ```
4. Install dependencies:
   ```sh
   pnpm install
   ```
5. Start the local server to preview and interact with the app:
   ```sh
   pnpm dev
   ```

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on [GitHub Issues](https://github.com/<your-username>/flowbrand-ui/issues) and include as much detail as possible. Provide steps to reproduce, expected and actu

### Suggesting Features

If you have an idea for a new feature, please open an issue on [GitHub Issues](https://github.com/<your-username>/flowbrand-ui/issues) and describe your proposal. Explain why the feature would be usef

### Code Contributions

> Please make sure to have created a fork of the original repository. This is where you will work when contributing.

#### Development Workflow

1. Create a new branch for your work:
   ```sh
   git checkout -b feat/HNG-2145-your-feature-name
   ```
   ##### Branch Naming Rules
   - You will likely work on features, bug fixes, refactors (restructuring code without changing functionality), chores on the repo (routine tasks such as updating dependencies or changing configurati
   - For any of these updates, you will likely use a ticket or an issue. The ticket number, e.g. HNG-2145 or issue number, should also be included in your branch name.
   - Finally, a short description for your update should follow. This is often taken from the ticket title.
   - All of this (except the ticket number acronym, `HNG`) should be written in lowercase.
     > Thus, a typical branch should look like `feat/HNG-1234-create-login-page` or like `chore/remove-unused-variables` if your update has no corresponding ticket or issue (unlikely).
2. Make your changes, and commit them with descriptive messages:

   ```sh
   git commit -m "feat: your commit message"
   ```

   ##### Commit Message Rules

   Commit messages also follow a similar pattern. However, there is no need to add a ticket number since they can be easily tracked given the branch name. Instead, use a colon, `:`, after the type of

   > Another example: `refactor: use a single state for formData` or `refactor(HNG-1234): use a single state for formData`

> Please notice how both branch names and commit messages use the imperative tense. The imperative tense is a command or request, which makes it clear what the commit does—e.g., “fix login issue”, NOT

3. Push your branch to your forked repository:
   ```sh
   git push origin <your-branch>
   ```

#### Submitting Pull Requests

1. Ensure your branch is up to date with your remote repository:
   ```sh
   git checkout main
   git pull origin main
   git checkout <your-branch>
   git rebase main
   ```
   > You should regularly update your fork with changes from the default branch of the upstream repository.
2. Run checks and ensure they pass:
   ```sh
   pnpm lint
   pnpm typecheck
   ```
   > Add `pnpm test` here once a test script exists. Until then, make it a habit to run lint and typecheck before opening pull requests.
3. Submit a pull request from your branch to the upstream repository.
4. In your pull request description, explain what changes you made and why.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/). By participating, you are expected to uphold this code. Please re

## License

By contributing, you agree that your contributions will be licensed under the [Apache License](LICENSE).
