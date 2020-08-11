import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './../angularMaterial.module';
import { AppRoutingModule } from './../app-routing.module';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AngularMaterialModule,
    AppRoutingModule
  ]
})

export class PostsModule { }
