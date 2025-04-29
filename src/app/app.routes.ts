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
import { RegisterProductComponent } from './register-product/register-product.component';
import { ListarProductosComponent } from './listar-productos/listar-productos.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AuthGuard } from './guards/auth.guard';
import { UserGuard } from './guards/user.guard';
import { AdminGuard } from './guards/admin.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterUserComponent },

  // 🔥 Rutas para usuarios normales
  { path: 'catalogo', component: CatalogComponent, canActivate: [AuthGuard, UserGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard, UserGuard] },
  { path: 'order-confirmation', component: OrderConfirmationComponent, canActivate: [AuthGuard, UserGuard] },
  { path: 'orden-historia', component: OrderHistoryComponent, canActivate: [AuthGuard, UserGuard] },
  { path: 'orden-tracking', component: OrderTrackingComponent, canActivate: [AuthGuard, UserGuard] },
  { path: 'perfil', component: ProfileComponent, canActivate: [AuthGuard, UserGuard] },
  { path: 'producto-review', component: ProductReviewComponent, canActivate: [AuthGuard, UserGuard] },
  { path: 'metodos-pago', component: PaymentMethodsComponent, canActivate: [AuthGuard, UserGuard] },

  // 🔥 Rutas solo para administradores
  { path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'register-product', component: RegisterProductComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'listar-productos', component: ListarProductosComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'edit-product/:id', component: EditProductComponent, canActivate: [AuthGuard, AdminGuard] }
];





