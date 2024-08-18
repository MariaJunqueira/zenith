# Awork Challenge

Live version available [here](https://zenith-3c5dc.web.app/users)

### Prerequisites

- Make sure you have [Node.js](https://nodejs.org/) installed (includes npm).
- Install the necessary packages by running:  
  ```bash
  npm install
  ```

## Getting Started

This project was built with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.0.

### Development Server

To start the dev server, run:  
```bash
ng serve
```
Then, open your browser and go to `http://localhost:4200/`. The app will reload automatically when you make changes to the source files.

### Creating Components

Need a new component? Run:  
```bash
ng generate component component-name
```
You can also create directives, pipes, services, and more with similar commands.

### Building the Project

To build the project, run:  
```bash
ng build
```
The build will be output to the `dist/` directory.

### Running Tests

- **Unit tests:**  
  Run `ng test` to execute unit tests with [Karma](https://karma-runner.github.io).
  
  
## CSS Variables and Styling

The project includes several SCSS files that define and manage the styles used throughout the application. Here’s a quick guide on where to find the relevant variables and how to use them:

### Variables

- **File:** `_variables.scss`
- **Description:** This file contains all the main CSS variables used in the project, including color schemes, spacing, font sizes, and more. These variables are defined using SCSS variables, which makes it easy to maintain a consistent design system across the application.

### Colors

- **File:** `_colors.scss`
- **Description:** The `_colors.scss` file contains specific color variables that you can use throughout your stylesheets. These include primary, secondary, and accent colors, as well as shades for text, backgrounds, and borders.

### Typography

- **File:** `_typography.scss`
- **Description:** This file manages the font styles and sizes used in the project. It includes variables for different text elements like headings, body text, and captions.

### Mixins

- **File:** `_mixins.scss`
- **Description:** The `_mixins.scss` file contains reusable CSS snippets that can be used throughout your SCSS files. Mixins help reduce code duplication and maintain consistency.

### Resets

- **File:** `_reset.scss`
- **Description:** This file includes CSS resets to ensure consistent styling across different browsers. It’s a good place to start when building custom styles.

### Additional Styles

- **Files:** `ease-import.scss`, `ease-styles.scss`
- **Description:** These files contain additional imports and styles specific to this project’s needs, ensuring that all styles are loaded and applied correctly.

### How to Use

To use these variables and mixins in your components, make sure to import the relevant SCSS files at the top of your component’s stylesheet, like this:

```scss
@import "ease/ease-import.scss";
@import 'ease/ease-styles';
```

This allows you to apply the predefined variables and mixins directly in your component’s styles.

## Need More Help?

For more details on Angular CLI, you can use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
