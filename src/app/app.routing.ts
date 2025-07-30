import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome.component/welcome.component';
import { NotificationComponent } from './notification.component/notification.component'
import { ProductViewComponent } from './productView.component/productView.component';
import { InterfaceComponent } from './interface.component/interface.component';
import { CompareInstoreSelectorComponent } from './compareInstoreSelector.component/compareInstoreSelector.component';
import { CompareProductsComponent } from './compareProducts.component/compareProducts.component';
import { LoadingComponent } from './loading.component/loading.component';
import { ThankYouComponent } from './thankYou.component/thankYou.component';
import { CompareOnlineComponent } from './compareOnline.component/compareOnline.component';
import { NoIDFoundComponent } from './NoIDFoundPage/NoIDFoundPage.component';
import { ForgotIDComponent } from './ForgotID.component/ForgotID.component';

const appRoutes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'notifications', component: NotificationComponent },
  { path: 'interface', component: InterfaceComponent },
  { path: 'product-view', component: ProductViewComponent },
  { path: 'compare-instore-selector', component: CompareInstoreSelectorComponent },
  { path: 'compare-products', component: CompareProductsComponent },
  { path: 'loading', component: LoadingComponent },
  { path: 'thankyou', component: ThankYouComponent },
  { path: 'compare-online', component: CompareOnlineComponent },
  { path: 'no-product', component: NoIDFoundComponent },
  { path: 'forgot-id', component: ForgotIDComponent },
  { path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  }
  ];

export const routing = RouterModule.forRoot(appRoutes);