import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';
import { DatabaseModule } from 'src/datebase/database.module'; 

import { CartController } from './cart.controller';
import { CartService } from './services';


@Module({
  imports: [ DatabaseModule, OrderModule ],
  providers: [ CartService ],
  controllers: [ CartController ]
})
export class CartModule {}
