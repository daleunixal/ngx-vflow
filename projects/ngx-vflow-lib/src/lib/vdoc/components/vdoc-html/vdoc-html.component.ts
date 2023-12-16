import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, NO_ERRORS_SCHEMA, NgZone, OnInit, Optional, SkipSelf, forwardRef, inject } from '@angular/core';
import { VDocViewComponent } from '../vdoc-view/vdoc-view.component';
import { HtmlStyleSheet } from '../../interfaces/stylesheet.interface';
import { HtmlViewModel } from '../../view-models/html.view-model';
import { VDocTreeBuilderService } from '../../services/vdoc-tree-builder.service';

@Component({
  selector: 'foreignObject[vdoc-html]',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./vdoc-html.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: VDocViewComponent, useExisting: forwardRef(() => VDocHtmlComponent) }],
})
export class VDocHtmlComponent extends VDocViewComponent implements OnInit {
  @Input()
  public styleSheet: HtmlStyleSheet = {}

  @HostBinding('attr.width')
  protected get hostWidth() {
    return this.model.width
  }

  @HostBinding('attr.height')
  protected get hostHeight() {
    return this.model.height
  }

  @HostBinding('attr.x')
  protected get hostX() {
    return this.model.x
  }

  @HostBinding('attr.y')
  protected get hostY() {
    return this.model.y
  }


  protected model!: HtmlViewModel;

  private host: ElementRef<SVGForeignObjectElement> = inject(ElementRef)
  private treeManager = inject(VDocTreeBuilderService)

  constructor(
    @SkipSelf() @Optional() private parent: VDocViewComponent,
    private zone: NgZone
  ) {
    super()
  }

  ngOnInit(): void {
    this.model = this.createModel();

    const ro = new ResizeObserver(([entry]) => {
      this.zone.run(() => {
        this.model.setHeight(entry.contentRect.height);
        this.treeManager.calculateLayout();
      })
    })

    ro.observe(this.host.nativeElement.firstElementChild!)
  }

  createModel() {
    const model = new HtmlViewModel(this, this.styleSheet)

    // every vdoc-block must have parent (vdoc-root or other views)
    const parent = this.treeManager.getByComponent(this.parent)
    model.parent = parent;
    parent.children.push(model)

    this.treeManager.register(model)

    return model
  }
}