import {
  IonApp,
  IonContent,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { SplashScreen } from '@capacitor/splash-screen';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/* Theme variables */
import './theme/variables.css';
import PropertyView from './pages/PropertyView';
import PropertyViewMap from './pages/PropertyViewMap';
import { useEffect } from 'react';

setupIonicReact();


const App: React.FC = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, []);


  return (
    <IonApp>
      <Router>
        <IonRouterOutlet>
          <Switch>
            <Route exact path="/" component={PropertyView} />
            <Route path="/mapa" component={PropertyViewMap} />
          </Switch>
        </IonRouterOutlet>
      </Router>
    </IonApp>
  )
};

export default App;
