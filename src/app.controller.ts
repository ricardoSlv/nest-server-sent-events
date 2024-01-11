import { Controller, Get, Param, Res, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { Observable, interval, map } from 'rxjs';
import { readFileSync } from 'fs';
import { join } from 'path';

//TODO
// 5 subjects, 1 a 5
// Html com:
//  5 butoes para enviar um event a partir de cada um dos subjects e
//  5 butoes para subscrever a cada um dos streams, muda de cor de estiver a escuta (vermelho, verde).

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
