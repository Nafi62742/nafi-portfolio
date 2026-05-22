import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../core/services/translate.service';
import { ScrollService } from '../../core/services/scroll.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  year = new Date().getFullYear();
  constructor(public t: TranslateService, public scroll: ScrollService) {}
}
