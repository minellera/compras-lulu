export const roundMoney = (v: number): number =>
  Math.round(v * 100) / 100;

export const formatBRL = (v: number): string =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
