import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  BeforeUpdate,
  JoinColumn,
} from 'typeorm';
import { Profile } from './Profile';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ enum: ['admin', 'user'], nullable: false })
  role: 'admin' | 'user';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @Column({ nullable: false })
  profileId: number;

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn({ name: 'profileId' })
  Profile?: Profile;
}
