class FormatUtilCls {
  formatDate(date: Date): string {
    return date
      .toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      .split(' ')[0];
  }
}

export const FormatUtil = new FormatUtilCls();
