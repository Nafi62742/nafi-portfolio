import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../core/services/translate.service';
import { ScrollService } from '../../core/services/scroll.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  stats = [
    { value: '2+',  key: 'about.stat_exp',       icon: 'fa-briefcase'     },
    { value: '7',   key: 'about.stat_projects',  icon: 'fa-folder-open'   },
    { value: '4+',  key: 'about.stat_databases', icon: 'fa-database'      },
    { value: '5+',  key: 'about.stat_devops',    icon: 'fa-cloud'         }
  ];

  constructor(public t: TranslateService, public scroll: ScrollService) {}
}
