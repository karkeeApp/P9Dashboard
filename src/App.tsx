import { FC } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';

// Configs
import { THEME_CONFIG } from '@/configs/app';

// Redux
import { store } from '@/redux';

// Views
import Views from '@/views';

const themes = {
  dark: `${process.env.PUBLIC_URL}/css/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/css/light-theme.css`,
};

const App: FC = () => (
  <Provider store={store}>
    <ThemeSwitcherProvider
      themeMap={themes}
      defaultTheme={THEME_CONFIG.currentTheme}
      insertionPoint='styles-insertion-point'
    >
      <Router>
        <Switch>
          <Route path='/' component={Views} />
        </Switch>
      </Router>
    </ThemeSwitcherProvider>
  </Provider>
);

export default App;
