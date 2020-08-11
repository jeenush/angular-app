import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './../angularMaterial.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [FormsModule, AngularMaterialModule, CommonModule, AuthRoutingModule]
})
export class AuthModule { }
