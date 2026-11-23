export type Cotacao = {
  symbol: string;
  data: {
    longName?: string;
    regularMarketPrice: number;
    regularMarketChangePercent: number;
  };
};

export async function buscarCotacoes(tickers: string[]): Promise<Cotacao[]> {
  const symbols = encodeURIComponent(tickers.join(','));
  const url = `https://brapi.dev/api/v2/stocks/quote?symbols=${symbols}`;
  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error(`Erro ao consultar a brapi (${resposta.status}). OBS: Para uso da API Brapi sem Token, só é permitido consultar essas 4 ações: PETR4, VALE3, ITUB4 e MGLU3.`);
  }

  const json: { results?: Cotacao[] } = await resposta.json();

  const cotacoes = (json.results ?? []).filter(
    ({ data }) =>
      typeof data?.regularMarketPrice === 'number' &&
      typeof data?.regularMarketChangePercent === 'number',
  );

  if (cotacoes.length === 0) {
    throw new Error('Nenhuma cotação encontrada.');
  }

  return cotacoes;
}