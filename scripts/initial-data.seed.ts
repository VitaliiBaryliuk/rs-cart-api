import { InjectRepository } from '@nestjs/typeorm';
import { createConnection, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv'
import { Cart } from '../src/datebase/entities/cart.entity';
import { CartItem } from '../src/datebase/entities/cart-item.entity';

dotenv.config()

export class InitialDataSeeder {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async seed() {
    const userId = uuidv4();
    const cartId = uuidv4();

    const cart = {
      id: cartId,
      user_id: userId,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      status: 'OPEN',
    };

    await this.cartRepository.save(cart);

    const cartItems = [
      {
        id: uuidv4(),
        cart_id: cartId,
        product_id: uuidv4(),
        count: 2,
      },
      {
        id: uuidv4(),
        cart_id: cartId,
        product_id: uuidv4(),
        count: 1,
      },
      {
        id: uuidv4(),
        cart_id: cartId,
        product_id: uuidv4(),
        count: 3,
      },
    ];

    console.log(cartItems)

    await this.cartItemRepository.save(cartItems);
  }
}

async function createInitialData() {
  const connection = await createConnection({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Cart, CartItem],
    logging: true,
  });

  const seeder = new InitialDataSeeder(
    connection.getRepository(Cart),
    connection.getRepository(CartItem),
  );

  await seeder.seed();
  console.log('Initial data created!');
}

createInitialData();