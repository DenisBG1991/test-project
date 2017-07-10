This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Launch of the project

### Folder Structure:

After clone, your project should look like this:

```
test-project/
  db/
    departments.json
    employees.json
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
    manifest.json
  src/
    actions/
        SearchDepartmentAction.js
        SearchEmployeeAction.js
    components/
        Header/
            Header.css
            Header.js
            logo.svg
        Intro/
            Intro.css
            Intro.js
        Menu/
            Menu.css
            Menu.js
    constants/
        Department.js
        Employee.js
    containers/
        App.css
        App.js
    reducers/
        index.js
    store/
        configureStore.js
    index.css
    index.js
    registerServiceWorker.js
  .gitignore
  package.json
  server.js
```

### Install all necessary packages:

For install all necessary packages, in the project directory, you can write:

```sh
npm install
```

### Launch of the server:

For launch of the server, in the project directory, you can write:

```sh
node server.js
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.