// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CatalogComponent } from './catalog/catalog.component';
import { CartComponent } from './cart/cart.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductReviewComponent } from './product-review/product-review.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';



export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'catalogo', component: CatalogComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order-confirmation', component: OrderConfirmationComponent },
  { path: 'orden-historia', component: OrderHistoryComponent },
  { path: 'orden-tracking', component: OrderTrackingComponent },
  { path: 'perfil', component: ProfileComponent },
  { path: 'producto-review', component: ProductReviewComponent },
  { path: 'admin', component: AdminPanelComponent },
  { path: 'metodos-pago', component: PaymentMethodsComponent }

];
