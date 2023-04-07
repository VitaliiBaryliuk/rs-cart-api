/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { v4 } from 'uuid';

import { Cart } from '../models';
import { Cart as CartEntity } from '../../datebase/entities/cart.entity';
import { CartItem as CartItemEntity } from '../../datebase/entities/cart-item.entity';

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  constructor(
    @InjectRepository(CartItemEntity)
    private readonly cartItemsRepo: Repository<CartItemEntity>,
    @InjectRepository(CartEntity)
    private readonly cartsRepo: Repository<CartEntity>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findByUserId(userId: string): Promise<Cart> {
    const cart = await this.cartsRepo.findOne({ where: { user_id: userId }, relations: ['items'] });

    if (!cart) {
      return null;
    }

    return {
      id: cart.id,
      items: cart.items.map(cartItem => ({
        product: {
          id: cartItem.product_id,
          title: 'test product',
          description: 'test description',
          price: 100,
        },
        count: cartItem.count
      })),
    };
  }

  async createByUserId(userId: string): Promise<Cart> {
    const id = v4();

    const cartData = {
      id: id,
      user_id: userId,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      status: 'OPEN',
    };
    const cart = await this.cartsRepo.insert(cartData);

    if (!cart) {
      return null;
    }     
    
    return {
      id: cartData.id,
      items: []
    };
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    let userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    userCart = await this.createByUserId(userId);

    return userCart;
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const cart = await this.cartsRepo.findOne(userId);
    console.log('items', items)
    cart.items = items.map(item => ({
      cart_id: cart.id,
      product_id: item.product.id,
      count: item.count, 
    }));

    cart.updated_at = new Date().toString();

    const updatedCart = await this.cartsRepo.save(cart);

    if (!updatedCart) {
      return null;
    }
    
    return {
      id: cart.id,
      items: cart.items.map(cartItem => ({
        product: {
          id: cartItem.product_id,
          title: 'test product',
          description: 'test description',
          price: 100,
        },
        count: cartItem.count
      })),
    };
  }

  async removeByUserId(userId: string): Promise<void> {
    const cart = await this.cartsRepo.findOne(userId);
    if (!cart) {
      return null;
    }
    await this.cartsRepo.remove(cart);
  }

}
