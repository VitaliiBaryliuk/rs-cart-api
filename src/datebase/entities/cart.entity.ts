import { Column, Entity, PrimaryColumn, OneToMany, JoinColumn, JoinTable } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ type: 'timestamp', nullable: false })
  created_at: string;

  @Column({ type: 'timestamp', nullable: false })
  updated_at: string;

  @Column({ type: 'enum', enum: ['OPEN', 'ORDERED'] })
  status: string;

  @OneToMany(() => CartItem, cartItem => cartItem.cart)
  items: CartItem[];
}