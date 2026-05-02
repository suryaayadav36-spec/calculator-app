# Calsy - Calculator App

Calsy is a clean, responsive calculator built with plain HTML, CSS, and JavaScript. It supports basic arithmetic, keyboard input, light and dark themes, calculation history, and saved user preferences through browser `localStorage`.

Live site: https://kunalcalsy.netlify.app/

## Features

- Basic calculator operations: addition, subtraction, multiplication, and division.
- Decimal number support with protection against repeated decimal points.
- Clear controls:
  - `AC` resets the full calculator state.
  - `C` clears only the current input.
  - `Backspace` removes the last entered digit.
- Division-by-zero handling with a clear error message.
- Keyboard support for fast desktop use.
- Calculation history saved in the browser.
- Clickable history items that can be reused as the current value.
- Light and dark mode with saved theme preference.
- Responsive layout for desktop, tablet, and mobile screens.
- Sitemap included for search engine indexing.

## Tech Stack

- HTML5 for the page structure.
- CSS3 for layout, responsive design, animation, and theming.
- JavaScript for calculator logic, UI updates, keyboard handling, theme state, and history storage.
- `localStorage` for persistent browser-side data.

No framework, bundler, or package manager is required.

## Project Structure

```text
calculator-app/
|-- css/
|   `-- styles.css
|-- js/
|   `-- script.js
|-- index.html
|-- sitemap.xml
|-- .gitignore
`-- README.md
```

## How To Run Locally

Because this is a static website, you can run it without installing dependencies.

1. Clone the repository:

```bash
git clone https://github.com/suryaayadav36-spec/calculator-app.git
```

2. Open the project folder:

```bash
cd calculator-app
```

3. Open `index.html` in a browser.

You can also use a simple local server if you prefer:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## How To Use

Use the on-screen buttons or your keyboard to enter numbers and operations.

Supported keyboard shortcuts:

| Key | Action |
| --- | --- |
| `0-9` | Enter numbers |
| `.` | Enter decimal point |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last digit |
| `Escape` | Reset calculator |

## Code Explanation

### HTML

The main page is defined in `index.html`. It contains:

- A header with the app name and theme toggle button.
- A calculator display with previous and current operand areas.
- A grid of number, operator, clear, backspace, and equals buttons.
- A history section that shows recent calculations.
- Links to `css/styles.css` and `js/script.js`.

The calculator buttons use attributes such as `data-number` and `data-operator`. JavaScript reads these attributes to decide what action to perform when a button is clicked.

### CSS

The styling lives in `css/styles.css`.

Important parts:

- CSS variables in `:root` define colors, shadows, transitions, and border radius values.
- `body.dark-mode` switches the app into dark mode.
- `.buttons-grid` creates the calculator keypad using CSS Grid.
- `.btn-zero` and `.btn-equals` span two columns for a familiar calculator layout.
- Media queries at `768px` and `480px` adjust spacing, font sizes, and button sizing for smaller screens.

### JavaScript

The main behavior is handled in `js/script.js`.

The script is organized around three classes:

#### `Calculator`

Manages calculator state and arithmetic.

It stores:

- `previousOperand`
- `currentOperand`
- `operation`

Key methods:

- `addNumber(number)` adds digits or a decimal point to the current input.
- `chooseOperation(operation)` stores the selected operator and moves the current value into the previous operand.
- `calculate()` performs the arithmetic and updates the display.
- `allClear()` resets the full calculator.
- `clear()` clears only the current input.
- `backspace()` removes the last character from the current input.
- `formatDisplay(number)` formats values with thousands separators.
- `formatOperation(operation)` converts internal operators like `*` and `/` into user-facing display symbols.

#### `HistoryManager`

Handles recent calculation history.

It stores up to five history items and saves them in browser `localStorage` under the key:

```text
calculatorHistory
```

History entries remain available after refreshing the page because they are stored in the browser.

#### `ThemeManager`

Handles light and dark mode.

It:

- Loads the saved theme from `localStorage`.
- Falls back to the user's system color preference.
- Toggles the `dark-mode` class on the `body`.
- Updates the theme button icon.
- Saves the selected theme under the key:

```text
theme
```

## Data Storage

Calsy stores small pieces of user preference data in the browser:

| Key | Purpose |
| --- | --- |
| `calculatorHistory` | Saves recent calculation results |
| `theme` | Saves light or dark mode preference |

No data is sent to a server.

## Deployment

This project can be deployed on any static hosting platform, including:

- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

The current sitemap points to:

```text
https://kunalcalsy.netlify.app/
```

If the site URL changes, update `sitemap.xml` with the new public URL.

## Repository

GitHub repository:

```text
https://github.com/suryaayadav36-spec/calculator-app
```

## License

No license file is currently included. Add a license before distributing or reusing this project publicly.
