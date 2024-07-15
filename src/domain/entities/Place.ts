import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './Profile';

@Entity('place')
export class Place {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  state: string;

  @Column({ type: 'text', nullable: true })
  thumb: string;

  @Column({ type: 'json', nullable: true })
  gallery: IGallery_Photo[];

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

  @ManyToOne(() => Profile, profile => profile.Places)
  @JoinColumn({ name: 'profileId' })
  Profile: Profile;
}

interface IGallery_Photo {
  order: number;
  photo: string;
}
