import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup

import { WelcomeService } from './welcome.component/welcome.service';
import { AppDataShareService } from './app.shareData';
import { FooterService } from './footer.component/footer.service';
import { ReviewService } from './review.component/review.service';
import { ProfileService } from './profile.component/profile.service';
import { BucketService } from './bucket.component/bucket.service';
import { ProductViewService } from './productView.component/productView.service';
import { CompareInstoreSelectorService } from './compareInstoreSelector.component/compareInstoreSelector.service';
import { CompareProductService } from './compareProducts.component/compareProducts.service';
import { OnlineCompareService } from './compareOnline.component/compareOnline.service';
import { HeaderService } from './header.component/header.service';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome.component/welcome.component';
import { NotificationComponent } from './notification.component/notification.component';
import { HeaderComponent } from './header.component/header.component';
import { FooterComponent } from './footer.component/footer.component';
import { ReviewComponent } from './review.component/review.component';
import { ProfileComponent } from './profile.component/profile.component';
import { BucketComponent } from './bucket.component/bucket.component';
import { LastViewedComponent } from './lastViewed.component/lastViewed.component';
import { MyFavoriteComponent } from './myFavorite.component/myFavorite.component';
import { ProductViewComponent } from './productView.component/productView.component';
import { InterfaceComponent } from './interface.component/interface.component';
import { CompareInstoreSelectorComponent } from './compareInstoreSelector.component/compareInstoreSelector.component';
import { CompareProductsComponent } from './compareProducts.component/compareProducts.component';
import { LoadingComponent } from './loading.component/loading.component';
import { ThankYouComponent } from './thankYou.component/thankYou.component';
import { CompareOnlineComponent } from './compareOnline.component/compareOnline.component';
import { OrderByPipe } from './pipes/orderBy';
import { NoIDFoundComponent }  from './NoIDFoundPage/NoIDFoundPage.component';
import { ForgotIDComponent } from './ForgotID.component/ForgotID.component';
import { ForgotIDService } from './ForgotID.component/ForgotID.service';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    NotificationComponent,
    HeaderComponent,
    FooterComponent,
    ReviewComponent,
    ProfileComponent,
    BucketComponent,
    LastViewedComponent,
    MyFavoriteComponent,
    ProductViewComponent,
    InterfaceComponent,
    CompareInstoreSelectorComponent,
    CompareProductsComponent,
    LoadingComponent,
    ThankYouComponent,
    CompareOnlineComponent,
    OrderByPipe,
    NoIDFoundComponent,
    ForgotIDComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    NgIdleKeepaliveModule.forRoot()    
  ],
  providers: [
    AppDataShareService,
    WelcomeService,
    FooterService,
    ReviewService,
    ProfileService,
    BucketService,
    ProductViewService,
    CompareInstoreSelectorService,
    CompareProductService,
    OnlineCompareService,
    ForgotIDService,
    HeaderService    
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
