import { Controller, Get, Param, Res, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { Observable, interval, map } from 'rxjs';
import { readFileSync } from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index(@Res() response: Response) {
    response
      .type('text/html')
      .send(readFileSync(join(__dirname, 'index.html')).toString());
  }

  @Sse('sse/:id')
  sse(@Param('id') id: string): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => ({ data: { hello: 'world ' + id } }) as MessageEvent),
    );
  }
}
