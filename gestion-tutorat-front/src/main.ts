import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';  // Import routes
import { AppComponent } from './app/app.component'; // Import your AppComponent

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(appRoutes), // Provide the routes
  ]
}).catch((err) => console.error(err));
