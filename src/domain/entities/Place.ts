import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ type: 'json', nullable: true })
  thumb: IGalery_Photo['photo'];

  @Column({ type: 'json', nullable: true })
  galery: IGalery_Photo[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ nullable: false })
  profileId: number;

  @OneToOne(() => Profile, (profile) => profile.Places)
  Profile?: Profile;
}

interface IGalery_Photo {
  order: number;
  photo: string;
}
