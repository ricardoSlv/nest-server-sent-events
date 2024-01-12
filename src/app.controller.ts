import { Controller, Get, Param, Post, Res, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { Observable, Subject } from 'rxjs';
import { readFileSync } from 'fs';
import { join } from 'path';

//TODO
// 5 subjects, 1 a 5
// Html com:
//  5 butoes para enviar um event a partir de cada um dos subjects e
//  5 butoes para subscrever a cada um dos streams, muda de cor de estiver a escuta (vermelho, verde).

@Controller()
export class AppController {
  channels: Record<number, Subject<MessageEvent>>;
  constructor(private readonly appService: AppService) {
    this.channels = {
      1: new Subject<MessageEvent>(),
      2: new Subject<MessageEvent>(),
      3: new Subject<MessageEvent>(),
      4: new Subject<MessageEvent>(),
      5: new Subject<MessageEvent>(),
    };
  }

  @Get()
  index(@Res() response: Response) {
    response.type('text/html').send(readFileSync(join(__dirname, 'index.html')).toString());
  }

  @Post('events/:id')
  eventTrigger(@Param('id') id: number, @Res() response: Response) {
    this.channels[id].next({
      data: 'Event from channel ' + id,
    } as MessageEvent);
    response.status(201).send();
  }

  @Sse('sse/:id')
  sse(@Param('id') id: number): Observable<MessageEvent> {
    return this.channels[id].asObservable();
  }
}
