import { purchaseItemRepo } from './purchaseItem.repo';
import { wishItemRepo } from './wishItem.repo';

export async function seedDev(): Promise<void> {
  const existing = await purchaseItemRepo.getAll();
  if (existing.length > 0) return;

  await purchaseItemRepo.create({ name: 'Leite', highlightColor: '#FFFFFF', icon: 'local_drink' });
  await purchaseItemRepo.create({ name: 'Pão', highlightColor: '#F5DEB3', icon: 'bakery_dining' });
  await purchaseItemRepo.create({ name: 'Arroz', highlightColor: '#FFFFF0', icon: 'rice_bowl' });
  await purchaseItemRepo.create({ name: 'Feijão', highlightColor: '#8B4513', icon: 'grain' });

  await wishItemRepo.create({
    name: 'Fone de Ouvido',
    description: 'Sony WH-1000XM5',
    priceBRL: 1499.9,
    icon: 'headphones',
    purchaseLink: '',
    photoUri: null,
    backgroundColor: '#1A1A2E',
    acquired: false,
    acquiredAt: null,
  });
}
