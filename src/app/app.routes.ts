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
import { RegisterUserComponent } from './register-user/register-user.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterUserComponent },

  
  { path: 'catalogo', component: CatalogComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'order-confirmation', component: OrderConfirmationComponent, canActivate: [AuthGuard] },
  { path: 'orden-historia', component: OrderHistoryComponent, canActivate: [AuthGuard] },
  { path: 'orden-tracking', component: OrderTrackingComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'producto-review', component: ProductReviewComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard] },
  { path: 'metodos-pago', component: PaymentMethodsComponent, canActivate: [AuthGuard] }
];
