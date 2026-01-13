import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '@orda.core/services/session.service';
import { ToolbarTitleService } from '@orda.shared/services/toolbar-title.service';

@Component({
  selector: 'orda-root',
  templateUrl: './app.component.html',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterModule],
  styles: [
    `
      .header {
        display: flex;
        height: auto;
        flex: 0 0 auto;
        align-items: center;
        z-index: 10;
      }

      .content {
        justify-content: center; /* horizontal center */
        align-items: center; /* vertical center */
        min-height: 0;
      }
    `,
  ],
})
export class AppComponent {
  title = 'orda';
  sessionService = inject(SessionService);
  router = inject(Router);
  toolbarTitleService = inject(ToolbarTitleService);

  //   info = rxResource({
  //     stream: () => this.sessionService.info(),
  //   });

  logout() {
    this.sessionService.logout().subscribe({
      next: () => {
        return this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
