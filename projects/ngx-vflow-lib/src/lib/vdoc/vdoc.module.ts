import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { VDocRootComponent } from './components/vdoc-root/vdoc-root.component';
import { VDocBlockComponent } from './components/vdoc-block/vdoc-block.component';
import { VDocHtmlComponent } from './components/vdoc-html/vdoc-html.component';
import { LetDirective } from './directives/let.directive';

const components = [
  VDocRootComponent,
  VDocBlockComponent,
  VDocHtmlComponent
]

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [...components],
  declarations: [...components, LetDirective],
  providers: [],
})
export class VDocModule { }
