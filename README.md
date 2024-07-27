# San Diego DEVx Website

Welcome to the San Diego DEVx website repository! This project aims to build a vibrant community of developers in San Diego, providing a platform for networking, learning, and sharing knowledge.

## Development Setup

Follow these instructions to set up the development environment and run the project locally.

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:

```sh
git clone https://github.com/yourusername/san-diego-devx.git
cd san-diego-devx
```

2. **Install dependencies**:

```sh
npm install
```

3. **Start the development server with the following command:**:

```sh
npm run dev
```

The site will be running at http://localhost:3000.

**Note: This project uses DaisyUI, a Tailwind CSS component library.**

## Contributing

We welcome contributions from the community! If you have suggestions or improvements, feel free to open an issue or submit a pull request.

### Guidelines

The project uses Prettier and ESLint for code formatting and linting.
Integrating ESLint in your editor is recommended to ensure that the code
formatting in addition to the linting rules are followed. For VSCode, you can
use [the ESLint extension](https://github.com/Microsoft/vscode-eslint).

Pre-commit hooks are in place to ensure that the code is properly formatted
before a commit is added to the repo. The pre-commit hook runs the precommit
script (`npm run precommit`).

### Steps to Contribute

1. **Fork the repository**
2. **Create a new branch**:
   ```sh
   git checkout -b feature-name
   ```
3. **Make your changes and commit**
   ```sh
   git add .
   git commit -m "Add some feature"
   ```
4. **Push to the branch**
   ```sh
   git push origin feature-name
   ```
5. **Open a pull request on Github**
